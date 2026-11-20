import { ArrowLeftRight, Gift, Tag } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  type: "jual" | "barter" | "hibah";
  price?: number | null;
  barterWish?: string | null;
  className?: string;
  long?: boolean;
};

export function typeLabel({ type, price, barterWish }: Props) {
  if (type === "jual") return `Jual ${formatRupiah(price)}`;
  if (type === "barter") return barterWish ? `Barter dgn ${barterWish}` : "Barter";
  return "GRATIS / Hibah";
}

export function TypeBadge(props: Props) {
  const { type, className } = props;
  const Icon = type === "jual" ? Tag : type === "barter" ? ArrowLeftRight : Gift;
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm",
        type === "jual" && "border-mint bg-mint text-mint-foreground",
        type === "barter" && "border-peach bg-peach text-peach-foreground",
        type === "hibah" && "border-sky-100 bg-sky-50 text-sky-700",
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{typeLabel(props)}</span>
    </span>
  );
}
