import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

const DEFAULT_FIELDS_OF_STUDY = [
  "Computer Science / Software Engineering",
  "Law / Legal Studies",
  "Medicine / Nursing / Public Health",
  "Accounting / Banking & Finance",
  "Electrical / Civil / Mechanical Engineering",
  "Education / Teaching",
  "Mass Communication / Journalism",
  "Biochemistry / Microbiology",
  "Economics / Political Science",
  "Architecture / Fine Arts",
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "field_of_study";

    let dbOptions = await prisma.formOption.findMany({
      where: { category },
      orderBy: { label: "asc" },
    });

    // Seed default options if category is empty
    if (dbOptions.length === 0 && category === "field_of_study") {
      await prisma.formOption.createMany({
        data: DEFAULT_FIELDS_OF_STUDY.map((item) => ({
          category: "field_of_study",
          value: item,
          label: item,
        })),
        skipDuplicates: true,
      });

      dbOptions = await prisma.formOption.findMany({
        where: { category: "field_of_study" },
        orderBy: { label: "asc" },
      });
    }

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
