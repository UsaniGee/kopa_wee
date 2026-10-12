import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { applyAutomaticTransition, dueAutomaticTransition } from "@/shared/lib/statusTransitions";

/**
 * GET /api/cron/journey-status
 *
 * Scheduled evaluator (vercel.json `crons`). Moves every user whose saved dates have passed:
 *   PCM -> SERVING when campExitDate has passed
 *   SERVING -> ALUMNI when serviceEndDate has passed
 *
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET` automatically when CRON_SECRET is set.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn("[CRON] CRON_SECRET not set — rejecting cron request");
    return NextResponse.json({ success: false, error: "Cron not configured" }, { status: 503 });
  }

  if (req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results = { pcmToServing: 0, servingToAlumni: 0, errors: 0 };

  try {
    const eligibleForServing = await prisma.nYSCJourney.findMany({
      where: { campExitDate: { lte: now }, user: { nyscStatus: "PCM" } },
      select: { userId: true },
    });

    for (const { userId } of eligibleForServing) {
      try {
        if (await applyAutomaticTransition(userId, "PCM", "SERVING", "CAMP_EXIT_DATE_REACHED")) results.pcmToServing++;
      } catch (err) {
        console.error(`[CRON] Failed PCM->SERVING for userId ${userId}:`, err);
        results.errors++;
      }
    }

    const eligibleForAlumni = await prisma.nYSCJourney.findMany({
      where: { serviceEndDate: { lte: now }, user: { nyscStatus: "SERVING" } },
      select: { userId: true },
    });

    for (const { userId } of eligibleForAlumni) {
      try {
        if (await applyAutomaticTransition(userId, "SERVING", "ALUMNI", "SERVICE_END_DATE_REACHED")) results.servingToAlumni++;
      } catch (err) {
        console.error(`[CRON] Failed SERVING->ALUMNI for userId ${userId}:`, err);
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
 * Self-evaluation for the signed-in user, e.g. right after they save their journey dates,
 * so they don't wait for the next scheduled run. Never acts on another user.
 */
export async function POST() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const userId = auth.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nyscStatus: true, nyscJourney: true },
    });

    const due = user ? dueAutomaticTransition(user.nyscStatus, user.nyscJourney, new Date()) : null;

    if (!user || !due) {
      return NextResponse.json({
        success: true,
        transitioned: false,
        newStatus: null,
        message: "No transition required at this time.",
      });
    }

    if (!(await applyAutomaticTransition(userId, user.nyscStatus, due.to, due.reason))) {
      return NextResponse.json({ success: true, transitioned: false, newStatus: null, message: "Your status was already updated." });
    }

    return NextResponse.json({
      success: true,
      transitioned: true,
      newStatus: due.to,
      message: `Status automatically transitioned to ${due.to}.`,
    });
  } catch (error) {
    console.error("[POST /api/cron/journey-status] Error:", error);
    return NextResponse.json(
      { success: false, error: "Journey evaluation failed" },
      { status: 500 }
    );
  }
}
