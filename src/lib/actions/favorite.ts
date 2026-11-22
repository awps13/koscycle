"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { isUuid } from "@/lib/types";

export async function toggleFavorite(listingId: string) {
  const session = await getSession();
  if (!session) return { ok: false as const, needLogin: true };
  if (!isUuid(listingId)) return { ok: false as const, needLogin: false };
  const userId = session.user.id;
  const key = { userId_listingId: { userId, listingId } };

  const existing = await prisma.favorite.findUnique({ where: key });
  if (existing) {
    await prisma.favorite.delete({ where: key });
    return { ok: true as const, favorited: false };
  }

  await prisma.favorite.upsert({ where: key, create: { userId, listingId }, update: {} });
  return { ok: true as const, favorited: true };
}
