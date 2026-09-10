import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";

const CLEARANCE_LOCK_DAYS = 20;

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    // Always scope to session user — ignore any userId query param
    const userId = auth.user!.id;

    const completedCount = await prisma.monthlyClearance.count({
      where: { userId },
    });

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
          completedCount: 0,
          isCompletedService: false,
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
        completedCount,
        isCompletedService: completedCount >= 12,
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
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const { userId } = body;

    // Ownership check — session user must match the userId in the request body
    if (userId && userId !== auth.user!.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Cannot mark clearance for another user" },
        { status: 403 }
      );
    }

    const sessionUserId = auth.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      select: { nyscStatus: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (user.nyscStatus !== "SERVING") {
      return NextResponse.json(
        { success: false, error: "Only serving corps members can mark clearance" },
        { status: 403 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const latestClearance = await tx.monthlyClearance.findFirst({
        where: { userId: sessionUserId },
        orderBy: { completedAt: "desc" },
      });

      const now = new Date();

      if (latestClearance && now < latestClearance.nextEligibleAt) {
        return { eligible: false, nextEligibleAt: latestClearance.nextEligibleAt };
      }

      const nextEligibleAt = new Date(now);
      nextEligibleAt.setDate(nextEligibleAt.getDate() + CLEARANCE_LOCK_DAYS);

      const clearance = await tx.monthlyClearance.create({
        data: { userId: sessionUserId, completedAt: now, nextEligibleAt },
      });

      return { eligible: true, clearance };
    });

    if (!result.eligible) {
      return NextResponse.json(
        {
          success: false,
          error: "CLEARANCE_NOT_YET_AVAILABLE",
          message: `You are not yet eligible. Next clearance window: ${new Date(result.nextEligibleAt!).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`,
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
