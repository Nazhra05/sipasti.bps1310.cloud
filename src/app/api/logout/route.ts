import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ status: true, message: "Berhasil keluar dari sesi." });

  // Clear HTTP-Only session token cookie server-side
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
  });

  // Clear legacy fixed-string cookie
  response.cookies.set("bps_solsel_auth_verified", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
  });

  // Clear user profile display cookie
  response.cookies.set("bps_solsel_auth_user", "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}
