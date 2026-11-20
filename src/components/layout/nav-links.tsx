"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/jelajah", label: "Jelajah" },
  { href: "/barter", label: "Barter Hub" },
  { href: "/hibah", label: "Hibah Gratis" },
  { href: "/tips", label: "Tips Pindah Kos" },
];

export function NavLinks({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className={cn("flex items-center gap-6", className)}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "relative py-1 text-sm font-medium text-foreground/80 transition-colors hover:text-primary",
              active && "font-semibold text-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function NavLinksFallback({ className }: { className?: string }) {
  return (
    <nav className={cn("flex items-center gap-6", className)}>
      {NAV_ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className="py-1 text-sm font-medium text-foreground/80">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
