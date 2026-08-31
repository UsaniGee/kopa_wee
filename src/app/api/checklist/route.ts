import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId parameter required" },
        { status: 400 }
      );
    }

    const checklist = await prisma.campChecklist.findUnique({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      data: checklist ? checklist.completedItems : [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch checklist" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, completedItems } = body;

    if (!userId || !Array.isArray(completedItems)) {
      return NextResponse.json(
        { success: false, error: "userId and completedItems array required" },
        { status: 400 }
      );
    }

    const checklist = await prisma.campChecklist.upsert({
      where: { userId },
      update: { completedItems },
      create: { userId, completedItems },
    });

    return NextResponse.json({
      success: true,
      data: checklist.completedItems,
      message: "Checklist updated",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update checklist" },
      { status: 500 }
    );
  }
}
