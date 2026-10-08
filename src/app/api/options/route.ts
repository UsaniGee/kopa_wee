import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "field_of_study";

    // Read-only: starter options are seeded by `prisma db seed`
    const dbOptions = await prisma.formOption.findMany({
      where: { category },
      orderBy: { label: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: dbOptions.map((opt) => opt.label),
    });
  } catch (error) {
    console.error("GET /api/options error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch form options" },
      { status: 500 }
    );
  }
}

// Categories users may extend from the UI (e.g. "Other" on the onboarding field-of-study picker)
const USER_EXTENSIBLE_CATEGORIES = ["field_of_study"] as const;

const addOptionSchema = z.object({
  category: z.enum(USER_EXTENSIBLE_CATEGORIES),
  value: z.string().trim().min(1, "Value is required").max(80, "Keep it under 80 characters"),
});

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { category, value } = addOptionSchema.parse(await req.json());

    const option = await prisma.formOption.upsert({
      where: { category_value: { category, value } },
      update: { label: value },
      create: { category, value, label: value },
    });

    return NextResponse.json({ success: true, data: option });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error("POST /api/options error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save custom option" },
      { status: 500 }
    );
  }
}
