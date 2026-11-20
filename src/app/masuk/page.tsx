import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Masuk" };

export default function MasukPage() {
  return <AuthShell mode="masuk" title="Masuk ke KosCycle" desc="Lanjutkan oper barang dan chat dengan anak kos lain." />;
}
