import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";
import { asImages, isUuid } from "./types";
import type { ListingStatus, ListingType } from "./constants";

/* Semua query membaca data per-request (tidak di-cache). Dengan Cache Components,
 * komponen yang memanggil fungsi di sini harus berada di dalam <Suspense>. */

const sellerSelect = {
  id: true,
  name: true,
  image: true,
  campus: true,
  ktmVerified: true,
} satisfies Prisma.UserSelect;

const listingInclude = { seller: { select: sellerSelect } } satisfies Prisma.ListingInclude;

type ListingRow = Prisma.ListingGetPayload<{ include: typeof listingInclude }>;

function toListing<T extends { images: Prisma.JsonValue }>(row: T) {
  return { ...row, images: asImages(row.images) };
}

export type ListingWithSeller = Omit<ListingRow, "images"> & { images: ReturnType<typeof asImages> };

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

function buildWhere(f: ListingFilters): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = {};
  if (f.status !== "all") where.status = f.status ?? "aktif";
  if (f.category) where.category = f.category;
  if (f.campus) where.campus = f.campus;
  if (f.type) where.type = f.type;
  if (f.excludeId) where.id = { not: f.excludeId };
  const q = f.q?.trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { area: { contains: q, mode: "insensitive" } },
    ];
  }
  return where;
}

export async function getListings(f: ListingFilters = {}): Promise<ListingWithSeller[]> {
  await connection();
  const orderBy: Prisma.ListingOrderByWithRelationInput[] =
    f.sort === "termurah"
      ? [{ price: { sort: "asc", nulls: "first" } }, { createdAt: "desc" }]
      : f.sort === "termahal"
        ? [{ price: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }]
        : [{ createdAt: "desc" }];

  const rows = await prisma.listing.findMany({
    where: buildWhere(f),
    include: listingInclude,
    orderBy,
    take: f.limit ?? 24,
    skip: f.offset ?? 0,
  });
  return rows.map(toListing);
}

export async function countListings(f: ListingFilters = {}) {
  await connection();
  return prisma.listing.count({ where: buildWhere(f) });
}

export const getCategoryCounts = cache(async () => {
  await connection();
  const rows = await prisma.listing.groupBy({
    by: ["category"],
    where: { status: "aktif" },
    _count: { _all: true },
  });
  return Object.fromEntries(rows.map((r) => [r.category, r._count._all])) as Record<string, number>;
});

export async function getStats() {
  await connection();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [soldThisMonth, campuses, users, verifiedUsers] = await Promise.all([
    prisma.listing.count({ where: { status: "terjual", soldAt: { gte: startOfMonth } } }),
    prisma.listing.groupBy({ by: ["campus"] }),
    prisma.user.count(),
    prisma.user.count({ where: { ktmVerified: true } }),
  ]);

  return { soldThisMonth, activeCampuses: campuses.length, users, verifiedUsers };
}

export async function getListingById(id: string) {
  await connection();
  if (!isUuid(id)) return null;
  const row = await prisma.listing.findUnique({
    where: { id },
    include: { seller: { select: { ...sellerSelect, whatsapp: true, createdAt: true } } },
  });
  return row ? toListing(row) : null;
}

export async function countSellerListings(sellerId: string) {
  return prisma.listing.count({ where: { sellerId } });
}

export async function getUserListings(userId: string): Promise<ListingWithSeller[]> {
  await connection();
  const rows = await prisma.listing.findMany({
    where: { sellerId: userId },
    include: listingInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toListing);
}

export async function getFavoriteIds(userId: string | undefined | null) {
  if (!userId) return new Set<string>();
  await connection();
  const rows = await prisma.favorite.findMany({ where: { userId }, select: { listingId: true } });
  return new Set(rows.map((r) => r.listingId));
}

export async function getFavoriteListings(userId: string): Promise<ListingWithSeller[]> {
  await connection();
  const rows = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { listing: { include: listingInclude } },
  });
  return rows.map((r) => toListing(r.listing));
}

/* ------------------------------ Chat ------------------------------ */

const chatListingSelect = {
  id: true,
  title: true,
  images: true,
  type: true,
  price: true,
  barterWish: true,
  status: true,
} satisfies Prisma.ListingSelect;

export async function getConversations(userId: string) {
  await connection();
  const convs = await prisma.conversation.findMany({
    where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    orderBy: { updatedAt: "desc" },
    include: {
      listing: { select: chatListingSelect },
      buyer: { select: { id: true, name: true, image: true } },
      seller: { select: { id: true, name: true, image: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: {
        select: { messages: { where: { senderId: { not: userId }, readAt: null } } },
      },
    },
  });

  return convs.map((c) => ({
    ...c,
    listing: toListing(c.listing),
    other: c.buyerId === userId ? c.seller : c.buyer,
    lastMessage: c.messages[0] ?? null,
    unread: c._count.messages,
  }));
}

export async function getConversation(id: string, userId: string) {
  await connection();
  if (!isUuid(id)) return null;
  const userSelect = { id: true, name: true, image: true, ktmVerified: true, whatsapp: true } as const;
  const conv = await prisma.conversation.findFirst({
    where: { id, OR: [{ buyerId: userId }, { sellerId: userId }] },
    include: {
      listing: { select: chatListingSelect },
      buyer: { select: userSelect },
      seller: { select: userSelect },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!conv) return null;
  return {
    ...conv,
    listing: toListing(conv.listing),
    other: conv.buyerId === userId ? conv.seller : conv.buyer,
  };
}

export async function markConversationRead(conversationId: string, userId: string) {
  await prisma.message.updateMany({
    where: { conversationId, senderId: { not: userId }, readAt: null },
    data: { readAt: new Date() },
  });
}

export async function getUnreadCount(userId: string) {
  await connection();
  return prisma.message.count({
    where: {
      senderId: { not: userId },
      readAt: null,
      conversation: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    },
  });
}
