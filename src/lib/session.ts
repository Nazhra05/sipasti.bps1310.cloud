import crypto from "crypto";

export const SESSION_COOKIE_NAME = "bps_solsel_session";

export interface SessionPayload {
  sessionId: string; // Cryptographically random UUID (unguessable)
  userId: string | number;
  username: string;
  name: string;
  email?: string;
  role?: string;
  iat: number; // Issued at timestamp (seconds)
  exp: number; // Expiration timestamp (seconds)
}

/**
 * Returns the secret key used for HMAC signing.
 * Reads SESSION_SECRET or falls back to BPS_API_KEY from environment.
 */
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.BPS_API_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[Security Warning] SESSION_SECRET or BPS_API_KEY is not defined. Using internal fallback secret.");
    }
    return "bps-solsel-internal-session-secret-key-32chars-minimum-security";
  }
  return secret.trim();
}

/**
 * Encodes an object to a URL-safe Base64 string.
 */
function base64UrlEncode(data: string): string {
  return Buffer.from(data, "utf8").toString("base64url");
}

/**
 * Decodes a URL-safe Base64 string back to utf-8.
 */
function base64UrlDecode(str: string): string {
  return Buffer.from(str, "base64url").toString("utf8");
}

/**
 * Computes an HMAC-SHA256 signature for the given payload string.
 */
function signPayload(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

/**
 * Creates a cryptographically unguessable, signed session token.
 *
 * Token structure: `<payloadBase64Url>.<signatureBase64Url>`
 *
 * @param user User attributes to embed in session
 * @param maxAgeSeconds Token validity duration in seconds (default: 30 days)
 * @returns Signed token string
 */
export function createSessionToken(
  user: {
    userId: string | number;
    username: string;
    name?: string;
    email?: string;
    role?: string;
  },
  maxAgeSeconds: number = 60 * 60 * 24 * 30 // 30 days
): string {
  const now = Math.floor(Date.now() / 1000);
  const secret = getSessionSecret();

  const payload: SessionPayload = {
    sessionId: crypto.randomUUID(), // Unguessable random session ID
    userId: user.userId,
    username: user.username,
    name: user.name || user.username,
    email: user.email || "",
    role: user.role || "Pegawai",
    iat: now,
    exp: now + maxAgeSeconds,
  };

  const payloadString = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadString);
  const signature = signPayload(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes a signed session token.
 *
 * Performs:
 * 1. Format validation (two segments: payload.signature)
 * 2. Constant-time HMAC-SHA256 signature verification (prevents timing attacks)
 * 3. Expiration validation (`exp` > now)
 *
 * Returns the decoded SessionPayload if valid, or null if forged, tampered, or expired.
 */
export function verifySessionToken(token: string | null | undefined): SessionPayload | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.trim().split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [encodedPayload, providedSignature] = parts;
  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const secret = getSessionSecret();
  const expectedSignature = signPayload(encodedPayload, secret);

  // Constant-time comparison to protect against timing attacks
  try {
    const providedBuf = Buffer.from(providedSignature, "utf8");
    const expectedBuf = Buffer.from(expectedSignature, "utf8");

    if (providedBuf.length !== expectedBuf.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) {
      return null;
    }
  } catch {
    return null;
  }

  // Parse payload and check expiration
  try {
    const jsonStr = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(jsonStr) as SessionPayload;

    if (!payload.sessionId || !payload.exp || !payload.username) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      // Token has expired
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Authoritative Route Handler Authentication Helper (Data Layer).
 *
 * IMPORTANT SECURITY PRINCIPLE:
 * Next.js Middleware/Proxy is NOT a security boundary and can be bypassed in edge cases.
 * Authoritative session & permission checks MUST occur directly inside Route Handlers
 * and the upstream PHP backend.
 *
 * @param request Optional Request object (extracts cookie from headers if provided)
 * @returns Verified SessionPayload or null if unauthorized
 */
export async function authenticateRouteHandler(request?: Request): Promise<SessionPayload | null> {
  let token: string | undefined;

  // 1. Try extracting from Request header if provided
  if (request) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }
  }

  // 2. Fall back to Next.js cookies() store if not found in request header
  if (!token) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Ignored if running in non-Next headers context (e.g. unit tests with raw Request)
    }
  }

  return token ? verifySessionToken(token) : null;
}

