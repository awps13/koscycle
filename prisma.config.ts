import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Sama seperti Next.js: .env.local didahulukan, lalu .env
config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
