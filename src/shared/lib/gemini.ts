import { GoogleGenerativeAI, type ModelParams } from "@google/generative-ai";

/** Default model; override with GEMINI_MODEL without a code change when Google retires it. */
const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";

export function geminiModelName(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

/** Returns a configured Gemini model, or null when GEMINI_API_KEY is not set. */
export function getGeminiModel(params: Omit<ModelParams, "model"> = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: geminiModelName(), ...params });
}
