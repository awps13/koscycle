"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isUuid } from "@/lib/types";

export async function startConversation(listingId: string) {
  const session = await getSession();
  if (!session) redirect(`/masuk?next=/barang/${listingId}`);
  const me = session.user.id;
  if (!isUuid(listingId)) redirect("/jelajah");

  const item = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, sellerId: true, title: true },
  });
  if (!item) redirect("/jelajah");
  if (item.sellerId === me) redirect("/pesan");

  const key = { listingId_buyerId: { listingId, buyerId: me } };
  const existing = await prisma.conversation.findUnique({ where: key, select: { id: true } });
  if (existing) redirect(`/pesan/${existing.id}`);

  let conversationId: string;
  try {
    const created = await prisma.conversation.create({
      data: {
        listingId,
        buyerId: me,
        sellerId: item.sellerId,
        messages: {
          create: { senderId: me, body: `Halo kak, "${item.title}" masih ada? Aku tertarik 🙌` },
        },
      },
      select: { id: true },
    });
    conversationId = created.id;
  } catch (err) {
    // Race condition: percakapan sudah dibuat oleh request lain
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const again = await prisma.conversation.findUnique({ where: key, select: { id: true } });
      redirect(again ? `/pesan/${again.id}` : "/pesan");
    }
    throw err;
  }
  redirect(`/pesan/${conversationId}`);
}

const bodySchema = z.string().trim().min(1).max(1000);

export async function sendMessage(conversationId: string, formData: FormData) {
  const session = await getSession();
  if (!session) return { ok: false, message: "Sesi berakhir, silakan masuk lagi." };
  const me = session.user.id;

  const parsed = bodySchema.safeParse(formData.get("body"));
  if (!parsed.success) return { ok: false, message: "Pesan tidak boleh kosong." };
  if (!isUuid(conversationId)) return { ok: false, message: "Percakapan tidak ditemukan." };

  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, OR: [{ buyerId: me }, { sellerId: me }] },
    select: { id: true },
  });
  if (!conv) return { ok: false, message: "Percakapan tidak ditemukan." };

  await prisma.$transaction([
    prisma.message.create({ data: { conversationId, senderId: me, body: parsed.data } }),
    prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } }),
  ]);

  refresh();
  return { ok: true };
}
