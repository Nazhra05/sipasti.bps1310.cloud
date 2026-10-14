import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy, config } from "./proxy";

const middleware = proxy;

describe("Next.js Edge Middleware (App B - SEC-08)", () => {
  it("should attach Content-Security-Policy header to outgoing response", () => {
    const req = new NextRequest("http://localhost:3000/katalog");
    const res = middleware(req);

    const csp = res.headers.get("Content-Security-Policy");
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("object-src 'none'");
  });

  it("should generate a cryptographic nonce and embed it in script-src directives", () => {
    const req = new NextRequest("http://localhost:3000/");
    const res = middleware(req);

    const csp = res.headers.get("Content-Security-Policy") || "";
    expect(csp).toMatch(/script-src[^;]*'nonce-[A-Za-z0-9+/=_-]+'/);
    expect(csp).toContain("'strict-dynamic'");
  });

  it("should export matcher configuration excluding static assets", () => {
    expect(config).toBeDefined();
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);
  });
});
