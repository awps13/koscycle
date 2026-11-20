"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSelect } from "./form-select";
import { signIn, signUp } from "@/lib/auth-client";
import { CAMPUSES } from "@/lib/constants";

function safeNext(v: string | null) {
  return v && v.startsWith("/") && !v.startsWith("//") ? v : "/";
}

export function AuthForm({ mode }: { mode: "masuk" | "daftar" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    setLoading(true);

    if (mode === "daftar") {
      const campus = String(fd.get("campus") ?? "");
      if (!campus) {
        setError("Pilih kampusmu dulu");
        setLoading(false);
        return;
      }
      const { error } = await signUp.email({
        name: String(fd.get("name") ?? "").trim(),
        email,
        password,
        campus,
      });
      if (error) {
        setError(
          error.code === "USER_ALREADY_EXISTS" || error.status === 422
            ? "Email sudah terdaftar. Silakan masuk."
            : (error.message ?? "Gagal mendaftar"),
        );
        setLoading(false);
        return;
      }
      toast.success("Akun dibuat! Lengkapi KTM di profil biar bisa pasang iklan.");
    } else {
      const { error } = await signIn.email({ email, password });
      if (error) {
        setError(error.status === 401 ? "Email atau password salah" : (error.message ?? "Gagal masuk"));
        setLoading(false);
        return;
      }
      toast.success("Selamat datang kembali!");
    }

    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "daftar" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Nama lengkap</Label>
            <Input id="name" name="name" required minLength={2} autoComplete="name" className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campus">Kampus</Label>
            <FormSelect
              id="campus"
              name="campus"
              placeholder="Pilih kampusmu"
              className="h-11"
              options={CAMPUSES.map((c) => ({ value: c.slug, label: c.name }))}
            />
          </div>
        </>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="nama@ui.ac.id"
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "daftar" ? "new-password" : "current-password"}
          className="h-11"
        />
        {mode === "daftar" ? <p className="text-xs text-muted-foreground">Minimal 8 karakter.</p> : null}
      </div>
      {error ? (
        <p className="rounded-lg bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">{error}</p>
      ) : null}
      <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl font-semibold">
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        {mode === "daftar" ? "Daftar Sekarang" : "Masuk"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {mode === "daftar" ? "Sudah punya akun? " : "Belum punya akun? "}
        <Link
          href={`/${mode === "daftar" ? "masuk" : "daftar"}${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-primary hover:underline"
        >
          {mode === "daftar" ? "Masuk" : "Daftar gratis"}
        </Link>
      </p>
    </form>
  );
}
