import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { ListingWithSeller } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { ListingCard, ListingCardSkeleton } from "./listing-card";

const GRID = "grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4";

export function ListingGrid({
  items,
  favoriteIds,
  emptyTitle = "Belum ada barang di sini",
  emptyText = "Coba ubah filter atau jadi yang pertama memasang iklan.",
}: {
  items: ListingWithSeller[];
  favoriteIds?: Set<string>;
  emptyTitle?: string;
  emptyText?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed bg-surface px-6 py-16 text-center">
        <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-mint text-mint-foreground">
          <PackageSearch className="size-7" />
        </span>
        <h3 className="text-lg font-bold">{emptyTitle}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{emptyText}</p>
        <Link href="/pasang-iklan" className={cn(buttonVariants(), "mt-6 h-10 rounded-xl px-5 font-semibold")}>
          Pasang Iklan
        </Link>
      </div>
    );
  }
  return (
    <div className={GRID}>
      {items.map((item, i) => (
        <ListingCard key={item.id} item={item} favorited={favoriteIds?.has(item.id)} priority={i < 4} />
      ))}
    </div>
  );
}

export function ListingGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={GRID}>
      {Array.from({ length: count }, (_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
