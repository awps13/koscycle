import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { ListingWithSeller } from "@/lib/queries";
import { getCampus, getCondition, getStatus } from "@/lib/constants";
import { timeAgo } from "@/lib/format";
import { UserAvatar } from "@/components/user-avatar";
import { FavoriteButton } from "./favorite-button";
import { TypeBadge } from "./type-badge";

export function ListingCard({
  item,
  favorited = false,
  priority = false,
}: {
  item: ListingWithSeller;
  favorited?: boolean;
  priority?: boolean;
}) {
  const cover = item.images[0]?.url;
  const campus = getCampus(item.campus);
  const condition = getCondition(item.condition);
  const status = item.status !== "aktif" ? getStatus(item.status) : null;

  return (
    <Link
      href={`/barang/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-[4/3.6] overflow-hidden bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={item.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <TypeBadge type={item.type} price={item.price} barterWish={item.barterWish} />
          <FavoriteButton listingId={item.id} initial={favorited} className="shrink-0" />
        </div>
        {status ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-foreground/85 px-2.5 py-1 text-xs font-semibold text-background">
            {status.label}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-[15px] leading-snug font-semibold group-hover:text-primary">
          {item.title}
        </h3>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">
            {campus?.name ?? item.campus}
            {item.area ? ` · ${item.area}` : ""}
          </span>
        </p>
        {condition ? (
          <span className="w-fit rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/70">
            {condition.label}
          </span>
        ) : null}
        <div className="mt-auto flex items-center gap-2 border-t pt-3">
          <UserAvatar
            name={item.seller.name}
            image={item.seller.image}
            verified={item.seller.ktmVerified}
            className="size-6 text-[10px]"
          />
          <span className="truncate text-xs font-medium">{item.seller.name}</span>
          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{timeAgo(item.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="aspect-[4/3.6] animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
