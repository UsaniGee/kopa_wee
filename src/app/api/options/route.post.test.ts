import { describe, expect, it } from "vitest";
import { POST } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";

const add = (body: unknown) => POST(makeRequest("/api/options", { method: "POST", body }));

describe("POST /api/options", () => {
  it("returns 401 when signed out", async () => {
    expect((await add({ category: "field_of_study", value: "Agriculture" })).status).toBe(401);
    expect(prismaMock.formOption.upsert).not.toHaveBeenCalled();
  });

  it("rejects categories users may not add to", async () => {
    signInAs();
    expect((await add({ category: "default_packing_item", value: "Anything" })).status).toBe(400);
  });

  it("rejects values that are empty or too long", async () => {
    signInAs();
    expect((await add({ category: "field_of_study", value: "   " })).status).toBe(400);
    expect((await add({ category: "field_of_study", value: "x".repeat(81) })).status).toBe(400);
  });

  it("saves a trimmed field of study for a signed-in user", async () => {
    signInAs();
    prismaMock.formOption.upsert.mockResolvedValue({ value: "Agricultural Science" });

    const res = await add({ category: "field_of_study", value: "  Agricultural Science " });

    expect(res.status).toBe(200);
    expect(prismaMock.formOption.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { category_value: { category: "field_of_study", value: "Agricultural Science" } },
      })
    );
  });
});
