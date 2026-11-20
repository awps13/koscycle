import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Pemeriksaan optimistis: hanya cek keberadaan cookie sesi.
// Validasi sesungguhnya tetap dilakukan di server (requireUser).
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const url = new URL("/masuk", request.url);
    url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pasang-iklan/:path*",
    "/dashboard/:path*",
    "/favorit/:path*",
    "/pesan/:path*",
    "/profil/:path*",
    "/barang/:id/edit",
  ],
};
