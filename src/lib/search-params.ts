import { CAMPUSES, CATEGORIES, LISTING_TYPES, SORT_OPTIONS, type ListingType } from "./constants";

type Raw = string | string[] | undefined;

const first = (v: Raw) => (Array.isArray(v) ? v[0] : v);

export function parseType(v: Raw): ListingType | undefined {
  const s = first(v);
  return LISTING_TYPES.some((t) => t.value === s) ? (s as ListingType) : undefined;
}

export function parseBrowseParams(sp: Record<string, Raw>) {
  const q = first(sp.q)?.slice(0, 80) || undefined;
  const kategori = first(sp.kategori);
  const kampus = first(sp.kampus);
  const urut = first(sp.urut);
  const hal = Number(first(sp.hal) ?? 1);
  return {
    q,
    category: CATEGORIES.some((c) => c.slug === kategori) ? kategori : undefined,
    campus: CAMPUSES.some((c) => c.slug === kampus) ? kampus : undefined,
    type: parseType(sp.tipe),
    sort: (SORT_OPTIONS.some((o) => o.value === urut) ? urut : "terbaru") as "terbaru" | "termurah" | "termahal",
    page: Number.isFinite(hal) && hal > 0 ? Math.floor(hal) : 1,
  };
}
