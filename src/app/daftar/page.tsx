import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Daftar" };

export default function DaftarPage() {
  return <AuthShell mode="daftar" title="Buat Akun Gratis" desc="Daftar pakai email, lalu verifikasi KTM di profil." />;
}
