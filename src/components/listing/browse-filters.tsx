import Form from "next/form";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormSelect } from "@/components/forms/form-select";
import { CAMPUSES, CATEGORIES, SORT_OPTIONS } from "@/lib/constants";

type Values = { q?: string; category?: string; campus?: string; type?: string; sort?: string };

export function BrowseFilters({
  basePath,
  values,
  keepType,
}: {
  basePath: string;
  values: Values;
  keepType?: boolean;
}) {
  return (
    <Form action={basePath} className="space-y-5">
      {keepType && values.type ? <input type="hidden" name="tipe" value={values.type} /> : null}
      <div className="space-y-2">
        <Label htmlFor="f-q">Kata kunci</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="f-q"
            name="q"
            defaultValue={values.q}
            placeholder="mis. rice cooker"
            className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="f-kategori">Kategori</Label>
        <FormSelect
          id="f-kategori"
          name="kategori"
          defaultValue={values.category ?? "all"}
          options={[{ value: "all", label: "Semua Kategori" }, ...CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))]}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="f-kampus">Area Kampus</Label>
        <FormSelect
          id="f-kampus"
          name="kampus"
          defaultValue={values.campus ?? "all"}
          options={[
            { value: "all", label: "Semua Kampus" },
            ...CAMPUSES.map((c) => ({ value: c.slug, label: c.name, hint: c.areas })),
          ]}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="f-urut">Urutkan</Label>
        <FormSelect
          id="f-urut"
          name="urut"
          defaultValue={values.sort ?? "terbaru"}
          options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="submit" className="h-10 flex-1 rounded-lg font-semibold">
          <SlidersHorizontal className="size-4" /> Terapkan
        </Button>
        <Link
          href={keepType && values.type ? `${basePath}?tipe=${values.type}` : basePath}
          className="inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted"
        >
          Reset
        </Link>
      </div>
    </Form>
  );
}
