"use server";

import { getSession } from "@/lib/session";
import { isCloudinaryConfigured, signUpload } from "@/lib/cloudinary";

export async function getUploadSignature(kind: "barang" | "ktm") {
  const session = await getSession();
  if (!session) return { ok: false as const, message: "Silakan masuk dulu untuk mengunggah foto." };
  if (!isCloudinaryConfigured) {
    return { ok: false as const, message: "Cloudinary belum dikonfigurasi (cek .env.local)." };
  }
  return { ok: true as const, ...signUpload(kind === "ktm" ? "ktm" : "barang") };
}
