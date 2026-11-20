import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  basePath,
  params,
  page,
  totalPages,
}: {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const href = (p: number) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) next.set(k, v);
    if (p > 1) next.set("hal", String(p));
    else next.delete("hal");
    const qs = next.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  };
  const cls =
    "inline-flex h-10 items-center gap-1 rounded-lg border bg-background px-3 text-sm font-medium hover:border-primary/40 hover:text-primary";
  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Halaman">
      {page > 1 ? (
        <Link href={href(page - 1)} className={cls}>
          <ChevronLeft className="size-4" /> Sebelumnya
        </Link>
      ) : (
        <span className={cn(cls, "pointer-events-none opacity-40")}>
          <ChevronLeft className="size-4" /> Sebelumnya
        </span>
      )}
      <span className="text-sm text-muted-foreground">
        Hal {page} dari {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={cls}>
          Berikutnya <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(cls, "pointer-events-none opacity-40")}>
          Berikutnya <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
