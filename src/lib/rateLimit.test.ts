import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getClientIp,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  clearAllRateLimits,
} from "./rateLimit";

describe("rateLimit utility", () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  it("should extract client IP from X-Forwarded-For header correctly", () => {
    const req = new Request("http://localhost:3000/api/login", {
      headers: { "x-forwarded-for": "10.0.0.1, 192.168.1.1" },
    });
    expect(getClientIp(req)).toBe("10.0.0.1");
  });

  it("should fallback to X-Real-IP if X-Forwarded-For is absent", () => {
    const req = new Request("http://localhost:3000/api/login", {
      headers: { "x-real-ip": "172.16.0.5" },
    });
    expect(getClientIp(req)).toBe("172.16.0.5");
  });

  it("should fallback to 127.0.0.1 if no IP headers are present", () => {
    const req = new Request("http://localhost:3000/api/login");
    expect(getClientIp(req)).toBe("127.0.0.1");
  });

  it("should allow attempts when under limit and block when maxAttempts reached", () => {
    const key = "test-ip-1";
    const maxAttempts = 3;
    const windowMs = 60000;

    // Check initially allowed
    const initial = checkRateLimit(key, maxAttempts, windowMs);
    expect(initial.allowed).toBe(true);
    expect(initial.remaining).toBe(3);

    // Record 2 failures
    recordFailedAttempt(key, windowMs);
    recordFailedAttempt(key, windowMs);

    const mid = checkRateLimit(key, maxAttempts, windowMs);
    expect(mid.allowed).toBe(true);
    expect(mid.remaining).toBe(1);

    // Record 3rd failure (limit reached)
    recordFailedAttempt(key, windowMs);

    const blocked = checkRateLimit(key, maxAttempts, windowMs);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("should reset rate limit when resetRateLimit is called", () => {
    const key = "test-ip-reset";
    recordFailedAttempt(key);
    recordFailedAttempt(key);
    recordFailedAttempt(key);
    recordFailedAttempt(key);
    recordFailedAttempt(key);

    expect(checkRateLimit(key, 5).allowed).toBe(false);

    resetRateLimit(key);
    expect(checkRateLimit(key, 5).allowed).toBe(true);
  });
});
