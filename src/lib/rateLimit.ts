/**
 * rateLimit.ts
 * In-memory sliding-window rate limiter for authentication routes (/api/login & /api/register).
 * Protects against brute-force password guessing and spam registration.
 */

interface RateLimitRecord {
  attempts: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Extracts client IP safely from request headers or fallbacks to 127.0.0.1.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

/**
 * Checks whether the given key is currently rate limited.
 * Does NOT increment attempts count.
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): { allowed: boolean; retryAfterSeconds: number; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record) {
    return { allowed: true, retryAfterSeconds: 0, remaining: maxAttempts };
  }

  // Filter timestamps within the active time window
  const recentAttempts = record.attempts.filter((timestamp) => now - timestamp < windowMs);
  record.attempts = recentAttempts;

  if (recentAttempts.length >= maxAttempts) {
    const oldest = recentAttempts[0];
    const retryAfterMs = windowMs - (now - oldest);
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    return {
      allowed: false,
      retryAfterSeconds,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: maxAttempts - recentAttempts.length,
  };
}

/**
 * Records a failed authentication attempt for the key.
 */
export function recordFailedAttempt(key: string, windowMs: number = 60000): void {
  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record) {
    record = { attempts: [] };
    rateLimitStore.set(key, record);
  }

  // Clean stale attempts
  record.attempts = record.attempts.filter((timestamp) => now - timestamp < windowMs);
  record.attempts.push(now);
}

/**
 * Resets rate limit attempts for a given key upon successful authentication.
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Clears the entire store (for test suite cleanup).
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}
