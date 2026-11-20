import "server-only";
import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
}

export const UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || "koscycle";

export function signUpload(subfolder: "barang" | "ktm") {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary belum dikonfigurasi. Isi CLOUDINARY_* di .env.local");
  }
  const timestamp = Math.round(Date.now() / 1000);
  const folder = `${UPLOAD_FOLDER}/${subfolder}`;
  const paramsToSign = { timestamp, folder };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret!);
  return { timestamp, folder, signature, apiKey: apiKey!, cloudName: cloudName! };
}

/** Pastikan URL benar-benar berasal dari akun Cloudinary kita. */
export function isOwnCloudinaryUrl(url: string) {
  if (!cloudName) return false;
  return url.startsWith(`https://res.cloudinary.com/${cloudName}/image/upload/`);
}

export async function destroyImages(publicIds: string[]) {
  if (!isCloudinaryConfigured || publicIds.length === 0) return;
  try {
    await cloudinary.api.delete_resources(publicIds);
  } catch (err) {
    console.error("[cloudinary] gagal menghapus gambar", err);
  }
}
