/**
 * Seed data contoh untuk KosCycle.
 * Jalankan: pnpm db:seed
 * Membuat beberapa akun demo (password: koscycle123) dan iklan contoh bergambar Unsplash.
 */
import { config } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

const U = (id: string) => ({ url: `https://images.unsplash.com/${id}` });

const USERS = [
  { name: "Raka Pratama", email: "raka@demo.koscycle.id", campus: "ui-depok", whatsapp: "081234567801", ktmVerified: true },
  { name: "Salsa Nabila", email: "salsa@demo.koscycle.id", campus: "ugm", whatsapp: "081234567802", ktmVerified: true },
  { name: "Dimas Ardi", email: "dimas@demo.koscycle.id", campus: "itb", whatsapp: null, ktmVerified: false },
  { name: "Nadia Putri", email: "nadia@demo.koscycle.id", campus: "ipb", whatsapp: "081234567804", ktmVerified: true },
];

type Seed = {
  seller: number;
  title: string;
  description: string;
  category: string;
  campus: string;
  area: string;
  type: "jual" | "barter" | "hibah";
  price?: number;
  barterWish?: string;
  condition: "seperti_baru" | "baik" | "layak";
  images: { url: string }[];
  status?: "aktif" | "terjual";
};

const LISTINGS: Seed[] = [
  {
    seller: 0,
    title: "Dispenser Miyako + Galon Aqua (isi setengah)",
    description: "Dispenser panas-normal, dipakai 1,5 tahun. Masih dingin & panas normal. Galon bonus. Ambil di Pocin ya, lagi siap-siap wisuda.",
    category: "dispenser", campus: "ui-depok", area: "Pocin", type: "jual", price: 85000, condition: "baik",
    images: [U("photo-1523362628745-0c100150b504")],
  },
  {
    seller: 1,
    title: "Meja Belajar Kayu Lipat + Rak Kecil",
    description: "Meja lipat ukuran 80x50, kokoh buat laptop & buku. Mau barter sama kipas angin meja karena kos baru panas banget.",
    category: "meja-kursi", campus: "ugm", area: "Pogung", type: "barter", barterWish: "Kipas", condition: "baik",
    images: [U("photo-1611269154421-4e27233ac5c7"), U("photo-1518455027359-f3f8164ba6bd")],
  },
  {
    seller: 0,
    title: "Rak Sepatu & Serbaguna 4 Susun",
    description: "Rak besi 4 susun, bisa buat sepatu atau alat masak. Gratis untuk adik tingkat, syarat ambil sendiri sebelum tanggal 30.",
    category: "rak-lemari", campus: "ui-depok", area: "Kutek", type: "hibah", condition: "layak",
    images: [U("photo-1594026112284-02bb6f3352fe")],
  },
  {
    seller: 3,
    title: "Rice Cooker Mini 0.6L Warna Sage",
    description: "Rice cooker kecil cukup buat 1-2 orang. Pemanas & penghangat normal, panci anti lengket masih bagus.",
    category: "alat-masak", campus: "ipb", area: "Babakan Raya", type: "jual", price: 120000, condition: "seperti_baru",
    images: [U("photo-1585515320310-259814833e62"), U("photo-1556909114-f6e7ad7d3136")],
  },
  {
    seller: 1,
    title: "Kipas Angin Meja USB Portable",
    description: "Kipas meja kecil, bisa pakai USB/power bank. Ada 3 level kecepatan. Cocok buat kos tanpa AC.",
    category: "kipas", campus: "ugm", area: "Karangmalang", type: "jual", price: 65000, condition: "seperti_baru",
    images: [U("photo-1618941716939-553df3c6c278")],
  },
  {
    seller: 2,
    title: "Kasur Busa Single 90x200 (Lipat)",
    description: "Kasur busa lipat tebal 10 cm, sarung bisa dilepas dan dicuci. Sudah dicuci bersih. Ambil sendiri di Cisitu.",
    category: "kasur", campus: "itb", area: "Cisitu", type: "jual", price: 150000, condition: "baik",
    images: [U("photo-1617325247661-675ab4b64ae2"), U("photo-1505693416388-ac5ce068fe85")],
  },
  {
    seller: 3,
    title: "Paket Buku Kalkulus & Fisika Dasar TPB",
    description: "Buku Purcell Kalkulus jilid 1 & Halliday Fisika Dasar + catatan rangkuman. Hibah buat maba yang butuh.",
    category: "buku", campus: "ipb", area: "Dramaga", type: "hibah", condition: "baik",
    images: [U("photo-1495446815901-a7297e633e8d"), U("photo-1512820790803-83ca734da794")],
  },
  {
    seller: 0,
    title: "Kursi Belajar Putih Minimalis",
    description: "Kursi model eames, kaki kayu. Nyaman buat belajar lama. Ada lecet tipis di dudukan.",
    category: "meja-kursi", campus: "ui-depok", area: "Kukusan", type: "jual", price: 95000, condition: "baik",
    images: [U("photo-1517705008128-361805f42e86")],
  },
  {
    seller: 1,
    title: "Lemari Portable Kayu Tinggi",
    description: "Lemari/rak tinggi 5 susun, mudah dibongkar pasang. Mau ditukar dengan rice cooker kecil.",
    category: "rak-lemari", campus: "ugm", area: "Sendowo", type: "barter", barterWish: "Rice Cooker", condition: "baik",
    images: [U("photo-1595428774223-ef52624120d2")],
  },
  {
    seller: 2,
    title: "Set Perlengkapan Mandi: Ember, Gayung, Rak Sabun",
    description: "Ember 20L, gayung, rak sabun tempel, dan keset. Bersih, siap pakai. Gratis untuk yang butuh.",
    category: "mandi", campus: "itb", area: "Tubagus Ismail", type: "hibah", condition: "layak",
    images: [U("photo-1584622650111-993a426fbf0a")],
  },
  {
    seller: 3,
    title: "Nakas / Meja Samping Kasur Kayu",
    description: "Meja kecil dengan rak, pas buat taruh lampu tidur dan buku. Kayu solid.",
    category: "rak-lemari", campus: "ipb", area: "Perwira", type: "jual", price: 70000, condition: "seperti_baru",
    images: [U("photo-1532372320572-cda25653a26d")],
  },
  {
    seller: 0,
    title: "Blender Kecil Philips",
    description: "Blender 1L, pisau tajam, bisa buat jus & sambal. Dijual karena pulang kampung.",
    category: "alat-masak", campus: "ui-depok", area: "Margonda", type: "jual", price: 110000, condition: "baik",
    images: [U("photo-1585515320310-259814833e62")], status: "terjual",
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL belum diisi di .env");

  const isNeon = /neon\.tech|vercel-storage\.com|neon\.build/.test(connectionString);
  const prisma = new PrismaClient({
    adapter: isNeon ? new PrismaNeon({ connectionString }) : new PrismaPg({ connectionString }),
  });

  try {
    const password = await hashPassword("koscycle123");
    const ids: string[] = [];

    for (const u of USERS) {
      const extra = {
        campus: u.campus,
        whatsapp: u.whatsapp,
        ktmVerified: u.ktmVerified,
        ktmUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363",
      };
      const existing = await prisma.user.findUnique({ where: { email: u.email }, select: { id: true } });
      if (existing) {
        await prisma.user.update({ where: { id: existing.id }, data: extra });
        ids.push(existing.id);
        continue;
      }
      const id = crypto.randomUUID();
      await prisma.user.create({
        data: {
          id,
          name: u.name,
          email: u.email,
          emailVerified: true,
          ...extra,
          // Akun credential Better Auth (login email + password)
          accounts: {
            create: { id: crypto.randomUUID(), accountId: id, providerId: "credential", password },
          },
        },
      });
      console.log(`✓ user ${u.email}`);
      ids.push(id);
    }

    await prisma.listing.deleteMany({ where: { sellerId: { in: ids } } });

    const now = Date.now();
    await prisma.listing.createMany({
      data: LISTINGS.map((l, i) => ({
        sellerId: ids[l.seller],
        title: l.title,
        description: l.description,
        category: l.category,
        campus: l.campus,
        area: l.area,
        type: l.type,
        price: l.price ?? null,
        barterWish: l.barterWish ?? null,
        condition: l.condition,
        images: l.images,
        status: l.status ?? "aktif",
        soldAt: l.status === "terjual" ? new Date(now) : null,
        createdAt: new Date(now - i * 1000 * 60 * 47),
      })),
    });
    console.log(`✓ ${LISTINGS.length} iklan contoh dibuat`);
    console.log("Akun demo: raka@demo.koscycle.id / koscycle123");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
