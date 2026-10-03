import { describe, it, expect } from "vitest";
import { toSafeExternalUrl } from "./safeUrl";

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
