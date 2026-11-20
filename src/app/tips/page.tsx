import type { Metadata } from "next";
import Link from "next/link";
import { Boxes, CalendarClock, Camera, HandCoins, ShieldCheck, Truck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Tips Pindah Kos" };

const TIPS = [
  {
    icon: CalendarClock,
    title: "Mulai oper barang 3–4 minggu sebelum pindah",
    text: "Musim wisuda dan akhir semester itu ramai. Pasang iklan lebih awal supaya ada waktu nego dan barang tidak menumpuk di hari terakhir.",
  },
  {
    icon: Boxes,
    title: "Pilah: bawa, jual, barter, atau hibah",
    text: "Barang besar (kasur, lemari, meja) biasanya lebih mahal ongkos kirimnya daripada harganya. Jual atau hibahkan saja ke adik tingkat.",
  },
  {
    icon: Camera,
    title: "Foto di tempat terang, tunjukkan minusnya",
    text: "Pembeli lebih percaya kalau kekurangan barang terlihat jelas. Foto dari beberapa sisi dan sebutkan umur pemakaian.",
  },
  {
    icon: HandCoins,
    title: "Pasang harga 30–60% dari harga baru",
    text: "Cek harga barang serupa di KosCycle. Barang yang masih mulus dan bermerk bisa sedikit lebih tinggi.",
  },
  {
    icon: Truck,
    title: "Atur cara angkut sejak awal",
    text: "Tulis di deskripsi apakah barang harus diambil sendiri atau bisa diantar ke kos terdekat. Hemat waktu chat bolak-balik.",
  },
];

export default function TipsPage() {
  return (
    <>
      <section className="border-b bg-surface">
        <div className="container-page py-12">
          <p className="text-xs font-bold tracking-wider text-primary uppercase">Tips Pindah Kos</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Pindahan ringan, dompet aman, barang tetap bermanfaat
          </h1>
        </div>
      </section>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <ol className="space-y-4">
          {TIPS.map((t, i) => (
            <li key={t.title} className="flex gap-4 rounded-2xl border bg-background p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-mint text-mint-foreground">
                <t.icon className="size-5" />
              </span>
              <div>
                <h2 className="font-bold">
                  {i + 1}. {t.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <aside id="cod-aman" className="h-fit scroll-mt-24 space-y-4 rounded-2xl border bg-peach/50 p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <ShieldCheck className="size-5 text-peach-foreground" /> Panduan COD Aman
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/80">
            <li>Pilih penjual dengan badge KTM terverifikasi.</li>
            <li>Ketemuan di tempat ramai: depan kos, gerbang kampus, atau kantin.</li>
            <li>Cek kondisi barang (nyalakan elektronik) sebelum bayar.</li>
            <li>Jangan transfer DP ke orang yang belum pernah kamu temui.</li>
            <li>Simpan riwayat chat di KosCycle sebagai bukti kesepakatan.</li>
          </ul>
          <Link href="/pasang-iklan" className={cn(buttonVariants(), "h-10 w-full rounded-xl font-semibold")}>
            Mulai Oper Barang
          </Link>
        </aside>
      </div>
    </>
  );
}
