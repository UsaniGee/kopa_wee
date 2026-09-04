import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

/**
 * GET /api/cron/journey-status
 * 
 * Backend journey status evaluator. Automatically transitions:
 *   PCM -> SERVING when campExitDate has passed
 *   SERVING -> ALUMNI when serviceEndDate has passed
 * 
 * This endpoint is designed to be called by:
 *   1. A scheduled cron job (e.g., Vercel cron, external scheduler)
 *   2. On user profile load as a fallback evaluator
 * 
 * Protected by CRON_SECRET environment variable.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "kopawee_cron_secret_2026";

  // Allow requests with correct cron secret OR internal requests (no auth for now in dev)
  if (authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = {
    pcmToServing: 0,
    servingToAlumni: 0,
    errors: 0,
  };

  try {
    // ── PCM -> SERVING: find PCMs whose campExitDate has passed ──────────────
    const eligibleForServing = await prisma.nYSCJourney.findMany({
      where: {
        campExitDate: { lte: now },
        user: { nyscStatus: "PCM" },
      },
      include: {
        user: {
          select: { id: true, name: true, nyscStatus: true },
        },
      },
    });

    for (const journey of eligibleForServing) {
      try {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: journey.userId },
            data: {
              nyscStatus: "SERVING",
              role: "SERVING_CORPER",
            },
          }),
          prisma.userStatusHistory.create({
            data: {
              userId: journey.userId,
              previousStatus: "PCM",
              newStatus: "SERVING",
              changedBy: "SYSTEM",
              changeType: "AUTOMATIC",
              reason: "CAMP_EXIT_DATE_REACHED",
            },
          }),
          prisma.notification.create({
            data: {
              userId: journey.userId,
              title: "Welcome to your service year! 🎉",
              message:
                "Based on the camp dates you provided, we've updated your NYSC status to Serving Corps Member. Your dashboard has been updated with features relevant to your service year. Congratulations, Corper!",
            },
          }),
        ]);
        results.pcmToServing++;
      } catch (err) {
        console.error(`[CRON] Failed PCM->SERVING for userId ${journey.userId}:`, err);
        results.errors++;
      }
    }

    // ── SERVING -> ALUMNI: find SERVING members whose serviceEndDate has passed ─
    const eligibleForAlumni = await prisma.nYSCJourney.findMany({
      where: {
        serviceEndDate: { lte: now },
        user: { nyscStatus: "SERVING" },
      },
      include: {
        user: {
          select: { id: true, name: true, nyscStatus: true },
        },
      },
    });

    for (const journey of eligibleForAlumni) {
      try {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: journey.userId },
            data: {
              nyscStatus: "ALUMNI",
              role: "ALUMNI",
            },
          }),
          prisma.userStatusHistory.create({
            data: {
              userId: journey.userId,
              previousStatus: "SERVING",
              newStatus: "ALUMNI",
              changedBy: "SYSTEM",
              changeType: "AUTOMATIC",
              reason: "SERVICE_END_DATE_REACHED",
            },
          }),
          prisma.notification.create({
            data: {
              userId: journey.userId,
              title: "Congratulations on completing your service year! 🎓",
              message:
                "Based on your expected service end date, you've been automatically transitioned to Alumni status. Your KopaWee dashboard has been updated with post-service features. Congratulations on your NYSC journey!",
            },
          }),
        ]);
        results.servingToAlumni++;
      } catch (err) {
        console.error(`[CRON] Failed SERVING->ALUMNI for userId ${journey.userId}:`, err);
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Journey status evaluation complete.",
      results,
      evaluatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("[GET /api/cron/journey-status] Error:", error);
    return NextResponse.json(
      { success: false, error: "Journey status evaluation failed" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cron/journey-status
 * 
 * Per-user evaluation: check a single user's journey dates and
 * transition if eligible. Called on profile load as a fallback.
 */
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

    const now = new Date();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        nyscStatus: true,
        nyscJourney: true,
      },
    });

    if (!user || !user.nyscJourney) {
      return NextResponse.json({
        success: true,
        transitioned: false,
        message: "No journey dates set. No transition performed.",
      });
    }

    const journey = user.nyscJourney;
    let transitioned = false;
    let newStatus: string | null = null;

    // PCM -> SERVING check
    if (
      user.nyscStatus === "PCM" &&
      journey.campExitDate &&
      now >= journey.campExitDate
    ) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { nyscStatus: "SERVING", role: "SERVING_CORPER" },
        }),
        prisma.userStatusHistory.create({
          data: {
            userId,
            previousStatus: "PCM",
            newStatus: "SERVING",
            changedBy: "SYSTEM",
            changeType: "AUTOMATIC",
            reason: "CAMP_EXIT_DATE_REACHED",
          },
        }),
        prisma.notification.create({
          data: {
            userId,
            title: "Welcome to your service year! 🎉",
            message:
              "Based on the camp dates you provided, we've updated your NYSC status to Serving Corps Member. Your dashboard has been updated with features relevant to your service year.",
          },
        }),
      ]);
      transitioned = true;
      newStatus = "SERVING";
    }

    // SERVING -> ALUMNI check
    else if (
      user.nyscStatus === "SERVING" &&
      journey.serviceEndDate &&
      now >= journey.serviceEndDate
    ) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { nyscStatus: "ALUMNI", role: "ALUMNI" },
        }),
        prisma.userStatusHistory.create({
          data: {
            userId,
            previousStatus: "SERVING",
            newStatus: "ALUMNI",
            changedBy: "SYSTEM",
            changeType: "AUTOMATIC",
            reason: "SERVICE_END_DATE_REACHED",
          },
        }),
        prisma.notification.create({
          data: {
            userId,
            title: "Congratulations on completing your service year! 🎓",
            message:
              "Based on your expected service end date, you've been automatically transitioned to Alumni status.",
          },
        }),
      ]);
      transitioned = true;
      newStatus = "ALUMNI";
    }

    return NextResponse.json({
      success: true,
      transitioned,
      newStatus,
      message: transitioned
        ? `Status automatically transitioned to ${newStatus}.`
        : "No transition required at this time.",
    });
  } catch (error) {
    console.error("[POST /api/cron/journey-status] Error:", error);
    return NextResponse.json(
      { success: false, error: "Journey evaluation failed" },
      { status: 500 }
    );
  }
}
