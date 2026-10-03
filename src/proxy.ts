import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check HTTP-Only authentication cookie
  const isAuthVerified = request.cookies.get("bps_solsel_auth_verified")?.value === "true";

  // If user is already authenticated and visits /login, redirect to homepage
  if (pathname === "/login" && isAuthVerified) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Create response and attach client security headers
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, _next, favicon.ico, images.
     */
    "/((?!_next/static|_next/image|favicon.ico|BPS Logo.png).*)",
  ],
};
