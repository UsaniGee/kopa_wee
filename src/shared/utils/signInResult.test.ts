import { describe, expect, it } from "vitest";
import { signInFailureCode } from "./signInResult";

describe("signInFailureCode", () => {
  it("treats an error in a 200 response as a failure (NextAuth v5 returns ok: true for bad passwords)", () => {
    expect(signInFailureCode({ ok: true, status: 200, error: "CredentialsSignin", code: "INVALID_CREDENTIALS", url: null })).toBe(
      "INVALID_CREDENTIALS"
    );
  });

  it("falls back to the error name when there is no code", () => {
    expect(signInFailureCode({ ok: true, status: 200, error: "CredentialsSignin", url: null })).toBe("CredentialsSignin");
  });

  it("reports a non-OK response or a missing result as a failure", () => {
    expect(signInFailureCode({ ok: false, status: 500, url: null })).toBe("UNKNOWN");
    expect(signInFailureCode(undefined)).toBe("UNKNOWN");
  });

  it("returns null for a real success", () => {
    expect(signInFailureCode({ ok: true, status: 200, url: "http://localhost:3000/dashboard" })).toBeNull();
  });
});
