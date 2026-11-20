import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { MessagesSquare } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { UserAvatar } from "@/components/user-avatar";
import { typeLabel } from "@/components/listing/type-badge";
import { timeAgo } from "@/lib/format";
import { getConversations } from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pesan" };

export default function PesanPage() {
  return (
    <div className="container-page max-w-3xl py-10">
      <PageHeading eyebrow="Pesan" title="Chat Sesama Anak Kos" />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <ConversationList />
      </Suspense>
    </div>
  );
}

async function ConversationList() {
  const me = await requireUser("/pesan");
  const convs = await getConversations(me.id);

  if (convs.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed bg-surface px-6 py-16 text-center">
        <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-mint text-mint-foreground">
          <MessagesSquare className="size-7" />
        </span>
        <h2 className="text-lg font-bold">Belum ada percakapan</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Mulai chat dari halaman barang yang kamu incar, atau tunggu pembeli menghubungi iklanmu.
        </p>
        <Link href="/jelajah" className="mt-5 text-sm font-semibold text-primary hover:underline">
          Jelajah barang →
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y overflow-hidden rounded-2xl border bg-background">
      {convs.map((c) => (
        <li key={c.id}>
          <Link href={`/pesan/${c.id}`} className="flex items-center gap-4 p-4 transition hover:bg-muted/60">
            <UserAvatar name={c.other.name} image={c.other.image} className="size-11" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className={cn("truncate", c.unread ? "font-extrabold" : "font-semibold")}>{c.other.name}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(c.updatedAt)}</span>
              </div>
              <p className="truncate text-xs text-primary">
                {c.listing.title} · {typeLabel(c.listing)}
              </p>
              <p className={cn("truncate text-sm", c.unread ? "font-semibold text-foreground" : "text-muted-foreground")}>
                {c.lastMessage ? `${c.lastMessage.senderId === me.id ? "Kamu: " : ""}${c.lastMessage.body}` : "—"}
              </p>
            </div>
            <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              {c.listing.images[0] ? (
                <Image src={c.listing.images[0].url} alt="" fill sizes="48px" className="object-cover" />
              ) : null}
            </span>
            {c.unread ? (
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {c.unread}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
