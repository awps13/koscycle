import Link from "next/link";
import { Logo } from "@/components/logo";
import { CATEGORIES } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-surface">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-3 md:col-span-1">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Platform oper barang secondhand khusus anak kos. Pindah kos tanpa beban, barang tetap bermanfaat.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold">Jelajah</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/jelajah?tipe=jual" className="hover:text-primary">Jual Beli Murah</Link></li>
            <li><Link href="/barter" className="hover:text-primary">Barter Hub</Link></li>
            <li><Link href="/hibah" className="hover:text-primary">Hibah Gratis</Link></li>
            <li><Link href="/kategori" className="hover:text-primary">Semua Kategori</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold">Kategori Populer</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {CATEGORIES.slice(0, 4).map((c) => (
              <li key={c.slug}>
                <Link href={`/jelajah?kategori=${c.slug}`} className="hover:text-primary">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold">Bantuan</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/tips" className="hover:text-primary">Tips Pindah Kos</Link></li>
            <li><Link href="/tips#cod-aman" className="hover:text-primary">Panduan COD Aman</Link></li>
            <li><Link href="/pasang-iklan" className="hover:text-primary">Pasang Iklan</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="container-page py-5 text-xs text-muted-foreground">
          © KosCycle — dari anak kos, untuk anak kos.
        </p>
      </div>
    </footer>
  );
}
