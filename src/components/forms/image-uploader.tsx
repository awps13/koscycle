"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { toast } from "sonner";
import { uploadToCloudinary, type UploadedImage, MAX_FILE_MB } from "@/lib/upload-client";
import { cn } from "@/lib/utils";

export function ImageUploader({
  value,
  onChange,
  max = 6,
  invalid,
}: {
  value: { url: string; publicId?: string }[];
  onChange: (images: { url: string; publicId?: string }[]) => void;
  max?: number;
  invalid?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = max - value.length;
    const list = Array.from(files).slice(0, room);
    if (files.length > room) toast.info(`Maksimal ${max} foto per iklan`);

    setUploading((n) => n + list.length);
    const results: UploadedImage[] = [];
    await Promise.all(
      list.map(async (file) => {
        try {
          results.push(await uploadToCloudinary(file, "barang"));
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Upload gagal");
        } finally {
          setUploading((n) => n - 1);
        }
      }),
    );
    if (results.length) onChange([...value, ...results]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function makeCover(index: number) {
    const next = [...value];
    const [img] = next.splice(index, 1);
    onChange([img, ...next]);
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((img, i) => (
          <div key={img.url} className="group relative aspect-square overflow-hidden rounded-xl border bg-muted">
            <Image src={img.url} alt={`Foto ${i + 1}`} fill sizes="160px" className="object-cover" />
            {i === 0 ? (
              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                Sampul
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makeCover(i)}
                className="absolute bottom-1.5 left-1.5 hidden items-center gap-1 rounded-full bg-background/95 px-2 py-0.5 text-[10px] font-semibold group-hover:inline-flex"
              >
                <Star className="size-3" /> Jadikan sampul
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Hapus foto"
              className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-background/95 shadow"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {Array.from({ length: uploading }, (_, i) => (
          <div key={`u${i}`} className="grid aspect-square place-items-center rounded-xl border bg-muted">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        ))}
        {value.length + uploading < max ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-xs font-medium text-muted-foreground transition hover:border-primary hover:bg-mint/40 hover:text-primary",
              invalid && "border-destructive/60",
            )}
          >
            <ImagePlus className="size-6" />
            Tambah foto
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Maks. {max} foto, masing-masing ≤ {MAX_FILE_MB} MB. Foto pertama jadi sampul. Disimpan di Cloudinary.
      </p>
    </div>
  );
}
