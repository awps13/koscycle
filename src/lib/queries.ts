import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { and, asc, count, desc, eq, gte, ilike, inArray, isNull, ne, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { conversation, favorite, listing, message, user } from "@/db/schema";
import type { ListingStatus, ListingType } from "./constants";

/* Semua query membaca data per-request (tidak di-cache). Dengan Cache Components,
 * komponen yang memanggil fungsi di sini harus berada di dalam <Suspense>. */

const sellerColumns = {
  id: user.id,
  name: user.name,
  image: user.image,
  campus: user.campus,
  ktmVerified: user.ktmVerified,
};

const listingColumns = {
  id: listing.id,
  title: listing.title,
  description: listing.description,
  category: listing.category,
  campus: listing.campus,
  area: listing.area,
  type: listing.type,
  price: listing.price,
  barterWish: listing.barterWish,
  condition: listing.condition,
  images: listing.images,
  status: listing.status,
  createdAt: listing.createdAt,
  updatedAt: listing.updatedAt,
  sellerId: listing.sellerId,
};

export type ListingFilters = {
  q?: string;
  category?: string;
  campus?: string;
  type?: ListingType;
  sort?: "terbaru" | "termurah" | "termahal";
  status?: ListingStatus | "all";
  excludeId?: string;
  limit?: number;
  offset?: number;
};

function buildWhere(f: ListingFilters) {
  const conds: SQL[] = [];
  if (f.status !== "all") conds.push(eq(listing.status, f.status ?? "aktif"));
  if (f.category) conds.push(eq(listing.category, f.category));
  if (f.campus) conds.push(eq(listing.campus, f.campus));
  if (f.type) conds.push(eq(listing.type, f.type));
  if (f.excludeId) conds.push(ne(listing.id, f.excludeId));
  if (f.q?.trim()) {
    const term = `%${f.q.trim()}%`;
    conds.push(or(ilike(listing.title, term), ilike(listing.description, term), ilike(listing.area, term))!);
  }
  return conds.length ? and(...conds) : undefined;
}

export async function getListings(f: ListingFilters = {}) {
  await connection();
  const order =
    f.sort === "termurah"
      ? [asc(sql`coalesce(${listing.price}, 0)`), desc(listing.createdAt)]
      : f.sort === "termahal"
        ? [desc(sql`coalesce(${listing.price}, 0)`), desc(listing.createdAt)]
        : [desc(listing.createdAt)];

  return db
    .select({ ...listingColumns, seller: sellerColumns })
    .from(listing)
    .innerJoin(user, eq(listing.sellerId, user.id))
    .where(buildWhere(f))
    .orderBy(...order)
    .limit(f.limit ?? 24)
    .offset(f.offset ?? 0);
}

export type ListingWithSeller = Awaited<ReturnType<typeof getListings>>[number];

export async function countListings(f: ListingFilters = {}) {
  await connection();
  const [row] = await db.select({ value: count() }).from(listing).where(buildWhere(f));
  return row?.value ?? 0;
}

export const getCategoryCounts = cache(async () => {
  await connection();
  const rows = await db
    .select({ category: listing.category, value: count() })
    .from(listing)
    .where(eq(listing.status, "aktif"))
    .groupBy(listing.category);
  return Object.fromEntries(rows.map((r) => [r.category, r.value])) as Record<string, number>;
});

export async function getStats() {
  await connection();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [[sold], [campuses], [users], [verified]] = await Promise.all([
    db
      .select({ value: count() })
      .from(listing)
      .where(and(eq(listing.status, "terjual"), gte(listing.soldAt, startOfMonth))),
    db.select({ value: sql<number>`count(distinct ${listing.campus})::int` }).from(listing),
    db.select({ value: count() }).from(user),
    db.select({ value: count() }).from(user).where(eq(user.ktmVerified, true)),
  ]);

  return {
    soldThisMonth: sold?.value ?? 0,
    activeCampuses: campuses?.value ?? 0,
    users: users?.value ?? 0,
    verifiedUsers: verified?.value ?? 0,
  };
}

export async function getListingById(id: string) {
  await connection();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db
    .select({
      ...listingColumns,
      seller: { ...sellerColumns, whatsapp: user.whatsapp, createdAt: user.createdAt },
    })
    .from(listing)
    .innerJoin(user, eq(listing.sellerId, user.id))
    .where(eq(listing.id, id))
    .limit(1);
  return row ?? null;
}

export async function countSellerListings(sellerId: string) {
  const [row] = await db.select({ value: count() }).from(listing).where(eq(listing.sellerId, sellerId));
  return row?.value ?? 0;
}

export async function getUserListings(userId: string) {
  await connection();
  return db
    .select({ ...listingColumns, seller: sellerColumns })
    .from(listing)
    .innerJoin(user, eq(listing.sellerId, user.id))
    .where(eq(listing.sellerId, userId))
    .orderBy(desc(listing.createdAt));
}

export async function getFavoriteIds(userId: string | undefined | null) {
  if (!userId) return new Set<string>();
  await connection();
  const rows = await db
    .select({ listingId: favorite.listingId })
    .from(favorite)
    .where(eq(favorite.userId, userId));
  return new Set(rows.map((r) => r.listingId));
}

export async function getFavoriteListings(userId: string) {
  await connection();
  return db
    .select({ ...listingColumns, seller: sellerColumns })
    .from(favorite)
    .innerJoin(listing, eq(favorite.listingId, listing.id))
    .innerJoin(user, eq(listing.sellerId, user.id))
    .where(eq(favorite.userId, userId))
    .orderBy(desc(favorite.createdAt));
}

/* ------------------------------ Chat ------------------------------ */

export async function getConversations(userId: string) {
  await connection();
  const convs = await db.query.conversation.findMany({
    where: or(eq(conversation.buyerId, userId), eq(conversation.sellerId, userId)),
    orderBy: desc(conversation.updatedAt),
    with: {
      listing: { columns: { id: true, title: true, images: true, type: true, price: true, status: true } },
      buyer: { columns: { id: true, name: true, image: true } },
      seller: { columns: { id: true, name: true, image: true } },
      messages: { orderBy: desc(message.createdAt), limit: 1 },
    },
  });

  if (convs.length === 0) return [];

  const unread = await db
    .select({ conversationId: message.conversationId, value: count() })
    .from(message)
    .where(
      and(
        inArray(
          message.conversationId,
          convs.map((c) => c.id),
        ),
        ne(message.senderId, userId),
        isNull(message.readAt),
      ),
    )
    .groupBy(message.conversationId);
  const unreadMap = new Map(unread.map((u) => [u.conversationId, u.value]));

  return convs.map((c) => ({
    ...c,
    other: c.buyerId === userId ? c.seller : c.buyer,
    lastMessage: c.messages[0] ?? null,
    unread: unreadMap.get(c.id) ?? 0,
  }));
}

export async function getConversation(id: string, userId: string) {
  await connection();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const conv = await db.query.conversation.findFirst({
    where: and(
      eq(conversation.id, id),
      or(eq(conversation.buyerId, userId), eq(conversation.sellerId, userId)),
    ),
    with: {
      listing: {
        columns: { id: true, title: true, images: true, type: true, price: true, barterWish: true, status: true },
      },
      buyer: { columns: { id: true, name: true, image: true, ktmVerified: true, whatsapp: true } },
      seller: { columns: { id: true, name: true, image: true, ktmVerified: true, whatsapp: true } },
      messages: { orderBy: asc(message.createdAt) },
    },
  });
  if (!conv) return null;
  return { ...conv, other: conv.buyerId === userId ? conv.seller : conv.buyer };
}

export async function markConversationRead(conversationId: string, userId: string) {
  await db
    .update(message)
    .set({ readAt: new Date() })
    .where(
      and(eq(message.conversationId, conversationId), ne(message.senderId, userId), isNull(message.readAt)),
    );
}

export async function getUnreadCount(userId: string) {
  await connection();
  const [row] = await db
    .select({ value: count() })
    .from(message)
    .innerJoin(conversation, eq(message.conversationId, conversation.id))
    .where(
      and(
        or(eq(conversation.buyerId, userId), eq(conversation.sellerId, userId)),
        ne(message.senderId, userId),
        isNull(message.readAt),
      ),
    );
  return row?.value ?? 0;
}
