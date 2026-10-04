import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Generate a cryptographically secure random nonce (base64)
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isDev = process.env.NODE_ENV !== "production";
  const scriptDirectives = isDev
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  // Modern CSP Level 3: 'strict-dynamic' with nonce (unsafe-eval only in dev for React debug features)
  const cspHeader = `
    default-src 'self';
    script-src ${scriptDirectives};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https: http:;
    font-src 'self' https://fonts.gstatic.com data:;
    connect-src 'self' https: http:;
    frame-ancestors 'self';
    form-action 'self';
    base-uri 'self';
    object-src 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  // Check HTTP-Only authentication cookie
  const isAuthVerified = request.cookies.get("bps_solsel_auth_verified")?.value === "true";

  // If user is already authenticated and visits /login, redirect to homepage
  if (pathname === "/login" && isAuthVerified) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Clone request headers to inject x-nonce and Content-Security-Policy for Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Attach Content-Security-Policy to the outgoing HTTP response
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, _next, favicon.ico, images.
     */
    "/((?!_next/static|_next/image|favicon.ico|BPS Logo.png|SIPASTI Logo.png).*)",
  ],
};
