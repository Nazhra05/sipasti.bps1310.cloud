/**
 * Validates a user-controlled URL (e.g. the `?redirect=` query param) before it is
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
