"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, PlusCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="grid size-9 place-items-center rounded-lg hover:bg-muted lg:hidden"
        aria-label="Buka menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {[...NAV_ITEMS, { href: "/kategori", label: "Semua Kategori" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/pasang-iklan"
            onClick={() => setOpen(false)}
            className={cn(buttonVariants(), "mt-4 h-11 rounded-xl font-semibold")}
          >
            <PlusCircle className="size-4" /> Pasang Iklan
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
