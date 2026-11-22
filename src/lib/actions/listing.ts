"use server";

import { redirect } from "next/navigation";
import { refresh, revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { asImages, isUuid, type ListingImage } from "@/lib/types";
import { getCurrentUser } from "@/lib/session";
import { destroyImages, isOwnCloudinaryUrl } from "@/lib/cloudinary";
import { CAMPUSES, CATEGORIES, CONDITIONS, LISTING_STATUSES } from "@/lib/constants";

export type ListingFormState = {
  ok?: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
};

const imageSchema = z.object({ url: z.string().url(), publicId: z.string().optional() });

const listingSchema = z
  .object({
    title: z.string().trim().min(5, "Judul minimal 5 karakter").max(80, "Judul maksimal 80 karakter"),
    description: z
      .string()
      .trim()
      .min(20, "Ceritakan kondisi barang minimal 20 karakter")
      .max(2000, "Deskripsi maksimal 2000 karakter"),
    category: z.enum(CATEGORIES.map((c) => c.slug) as [string, ...string[]], {
      error: "Pilih kategori",
    }),
    campus: z.enum(CAMPUSES.map((c) => c.slug) as [string, ...string[]], { error: "Pilih area kampus" }),
    area: z.string().trim().max(60).optional(),
    type: z.enum(["jual", "barter", "hibah"], { error: "Pilih jenis iklan" }),
    price: z.coerce.number().int().min(0).max(100_000_000).optional(),
    barterWish: z.string().trim().max(120).optional(),
    condition: z.enum(CONDITIONS.map((c) => c.value) as [string, ...string[]], {
      error: "Pilih kondisi barang",
    }),
    images: z.array(imageSchema).min(1, "Unggah minimal 1 foto").max(6, "Maksimal 6 foto"),
  })
  .superRefine((v, ctx) => {
    if (v.type === "jual" && (!v.price || v.price < 1000)) {
      ctx.addIssue({ code: "custom", path: ["price"], message: "Isi harga jual (minimal Rp 1.000)" });
    }
    if (v.type === "barter" && !v.barterWish) {
      ctx.addIssue({ code: "custom", path: ["barterWish"], message: "Tulis barang yang ingin ditukar" });
    }
  });

function parseForm(formData: FormData) {
  let images: unknown = [];
  try {
    images = JSON.parse(String(formData.get("images") ?? "[]"));
  } catch {
    images = [];
  }
  const empty = (v: FormDataEntryValue | null) => (v === null || v === "" ? undefined : v);
  return listingSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    campus: formData.get("campus"),
    area: empty(formData.get("area")),
    type: formData.get("type"),
    price: empty(String(formData.get("price") ?? "").replace(/\D/g, "")),
    barterWish: empty(formData.get("barterWish")),
    condition: formData.get("condition"),
    images,
  });
}

function toErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

function normalize(data: z.infer<typeof listingSchema>) {
  const images: ListingImage[] = data.images.filter((img) => isOwnCloudinaryUrl(img.url));
  return {
    title: data.title,
    description: data.description,
    category: data.category,
    campus: data.campus,
    area: data.area ?? null,
    type: data.type,
    price: data.type === "jual" ? (data.price ?? null) : null,
    barterWish: data.type === "barter" ? (data.barterWish ?? null) : null,
    condition: data.condition as "seperti_baru" | "baik" | "layak",
    images,
  };
}

export async function createListing(_: ListingFormState, formData: FormData): Promise<ListingFormState> {
  const me = await getCurrentUser();
  if (!me) redirect("/masuk?next=/pasang-iklan");
  if (!me.ktmUrl) {
    return { message: "Unggah foto KTM di halaman Profil dulu sebelum memasang iklan." };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: toErrors(parsed.error), message: "Periksa kembali isian kamu." };

  const values = normalize(parsed.data);
  if (values.images.length === 0) {
    return { errors: { images: "Foto harus diunggah lewat Cloudinary" } };
  }

  const created = await prisma.listing.create({
    data: { ...values, sellerId: me.id },
    select: { id: true },
  });

  revalidatePath("/", "layout");
  redirect(`/barang/${created.id}?baru=1`);
}

export async function updateListing(
  id: string,
  _: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const me = await getCurrentUser();
  if (!me) redirect(`/masuk?next=/barang/${id}/edit`);
  if (!isUuid(id)) return { message: "Iklan tidak ditemukan." };

  const existing = await prisma.listing.findFirst({
    where: { id, sellerId: me.id },
    select: { images: true },
  });
  if (!existing) return { message: "Iklan tidak ditemukan." };

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: toErrors(parsed.error), message: "Periksa kembali isian kamu." };
  const values = normalize(parsed.data);
  if (values.images.length === 0) {
    return { errors: { images: "Foto harus diunggah lewat Cloudinary" } };
  }

  await prisma.listing.updateMany({ where: { id, sellerId: me.id }, data: values });

  // Hapus gambar lama yang sudah tidak dipakai
  const kept = new Set(values.images.map((i) => i.publicId));
  const removed = asImages(existing.images).map((i) => i.publicId).filter((p): p is string => !!p && !kept.has(p));
  await destroyImages(removed);

  revalidatePath("/", "layout");
  redirect(`/barang/${id}`);
}

const statusSchema = z.enum(LISTING_STATUSES.map((s) => s.value) as [string, ...string[]]);

export async function setListingStatus(id: string, status: string) {
  const me = await getCurrentUser();
  if (!me) return { ok: false, message: "Silakan masuk dulu." };
  if (!isUuid(id)) return { ok: false, message: "Iklan tidak ditemukan." };
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, message: "Status tidak valid." };

  const value = parsed.data as "aktif" | "dipesan" | "terjual";
  await prisma.listing.updateMany({
    where: { id, sellerId: me.id },
    data: { status: value, soldAt: value === "terjual" ? new Date() : null },
  });

  revalidatePath("/", "layout");
  refresh();
  return { ok: true };
}

export async function deleteListing(id: string, redirectTo?: string) {
  const me = await getCurrentUser();
  if (!me) return { ok: false, message: "Silakan masuk dulu." };

  if (!isUuid(id)) return { ok: false, message: "Iklan tidak ditemukan." };
  const target = await prisma.listing.findFirst({ where: { id, sellerId: me.id }, select: { images: true } });
  if (!target) return { ok: false, message: "Iklan tidak ditemukan." };
  await prisma.listing.deleteMany({ where: { id, sellerId: me.id } });

  await destroyImages(asImages(target.images).map((i) => i.publicId).filter((p): p is string => !!p));

  revalidatePath("/", "layout");
  if (redirectTo) redirect(redirectTo);
  refresh();
  return { ok: true };
}
