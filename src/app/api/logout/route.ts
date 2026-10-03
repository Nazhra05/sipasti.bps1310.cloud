import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ status: true, message: "Berhasil keluar dari sesi." });

  // Clear HTTP-Only authentication cookies server-side
  response.cookies.set("bps_solsel_auth_verified", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
  });
  response.cookies.set("bps_solsel_auth_user", "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}
