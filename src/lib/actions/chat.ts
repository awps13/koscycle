"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { conversation, listing, message } from "@/db/schema";
import { getSession } from "@/lib/session";

export async function startConversation(listingId: string) {
  const session = await getSession();
  if (!session) redirect(`/masuk?next=/barang/${listingId}`);
  const me = session.user.id;

  const [item] = await db
    .select({ id: listing.id, sellerId: listing.sellerId, title: listing.title })
    .from(listing)
    .where(eq(listing.id, listingId))
    .limit(1);
  if (!item) redirect("/jelajah");
  if (item.sellerId === me) redirect("/pesan");

  const [existing] = await db
    .select({ id: conversation.id })
    .from(conversation)
    .where(and(eq(conversation.listingId, listingId), eq(conversation.buyerId, me)))
    .limit(1);

  if (existing) redirect(`/pesan/${existing.id}`);

  const [created] = await db
    .insert(conversation)
    .values({ listingId, buyerId: me, sellerId: item.sellerId })
    .onConflictDoNothing()
    .returning({ id: conversation.id });

  if (created) {
    await db.insert(message).values({
      conversationId: created.id,
      senderId: me,
      body: `Halo kak, "${item.title}" masih ada? Aku tertarik 🙌`,
    });
    redirect(`/pesan/${created.id}`);
  }

  // Race condition: percakapan dibuat request lain
  const [again] = await db
    .select({ id: conversation.id })
    .from(conversation)
    .where(and(eq(conversation.listingId, listingId), eq(conversation.buyerId, me)))
    .limit(1);
  redirect(again ? `/pesan/${again.id}` : "/pesan");
}

const bodySchema = z.string().trim().min(1).max(1000);

export async function sendMessage(conversationId: string, formData: FormData) {
  const session = await getSession();
  if (!session) return { ok: false, message: "Sesi berakhir, silakan masuk lagi." };
  const me = session.user.id;

  const parsed = bodySchema.safeParse(formData.get("body"));
  if (!parsed.success) return { ok: false, message: "Pesan tidak boleh kosong." };

  const [conv] = await db
    .select({ id: conversation.id })
    .from(conversation)
    .where(
      and(
        eq(conversation.id, conversationId),
        or(eq(conversation.buyerId, me), eq(conversation.sellerId, me)),
      ),
    )
    .limit(1);
  if (!conv) return { ok: false, message: "Percakapan tidak ditemukan." };

  await db.insert(message).values({ conversationId, senderId: me, body: parsed.data });
  await db.update(conversation).set({ updatedAt: new Date() }).where(eq(conversation.id, conversationId));

  refresh();
  return { ok: true };
}
