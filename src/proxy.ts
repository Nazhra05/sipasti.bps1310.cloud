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

  // Return response (security headers are globally applied in next.config.ts)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, _next, favicon.ico, images.
     */
    "/((?!_next/static|_next/image|favicon.ico|BPS Logo.png).*)",
  ],
};
