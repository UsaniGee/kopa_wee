import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";
import { sendEmail } from "@/shared/lib/email";

vi.mock("@/shared/lib/email", () => ({ sendEmail: vi.fn(async () => ({ success: true })) }));

const invite = (body: unknown) => POST(makeRequest("/api/admin/invite", { method: "POST", body }));

describe("POST /api/admin/invite", () => {
  beforeEach(() => {
    vi.stubEnv("NEXTAUTH_URL", "https://kopawee.test");
  });

  it("is for admins only", async () => {
    expect((await invite({ email: "new@b.ng" })).status).toBe(401);
    signInAs({ applicationRole: "USER" });
    expect((await invite({ email: "new@b.ng" })).status).toBe(403);
    expect(prismaMock.adminInvite.upsert).not.toHaveBeenCalled();
  });

  it("emails an invite link built from NEXTAUTH_URL, never localhost", async () => {
    signInAs({ id: "admin_1", applicationRole: "ADMIN" });
    prismaMock.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ name: "Ada" });
    prismaMock.adminInvite.upsert.mockResolvedValue({});

    const res = await invite({ email: "New@B.ng", role: "USER" });

    expect(res.status).toBe(200);
    const props = vi.mocked(sendEmail).mock.calls[0][0].template.props as { inviteUrl: string };
    expect(props.inviteUrl).toMatch(/^https:\/\/kopawee\.test\/auth\/accept-invite\?token=[0-9a-f]{64}$/);
    expect(prismaMock.adminInvite.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "new@b.ng" } })
    );
  });
});
