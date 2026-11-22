export type ListingImage = { url: string; publicId?: string };

/** Kolom `images` bertipe Json di Prisma — ubah ke tipe yang jelas. */
export function asImages(value: unknown): ListingImage[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (v): v is ListingImage => !!v && typeof v === "object" && typeof (v as ListingImage).url === "string",
  );
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}
