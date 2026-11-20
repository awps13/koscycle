import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Eye, Pencil, PlusCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageHeading } from "@/components/page-heading";
import { DeleteListingButton, StatusSelect } from "@/components/listing/owner-actions";
import { TypeBadge } from "@/components/listing/type-badge";
import { ListingGrid } from "@/components/listing/listing-grid";
import { getCategory } from "@/lib/constants";
import { timeAgo } from "@/lib/format";
import { getUserListings } from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Iklan Saya" };

export default function DashboardPage() {
  return (
    <div className="container-page py-10">
      <PageHeading eyebrow="Dashboard" title="Iklan Saya" desc="Kelola barang yang sedang kamu oper.">
        <Link href="/pasang-iklan" className={cn(buttonVariants(), "h-10 rounded-xl px-4 font-semibold")}>
          <PlusCircle className="size-4" /> Pasang Iklan
        </Link>
      </PageHeading>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <MyListings />
      </Suspense>
    </div>
  );
}

async function MyListings() {
  const me = await requireUser("/dashboard");
  const items = await getUserListings(me.id);

  const stats = {
    aktif: items.filter((i) => i.status === "aktif").length,
    dipesan: items.filter((i) => i.status === "dipesan").length,
    terjual: items.filter((i) => i.status === "terjual").length,
  };

  if (items.length === 0) {
    return <ListingGrid items={[]} emptyTitle="Belum ada iklan" emptyText="Pasang iklan pertamamu, gratis!" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Aktif" value={stats.aktif} />
        <Stat label="Dipesan" value={stats.dipesan} />
        <Stat label="Laku / Diambil" value={stats.terjual} />
      </div>
      <div className="divide-y overflow-hidden rounded-2xl border bg-background">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <Link href={`/barang/${item.id}`} className="flex min-w-0 flex-1 items-center gap-4">
              <span className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                {item.images[0] ? (
                  <Image src={item.images[0].url} alt="" fill sizes="80px" className="object-cover" />
                ) : null}
              </span>
              <span className="min-w-0 space-y-1.5">
                <span className="block truncate font-semibold hover:text-primary">{item.title}</span>
                <TypeBadge type={item.type} price={item.price} barterWish={item.barterWish} className="shadow-none" />
                <span className="block text-xs text-muted-foreground">
                  {getCategory(item.category)?.name} · {timeAgo(item.createdAt)}
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-44">
                <StatusSelect id={item.id} status={item.status} />
              </div>
              <Link
                href={`/barang/${item.id}`}
                aria-label="Lihat"
                className={cn(buttonVariants({ variant: "outline", size: "icon" }), "size-10")}
              >
                <Eye className="size-4" />
              </Link>
              <Link
                href={`/barang/${item.id}/edit`}
                aria-label="Edit"
                className={cn(buttonVariants({ variant: "outline", size: "icon" }), "size-10")}
              >
                <Pencil className="size-4" />
              </Link>
              <DeleteListingButton id={item.id} compact />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-background p-4">
      <p className="text-2xl font-extrabold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
