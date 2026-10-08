import { describe, expect, it } from "vitest";
import { GET } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { makeRequest } from "@/test/request";

describe("GET /api/options", () => {
  it("returns stored options and never seeds inside a GET", async () => {
    prismaMock.formOption.findMany.mockResolvedValue([]);

    const res = await GET(makeRequest("/api/options?category=field_of_study"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toEqual([]);
    expect(prismaMock.formOption.createMany).not.toHaveBeenCalled();
  });

  it("maps stored rows to labels", async () => {
    prismaMock.formOption.findMany.mockResolvedValue([{ label: "Law / Legal Studies" }]);
    const body = await (await GET(makeRequest("/api/options?category=field_of_study"))).json();
    expect(body.data).toEqual(["Law / Legal Studies"]);
  });
});
