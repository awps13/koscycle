"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { destroyImages, isOwnCloudinaryUrl } from "@/lib/cloudinary";
import { CAMPUSES } from "@/lib/constants";

export type ProfileFormState = { ok?: boolean; message?: string; errors?: Record<string, string> };

const profileSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(60),
  campus: z.enum(CAMPUSES.map((c) => c.slug) as [string, ...string[]], { error: "Pilih kampus" }),
  whatsapp: z
    .string()
    .trim()
    .regex(/^(\+?62|0)8\d{7,12}$/, "Format nomor WA tidak valid, contoh 081234567890")
    .optional()
    .or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
});

export async function updateProfile(_: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const session = await getSession();
  if (!session) return { message: "Sesi berakhir, silakan masuk lagi." };

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    campus: formData.get("campus"),
    whatsapp: formData.get("whatsapp") ?? "",
    image: formData.get("image") ?? "",
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { errors, message: "Periksa kembali isian kamu." };
  }

  const image = parsed.data.image && isOwnCloudinaryUrl(parsed.data.image) ? parsed.data.image : undefined;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      campus: parsed.data.campus,
      whatsapp: parsed.data.whatsapp || null,
      ...(image ? { image } : {}),
    },
  });

  refresh();
  return { ok: true, message: "Profil berhasil disimpan." };
}

export async function saveKtm(url: string, publicId?: string) {
  const session = await getSession();
  if (!session) return { ok: false, message: "Sesi berakhir, silakan masuk lagi." };
  if (!isOwnCloudinaryUrl(url)) return { ok: false, message: "URL KTM tidak valid." };

  const prev = await prisma.user.findUnique({ where: { id: session.user.id }, select: { ktmUrl: true } });

  // Upload KTM baru → status verifikasi direset sampai dicek ulang admin
  await prisma.user.update({
    where: { id: session.user.id },
    data: { ktmUrl: url, ktmVerified: false },
  });

  const prevId = prev?.ktmUrl?.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i)?.[1];
  if (prevId && prevId !== publicId) await destroyImages([prevId]);

  refresh();
  return { ok: true };
}
