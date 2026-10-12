import { describe, expect, it } from "vitest";
import { Prisma } from "@prisma/client";
import { applyAutomaticTransition } from "./statusTransitions";
import { prismaMock } from "@/test/prismaMock";

describe("applyAutomaticTransition", () => {
  it("only updates a user who is still in the expected stage", async () => {
    prismaMock.user.update.mockResolvedValue({});
    prismaMock.userStatusHistory.create.mockResolvedValue({});
    prismaMock.notification.create.mockResolvedValue({});

    expect(await applyAutomaticTransition("u1", "PCM", "SERVING", "CAMP_EXIT_DATE_REACHED")).toBe(true);
    expect(prismaMock.user.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "u1", nyscStatus: "PCM" } }));
  });

  it("skips (no history, no notification) when someone else already changed the status", async () => {
    prismaMock.$transaction.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError("Record to update not found.", { code: "P2025", clientVersion: "5.22.0" })
    );

    expect(await applyAutomaticTransition("u1", "PCM", "SERVING", "CAMP_EXIT_DATE_REACHED")).toBe(false);
  });
});
