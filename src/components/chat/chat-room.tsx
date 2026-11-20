"use client";

import { useEffect, useOptimistic, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, SendHorizontal } from "lucide-react";
import { toast } from "sonner";
import { sendMessage } from "@/lib/actions/chat";
import { cn } from "@/lib/utils";

export type ChatMessage = { id: string; body: string; mine: boolean; time: string; pending?: boolean };

export function ChatRoom({ conversationId, messages }: { conversationId: string; messages: ChatMessage[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [pending, startTransition] = useTransition();
  const [optimistic, addOptimistic] = useOptimistic(messages, (state, body: string) => [
    ...state,
    { id: `tmp-${state.length}`, body, mine: true, time: "", pending: true },
  ]);

  // Polling sederhana untuk pesan baru
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 5000);
    return () => clearInterval(t);
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [optimistic.length]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = String(fd.get("body") ?? "").trim();
    if (!body) return;
    formRef.current?.reset();
    startTransition(async () => {
      addOptimistic(body);
      const res = await sendMessage(conversationId, fd);
      if (!res.ok) toast.error(res.message);
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto bg-surface p-4">
        {optimistic.map((m) => (
          <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
                m.mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border bg-background",
                m.pending && "opacity-60",
              )}
            >
              <p className="break-words whitespace-pre-wrap">{m.body}</p>
              {m.time ? (
                <p className={cn("mt-0.5 text-right text-[10px]", m.mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {m.time}
                </p>
              ) : null}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form ref={formRef} onSubmit={submit} className="flex items-end gap-2 border-t bg-background p-3">
        <textarea
          name="body"
          rows={1}
          maxLength={1000}
          placeholder="Tulis pesan…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          className="max-h-32 min-h-10 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Kirim"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <SendHorizontal className="size-4" />}
        </button>
      </form>
    </div>
  );
}
