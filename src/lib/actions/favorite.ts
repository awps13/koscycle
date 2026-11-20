"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { favorite } from "@/db/schema";
import { getSession } from "@/lib/session";

export async function toggleFavorite(listingId: string) {
  const session = await getSession();
  if (!session) return { ok: false as const, needLogin: true };
  const userId = session.user.id;

  const [existing] = await db
    .select({ listingId: favorite.listingId })
    .from(favorite)
    .where(and(eq(favorite.userId, userId), eq(favorite.listingId, listingId)))
    .limit(1);

  if (existing) {
    await db.delete(favorite).where(and(eq(favorite.userId, userId), eq(favorite.listingId, listingId)));
    return { ok: true as const, favorited: false };
  }

  await db.insert(favorite).values({ userId, listingId }).onConflictDoNothing();
  return { ok: true as const, favorited: true };
}
