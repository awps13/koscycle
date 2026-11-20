import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronRight, MapPin, MessageCircle, PackageCheck, ShieldCheck, Tag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ImageGallery } from "@/components/listing/image-gallery";
import { FavoriteButton } from "@/components/listing/favorite-button";
import { ListingGrid, ListingGridSkeleton } from "@/components/listing/listing-grid";
import { OwnerActions } from "@/components/listing/owner-actions";
import { TypeBadge } from "@/components/listing/type-badge";
import { UserAvatar } from "@/components/user-avatar";
import { startConversation } from "@/lib/actions/chat";
import { getCampus, getCategory, getCondition, getStatus } from "@/lib/constants";
import { formatRupiah, timeAgo, whatsappLink } from "@/lib/format";
import { countSellerListings, getFavoriteIds, getListingById, getListings } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export default function ListingPage({ params, searchParams }: PageProps<"/barang/[id]">) {
  return (
    <div className="container-page py-8">
      <Suspense fallback={<DetailSkeleton />}>
        <ListingDetail params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
      <div className="space-y-4">
        <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

async function ListingDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [item, session] = await Promise.all([getListingById(id), getSession()]);
  if (!item) notFound();

  const me = session?.user.id;
  const isOwner = me === item.sellerId;
  const [favoriteIds, sellerCount] = await Promise.all([getFavoriteIds(me), countSellerListings(item.sellerId)]);
  const category = getCategory(item.category);
  const campus = getCampus(item.campus);
  const condition = getCondition(item.condition);
  const status = getStatus(item.status);
  const chat = startConversation.bind(null, item.id);

  return (
    <>
      {sp.baru ? (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-primary/20 bg-mint px-4 py-3 text-sm font-medium text-mint-foreground">
          <PackageCheck className="size-5" /> Iklanmu sudah tayang! Bagikan link halaman ini ke grup angkatan biar cepat laku.
        </div>
      ) : null}

      <nav className="mb-5 flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/jelajah" className="hover:text-primary">Jelajah</Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/jelajah?kategori=${item.category}`} className="hover:text-primary">{category?.name}</Link>
        <ChevronRight className="size-3.5" />
        <span className="truncate text-foreground">{item.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="min-w-0 space-y-8">
          <ImageGallery images={item.images} title={item.title} />
          <section>
            <h2 className="mb-3 text-lg font-bold">Deskripsi</h2>
            <p className="leading-relaxed whitespace-pre-line text-foreground/85">{item.description}</p>
          </section>
          <section className="grid gap-3 sm:grid-cols-2">
            <Info icon={Tag} label="Kategori" value={category?.name ?? item.category} />
            <Info icon={PackageCheck} label="Kondisi" value={condition?.label ?? "-"} />
            <Info
              icon={MapPin}
              label="Lokasi COD"
              value={`${campus?.name ?? item.campus}${item.area ? ` · ${item.area}` : ""}`}
            />
            <Info icon={CalendarDays} label="Dipasang" value={timeAgo(item.createdAt)} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4 rounded-2xl border bg-background p-5">
            <div className="flex items-start justify-between gap-3">
              <TypeBadge type={item.type} price={item.price} barterWish={item.barterWish} />
              {item.status !== "aktif" ? (
                <span className="rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-background">
                  {status?.label}
                </span>
              ) : null}
            </div>
            <h1 className="text-2xl leading-snug font-extrabold tracking-tight">{item.title}</h1>
            <p className="text-3xl font-extrabold text-primary">
              {item.type === "jual" ? formatRupiah(item.price) : item.type === "hibah" ? "Gratis" : "Barter"}
            </p>
            {item.type === "barter" && item.barterWish ? (
              <p className="rounded-xl bg-peach px-3 py-2 text-sm text-peach-foreground">
                Ingin ditukar dengan: <strong>{item.barterWish}</strong>
              </p>
            ) : null}
            {item.type === "hibah" ? (
              <p className="rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-800">
                Barang hibah — ambil sendiri ke lokasi penjual.
              </p>
            ) : null}

            {!isOwner ? (
              <div className="flex gap-2">
                <form action={chat} className="flex-1">
                  <Button
                    type="submit"
                    disabled={item.status === "terjual"}
                    className="h-11 w-full rounded-xl font-semibold"
                  >
                    <MessageCircle className="size-4" />
                    {item.type === "barter" ? "Tawarkan Barter" : item.type === "hibah" ? "Minta Barang" : "Chat Penjual"}
                  </Button>
                </form>
                <FavoriteButton listingId={item.id} initial={favoriteIds.has(item.id)} withLabel className="h-11" />
              </div>
            ) : null}
          </div>

          {isOwner ? <OwnerActions id={item.id} status={item.status} /> : null}

          <div className="rounded-2xl border bg-background p-5">
            <p className="mb-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">Penjual</p>
            <div className="flex items-center gap-3">
              <UserAvatar
                name={item.seller.name}
                image={item.seller.image}
                verified={item.seller.ktmVerified}
                className="size-12"
              />
              <div className="min-w-0">
                <p className="truncate font-bold">{item.seller.name}</p>
                <p className="text-xs text-muted-foreground">
                  {getCampus(item.seller.campus)?.name ?? "Mahasiswa"} · {sellerCount} iklan
                </p>
              </div>
            </div>
            <div
              className={cn(
                "mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold",
                item.seller.ktmVerified ? "bg-mint text-mint-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              <ShieldCheck className="size-4" />
              {item.seller.ktmVerified ? "KTM Terverifikasi — COD aman di depan kos" : "KTM sedang diverifikasi"}
            </div>
            {!isOwner && item.seller.whatsapp && session ? (
              <a
                href={whatsappLink(item.seller.whatsapp, `Halo kak, saya lihat "${item.title}" di KosCycle. Masih ada?`)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "mt-3 h-10 w-full rounded-xl font-semibold")}
              >
                Hubungi via WhatsApp
              </a>
            ) : null}
          </div>

          <div className="rounded-2xl border border-dashed p-4 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Tips COD aman:</strong> ketemuan di tempat ramai sekitar kampus, cek
            kondisi barang sebelum bayar, dan jangan transfer DP ke orang yang belum kamu temui.
          </div>
        </aside>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Barang Serupa</h2>
        <Suspense fallback={<ListingGridSkeleton count={4} />}>
          <Similar id={item.id} category={item.category} favoriteIds={favoriteIds} />
        </Suspense>
      </section>
    </>
  );
}

async function Similar({ id, category, favoriteIds }: { id: string; category: string; favoriteIds: Set<string> }) {
  const items = await getListings({ category, excludeId: id, limit: 4 });
  if (items.length === 0) return <p className="text-sm text-muted-foreground">Belum ada barang serupa.</p>;
  return <ListingGrid items={items} favoriteIds={favoriteIds} />;
}

function Info({ icon: Icon, label, value }: { icon: typeof Tag; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background p-3">
      <span className="grid size-9 place-items-center rounded-lg bg-mint text-mint-foreground">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block truncate text-sm font-semibold">{value}</span>
      </span>
    </div>
  );
}
