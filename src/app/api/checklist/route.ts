import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const checklist = await prisma.campChecklist.findUnique({
      where: { userId: auth.user!.id },
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
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.json();
    const { completedItems } = body;

    if (!Array.isArray(completedItems)) {
      return NextResponse.json(
        { success: false, error: "completedItems array required" },
        { status: 400 }
      );
    }

    const userId = auth.user!.id;
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
