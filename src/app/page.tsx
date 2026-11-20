import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { CategoryGrid, CategoryGridFallback, SectionHeader } from "@/components/home/category-section";
import { HomeCatalog, HomeCatalogTabs } from "@/components/home/catalog-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { ListingGridSkeleton } from "@/components/listing/listing-grid";
import { TypeTabs } from "@/components/listing/type-tabs";

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <>
      <Hero />

      <section className="border-y bg-surface py-14">
        <div className="container-page">
          <SectionHeader
            title="Kategori Perlengkapan Kos"
            subtitle="Cari perlengkapan yang paling sering dicari anak kos baru & wisudawan"
            href="/kategori"
            linkLabel="Lihat Semua Kategori"
          />
          <Suspense fallback={<CategoryGridFallback />}>
            <CategoryGrid />
          </Suspense>
        </div>
      </section>

      <section id="katalog" className="scroll-mt-20 bg-background py-14">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-primary uppercase">Katalog Oper Kos Terdekat</p>
              <h2 className="mt-2 max-w-md text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
                Pilih Sesuai Budget &amp; Kebutuhan Kosmu
              </h2>
            </div>
            <Suspense fallback={<TypeTabs basePath="/" params={{}} hash="katalog" />}>
              <HomeCatalogTabs searchParams={searchParams} />
            </Suspense>
          </div>
          <Suspense fallback={<ListingGridSkeleton />}>
            <HomeCatalog searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      <HowItWorks />
    </>
  );
}
