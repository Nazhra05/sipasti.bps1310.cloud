import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

/**
 * GET /api/auth/me
 * Endpoint to safely verify the HTTP-Only signed session token from the browser.
 * Returns authenticated user details if the cryptographic token signature is valid,
 * or 401 unauthenticated if missing, forged, or expired.
 */
export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { authenticated: false, message: "Sesi tidak ditemukan", user: null },
      { status: 401 }
    );
  }

  const payload = verifySessionToken(sessionCookie);

  if (!payload) {
    return NextResponse.json(
      { authenticated: false, message: "Token sesi tidak valid atau telah kedaluwarsa", user: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id_admin: payload.userId,
      username: payload.username,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
  });
}
