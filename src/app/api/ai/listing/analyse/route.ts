import { NextResponse } from "next/server";
import { SchemaType, type Part, type ResponseSchema } from "@google/generative-ai";
import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { getGeminiModel } from "@/shared/lib/gemini";
import { MARKETPLACE_CATEGORIES } from "@/shared/data/referenceData";

const MAX_IMAGES = 3;
// ~2 MB of base64 per photo; the form downsizes before sending
const MAX_IMAGE_CHARS = 2_800_000;
const DATA_URL = /^data:(image\/(?:jpeg|png|webp|heic|heif));base64,([A-Za-z0-9+/=]+)$/;

const requestSchema = z
  .object({
    description: z.string().max(1000).default(""),
    images: z.array(z.string().max(MAX_IMAGE_CHARS).regex(DATA_URL, "Photos must be JPEG, PNG, WebP or HEIC")).max(MAX_IMAGES).default([]),
    type: z.literal("marketplace").default("marketplace"),
  })
  .refine((b) => b.description.trim() !== "" || b.images.length > 0, {
    message: "Add a short description or at least one photo",
  });

const draftSchema = z.object({
  title: z.string(),
  category: z.string().nullable(),
  price: z.number().nullable(),
  condition: z.string().nullable(),
  state: z.string().nullable(),
  lga: z.string().nullable(),
  description: z.string(),
  missingFields: z.array(z.string()),
});

const nullableString = { type: SchemaType.STRING, nullable: true } as const;
const RESPONSE_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING },
    category: { ...nullableString, description: `One of: ${MARKETPLACE_CATEGORIES.join(", ")}` },
    price: { type: SchemaType.INTEGER, nullable: true, description: "Asking price in naira" },
    condition: nullableString,
    state: { ...nullableString, description: "Nigerian state name, e.g. Lagos or FCT - Abuja" },
    lga: { ...nullableString, description: "Local Government Area name" },
    description: { type: SchemaType.STRING },
    missingFields: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
  },
  required: ["title", "category", "price", "condition", "state", "lga", "description", "missingFields"],
};

const SYSTEM_INSTRUCTION = `You turn a Nigerian corps member's rough notes and photos into a marketplace listing draft for KopaWee.
Rules:
- Use only facts stated in the text or clearly visible in the photos. Never guess a price, location, brand or condition.
- If something is unknown, return null for it and add a short label for it to missingFields (e.g. "price", "location").
- category must be exactly one of: ${MARKETPLACE_CATEGORIES.join(", ")}; otherwise null.
- price is a whole number of naira (e.g. "15k" = 15000).
- state and lga must be real Nigerian names as written by the user; do not infer a location from landmarks or slang.
- title: short and factual (max 60 characters). description: 1-3 plain sentences from the user's facts only; empty string if there are none. Never claim the item is verified.`;

const jsonError = (status: number, error: string, message?: string) =>
  NextResponse.json({ success: false, error, ...(message ? { message } : {}) }, { status });

/** Keeps a state/LGA only when it exists in the seeded tables (and the LGA is in that state). */
async function verifiedLocation(state: string | null, lga: string | null) {
  if (!state) return { state: null, lga: null };
  const stateRow = await prisma.state.findUnique({ where: { name: state }, select: { id: true } });
  if (!stateRow) return { state: null, lga: null };
  if (!lga) return { state, lga: null };
  const lgaRow = await prisma.lGA.findUnique({
    where: { stateId_name: { stateId: stateRow.id, name: lga } },
    select: { id: true },
  });
  return { state, lga: lgaRow ? lga : null };
}

/**
 * POST /api/ai/listing/analyse — drafts a marketplace listing from a description and/or photos.
 * Unknown fields come back null; nothing is invented or defaulted.
 */
export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const model = getGeminiModel({
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: { responseMimeType: "application/json", responseSchema: RESPONSE_SCHEMA, temperature: 0.2 },
  });
  if (!model) return jsonError(503, "AI_NOT_CONFIGURED");

  let input: z.infer<typeof requestSchema>;
  try {
    input = requestSchema.parse(await req.json());
  } catch (error) {
    return jsonError(400, "INVALID_REQUEST", error instanceof z.ZodError ? error.errors[0].message : undefined);
  }

  const parts: Part[] = [{ text: input.description.trim() || "Describe this item from the photos." }];
  for (const image of input.images) {
    const [, mimeType, data] = image.match(DATA_URL)!; // guaranteed by the request schema
    parts.push({ inlineData: { mimeType, data } });
  }

  let draft: z.infer<typeof draftSchema>;
  try {
    const result = await model.generateContent(parts);
    draft = draftSchema.parse(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("[POST /api/ai/listing/analyse] Gemini error or unexpected output:", error);
    return jsonError(502, "AI_FAILED", "The AI couldn't draft this listing. Please fill the form yourself.");
  }

  try {
    const location = await verifiedLocation(draft.state, draft.lga);
    const category = (MARKETPLACE_CATEGORIES as readonly string[]).includes(draft.category ?? "") ? draft.category : null;
    const price = draft.price !== null && Number.isInteger(draft.price) && draft.price > 0 ? draft.price : null;

    return NextResponse.json({
      success: true,
      data: {
        title: draft.title.trim(),
        categoryOrType: category,
        price,
        condition: draft.condition,
        ...location,
        description: draft.description.trim(),
        missingFields: draft.missingFields,
      },
    });
  } catch (error) {
    console.error("[POST /api/ai/listing/analyse] Error:", error);
    return jsonError(500, "ANALYSIS_FAILED");
  }
}
