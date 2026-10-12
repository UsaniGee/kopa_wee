import { describe, expect, it } from "vitest";
import { POST } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";

describe("POST /api/clearance", () => {
  it("returns 401 when signed out", async () => {
    const res = await POST();
    expect(res.status).toBe(401);
  });

  it("marks clearance for the session user without needing a request body", async () => {
    signInAs({ id: "user_1", nyscStatus: "SERVING" });
    prismaMock.user.findUnique.mockResolvedValue({ nyscStatus: "SERVING" });
    prismaMock.monthlyClearance.findFirst.mockResolvedValue(null);
    prismaMock.monthlyClearance.create.mockImplementation(async ({ data }: { data: object }) => data);

    const res = await POST();

    expect(res.status).toBe(200);
    expect(prismaMock.monthlyClearance.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: "user_1" }),
    });
  });

  it("returns 403 for a user who is not serving", async () => {
    signInAs({ id: "user_1" });
    prismaMock.user.findUnique.mockResolvedValue({ nyscStatus: "PCM" });

    const res = await POST();

    expect(res.status).toBe(403);
  });

  it("locks per user before checking eligibility, so a double tap cannot record two clearances", async () => {
    signInAs({ id: "user_1" });
    prismaMock.user.findUnique.mockResolvedValue({ nyscStatus: "SERVING" });
    const order: string[] = [];
    prismaMock.$executeRaw.mockImplementation(async () => { order.push("lock"); return 1; });
    prismaMock.monthlyClearance.findFirst.mockImplementation(async () => { order.push("check"); return null; });
    prismaMock.monthlyClearance.create.mockResolvedValue({ completedAt: new Date(), nextEligibleAt: new Date() });

    await POST();

    expect(order).toEqual(["lock", "check"]);
  });
});
