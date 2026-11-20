const rupiah = new Intl.NumberFormat("id-ID");

export function formatRupiah(value: number | null | undefined) {
  if (value == null) return "-";
  return `Rp ${rupiah.format(value)}`;
}

export function formatNumber(value: number) {
  return rupiah.format(value);
}

/** Waktu relatif berbahasa Indonesia. Hanya panggil di Server Component (request time). */
export function timeAgo(date: Date | string, now = Date.now()) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Math.max(0, Math.floor((now - d.getTime()) / 1000));
  if (diff < 60) return "Baru saja";
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function whatsappLink(phone: string, text?: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}
