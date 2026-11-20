"use client";

import { useOptimistic, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleFavorite } from "@/lib/actions/favorite";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  listingId,
  initial,
  className,
  withLabel,
}: {
  listingId: string;
  initial: boolean;
  className?: string;
  withLabel?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [favorited, setOptimistic] = useOptimistic(initial);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      setOptimistic(!favorited);
      const res = await toggleFavorite(listingId);
      if (!res.ok) {
        toast.info("Masuk dulu untuk menyimpan barang favorit");
        router.push(`/masuk?next=${encodeURIComponent(pathname)}`);
        return;
      }
      toast.success(res.favorited ? "Disimpan ke favorit" : "Dihapus dari favorit");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={favorited}
      aria-label={favorited ? "Hapus dari favorit" : "Simpan ke favorit"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-background/95 text-foreground/80 shadow-sm transition hover:scale-105 hover:text-rose-500",
        withLabel ? "h-10 border px-4 text-sm font-semibold" : "size-8",
        className,
      )}
    >
      <Heart className={cn("size-4", favorited && "fill-rose-500 text-rose-500")} />
      {withLabel ? (favorited ? "Tersimpan" : "Simpan") : null}
    </button>
  );
}
