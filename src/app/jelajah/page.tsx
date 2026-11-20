import type { Metadata } from "next";
import { BrowseView } from "@/components/listing/browse-view";

export const metadata: Metadata = { title: "Jelajah Barang" };

export default function JelajahPage({ searchParams }: PageProps<"/jelajah">) {
  return (
    <BrowseView
      basePath="/jelajah"
      eyebrow="Jelajah"
      title="Semua Barang Oper Kos"
      description="Perabot dan perlengkapan kos dari kakak tingkat & sesama mahasiswa di sekitar kampusmu."
      searchParams={searchParams}
    />
  );
}
