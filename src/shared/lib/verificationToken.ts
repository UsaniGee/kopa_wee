import crypto from "crypto";

/** Matches the "expires in 24 hours" promise in VerificationEmail. */
export const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/** A fresh email-verification token and its expiry time. */
export function newVerificationToken(): { token: string; expiresAt: Date } {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
  };
}
