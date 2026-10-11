import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
  authenticateRouteHandler,
  SESSION_COOKIE_NAME,
} from "./session";

describe("Session Token Security (HMAC-SHA256 Signed Tokens)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, SESSION_SECRET: "test-secret-key-1234567890abcdef" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should export SESSION_COOKIE_NAME as bps_solsel_session", () => {
    expect(SESSION_COOKIE_NAME).toBe("bps_solsel_session");
  });

  it("should create a valid signed token containing an unguessable sessionId", () => {
    const token = createSessionToken({
      userId: 42,
      username: "admin_solsel",
      name: "Admin BPS",
      email: "admin@bps.go.id",
      role: "SuperAdmin",
    });

    expect(token).toBeTypeOf("string");
    expect(token.includes(".")).toBe(true);

    const payload = verifySessionToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe(42);
    expect(payload?.username).toBe("admin_solsel");
    expect(payload?.role).toBe("SuperAdmin");
    expect(payload?.sessionId).toBeDefined();
    // Verify sessionId is a valid UUID format
    expect(payload?.sessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it("should generate unique sessionIds for consecutive tokens of the same user", () => {
    const token1 = createSessionToken({ userId: 1, username: "user" });
    const token2 = createSessionToken({ userId: 1, username: "user" });

    const p1 = verifySessionToken(token1);
    const p2 = verifySessionToken(token2);

    expect(token1).not.toBe(token2);
    expect(p1?.sessionId).not.toBe(p2?.sessionId);
  });

  it("should reject fixed strings like 'true', 'verified', or random gibberish", () => {
    expect(verifySessionToken("true")).toBeNull();
    expect(verifySessionToken("verified")).toBeNull();
    expect(verifySessionToken("1")).toBeNull();
    expect(verifySessionToken("")).toBeNull();
    expect(verifySessionToken(null)).toBeNull();
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken("arbitrary.fake_token_data")).toBeNull();
  });

  it("should reject tampered payload even if signature segment exists", () => {
    const token = createSessionToken({ userId: 10, username: "regular_user" });
    const [payloadB64, sig] = token.split(".");

    // Attacker tampers payload by altering Base64
    const tamperedPayloadB64 = Buffer.from(
      JSON.stringify({ userId: 10, username: "admin_user", role: "SuperAdmin" })
    ).toString("base64url");

    const forgedToken = `${tamperedPayloadB64}.${sig}`;
    expect(verifySessionToken(forgedToken)).toBeNull();
  });

  it("should reject tampered signature", () => {
    const token = createSessionToken({ userId: 10, username: "regular_user" });
    const [payloadB64, sig] = token.split(".");

    const tamperedSig = sig.slice(0, -2) + "xx";
    const forgedToken = `${payloadB64}.${tamperedSig}`;
    expect(verifySessionToken(forgedToken)).toBeNull();
  });

  it("should reject expired session tokens", () => {
    // Create token that was valid for only -10 seconds (already expired)
    const token = createSessionToken(
      { userId: 10, username: "regular_user" },
      -10 // Expired in the past
    );

    expect(verifySessionToken(token)).toBeNull();
  });

  it("should reject tokens signed with a different secret key", () => {
    process.env.SESSION_SECRET = "secret_key_alpha";
    const tokenAlpha = createSessionToken({ userId: 10, username: "user" });

    // Change secret key on the server
    process.env.SESSION_SECRET = "secret_key_beta";
    expect(verifySessionToken(tokenAlpha)).toBeNull();
  });

  it("should authenticate via authenticateRouteHandler using Request cookie header", async () => {
    const validToken = createSessionToken({ userId: 99, username: "route_user" });
    const req = new Request("http://localhost:3000/api/protected", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${validToken}; other_cookie=xyz`,
      },
    });

    const session = await authenticateRouteHandler(req);
    expect(session).not.toBeNull();
    expect(session?.userId).toBe(99);
    expect(session?.username).toBe("route_user");
  });

  it("should return null in authenticateRouteHandler when cookie is forged or missing", async () => {
    const reqMissing = new Request("http://localhost:3000/api/protected");
    expect(await authenticateRouteHandler(reqMissing)).toBeNull();

    const reqForged = new Request("http://localhost:3000/api/protected", {
      headers: { cookie: `${SESSION_COOKIE_NAME}=forged_random_string` },
    });
    expect(await authenticateRouteHandler(reqForged)).toBeNull();
  });
});
