import { describe, expect, it } from "vitest";
import { Prisma } from "@prisma/client";
import { POST } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";

const post = (body: unknown) => POST(makeRequest("/api/users/status", { method: "POST", body }));

function stubUser(nyscStatus: "PCM" | "SERVING" | "ALUMNI") {
  prismaMock.user.findUnique.mockResolvedValue({ nyscStatus, applicationRole: "USER" });
  prismaMock.user.update.mockResolvedValue({ id: "user_1", nyscStatus: "X", role: "X" });
  prismaMock.userStatusHistory.create.mockResolvedValue({ id: "h1" });
}

describe("POST /api/users/status", () => {
  it("returns 401 when signed out", async () => {
    const res = await post({ newStatus: "SERVING" });
    expect(res.status).toBe(401);
  });

  it("lets a serving corps member move to ALUMNI", async () => {
    signInAs({ id: "user_1", nyscStatus: "SERVING" });
    stubUser("SERVING");

    const res = await post({ newStatus: "ALUMNI" });

    expect(res.status).toBe(200);
    expect(prismaMock.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user_1", nyscStatus: "SERVING" },
        data: expect.objectContaining({ nyscStatus: "ALUMNI", role: "ALUMNI" }),
      })
    );
    expect(prismaMock.userStatusHistory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: "user_1", changedBy: "user_1", changeType: "MANUAL", newStatus: "ALUMNI" }),
    });
  });

  it("acts on the session user and does not require or trust a body userId", async () => {
    signInAs({ id: "user_1" });
    stubUser("PCM");

    const res = await post({ userId: "someone_else", newStatus: "SERVING" });

    expect(res.status).toBe(200);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "user_1" } }));
    expect(prismaMock.user.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "user_1", nyscStatus: "PCM" } }));
  });

  it("rejects a transition that skips a stage", async () => {
    signInAs({ id: "user_1" });
    stubUser("PCM");

    const res = await post({ newStatus: "ALUMNI" });

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("INVALID_STATUS_TRANSITION");
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("rejects an unknown status with 400", async () => {
    signInAs({ id: "user_1" });
    const res = await post({ newStatus: "RETIRED" });
    expect(res.status).toBe(400);
  });

  it("returns 409 when the status changed in the meantime (e.g. the nightly job ran)", async () => {
    signInAs({ id: "user_1" });
    stubUser("PCM");
    prismaMock.$transaction.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError("Record to update not found.", { code: "P2025", clientVersion: "5.22.0" })
    );

    const res = await post({ newStatus: "SERVING" });

    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe("STATUS_CHANGED");
  });
});
