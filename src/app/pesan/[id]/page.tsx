import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ChatRoom } from "@/components/chat/chat-room";
import { UserAvatar } from "@/components/user-avatar";
import { typeLabel } from "@/components/listing/type-badge";
import { getStatus } from "@/lib/constants";
import { whatsappLink } from "@/lib/format";
import { getConversation, markConversationRead } from "@/lib/queries";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Chat" };

const timeFmt = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  day: "numeric",
  month: "short",
  timeZone: "Asia/Jakarta",
});

export default function ChatPage({ params }: PageProps<"/pesan/[id]">) {
  return (
    <div className="container-page max-w-3xl py-6">
      <Suspense fallback={<div className="h-[70vh] animate-pulse rounded-2xl bg-muted" />}>
        <Thread params={params} />
      </Suspense>
    </div>
  );
}

async function Thread({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await requireUser(`/pesan/${id}`);
  const conv = await getConversation(id, me.id);
  if (!conv) notFound();
  await markConversationRead(conv.id, me.id);

  const status = conv.listing.status !== "aktif" ? getStatus(conv.listing.status) : null;

  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-2xl border bg-background">
      <div className="flex items-center gap-3 border-b p-3">
        <Link href="/pesan" aria-label="Kembali" className="grid size-9 place-items-center rounded-lg hover:bg-muted">
          <ArrowLeft className="size-5" />
        </Link>
        <UserAvatar name={conv.other.name} image={conv.other.image} verified={conv.other.ktmVerified} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{conv.other.name}</p>
          <p className="text-xs text-muted-foreground">
            {conv.sellerId === me.id ? "Calon pembeli" : "Penjual"}
            {conv.other.ktmVerified ? " · KTM terverifikasi" : ""}
          </p>
        </div>
        {conv.other.whatsapp ? (
          <a
            href={whatsappLink(conv.other.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted sm:block"
          >
            WhatsApp
          </a>
        ) : null}
      </div>
      <Link href={`/barang/${conv.listing.id}`} className="flex items-center gap-3 border-b bg-mint/40 px-4 py-2.5 hover:bg-mint/70">
        <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
          {conv.listing.images[0] ? (
            <Image src={conv.listing.images[0].url} alt="" fill sizes="44px" className="object-cover" />
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{conv.listing.title}</span>
          <span className="block text-xs text-primary">{typeLabel(conv.listing)}</span>
        </span>
        {status ? (
          <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background">
            {status.label}
          </span>
        ) : null}
      </Link>
      <ChatRoom
        conversationId={conv.id}
        messages={conv.messages.map((m) => ({
          id: m.id,
          body: m.body,
          mine: m.senderId === me.id,
          time: timeFmt.format(m.createdAt),
        }))}
      />
    </div>
  );
}
