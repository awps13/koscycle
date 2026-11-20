import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeftRight, Leaf, ShieldCheck } from "lucide-react";
import { POPULAR_SEARCHES } from "@/lib/constants";
import { HeroSearch } from "./hero-search";
import { HeroStats, HeroStatsFallback } from "./hero-stats";

const HERO_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(13_92_69/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(13_92_69/0.04)_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      <div className="container-page relative grid items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
            <Leaf className="size-3.5" />
            Platform Oper Barang Secondhand Khusus Anak Kos No. 1
          </span>

          <h1 className="mt-6 text-4xl leading-[1.15] font-extrabold tracking-tight text-balance sm:text-5xl">
            Pindah Kos Tanpa Beban,{" "}
            <span className="relative inline-block text-primary">
              Oper Barang
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1.5 left-0 h-2.5 w-full text-primary/35"
              >
                <path d="M2 9 C 50 2, 150 2, 198 8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            Lebih Cuan &amp; Berkah!
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Beli murah perabot kos dari kakak tingkat yang mau lulus, jual barangmu sebelum pulang kampung, atau
            barter sesama anak kos tanpa biaya admin.
          </p>

          <div className="mt-8 rounded-2xl border bg-background p-3 shadow-sm">
            <HeroSearch />
            <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs text-muted-foreground">Pencarian Populer:</span>
              {POPULAR_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/jelajah?q=${encodeURIComponent(term)}`}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80 transition hover:bg-accent hover:text-primary"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <Suspense fallback={<HeroStatsFallback />}>
            <HeroStats />
          </Suspense>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative rounded-[28px] border bg-background p-3 shadow-xl shadow-primary/5">
            <div className="relative aspect-[4/3.6] overflow-hidden rounded-[20px]">
              <Image
                src={HERO_IMAGE}
                alt="Kamar kos rapi berisi perabot secondhand"
                fill
                priority
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
              />
              <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-primary shadow">
                <span className="size-2 rounded-full bg-emerald-500" />
                Pindahan UI Depok Gelombang Wisuda
              </span>
            </div>
          </div>

          <div className="absolute -top-5 -right-2 flex items-center gap-3 rounded-2xl border bg-background px-4 py-3 shadow-lg sm:-right-6">
            <span className="grid size-9 place-items-center rounded-full bg-mint text-mint-foreground">
              <ShieldCheck className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-bold">KTM Terverifikasi</span>
              <span className="block text-xs text-primary">COD Aman di Depan Kos</span>
            </span>
          </div>

          <div className="absolute -bottom-6 -left-2 flex items-center gap-3 rounded-2xl border bg-background px-4 py-3 shadow-lg sm:-left-8">
            <span className="grid size-9 place-items-center rounded-full bg-peach text-peach-foreground">
              <ArrowLeftRight className="size-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-bold text-peach-foreground">Barter Berhasil!</span>
              <span className="block text-xs font-semibold">Meja Lipat ⇄ Kipas Angin Meja</span>
              <span className="block text-[11px] text-muted-foreground">Anak Kos Pogung • Baru saja</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
