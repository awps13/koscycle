import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

if (!url && process.env.NODE_ENV !== "production") {
  console.warn(
    "[KosCycle] DATABASE_URL belum diisi. Salin .env.example ke .env.local dan isi koneksi Vercel Postgres/Neon.",
  );
}

type DB = NeonHttpDatabase<typeof schema>;

function createDb(): DB {
  // URL placeholder hanya agar build tidak gagal saat env belum diisi;
  // query baru dijalankan ketika ada request.
  const connectionString = url ?? "postgresql://user:password@localhost:5432/koscycle";

  // Vercel Postgres / Neon → driver HTTP serverless (cocok untuk Vercel).
  // Postgres biasa (mis. lokal: localhost) → driver node-postgres.
  const isNeon = /neon\.tech|vercel-storage\.com|neon\.build/.test(connectionString) || !url;
  if (isNeon) return drizzleNeon(neon(connectionString), { schema });

  const globalForPg = globalThis as unknown as { __kosPool?: Pool };
  const pool = (globalForPg.__kosPool ??= new Pool({ connectionString, max: 5 }));
  return drizzlePg(pool, { schema }) as unknown as DB;
}

export const db = createDb();
export { schema };
