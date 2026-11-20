"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatarClient } from "./user-avatar-client";
import { FormSelect } from "./form-select";
import { updateProfile, type ProfileFormState } from "@/lib/actions/profile";
import { uploadToCloudinary } from "@/lib/upload-client";
import { CAMPUSES } from "@/lib/constants";

export function ProfileForm({
  initial,
}: {
  initial: { name: string; email: string; campus: string | null; whatsapp: string | null; image: string | null };
}) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(updateProfile, {});
  const [image, setImage] = useState(initial.image ?? "");
  const [uploading, setUploading] = useState(false);
  const e = state.errors ?? {};

  useEffect(() => {
    if (state.ok && state.message) toast.success(state.message);
  }, [state]);

  async function onAvatar(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadToCloudinary(file, "barang");
      setImage(res.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(ev) => {
        ev.preventDefault();
        const fd = new FormData(ev.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      <input type="hidden" name="image" value={image} />
      <div className="flex items-center gap-4">
        <UserAvatarClient name={initial.name} image={image} />
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
          Ganti foto
          <input type="file" accept="image/*" hidden onChange={(ev) => onAvatar(ev.target.files?.[0])} />
        </label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nama</Label>
        <Input id="name" name="name" defaultValue={initial.name} className="h-10" aria-invalid={!!e.name} />
        {e.name ? <p className="text-xs text-destructive">{e.name}</p> : null}
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={initial.email} disabled className="h-10" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="campus">Kampus</Label>
          <FormSelect
            id="campus"
            name="campus"
            defaultValue={initial.campus ?? undefined}
            placeholder="Pilih kampus"
            invalid={!!e.campus}
            options={CAMPUSES.map((c) => ({ value: c.slug, label: c.name }))}
          />
          {e.campus ? <p className="text-xs text-destructive">{e.campus}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">No. WhatsApp (opsional)</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            inputMode="tel"
            defaultValue={initial.whatsapp ?? ""}
            placeholder="081234567890"
            className="h-10"
            aria-invalid={!!e.whatsapp}
          />
          {e.whatsapp ? <p className="text-xs text-destructive">{e.whatsapp}</p> : null}
        </div>
      </div>
      {state.message && !state.ok ? <p className="text-sm text-destructive">{state.message}</p> : null}
      <Button type="submit" disabled={pending || uploading} className="h-10 rounded-xl px-6 font-semibold">
        {pending ? <Loader2 className="size-4 animate-spin" /> : null} Simpan Profil
      </Button>
    </form>
  );
}
