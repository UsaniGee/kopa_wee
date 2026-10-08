import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, value } = body;

    if (!category || !value || !value.trim()) {
      return NextResponse.json(
        { success: false, error: "Category and value are required" },
        { status: 400 }
      );
    }

    const cleanValue = value.trim();

    const option = await prisma.formOption.upsert({
      where: {
        category_value: {
          category,
          value: cleanValue,
        },
      },
      update: { label: cleanValue },
      create: {
        category,
        value: cleanValue,
        label: cleanValue,
      },
    });

    return NextResponse.json({
      success: true,
      data: option,
    });
  } catch (error) {
    console.error("POST /api/options error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save custom option" },
      { status: 500 }
    );
  }
}
