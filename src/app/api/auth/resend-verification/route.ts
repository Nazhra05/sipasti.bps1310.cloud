import { NextResponse } from "next/server";

/**
 * GET /api/auth/resend-verification
 * Route handler Next.js untuk mengarahkan pengguna ke halaman kirim ulang verifikasi email
 * di Dashboard_Admin secara dinamis berdasarkan konfigurasi API_BASE_URL lingkungan server.
 * Mencegah kebocoran URL atau hardcode localhost pada bundle browser client.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";

  const apiBase = process.env.API_BASE_URL || "http://localhost/Dashboard_Admin/public/api";
  const publicBase = apiBase.replace(/\/api\/?$/, "");

  const targetUrl = new URL(`${publicBase}/resend_verification.php`);
  if (email.trim()) {
    targetUrl.searchParams.set("email", email.trim());
  }

  return NextResponse.redirect(targetUrl.toString(), 302);
}
