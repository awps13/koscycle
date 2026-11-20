import Link from "next/link";
import { Bell, Heart, PlusCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { getUnreadCount } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { UserMenu } from "./user-menu";

export async function HeaderUser() {
  const me = await getCurrentUser();

  if (!me) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/masuk" className={cn(buttonVariants({ variant: "ghost" }), "h-10 px-4 font-semibold")}>
          Masuk
        </Link>
        <Link
          href="/pasang-iklan"
          className={cn(buttonVariants(), "hidden h-10 rounded-xl px-4 font-semibold sm:inline-flex")}
        >
          <PlusCircle className="size-4" /> Pasang Iklan
        </Link>
      </div>
    );
  }

  const unread = await getUnreadCount(me.id);

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <Link
        href="/pesan"
        className="relative grid size-9 place-items-center rounded-full text-foreground/80 hover:bg-muted"
        aria-label={unread ? `${unread} pesan belum dibaca` : "Pesan"}
      >
        <Bell className="size-5" />
        {unread > 0 ? (
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-peach-foreground ring-2 ring-background" />
        ) : null}
      </Link>
      <Link
        href="/favorit"
        className="hidden size-9 place-items-center rounded-full text-foreground/80 hover:bg-muted sm:grid"
        aria-label="Favorit"
      >
        <Heart className="size-5" />
      </Link>
      <Link
        href="/pasang-iklan"
        className={cn(buttonVariants(), "hidden h-10 rounded-xl px-4 font-semibold sm:inline-flex")}
      >
        <PlusCircle className="size-4" /> Pasang Iklan
      </Link>
      <UserMenu name={me.name} email={me.email} image={me.image} verified={me.ktmVerified} />
    </div>
  );
}

export function HeaderUserFallback() {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden h-10 w-32 animate-pulse rounded-xl bg-muted sm:block" />
      <div className="size-9 animate-pulse rounded-full bg-muted" />
    </div>
  );
}
