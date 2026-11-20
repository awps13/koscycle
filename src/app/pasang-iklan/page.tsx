import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { IdCard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ListingForm } from "@/components/forms/listing-form";
import { createListing } from "@/lib/actions/listing";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pasang Iklan" };

export default function PasangIklanPage() {
  return (
    <div className="bg-surface">
      <div className="container-page max-w-3xl py-10">
        <p className="text-xs font-bold tracking-wider text-primary uppercase">Pasang Iklan Gratis</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Oper barangmu ke adik tingkat</h1>
        <p className="mt-2 text-muted-foreground">Tanpa biaya admin. Isi detail barang, lalu tunggu chat dari pembeli.</p>
        <div className="mt-8">
          <Suspense fallback={<div className="h-[600px] animate-pulse rounded-2xl bg-muted" />}>
            <NewListingForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function NewListingForm() {
  const me = await requireUser("/pasang-iklan");

  if (!me.ktmUrl) {
    return (
      <div className="flex flex-col items-center rounded-2xl border bg-background px-6 py-14 text-center">
        <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-peach text-peach-foreground">
          <IdCard className="size-7" />
        </span>
        <h2 className="text-xl font-bold">Unggah KTM dulu, ya</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Biar transaksi aman, semua penjual di KosCycle wajib mengunggah foto Kartu Tanda Mahasiswa. Cukup sekali
          saja.
        </p>
        <Link href="/profil?next=/pasang-iklan" className={cn(buttonVariants(), "mt-6 h-11 rounded-xl px-6 font-semibold")}>
          Unggah KTM Sekarang
        </Link>
      </div>
    );
  }

  return (
    <ListingForm
      action={createListing}
      submitLabel="Tayangkan Iklan"
      initial={{
        title: "",
        description: "",
        category: "",
        campus: me.campus ?? "",
        area: "",
        type: "jual",
        price: null,
        barterWish: "",
        condition: "baik",
        images: [],
      }}
    />
  );
}
