import type { Metadata } from "next";
import { BrowseView } from "@/components/listing/browse-view";

export const metadata: Metadata = { title: "Barter Hub" };

export default function BarterPage({ searchParams }: PageProps<"/barter">) {
  return (
    <BrowseView
      basePath="/barter"
      eyebrow="Barter Hub"
      title="Tukar Barang Sesama Anak Kos"
      description="Punya rak tapi butuh kipas? Tawarkan barter tanpa keluar uang. Chat penjual untuk menawarkan barangmu."
      fixedType="barter"
      searchParams={searchParams}
    />
  );
}
