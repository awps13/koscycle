import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/forms/auth-form";

export function AuthShell({ mode, title, desc }: { mode: "masuk" | "daftar"; title: string; desc: string }) {
  return (
    <div className="flex flex-1 items-center bg-surface py-12">
      <div className="container-page grid max-w-5xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight">
            Pindah kos tanpa beban, <span className="text-primary">oper barang</span> lebih cuan.
          </h1>
          <ul className="mt-6 space-y-3 text-muted-foreground">
            {["Gratis tanpa biaya admin", "Khusus mahasiswa, penjual wajib KTM", "COD aman di sekitar kampus"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-md rounded-3xl border bg-background p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">{desc}</p>
          <Suspense fallback={<div className="h-72 animate-pulse rounded-xl bg-muted" />}>
            <AuthForm mode={mode} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
