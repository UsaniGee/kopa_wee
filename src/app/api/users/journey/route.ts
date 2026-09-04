import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

// GET /api/users/journey?userId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId parameter required" },
        { status: 400 }
      );
    }

    const journey = await prisma.nYSCJourney.findUnique({
      where: { userId },
    });

    // Also get the user's current nysc status for context
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        nyscStatus: true,
        deployedState: true,
        lga: true,
        ppaName: true,
        callUpNo: true,
        stateCode: true,
        stateOfOrigin: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        journey: journey || null,
        user: user || null,
      },
    });
  } catch (error) {
    console.error("[GET /api/users/journey] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch journey data" },
      { status: 500 }
    );
  }
}

const updateJourneySchema = z.object({
  userId: z.string().min(1),
  // PCM camp dates
  campEntryDate: z.string().datetime({ offset: true }).nullable().optional(),
  campExitDate: z.string().datetime({ offset: true }).nullable().optional(),
  // Serving service dates
  serviceStartDate: z.string().datetime({ offset: true }).nullable().optional(),
  serviceEndDate: z.string().datetime({ offset: true }).nullable().optional(),
  // Additional info
  batch: z.string().nullable().optional(),
  stream: z.string().nullable().optional(),
  institution: z.string().nullable().optional(),
  courseOfStudy: z.string().nullable().optional(),
});

// PATCH /api/users/journey — upsert journey dates and info
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const data = updateJourneySchema.parse(body);

    const { userId, ...journeyData } = data;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nyscStatus: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Safety: if user already transitioned to SERVING or ALUMNI via automatic mechanism,
    // allow them to update dates but warn if camp dates would trigger another auto-transition
    const updateData: Record<string, unknown> = { campDateSource: "USER_PROVIDED", serviceDateSource: "USER_PROVIDED" };

    if (journeyData.campEntryDate !== undefined) {
      updateData.campEntryDate = journeyData.campEntryDate ? new Date(journeyData.campEntryDate) : null;
    }
    if (journeyData.campExitDate !== undefined) {
      updateData.campExitDate = journeyData.campExitDate ? new Date(journeyData.campExitDate) : null;
    }
    if (journeyData.serviceStartDate !== undefined) {
      updateData.serviceStartDate = journeyData.serviceStartDate ? new Date(journeyData.serviceStartDate) : null;
    }
    if (journeyData.serviceEndDate !== undefined) {
      updateData.serviceEndDate = journeyData.serviceEndDate ? new Date(journeyData.serviceEndDate) : null;
    }
    if (journeyData.batch !== undefined) updateData.batch = journeyData.batch;
    if (journeyData.stream !== undefined) updateData.stream = journeyData.stream;
    if (journeyData.institution !== undefined) updateData.institution = journeyData.institution;
    if (journeyData.courseOfStudy !== undefined) updateData.courseOfStudy = journeyData.courseOfStudy;

    const journey = await prisma.nYSCJourney.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData,
      },
    });

    return NextResponse.json({
      success: true,
      data: journey,
      message: "Journey dates updated successfully.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[PATCH /api/users/journey] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update journey data" },
      { status: 500 }
    );
  }
}
