import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as resetPassword } from "./reset-password/route";
import { POST as forgotPassword } from "./forgot-password/route";
import { POST as resendVerification } from "./resend-verification/route";
import { prismaMock } from "@/test/prismaMock";
import { makeRequest } from "@/test/request";
import { sendEmail } from "@/shared/lib/email";

vi.mock("@/shared/lib/email", () => ({ sendEmail: vi.fn(async () => ({ success: true })) }));

describe("password reset and email links", () => {
  beforeEach(() => {
    vi.stubEnv("NEXTAUTH_URL", "https://kopawee.test");
  });

  it("reset-password requires at least 8 characters", async () => {
    // A valid token, so only the password length can cause a 400
    prismaMock.user.findFirst.mockResolvedValue({ id: "u1" });
    prismaMock.user.update.mockResolvedValue({});
    const res = await resetPassword(
      makeRequest("/api/auth/reset-password", { method: "POST", body: { token: "t", password: "1234567" } })
    );
    expect(res.status).toBe(400);
  });

  it("forgot-password links use NEXTAUTH_URL", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "u1", name: "A", email: "a@b.ng" });
    prismaMock.user.update.mockResolvedValue({});

    await forgotPassword(makeRequest("/api/auth/forgot-password", { method: "POST", body: { email: "a@b.ng" } }));

    const props = vi.mocked(sendEmail).mock.calls[0][0].template.props as { resetUrl: string };
    expect(props.resetUrl).toMatch(/^https:\/\/kopawee\.test\/auth\/reset-password\?token=/);
  });

  it("resend-verification issues a fresh token with a 24-hour expiry", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "u1", name: "A", email: "resend@b.ng", isVerified: false });
    prismaMock.user.update.mockResolvedValue({});

    await resendVerification(
      makeRequest("/api/auth/resend-verification", { method: "POST", body: { email: "resend@b.ng" } })
    );

    const data = prismaMock.user.update.mock.calls[0][0].data;
    expect(data.verificationToken).toEqual(expect.any(String));
    expect(data.verificationTokenExpiry.getTime()).toBeGreaterThan(Date.now() + 23.9 * 3_600_000);
  });
});
