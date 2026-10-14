import { describe, it, expect } from "vitest";
import { toSafeExternalUrl, toSafeRedirectUrl, isTrustedHost } from "./safeUrl";

describe("toSafeExternalUrl", () => {
  it("accepts absolute http and https URLs", () => {
    expect(toSafeExternalUrl("https://example.go.id/app")).toBe("https://example.go.id/app");
    expect(toSafeExternalUrl("http://10.13.10.5/internal")).toBe("http://10.13.10.5/internal");
  });

  it("rejects script-capable schemes", () => {
    expect(toSafeExternalUrl("javascript:alert(1)")).toBeNull();
    expect(toSafeExternalUrl("  JavaScript:alert(document.cookie)")).toBeNull();
    expect(toSafeExternalUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(toSafeExternalUrl("vbscript:msgbox(1)")).toBeNull();
  });

  it("rejects empty, relative, and malformed input", () => {
    expect(toSafeExternalUrl(null)).toBeNull();
    expect(toSafeExternalUrl("")).toBeNull();
    expect(toSafeExternalUrl("/login")).toBeNull();
    expect(toSafeExternalUrl("not a url")).toBeNull();
  });
});

describe("toSafeRedirectUrl (Open Redirect Protection)", () => {
  it("allows safe internal relative paths", () => {
    expect(toSafeRedirectUrl("/repositori")).toBe("/repositori");
    expect(toSafeRedirectUrl("/katalog?kategori=1")).toBe("/katalog?kategori=1");
    expect(toSafeRedirectUrl("/api/auth/sso")).toBe("/api/auth/sso");
  });

  it("rejects protocol-relative and backslash evasion paths", () => {
    expect(toSafeRedirectUrl("//evil.com")).toBeNull();
    expect(toSafeRedirectUrl("//evil.com/phish")).toBeNull();
    expect(toSafeRedirectUrl("/\\evil.com")).toBeNull();
  });

  it("allows trusted official BPS and internal network URLs", () => {
    expect(toSafeRedirectUrl("https://bps.go.id")).toBe("https://bps.go.id/");
    expect(toSafeRedirectUrl("https://webapps.bps.go.id/portal")).toBe("https://webapps.bps.go.id/portal");
    expect(toSafeRedirectUrl("https://bps1310.cloud/admin")).toBe("https://bps1310.cloud/admin");
    expect(toSafeRedirectUrl("http://10.13.10.5/secret-portal")).toBe("http://10.13.10.5/secret-portal");
    expect(toSafeRedirectUrl("http://localhost:3000/test")).toBe("http://localhost:3000/test");
  });

  it("strictly rejects untrusted external domains (Open Redirect mitigation)", () => {
    expect(toSafeRedirectUrl("https://evil.com")).toBeNull();
    expect(toSafeRedirectUrl("https://attacker-phishing.org/login")).toBeNull();
    expect(toSafeRedirectUrl("http://evil.bps.go.id.attacker.com")).toBeNull();
  });

  it("rejects javascript:, data:, and empty strings", () => {
    expect(toSafeRedirectUrl(null)).toBeNull();
    expect(toSafeRedirectUrl("")).toBeNull();
    expect(toSafeRedirectUrl("   ")).toBeNull();
    expect(toSafeRedirectUrl("javascript:alert(1)")).toBeNull();
  });
});

describe("isTrustedHost", () => {
  it("identifies trusted official and internal network hosts", () => {
    expect(isTrustedHost("localhost")).toBe(true);
    expect(isTrustedHost("127.0.0.1")).toBe(true);
    expect(isTrustedHost("bps1310.cloud")).toBe(true);
    expect(isTrustedHost("administators.bps1310.cloud")).toBe(true);
    expect(isTrustedHost("bps.go.id")).toBe(true);
    expect(isTrustedHost("solokselatankab.bps.go.id")).toBe(true);
    expect(isTrustedHost("10.13.10.5")).toBe(true);
    expect(isTrustedHost("192.168.1.10")).toBe(true);
  });

  it("rejects untrusted domains", () => {
    expect(isTrustedHost("evil.com")).toBe(false);
    expect(isTrustedHost("google.com")).toBe(false);
    expect(isTrustedHost("bps.go.id.evil.com")).toBe(false);
  });
});

