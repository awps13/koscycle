import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeading } from "@/components/page-heading";
import { ListingGrid, ListingGridSkeleton } from "@/components/listing/listing-grid";
import { getFavoriteListings } from "@/lib/queries";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Favorit" };

export default function FavoritPage() {
  return (
    <div className="container-page py-10">
      <PageHeading eyebrow="Favorit" title="Barang yang Kamu Simpan" />
      <Suspense fallback={<ListingGridSkeleton count={4} />}>
        <Favorites />
      </Suspense>
    </div>
  );
}

async function Favorites() {
  const me = await requireUser("/favorit");
  const items = await getFavoriteListings(me.id);
  return (
    <ListingGrid
      items={items}
      favoriteIds={new Set(items.map((i) => i.id))}
      emptyTitle="Belum ada favorit"
      emptyText="Tekan ikon hati di kartu barang untuk menyimpannya di sini."
    />
  );
}
