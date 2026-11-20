type LoaderArgs = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: LoaderArgs) {
  const q = quality ?? 75;

  // Cloudinary: sisipkan transformasi setelah "/upload/"
  if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
    return src.replace(
      "/upload/",
      `/upload/f_auto,q_${q === 75 ? "auto" : q},c_limit,w_${width}/`,
    );
  }

  // Unsplash (dipakai data seed)
  if (src.includes("images.unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(q));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  }

  return src;
}
