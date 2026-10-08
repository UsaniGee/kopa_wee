import { describe, expect, it } from "vitest";
import { GET } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { makeRequest } from "@/test/request";

describe("GET /api/states", () => {
  it("returns states from the database without writing anything", async () => {
    prismaMock.state.findMany.mockResolvedValue([
      { id: "s1", name: "Lagos", code: "LA", lgas: [{ name: "Ikeja" }, { name: "Epe" }] },
    ]);

    const res = await GET(makeRequest("/api/states"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toEqual([{ id: "s1", name: "Lagos", code: "LA", lgas: ["Epe", "Ikeja"] }]);
    expect(prismaMock.state.upsert).not.toHaveBeenCalled();
    expect(prismaMock.lGA.upsert).not.toHaveBeenCalled();
  });

  it("returns the LGAs of one state", async () => {
    prismaMock.state.findMany.mockResolvedValue([{ id: "s1", name: "Lagos", code: "LA", lgas: [{ name: "Ikeja" }] }]);
    const body = await (await GET(makeRequest("/api/states?state=lagos"))).json();
    expect(body.data).toEqual(["Ikeja"]);
  });

  it("returns 503 when reference data has not been seeded, instead of seeding inside a GET", async () => {
    prismaMock.state.findMany.mockResolvedValue([]);
    const res = await GET(makeRequest("/api/states"));
    expect(res.status).toBe(503);
    expect(prismaMock.state.upsert).not.toHaveBeenCalled();
  });

  it("returns 503 on a database error instead of made-up ids", async () => {
    prismaMock.state.findMany.mockRejectedValue(new Error("db down"));
    const res = await GET(makeRequest("/api/states"));
    const body = await res.json();
    expect(res.status).toBe(503);
    expect(body.success).toBe(false);
  });
});
