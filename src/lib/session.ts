import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./prisma";

/** Baca sesi untuk request ini (di-dedupe per render). Wajib dipanggil di dalam <Suspense>. */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/** Data user terbaru dari database (bukan dari cookie cache). */
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
});

export async function requireUser(next = "/") {
  const current = await getCurrentUser();
  if (!current) redirect(`/masuk?next=${encodeURIComponent(next)}`);
  return current;
}
