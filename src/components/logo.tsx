import Link from "next/link";
import { Recycle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label="KosCycle beranda">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Recycle className="size-5" strokeWidth={2.4} />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-foreground">KosCycle</span>
    </Link>
  );
}
