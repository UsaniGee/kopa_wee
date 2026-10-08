import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
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

const ask = (body: unknown) => POST(makeRequest("/api/ai/listing", { method: "POST", body }));

describe("POST /api/ai/listing (KopaBot assistant)", () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = "test-key";
  });
  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_MODEL;
  });

  it("returns 401 when signed out", async () => {
    expect((await ask({ message: "When is clearance?" })).status).toBe(401);
  });

  it("returns AI_NOT_CONFIGURED (503) without a Gemini key", async () => {
    signInAs({ id: "assist_1" });
    delete process.env.GEMINI_API_KEY;
    const res = await ask({ message: "hi" });
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe("AI_NOT_CONFIGURED");
  });

  it("rejects an empty message with 400", async () => {
    signInAs({ id: "assist_2" });
    expect((await ask({ message: "" })).status).toBe(400);
  });

  it("replies with Gemini's answer using the configured model", async () => {
    signInAs({ id: "assist_3" });
    process.env.GEMINI_MODEL = "gemini-test-model";
    generateContent.mockResolvedValue({ response: { text: () => "Clearance is monthly at your LGA office." } });

    const res = await ask({ message: "When is clearance?" });

    expect(res.status).toBe(200);
    expect((await res.json()).reply).toBe("Clearance is monthly at your LGA office.");
    expect(getGenerativeModel).toHaveBeenCalledWith(expect.objectContaining({ model: "gemini-test-model" }));
  });
});
