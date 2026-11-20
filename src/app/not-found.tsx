import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="container-page flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">Barangnya sudah dioper duluan</h1>
      <p className="mt-2 text-muted-foreground">Halaman yang kamu cari tidak ditemukan atau sudah dihapus.</p>
      <Link href="/jelajah" className={cn(buttonVariants(), "mt-6 h-11 rounded-xl px-6 font-semibold")}>
        Jelajah Barang Lain
      </Link>
    </div>
  );
}
