export const CATEGORIES = [
  { slug: "meja-kursi", name: "Meja & Kursi Belajar", unit: "unit", icon: "desk", tone: "mint" },
  { slug: "kasur", name: "Kasur & Busa", unit: "unit", icon: "bed", tone: "peach" },
  { slug: "dispenser", name: "Dispenser & Galon", unit: "unit", icon: "droplet", tone: "mint" },
  { slug: "kipas", name: "Kipas & Pendingin", unit: "unit", icon: "fan", tone: "mint" },
  { slug: "alat-masak", name: "Alat Masak & Rice Cooker", unit: "unit", icon: "pot", tone: "peach" },
  { slug: "rak-lemari", name: "Rak & Lemari Portable", unit: "unit", icon: "shelf", tone: "mint" },
  { slug: "mandi", name: "Perlengkapan Mandi", unit: "unit", icon: "bath", tone: "mint" },
  { slug: "buku", name: "Buku & Catatan Kuliah", unit: "judul", icon: "book", tone: "peach" },
  { slug: "lainnya", name: "Lain-lain", unit: "unit", icon: "box", tone: "peach" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
export type CategoryIcon = (typeof CATEGORIES)[number]["icon"];

export const CAMPUSES = [
  { slug: "ui-depok", name: "UI Depok", areas: "Pocin, Kutek, Kukusan, Margonda" },
  { slug: "ugm", name: "UGM Yogyakarta", areas: "Pogung, Karangmalang, Sendowo" },
  { slug: "itb", name: "ITB Bandung", areas: "Cisitu, Tubagus Ismail, Dago" },
  { slug: "ipb", name: "IPB Dramaga", areas: "Babakan Raya, Perwira, Bara" },
  { slug: "unpad", name: "Unpad Jatinangor", areas: "Ciseke, Sayang, Hegarmanah" },
  { slug: "its", name: "ITS Surabaya", areas: "Keputih, Gebang, Mulyosari" },
  { slug: "unair", name: "Unair Surabaya", areas: "Karangmenjangan, Mulyorejo" },
  { slug: "undip", name: "Undip Tembalang", areas: "Banjarsari, Bulusan, Tembalang" },
  { slug: "ub", name: "UB Malang", areas: "Watugong, Kerto, Sumbersari" },
  { slug: "uns", name: "UNS Solo", areas: "Kentingan, Ngoresan, Jebres" },
  { slug: "uny", name: "UNY Yogyakarta", areas: "Karangmalang, Samirono" },
  { slug: "uin-jakarta", name: "UIN Jakarta", areas: "Pesanggrahan, Legoso, Ciputat" },
  { slug: "telkom", name: "Telkom University", areas: "Sukapura, Sukabirus, PGA" },
  { slug: "binus", name: "Binus Kemanggisan", areas: "Kemanggisan, Anggrek, Syahdan" },
  { slug: "unhas", name: "Unhas Makassar", areas: "Tamalanrea, Pintu 1, Perintis" },
  { slug: "usu", name: "USU Medan", areas: "Padang Bulan, Dr. Mansyur" },
] as const;

export type CampusSlug = (typeof CAMPUSES)[number]["slug"];

export const LISTING_TYPES = [
  { value: "jual", label: "Jual Beli Murah", short: "Jual" },
  { value: "barter", label: "Barter Sesama Anak Kos", short: "Barter" },
  { value: "hibah", label: "Hibah Gratis (Bawa Sendiri)", short: "Gratis" },
] as const;

export type ListingType = (typeof LISTING_TYPES)[number]["value"];

export const CONDITIONS = [
  { value: "seperti_baru", label: "Seperti Baru" },
  { value: "baik", label: "Baik, Normal Pakai" },
  { value: "layak", label: "Layak Pakai (Ada Minus)" },
] as const;

export type Condition = (typeof CONDITIONS)[number]["value"];

export const LISTING_STATUSES = [
  { value: "aktif", label: "Aktif" },
  { value: "dipesan", label: "Sedang Dipesan" },
  { value: "terjual", label: "Sudah Laku / Diambil" },
] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number]["value"];

export const POPULAR_SEARCHES = [
  "Rice Cooker Kecil",
  "Kasur Lipat Single",
  "Meja Laptop Lesehan",
  "Kipas Cosmos",
];

export const SORT_OPTIONS = [
  { value: "terbaru", label: "Terbaru" },
  { value: "termurah", label: "Harga Termurah" },
  { value: "termahal", label: "Harga Termahal" },
] as const;

export function getCategory(slug: string | null | undefined) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCampus(slug: string | null | undefined) {
  return CAMPUSES.find((c) => c.slug === slug);
}

export function getCondition(value: string | null | undefined) {
  return CONDITIONS.find((c) => c.value === value);
}

export function getStatus(value: string | null | undefined) {
  return LISTING_STATUSES.find((s) => s.value === value);
}
