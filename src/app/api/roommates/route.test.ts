import { describe, expect, it } from "vitest";
import { DELETE, GET } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";

describe("roommate requests", () => {
  it("can cancel a MATCHED request as well as an ACTIVE one, only the user's own", async () => {
    signInAs({ id: "owner_1" });
    prismaMock.roommateRequest.updateMany.mockResolvedValue({ count: 1 });

    const res = await DELETE(makeRequest("/api/roommates?id=req_1", { method: "DELETE" }));

    expect(res.status).toBe(200);
    expect(prismaMock.roommateRequest.updateMany).toHaveBeenCalledWith({
      where: { id: "req_1", userId: "owner_1", status: { in: ["ACTIVE", "MATCHED"] } },
      data: { status: "CANCELLED" },
    });
  });

  it("reports 404 when nothing was cancelled instead of claiming success", async () => {
    signInAs({ id: "owner_1" });
    prismaMock.roommateRequest.updateMany.mockResolvedValue({ count: 0 });

    const res = await DELETE(makeRequest("/api/roommates?id=req_x", { method: "DELETE" }));

    expect(res.status).toBe(404);
  });

  it("returns the user's newest open request", async () => {
    signInAs({ id: "owner_1" });
    prismaMock.roommateRequest.findFirst.mockResolvedValue(null);

    await GET(makeRequest("/api/roommates?my=true"));

    expect(prismaMock.roommateRequest.findFirst).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { createdAt: "desc" } }));
  });
});
