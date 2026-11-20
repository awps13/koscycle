import { Suspense } from "react";
import { SlidersHorizontal } from "lucide-react";
import { getCampus, getCategory, type ListingType } from "@/lib/constants";
import { parseBrowseParams } from "@/lib/search-params";
import { countListings, getFavoriteIds, getListings } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { formatNumber } from "@/lib/format";
import { BrowseFilters } from "./browse-filters";
import { ListingGrid, ListingGridSkeleton } from "./listing-grid";
import { Pagination } from "./pagination";
import { TypeTabs } from "./type-tabs";

const PAGE_SIZE = 16;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export function BrowseView({
  basePath,
  eyebrow,
  title,
  description,
  fixedType,
  searchParams,
}: {
  basePath: string;
  eyebrow: string;
  title: string;
  description: string;
  fixedType?: ListingType;
  searchParams: SearchParams;
}) {
  return (
    <>
      <section className="border-b bg-surface">
        <div className="container-page py-10">
          <p className="text-xs font-bold tracking-wider text-primary uppercase">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        </div>
      </section>
      <div className="container-page py-10">
        <Suspense fallback={<BrowseFallback />}>
          <BrowseResults basePath={basePath} fixedType={fixedType} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

function BrowseFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div className="hidden h-96 animate-pulse rounded-2xl bg-muted lg:block" />
      <ListingGridSkeleton count={8} />
    </div>
  );
}

async function BrowseResults({
  basePath,
  fixedType,
  searchParams,
}: {
  basePath: string;
  fixedType?: ListingType;
  searchParams: SearchParams;
}) {
  const p = parseBrowseParams(await searchParams);
  const type = fixedType ?? p.type;
  const filters = { q: p.q, category: p.category, campus: p.campus, type, sort: p.sort };

  const [items, total, session] = await Promise.all([
    getListings({ ...filters, limit: PAGE_SIZE, offset: (p.page - 1) * PAGE_SIZE }),
    countListings(filters),
    getSession(),
  ]);
  const favoriteIds = await getFavoriteIds(session?.user.id);

  const urlParams = {
    q: p.q,
    kategori: p.category,
    kampus: p.campus,
    tipe: fixedType ? undefined : type,
    urut: p.sort !== "terbaru" ? p.sort : undefined,
  };
  const chips = [
    p.q && `“${p.q}”`,
    getCategory(p.category)?.name,
    getCampus(p.campus)?.name,
  ].filter(Boolean) as string[];

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <details className="group rounded-2xl border bg-background p-5 lg:open:block" open>
          <summary className="flex cursor-pointer list-none items-center gap-2 font-bold lg:pointer-events-none">
            <SlidersHorizontal className="size-4 text-primary" /> Filter
          </summary>
          <div className="mt-5">
            <BrowseFilters
              basePath={basePath}
              values={{ q: p.q, category: p.category, campus: p.campus, sort: p.sort, type: fixedType ? undefined : type }}
              keepType={!fixedType}
            />
          </div>
        </details>
      </aside>

      <div className="min-w-0">
        {!fixedType ? (
          <TypeTabs basePath={basePath} params={urlParams} current={type} className="mb-5" />
        ) : null}
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{formatNumber(total)}</strong> barang ditemukan
          </span>
          {chips.map((c) => (
            <span key={c} className="rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold text-mint-foreground">
              {c}
            </span>
          ))}
        </div>
        <ListingGrid
          items={items}
          favoriteIds={favoriteIds}
          emptyTitle="Barang belum ketemu"
          emptyText="Coba kata kunci lain, ganti kampus, atau hapus beberapa filter."
        />
        <Pagination
          basePath={basePath}
          params={{ ...urlParams }}
          page={p.page}
          totalPages={Math.ceil(total / PAGE_SIZE)}
        />
      </div>
    </div>
  );
}
