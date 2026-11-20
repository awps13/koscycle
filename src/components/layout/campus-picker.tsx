"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CAMPUSES, getCampus } from "@/lib/constants";

export function CampusPicker() {
  const router = useRouter();
  const params = useSearchParams();
  const current = getCampus(params.get("kampus"));

  function go(slug?: string) {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set("kampus", slug);
    else next.delete("kampus");
    router.push(`/jelajah?${next.toString()}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 items-center gap-1.5 rounded-full bg-muted px-3 text-xs font-semibold text-foreground/90 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40">
        <MapPin className="size-3.5 text-primary" />
        <span className="max-w-32 truncate">{current ? `Sekitar ${current.name}` : "Semua Kampus"}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-80 w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Pilih area kampus</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => go()}>Semua Kampus</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {CAMPUSES.map((c) => (
          <DropdownMenuItem key={c.slug} onClick={() => go(c.slug)}>
            <span className="flex flex-col">
              <span className="font-medium">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.areas}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CampusPickerFallback() {
  return (
    <span className="flex h-9 items-center gap-1.5 rounded-full bg-muted px-3 text-xs font-semibold">
      <MapPin className="size-3.5 text-primary" />
      Semua Kampus
      <ChevronDown className="size-3.5 text-muted-foreground" />
    </span>
  );
}
