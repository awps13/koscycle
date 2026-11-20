"use client";

import { getUploadSignature } from "@/lib/actions/upload";

export type UploadedImage = { url: string; publicId: string };

export const MAX_FILE_MB = 8;

/** Upload langsung dari browser ke Cloudinary memakai signature dari server. */
export async function uploadToCloudinary(file: File, kind: "barang" | "ktm"): Promise<UploadedImage> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} bukan file gambar`);
  if (file.size > MAX_FILE_MB * 1024 * 1024) throw new Error(`${file.name} lebih dari ${MAX_FILE_MB} MB`);

  const sig = await getUploadSignature(kind);
  if (!sig.ok) throw new Error(sig.message);

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sig.apiKey);
  body.append("timestamp", String(sig.timestamp));
  body.append("signature", sig.signature);
  body.append("folder", sig.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? "Upload ke Cloudinary gagal");
  return { url: json.secure_url as string, publicId: json.public_id as string };
}
