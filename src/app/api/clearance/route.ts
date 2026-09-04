import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

const CLEARANCE_LOCK_DAYS = 20;

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

    // Get the most recent clearance record
    const latestClearance = await prisma.monthlyClearance.findFirst({
      where: { userId },
      orderBy: { completedAt: "desc" },
    });

    if (!latestClearance) {
      return NextResponse.json({
        success: true,
        data: {
          hasCleared: false,
          lastClearedAt: null,
          nextEligibleAt: null,
          isEligible: true,
        },
      });
    }

    const now = new Date();
    const isEligible = now >= latestClearance.nextEligibleAt;

    return NextResponse.json({
      success: true,
      data: {
        hasCleared: true,
        lastClearedAt: latestClearance.completedAt,
        nextEligibleAt: latestClearance.nextEligibleAt,
        isEligible,
      },
    });
  } catch (error) {
    console.error("[GET /api/clearance] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch clearance status" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    // Verify user is a SERVING member
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nyscStatus: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.nyscStatus !== "SERVING") {
      return NextResponse.json(
        {
          success: false,
          error: "Only serving corps members can mark clearance",
        },
        { status: 403 }
      );
    }

    // Use a transaction to prevent race conditions / double submissions
    const result = await prisma.$transaction(async (tx) => {
      // Check the most recent clearance inside the transaction
      const latestClearance = await tx.monthlyClearance.findFirst({
        where: { userId },
        orderBy: { completedAt: "desc" },
      });

      const now = new Date();

      // Check if user is eligible (no recent clearance OR past nextEligibleAt)
      if (latestClearance && now < latestClearance.nextEligibleAt) {
        return {
          eligible: false,
          nextEligibleAt: latestClearance.nextEligibleAt,
        };
      }

      // Calculate nextEligibleAt (now + CLEARANCE_LOCK_DAYS)
      const nextEligibleAt = new Date(now);
      nextEligibleAt.setDate(nextEligibleAt.getDate() + CLEARANCE_LOCK_DAYS);

      // Create the clearance record
      const clearance = await tx.monthlyClearance.create({
        data: {
          userId,
          completedAt: now,
          nextEligibleAt,
        },
      });

      return { eligible: true, clearance };
    });

    if (!result.eligible) {
      return NextResponse.json(
        {
          success: false,
          error: "CLEARANCE_NOT_YET_AVAILABLE",
          message: `You are not yet eligible for clearance. Your next clearance window opens on ${new Date(result.nextEligibleAt!).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`,
          nextEligibleAt: result.nextEligibleAt,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Monthly clearance marked as complete.",
      data: {
        completedAt: result.clearance!.completedAt,
        nextEligibleAt: result.clearance!.nextEligibleAt,
      },
    });
  } catch (error) {
    console.error("[POST /api/clearance] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark clearance" },
      { status: 500 }
    );
  }
}
