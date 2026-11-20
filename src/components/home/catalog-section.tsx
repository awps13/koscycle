import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ListingGrid } from "@/components/listing/listing-grid";
import { TypeTabs } from "@/components/listing/type-tabs";
import { parseType } from "@/lib/search-params";
import { getFavoriteIds, getListings } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export async function HomeCatalog({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const type = parseType(sp.tipe);
  const [items, session] = await Promise.all([getListings({ type, limit: 8 }), getSession()]);
  const favoriteIds = await getFavoriteIds(session?.user.id);

  return (
    <>
      <ListingGrid items={items} favoriteIds={favoriteIds} />
      <div className="mt-10 flex justify-center">
        <Link
          href={type ? `/jelajah?tipe=${type}` : "/jelajah"}
          className={cn(buttonVariants({ variant: "outline" }), "h-11 rounded-xl px-6 font-semibold")}
        >
          Lihat Semua Barang <ArrowRight className="size-4" />
        </Link>
      </div>
    </>
  );
}

export async function HomeCatalogTabs({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <TypeTabs basePath="/" params={{}} current={parseType(sp.tipe)} hash="katalog" />;
}
