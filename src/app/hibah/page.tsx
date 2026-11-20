import type { Metadata } from "next";
import { BrowseView } from "@/components/listing/browse-view";

export const metadata: Metadata = { title: "Hibah Gratis" };

export default function HibahPage({ searchParams }: PageProps<"/hibah">) {
  return (
    <BrowseView
      basePath="/hibah"
      eyebrow="Hibah Gratis"
      title="Gratis, Tinggal Bawa Sendiri"
      description="Barang yang dihibahkan kakak tingkat sebelum pulang kampung. Ambil sendiri di kos penjual, jangan lupa bilang terima kasih!"
      fixedType="hibah"
      searchParams={searchParams}
    />
  );
}
