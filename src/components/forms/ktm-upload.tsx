"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BadgeCheck, Clock, IdCard, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { saveKtm } from "@/lib/actions/profile";
import { uploadToCloudinary } from "@/lib/upload-client";
import { cn } from "@/lib/utils";

export function KtmUpload({
  ktmUrl,
  verified,
  next,
}: {
  ktmUrl: string | null;
  verified: boolean;
  next?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      const up = await uploadToCloudinary(file, "ktm");
      startTransition(async () => {
        const res = await saveKtm(up.url, up.publicId);
        if (!res.ok) {
          toast.error(res.message);
          return;
        }
        toast.success("KTM berhasil diunggah, menunggu verifikasi admin");
        if (next?.startsWith("/")) router.push(next);
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
          verified ? "bg-mint text-mint-foreground" : ktmUrl ? "bg-peach text-peach-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {verified ? <BadgeCheck className="size-5" /> : ktmUrl ? <Clock className="size-5" /> : <IdCard className="size-5" />}
        {verified
          ? "KTM terverifikasi. Badge centang tampil di profil & iklanmu."
          : ktmUrl
            ? "KTM sudah diunggah, sedang menunggu verifikasi. Kamu sudah bisa pasang iklan."
            : "Belum ada KTM. Wajib diunggah sebelum memasang iklan."}
      </div>
      {ktmUrl ? (
        <div className="relative aspect-[1.6/1] max-w-sm overflow-hidden rounded-xl border bg-muted">
          <Image src={ktmUrl} alt="Foto KTM" fill sizes="384px" className="object-cover blur-[2px]" />
        </div>
      ) : null}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        {ktmUrl ? "Ganti Foto KTM" : "Unggah Foto KTM"}
        <input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => onFile(e.target.files?.[0])} />
      </label>
      <p className="text-xs text-muted-foreground">
        Foto KTM hanya dipakai untuk verifikasi dan tidak ditampilkan ke pengguna lain.
      </p>
    </div>
  );
}
