import Form from "next/form";
import { Search } from "lucide-react";

export function HeaderSearch() {
  return (
    <Form action="/jelajah" className="relative" role="search">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        name="q"
        type="search"
        placeholder="Cari meja, kipas…"
        aria-label="Cari barang"
        className="h-9 w-40 rounded-full bg-muted pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-ring/30 xl:w-48"
      />
    </Form>
  );
}
