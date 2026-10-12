import { describe, expect, it } from "vitest";
import { POST } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";

const revert = (body: unknown) => POST(makeRequest("/api/admin/users/revert-status", { method: "POST", body }));

function stubTarget(nyscStatus: string) {
  prismaMock.user.findUnique.mockResolvedValue({ id: "u1", name: "Ada", nyscStatus });
  prismaMock.user.update.mockResolvedValue({ id: "u1", name: "Ada", nyscStatus: "SERVING", role: "SERVING_CORPER" });
  prismaMock.userStatusHistory.create.mockResolvedValue({ id: "h1" });
  prismaMock.nYSCJourney.updateMany.mockResolvedValue({ count: 1 });
  prismaMock.notification.create.mockResolvedValue({});
}

describe("POST /api/admin/users/revert-status", () => {
  it("is for admins only", async () => {
    signInAs({ applicationRole: "USER" });
    expect((await revert({ targetUserId: "u1", newStatus: "SERVING", reason: "x" })).status).toBe(403);
  });

  it("ALUMNI -> SERVING clears a past service end date so the nightly job does not undo it", async () => {
    signInAs({ id: "admin_1", applicationRole: "ADMIN" });
    stubTarget("ALUMNI");

    expect((await revert({ targetUserId: "u1", newStatus: "SERVING", reason: "Wrong end date" })).status).toBe(200);

    expect(prismaMock.nYSCJourney.updateMany).toHaveBeenCalledWith({
      where: { userId: "u1", serviceEndDate: { lte: expect.any(Date) } },
      data: { serviceEndDate: null },
    });
  });

  it("-> PCM clears a past camp exit date", async () => {
    signInAs({ id: "admin_1", applicationRole: "ADMIN" });
    stubTarget("SERVING");

    await revert({ targetUserId: "u1", newStatus: "PCM", reason: "Not posted yet" });

    expect(prismaMock.nYSCJourney.updateMany).toHaveBeenCalledWith({
      where: { userId: "u1", campExitDate: { lte: expect.any(Date) } },
      data: { campExitDate: null },
    });
  });

  it("-> ALUMNI keeps the journey dates", async () => {
    signInAs({ id: "admin_1", applicationRole: "ADMIN" });
    stubTarget("SERVING");

    await revert({ targetUserId: "u1", newStatus: "ALUMNI", reason: "Passed out" });

    expect(prismaMock.nYSCJourney.updateMany).not.toHaveBeenCalled();
  });
});
