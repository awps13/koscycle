"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Armchair, GraduationCap, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CAMPUSES, CATEGORIES } from "@/lib/constants";

const campusItems = [
  { value: "all", label: "Semua Kampus" },
  ...CAMPUSES.map((c) => ({ value: c.slug, label: `${c.name} (${c.areas})` })),
];
const categoryItems = [
  { value: "all", label: "Semua Kategori" },
  ...CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
];

function Field({
  icon: Icon,
  label,
  items,
  value,
  onChange,
}: {
  icon: typeof Search;
  label: string;
  items: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select items={items} value={value} onValueChange={(v) => onChange(String(v ?? "all"))}>
      <SelectTrigger
        aria-label={label}
        className="h-auto min-h-14 w-full min-w-0 items-center rounded-xl border-0 bg-muted px-3 py-2 text-left hover:bg-accent/60"
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">
          <Icon className="size-5 shrink-0 text-primary" />
          <span className="flex min-w-0 flex-col">
            <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
            <SelectValue className="truncate text-sm font-semibold text-foreground" />
          </span>
        </span>
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {items.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function HeroSearch() {
  const router = useRouter();
  const [campus, setCampus] = useState("ui-depok");
  const [category, setCategory] = useState("all");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (campus !== "all") params.set("kampus", campus);
    if (category !== "all") params.set("kategori", category);
    router.push(`/jelajah?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
      <Field icon={GraduationCap} label="Area Kampus" items={campusItems} value={campus} onChange={setCampus} />
      <Field icon={Armchair} label="Kategori Perabot" items={categoryItems} value={category} onChange={setCategory} />
      <button
        type="submit"
        className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        <Search className="size-4" />
        Temukan Barang Dekat Kos
      </button>
    </form>
  );
}
