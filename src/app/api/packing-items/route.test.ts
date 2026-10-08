import { describe, expect, it } from "vitest";
import { GET } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { DEFAULT_PACKING_ITEMS } from "@/shared/data/referenceData";

describe("GET /api/packing-items", () => {
  it("returns 401 when signed out", async () => {
    expect((await GET()).status).toBe(401);
  });

  it("creates the user's checklist from the single canonical template on first visit", async () => {
    signInAs({ id: "user_1" });
    prismaMock.packingItem.count.mockResolvedValue(0);
    prismaMock.packingItem.createMany.mockResolvedValue({ count: DEFAULT_PACKING_ITEMS.length });
    prismaMock.packingItem.findMany.mockResolvedValue([]);

    const res = await GET();

    expect(res.status).toBe(200);
    const rows = prismaMock.packingItem.createMany.mock.calls[0][0].data;
    expect(rows).toHaveLength(DEFAULT_PACKING_ITEMS.length);
    expect(rows[0]).toMatchObject({ userId: "user_1", name: DEFAULT_PACKING_ITEMS[0].name, isCustom: false });
  });
});
