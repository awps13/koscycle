"use client";

import { startTransition, useActionState, useState } from "react";
import { ArrowLeftRight, Gift, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormSelect } from "./form-select";
import { ImageUploader } from "./image-uploader";
import type { ListingFormState } from "@/lib/actions/listing";
import { CAMPUSES, CATEGORIES, CONDITIONS, type ListingType } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type ListingFormValues = {
  title: string;
  description: string;
  category: string;
  campus: string;
  area: string;
  type: ListingType;
  price: number | null;
  barterWish: string;
  condition: string;
  images: { url: string; publicId?: string }[];
};

const TYPE_OPTIONS = [
  { value: "jual", label: "Jual", desc: "Dapat uang tambahan", icon: Tag },
  { value: "barter", label: "Barter", desc: "Tukar dengan barang lain", icon: ArrowLeftRight },
  { value: "hibah", label: "Hibah", desc: "Gratis, ambil sendiri", icon: Gift },
] as const;

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs font-medium text-destructive">{msg}</p> : null;
}

export function ListingForm({
  action,
  initial,
  submitLabel,
}: {
  action: (state: ListingFormState, formData: FormData) => Promise<ListingFormState>;
  initial: ListingFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [type, setType] = useState<ListingType>(initial.type);
  const [images, setImages] = useState(initial.images);
  const [price, setPrice] = useState(initial.price ? new Intl.NumberFormat("id-ID").format(initial.price) : "");
  const e = state.errors ?? {};

  return (
    <form
      className="space-y-8"
      onSubmit={(ev) => {
        // Submit manual agar isian tidak di-reset React saat validasi gagal
        ev.preventDefault();
        const fd = new FormData(ev.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <Section title="Foto Barang" desc="Foto yang terang & jelas bikin barang lebih cepat laku.">
        <ImageUploader value={images} onChange={setImages} invalid={!!e.images} />
        <FieldError msg={e.images} />
      </Section>

      <Section title="Jenis Iklan">
        <RadioGroup
          name="type"
          value={type}
          onValueChange={(v) => setType(v as ListingType)}
          className="grid gap-3 sm:grid-cols-3"
        >
          {TYPE_OPTIONS.map((o) => (
            <Label
              key={o.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 font-normal transition",
                type === o.value ? "border-primary bg-mint/50 ring-1 ring-primary" : "hover:border-primary/40",
              )}
            >
              <RadioGroupItem value={o.value} className="mt-0.5" />
              <span className="flex-1">
                <span className="flex items-center gap-1.5 text-sm font-bold">
                  <o.icon className="size-4 text-primary" /> {o.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{o.desc}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>
        {type === "jual" ? (
          <div className="mt-4 max-w-xs space-y-2">
            <Label htmlFor="price">Harga</Label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
              <Input
                id="price"
                name="price"
                inputMode="numeric"
                placeholder="85.000"
                value={price}
                onChange={(ev) => {
                  const digits = ev.target.value.replace(/\D/g, "");
                  setPrice(digits ? new Intl.NumberFormat("id-ID").format(Number(digits)) : "");
                }}
                aria-invalid={!!e.price}
                className="h-10 pl-10"
              />
            </div>
            <FieldError msg={e.price} />
          </div>
        ) : null}
        {type === "barter" ? (
          <div className="mt-4 space-y-2">
            <Label htmlFor="barterWish">Ingin ditukar dengan</Label>
            <Input
              id="barterWish"
              name="barterWish"
              defaultValue={initial.barterWish}
              placeholder="mis. Kipas angin meja"
              aria-invalid={!!e.barterWish}
              className="h-10"
            />
            <FieldError msg={e.barterWish} />
          </div>
        ) : null}
      </Section>

      <Section title="Detail Barang">
        <div className="space-y-2">
          <Label htmlFor="title">Judul iklan</Label>
          <Input
            id="title"
            name="title"
            defaultValue={initial.title}
            placeholder="mis. Rice Cooker Miyako 0.6L masih mulus"
            aria-invalid={!!e.title}
            className="h-10"
            maxLength={80}
          />
          <FieldError msg={e.title} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <FormSelect
              id="category"
              name="category"
              defaultValue={initial.category || undefined}
              placeholder="Pilih kategori"
              invalid={!!e.category}
              options={CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))}
            />
            <FieldError msg={e.category} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Kondisi</Label>
            <FormSelect
              id="condition"
              name="condition"
              defaultValue={initial.condition || undefined}
              placeholder="Pilih kondisi"
              invalid={!!e.condition}
              options={CONDITIONS.map((c) => ({ value: c.value, label: c.label }))}
            />
            <FieldError msg={e.condition} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initial.description}
            rows={6}
            placeholder="Ceritakan merk, umur pemakaian, minus (kalau ada), dan alasan dijual. Contoh: Dipakai 1 tahun, masih normal, lecet sedikit di tutup."
            aria-invalid={!!e.description}
          />
          <FieldError msg={e.description} />
        </div>
      </Section>

      <Section title="Lokasi COD">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="campus">Area kampus</Label>
            <FormSelect
              id="campus"
              name="campus"
              defaultValue={initial.campus || undefined}
              placeholder="Pilih kampus"
              invalid={!!e.campus}
              options={CAMPUSES.map((c) => ({ value: c.slug, label: c.name, hint: c.areas }))}
            />
            <FieldError msg={e.campus} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Daerah kos (opsional)</Label>
            <Input id="area" name="area" defaultValue={initial.area} placeholder="mis. Pocin, Kutek" className="h-10" />
          </div>
        </div>
      </Section>

      {state.message && !state.ok ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {state.message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending} className="h-11 rounded-xl px-8 font-semibold">
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border bg-background p-5 sm:p-6">
      <div>
        <h2 className="font-bold">{title}</h2>
        {desc ? <p className="text-sm text-muted-foreground">{desc}</p> : null}
      </div>
      {children}
    </section>
  );
}
