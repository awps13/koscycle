import Link from "next/link";
import { Camera, Handshake, MessageCircle, PlusCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { icon: Camera, title: "Foto & Pasang Iklan", text: "Unggah foto barang, pilih jual, barter, atau hibah. Gratis tanpa biaya admin." },
  { icon: MessageCircle, title: "Chat Sesama Anak Kos", text: "Nego harga atau tawarkan barang tukar langsung lewat chat KosCycle." },
  { icon: Handshake, title: "COD di Depan Kos", text: "Ketemuan di area kampus. Semua penjual wajib unggah KTM, jadi lebih aman." },
];

export function HowItWorks() {
  return (
    <section className="bg-surface py-16">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-wider text-primary uppercase">Mau Pindahan?</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
              Barangmu masih layak, jangan dibuang. Oper ke adik tingkat!
            </h2>
            <p className="mt-4 text-muted-foreground">
              Daripada repot bawa pulang kampung atau ditinggal di kos, pasang iklan dalam 2 menit dan biarkan
              barangmu dipakai lagi.
            </p>
            <Link href="/pasang-iklan" className={cn(buttonVariants(), "mt-6 h-11 rounded-xl px-6 font-semibold")}>
              <PlusCircle className="size-4" /> Pasang Iklan Gratis
            </Link>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border bg-background p-5">
                <span className="mb-4 flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-mint text-mint-foreground">
                    <s.icon className="size-5" />
                  </span>
                  <span className="text-3xl font-extrabold text-muted">0{i + 1}</span>
                </span>
                <h3 className="font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
