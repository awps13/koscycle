import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import { CATEGORIES } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import { getCategoryCounts } from "@/lib/queries";

export const metadata: Metadata = { title: "Semua Kategori" };

async function Count({ slug, unit }: { slug: string; unit: string }) {
  const counts = await getCategoryCounts();
  return <>{`${formatNumber(counts[slug] ?? 0)} ${unit} tersedia`}</>;
}

export default function KategoriPage() {
  return (
    <div className="container-page py-12">
      <p className="text-xs font-bold tracking-wider text-primary uppercase">Kategori</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Semua Kategori Perlengkapan Kos</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/jelajah?kategori=${c.slug}`}
            className="group flex items-center gap-4 rounded-2xl border bg-background p-5 transition hover:border-primary/30 hover:shadow-md"
          >
            <CategoryIcon icon={c.icon} tone={c.tone} className="size-14" />
            <span className="flex-1">
              <span className="block font-bold">{c.name}</span>
              <span className="block text-sm text-muted-foreground">
                <Suspense fallback="…">
                  <Count slug={c.slug} unit={c.unit} />
                </Suspense>
              </span>
            </span>
            <ArrowRight className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
