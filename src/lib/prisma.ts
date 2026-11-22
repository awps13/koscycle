import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const url = process.env.DATABASE_URL;

if (!url && process.env.NODE_ENV !== "production") {
  console.warn(
    "[KosCycle] DATABASE_URL belum diisi. Salin .env.example ke .env lalu isi koneksi Vercel Postgres/Neon.",
  );
}

function createPrisma() {
  // URL placeholder hanya agar build tidak gagal saat env belum diisi;
  // koneksi baru dibuka ketika ada query.
  const connectionString = url ?? "postgresql://user:password@localhost:5432/koscycle";

  // Vercel Postgres / Neon → adapter serverless Neon (cocok untuk Vercel).
  // Postgres biasa (mis. localhost) → adapter node-postgres.
  const isNeon = /neon\.tech|vercel-storage\.com|neon\.build/.test(connectionString);
  const adapter = isNeon ? new PrismaNeon({ connectionString }) : new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

// Satu instance per proses (hindari banyak pool saat hot reload di dev)
const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };
export const prisma = globalForPrisma.__prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.__prisma = prisma;
