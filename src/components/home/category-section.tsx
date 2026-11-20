import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { CATEGORIES } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { getCategoryCounts } from "@/lib/queries";

const HOME_CATEGORIES = CATEGORIES.filter((c) => c.slug !== "lainnya");

function CategoryTile({
  category,
  count,
}: {
  category: (typeof CATEGORIES)[number];
  count?: number;
}) {
  return (
    <Link
      href={`/jelajah?kategori=${category.slug}`}
      className="flex flex-col items-center gap-3 rounded-2xl border bg-background px-3 py-5 text-center transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <CategoryIcon icon={category.icon} tone={category.tone} />
      <span className="text-xs leading-snug font-semibold">{category.name}</span>
      <span className="-mt-1.5 text-xs text-muted-foreground">
        {count === undefined ? (
          <span className="inline-block h-3 w-12 animate-pulse rounded bg-muted align-middle" />
        ) : (
          `${formatNumber(count)} ${category.unit}`
        )}
      </span>
    </Link>
  );
}

export async function CategoryGrid() {
  const counts = await getCategoryCounts();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {HOME_CATEGORIES.map((c) => (
        <CategoryTile key={c.slug} category={c} count={counts[c.slug] ?? 0} />
      ))}
    </div>
  );
}

export function CategoryGridFallback() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {HOME_CATEGORIES.map((c) => (
        <CategoryTile key={c.slug} category={c} />
      ))}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          {linkLabel} <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
