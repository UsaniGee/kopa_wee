import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/shared/lib/apiAuth";
import { z } from "zod";

const requestSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.string().max(500).optional(),
});

// Simple in-memory rate limiter: userId -> { count, windowStart }
// Resets every hour. Acceptable for single-instance deployments; use Redis for multi-instance.
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const MAX_REQUESTS_PER_HOUR = 20;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(userId, { count: 1, windowStart: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
  }

  if (entry.count >= MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - entry.count };
}

const KOPAWEE_SYSTEM_PROMPT = `You are KopaBot, the intelligent assistant embedded in KopaWee — the official companion platform for Nigerian NYSC (National Youth Service Corps) corps members.

Your expertise covers:
- NYSC processes: registration, call-up letters, orientation camp, postings, redeployment
- Monthly LGA biometric clearance: eligibility windows, what to bring, what happens if you miss it
- PPA (Place of Primary Assignment): logbook completion, attendance, leave requests, relationship with employers
- CDS (Community Development Service): group requirements, attendance, project documentation, dues
- Corps member allowances: monthly stipend, when it's paid, what affects it
- Safety: travel safety tips, SOS protocol, emergency contacts, night travel warnings
- Accommodation: finding corper lodges, roommate etiquette, housing allowances
- P2P Marketplace: safe buying/selling tips, pricing corper goods, POP season deals
- State-specific guidance: deployment states, LGA office locations, camp rules by state
- Post-NYSC: POP certificate process, alumni networking, career transition

Tone: Friendly, direct, knowledgeable. Like a senior corper who's been through it all.
Format: Concise answers. Use bullet points for lists. Bold key terms.
Language: English (Nigerian context). Use NYSC terminology naturally.
Limits: Do not provide legal, medical, or financial advice beyond general NYSC guidance. Do not make up specific dates, names, or official policies you're not certain about.`;

export async function POST(req: NextRequest) {
  // Auth guard
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  // Rate limit check
  const { allowed, remaining } = checkRateLimit(auth.user!.id);
  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "RATE_LIMIT_EXCEEDED",
        message: "You've reached the AI assistant limit (20 requests/hour). Please try again later.",
      },
      {
        status: 429,
        headers: { "X-RateLimit-Remaining": "0" },
      }
    );
  }

  // API key check
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[AI] GEMINI_API_KEY not set — returning AI_NOT_CONFIGURED");
    return NextResponse.json(
      { success: false, error: "AI_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { message, context } = requestSchema.parse(body);

    // Dynamic import to avoid build failure when package not yet installed
    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: KOPAWEE_SYSTEM_PROMPT,
    });

    const userMessage = context
      ? `[User context: ${context}]\n\n${message}`
      : message;

    const result = await model.generateContent(userMessage);
    const reply = result.response.text();

    return NextResponse.json(
      { success: true, reply },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[POST /api/ai/listing] Error:", error);
    return NextResponse.json(
      { success: false, error: "AI request failed. Please try again." },
      { status: 500 }
    );
  }
}
