import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { prismaMock } from "@/test/prismaMock";
import { signInAs } from "@/test/authMock";
import { makeRequest } from "@/test/request";

const generateContent = vi.fn();
const getGenerativeModel = vi.fn(() => ({ generateContent }));

vi.mock("@google/generative-ai", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@google/generative-ai")>()),
  GoogleGenerativeAI: class {
    getGenerativeModel = getGenerativeModel;
  },
}));

const geminiReturns = (json: object) =>
  generateContent.mockResolvedValue({ response: { text: () => JSON.stringify(json) } });

const analyse = (body: unknown) => POST(makeRequest("/api/ai/listing/analyse", { method: "POST", body }));

/** Lagos/Ikeja exist; nothing else does. */
function stubLocations() {
  prismaMock.state.findUnique.mockImplementation(async ({ where }: { where: { name: string } }) =>
    where.name === "Lagos" ? { id: "state_lagos" } : null
  );
  prismaMock.lGA.findUnique.mockImplementation(
    async ({ where }: { where: { stateId_name: { name: string } } }) =>
      where.stateId_name.name === "Ikeja" ? { id: "lga_ikeja" } : null
  );
}

describe("POST /api/ai/listing/analyse", () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = "test-key";
  });
  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it("returns 401 when signed out", async () => {
    expect((await analyse({ description: "standing fan" })).status).toBe(401);
  });

  it("returns AI_NOT_CONFIGURED (503) without a Gemini key", async () => {
    signInAs();
    delete process.env.GEMINI_API_KEY;
    const res = await analyse({ description: "standing fan" });
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe("AI_NOT_CONFIGURED");
  });

  it("requires a description or at least one photo", async () => {
    signInAs();
    expect((await analyse({ description: "  " })).status).toBe(400);
  });

  it("returns Gemini's draft with a verified state and LGA", async () => {
    signInAs();
    stubLocations();
    geminiReturns({
      title: "Binatone 16\" Standing Fan",
      category: "Electronics",
      price: 15000,
      condition: "Fairly used",
      state: "Lagos",
      lga: "Ikeja",
      description: "Works well, used for 3 months.",
      missingFields: [],
    });

    const res = await analyse({ description: "binatone fan in ikeja 15k fairly used" });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data).toEqual({
      title: "Binatone 16\" Standing Fan",
      categoryOrType: "Electronics",
      price: 15000,
      condition: "Fairly used",
      state: "Lagos",
      lga: "Ikeja",
      description: "Works well, used for 3 months.",
      missingFields: [],
    });
  });

  it("nulls out a state, LGA or category that is not real, and never invents a location or image", async () => {
    signInAs();
    stubLocations();
    geminiReturns({
      title: "Mattress",
      category: "Bedding",
      price: null,
      condition: null,
      state: "Lagos",
      lga: "Yaba",
      description: "",
      missingFields: ["price"],
    });

    const body = await (await analyse({ description: "mattress near yaba" })).json();

    expect(body.data).toMatchObject({ categoryOrType: null, price: null, state: "Lagos", lga: null });
    expect(body.data).not.toHaveProperty("images");
    expect(JSON.stringify(body.data)).not.toMatch(/Ikeja|unsplash|verified/i);
  });

  it("sends photos to Gemini as inline image data", async () => {
    signInAs();
    stubLocations();
    geminiReturns({ title: "Gas cylinder", category: "Kitchenware", price: null, condition: null, state: null, lga: null, description: "", missingFields: [] });

    await analyse({ images: ["data:image/jpeg;base64,QUJD"] });

    const parts = generateContent.mock.calls[0][0];
    expect(parts).toContainEqual({ inlineData: { mimeType: "image/jpeg", data: "QUJD" } });
  });

  it("returns 502 when Gemini replies with something that is not the expected JSON", async () => {
    signInAs();
    generateContent.mockResolvedValue({ response: { text: () => "Sure! Here is your listing..." } });
    const res = await analyse({ description: "fan" });
    expect(res.status).toBe(502);
  });
});
