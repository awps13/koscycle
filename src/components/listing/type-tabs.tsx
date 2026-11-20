import Link from "next/link";
import { ArrowLeftRight, Gift, LayoutGrid, Tag } from "lucide-react";
import { LISTING_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS = { all: LayoutGrid, jual: Tag, barter: ArrowLeftRight, hibah: Gift };

export function TypeTabs({
  basePath,
  params,
  current,
  hash,
  className,
}: {
  basePath: string;
  params: Record<string, string | undefined>;
  current?: string;
  hash?: string;
  className?: string;
}) {
  const tabs = [{ value: "all", label: "Semua Barang (All)" }, ...LISTING_TYPES];

  function href(value: string) {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== "tipe" && k !== "hal") next.set(k, v);
    if (value !== "all") next.set("tipe", value);
    const qs = next.toString();
    return `${basePath}${qs ? `?${qs}` : ""}${hash ? `#${hash}` : ""}`;
  }

  return (
    <div className={cn("scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0", className)}>
      {tabs.map((t) => {
        const active = (current ?? "all") === t.value;
        const Icon = ICONS[t.value as keyof typeof ICONS];
        return (
          <Link
            key={t.value}
            href={href(t.value)}
            scroll={false}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background text-foreground/80 hover:border-primary/40 hover:text-primary",
            )}
          >
            {t.value !== "all" ? <Icon className="size-3.5" /> : null}
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
