/**
 * Checks if a hostname belongs to trusted official BPS or internal network domains.
 */
export function isTrustedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().split(":")[0]; // strip port if present
  if (host === "localhost" || host === "127.0.0.1") return true;
  if (host === "bps1310.cloud" || host.endsWith(".bps1310.cloud")) return true;
  if (host === "bps.go.id" || host.endsWith(".bps.go.id")) return true;
  // Internal private subnets (e.g. 10.x.x.x, 192.168.x.x, 172.16-31.x.x)
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  return false;
}

/**
 * Validates a redirect URL or path (e.g. from the `?redirect=` query param).
 * Strictly prevents Open Redirect vulnerabilities:
 * - Internal relative paths starting with single '/' are allowed (e.g. '/repositori').
 * - Protocol-relative paths (e.g. '//evil.com') and backslash prefixes ('/\\') are rejected.
 * - Absolute http/https URLs are allowed ONLY if the target host belongs to an official
 *   trusted BPS domain or approved internal network host.
 *
 * Returns the normalized URL/path string, or null if unsafe/untrusted.
 */
export function toSafeRedirectUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Internal relative path (must start with single '/', not '//' or '/\')
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    if (isTrustedHost(parsed.hostname)) {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validates a user-controlled URL (e.g. service URLs) before it is
 * passed to window.open() or an <a href>. Only absolute http/https URLs are allowed,
 * which blocks `javascript:`, `data:`, `vbscript:` and other script-capable schemes.
 *
 * Returns the normalized URL string, or null if the input is missing or unsafe.
 */
export function toSafeExternalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    // Relative or malformed URLs are rejected
    return null;
  }
}

