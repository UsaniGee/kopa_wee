import { describe, expect, it } from "vitest";
import { prisma } from "@/shared/lib/prisma";
import { requireAdmin, requireAuth } from "@/shared/lib/apiAuth";
import { signInAs } from "./authMock";
import { prismaMock } from "./prismaMock";

describe("test harness", () => {
  it("replaces Prisma with stubbable mocks that reset between tests", async () => {
    expect(prisma).toBe(prismaMock);
    prismaMock.user.findUnique.mockResolvedValue({ id: "u1" });
    await expect(prisma.user.findUnique({ where: { id: "u1" } })).resolves.toEqual({ id: "u1" });
  });

  it("starts each test with fresh Prisma stubs", async () => {
    expect(prisma.user.findUnique({ where: { id: "u1" } })).toBeUndefined();
  });

  it("returns 401 from requireAuth when signed out", async () => {
    const result = await requireAuth();
    expect(result.error?.status).toBe(401);
  });

  it("returns the signed-in user, and 403 from requireAdmin for non-admins", async () => {
    signInAs({ id: "u2" });
    expect((await requireAuth()).user?.id).toBe("u2");
    expect((await requireAdmin()).error?.status).toBe(403);
  });
});
