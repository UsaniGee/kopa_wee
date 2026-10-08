import { describe, expect, it } from "vitest";
import { GET } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { makeRequest } from "@/test/request";

const verify = (token = "tok_1") => GET(makeRequest(`/api/auth/verify?token=${token}`));
const HOUR = 3_600_000;

describe("GET /api/auth/verify", () => {
  it("verifies a user whose token has not expired and clears the token", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: "u1", email: "a@b.ng", name: "A", isVerified: false, verificationTokenExpiry: new Date(Date.now() + HOUR),
    });
    prismaMock.user.update.mockResolvedValue({ id: "u1", email: "a@b.ng", name: "A", role: "PCM" });

    const res = await verify();

    expect(res.status).toBe(200);
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isVerified: true, verificationToken: null, verificationTokenExpiry: null } })
    );
  });

  it("rejects an expired link with 410 and does not verify", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: "u1", email: "a@b.ng", name: "A", isVerified: false, verificationTokenExpiry: new Date(Date.now() - HOUR),
    });

    const res = await verify();

    expect(res.status).toBe(410);
    expect((await res.json()).error).toBe("VERIFICATION_LINK_EXPIRED");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("still accepts links issued before expiries existed (null expiry)", async () => {
    prismaMock.user.findFirst.mockResolvedValue({
      id: "u1", email: "a@b.ng", name: "A", isVerified: false, verificationTokenExpiry: null,
    });
    prismaMock.user.update.mockResolvedValue({ id: "u1", email: "a@b.ng", name: "A", role: "PCM" });

    expect((await verify()).status).toBe(200);
  });
});
