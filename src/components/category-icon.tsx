import {
  Armchair,
  BedDouble,
  BookOpen,
  Bath,
  CookingPot,
  Droplet,
  Fan,
  LibraryBig,
  Package,
  type LucideIcon,
} from "lucide-react";
import type { CategoryIcon as IconName } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<IconName, LucideIcon> = {
  desk: Armchair,
  bed: BedDouble,
  droplet: Droplet,
  fan: Fan,
  pot: CookingPot,
  shelf: LibraryBig,
  bath: Bath,
  book: BookOpen,
  box: Package,
};

export function CategoryIcon({
  icon,
  tone,
  className,
}: {
  icon: IconName;
  tone: "mint" | "peach";
  className?: string;
}) {
  const Icon = ICONS[icon];
  return (
    <span
      className={cn(
        "grid size-11 place-items-center rounded-xl",
        tone === "mint" ? "bg-mint text-mint-foreground" : "bg-peach text-peach-foreground",
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={2} />
    </span>
  );
}
