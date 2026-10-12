import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { LEGACY_ROLE_FOR_STAGE } from "@/shared/lib/statusTransitions";

// Users may only move one stage forward themselves; reversals go through an admin
const ALLOWED_MANUAL_TRANSITIONS: Record<string, string[]> = {
  PCM: ["SERVING"],
  SERVING: ["ALUMNI"],
  ALUMNI: [],
};

const statusTransitionSchema = z.object({
  newStatus: z.enum(["PCM", "SERVING", "ALUMNI"]),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const { newStatus, reason } = statusTransitionSchema.parse(body);
    const userId = auth.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nyscStatus: true, applicationRole: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const currentStatus = user.nyscStatus;

    // Check if this is a valid user-initiated transition
    const allowedNext = ALLOWED_MANUAL_TRANSITIONS[currentStatus] || [];
    if (!allowedNext.includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_STATUS_TRANSITION",
          message: `Cannot transition from ${currentStatus} to ${newStatus}. ${
            currentStatus === newStatus
              ? "You are already in this status."
              : "This transition is not permitted. Contact an administrator if you need help."
          }`,
          currentStatus,
        },
        { status: 400 }
      );
    }

    // Execute transition in a transaction with audit log
    const [updatedUser, historyEntry] = await prisma.$transaction([
      // Matches only if the status is still the one checked above (the nightly job may have moved it)
      prisma.user.update({
        where: { id: userId, nyscStatus: currentStatus },
        data: {
          nyscStatus: newStatus,
          // Keep the legacy role field in sync
          role: LEGACY_ROLE_FOR_STAGE[newStatus],
        },
        select: {
          id: true,
          name: true,
          nyscStatus: true,
          role: true,
        },
      }),
      prisma.userStatusHistory.create({
        data: {
          userId,
          previousStatus: currentStatus,
          newStatus,
          changedBy: userId,
          changeType: "MANUAL",
          reason: reason || `User self-initiated transition from ${currentStatus} to ${newStatus}`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Status updated to ${newStatus} successfully.`,
      data: {
        user: updatedUser,
        historyEntry,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "STATUS_CHANGED", message: "Your status was just updated. Refresh the page to see it." },
        { status: 409 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[POST /api/users/status] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update status" },
      { status: 500 }
    );
  }
}
