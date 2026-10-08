import { afterEach, describe, expect, it, vi } from "vitest";
import { appBaseUrl } from "./appUrl";
import { newVerificationToken, VERIFICATION_TOKEN_TTL_MS } from "./verificationToken";

describe("appBaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses NEXTAUTH_URL without a trailing slash", () => {
    vi.stubEnv("NEXTAUTH_URL", "https://kopawee.ng/");
    expect(appBaseUrl()).toBe("https://kopawee.ng");
  });

  it("throws in production when NEXTAUTH_URL is missing, instead of emailing localhost links", () => {
    vi.stubEnv("NEXTAUTH_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(() => appBaseUrl()).toThrow(/NEXTAUTH_URL/);
  });

  it("falls back to localhost only outside production", () => {
    vi.stubEnv("NEXTAUTH_URL", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(appBaseUrl()).toBe("http://localhost:3000");
  });
});

describe("newVerificationToken", () => {
  it("returns an unguessable token that expires in 24 hours", () => {
    const before = Date.now();
    const a = newVerificationToken();
    const b = newVerificationToken();

    expect(a.token).not.toBe(b.token);
    expect(a.token.length).toBeGreaterThanOrEqual(40);
    expect(VERIFICATION_TOKEN_TTL_MS).toBe(24 * 60 * 60 * 1000);
    expect(a.expiresAt.getTime() - before).toBeGreaterThanOrEqual(VERIFICATION_TOKEN_TTL_MS - 1000);
  });
});
