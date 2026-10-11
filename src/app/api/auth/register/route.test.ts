import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { makeRequest } from "@/test/request";

vi.mock("@/shared/lib/email", () => ({ sendEmail: vi.fn(async () => ({ success: true })) }));
// Real bcrypt (cost 12) takes seconds and made these tests flaky under load; hashing is not what they check
vi.mock("@/shared/lib/auth", () => ({ hashPassword: vi.fn(async (pw: string) => `hashed:${pw}`) }));

const register = (body: unknown) => POST(makeRequest("/api/auth/register", { method: "POST", body }));

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.stubEnv("NEXTAUTH_URL", "https://kopawee.test");
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockImplementation(async ({ data }: { data: { email: string; name: string } }) => ({
      id: "new_1",
      ...data,
    }));
  });

  it("always creates a PCM and ignores client-supplied roles and profile fields", async () => {
    const res = await register({
      name: "Ada Obi",
      email: "Ada@Example.com",
      password: "long-enough-pw",
      role: "EMPLOYER",
      stateCode: "LA/26A/1234",
      deployedState: "Lagos",
    });

    expect(res.status).toBe(201);
    const data = prismaMock.user.create.mock.calls[0][0].data;
    expect(data.role).toBe("PCM");
    expect(data.email).toBe("ada@example.com");
    expect(data).not.toHaveProperty("stateCode");
    expect(data).not.toHaveProperty("deployedState");
  });

  it("gives the verification token a 24-hour expiry", async () => {
    await register({ name: "Ada Obi", email: "ada@example.com", password: "long-enough-pw" });
    const data = prismaMock.user.create.mock.calls[0][0].data;
    const hours = (data.verificationTokenExpiry.getTime() - Date.now()) / 3_600_000;
    expect(hours).toBeGreaterThan(23.9);
    expect(hours).toBeLessThanOrEqual(24);
  });

  it("requires passwords of at least 8 characters", async () => {
    expect((await register({ name: "Ada Obi", email: "ada@example.com", password: "1234567" })).status).toBe(400);
  });
});
