import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

// Valid manual transitions (users can only go forward)
const ALLOWED_MANUAL_TRANSITIONS: Record<string, string[]> = {
  PCM: ["SERVING"],
  SERVING: [],   // Users cannot manually transition from SERVING
  ALUMNI: [],    // Users cannot manually transition from ALUMNI
};

const statusTransitionSchema = z.object({
  userId: z.string().min(1),
  newStatus: z.enum(["PCM", "SERVING", "ALUMNI"]),
  reason: z.string().optional(),
});

// POST /api/users/status — user-initiated controlled status transition
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, newStatus, reason } = statusTransitionSchema.parse(body);

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
      prisma.user.update({
        where: { id: userId },
        data: {
          nyscStatus: newStatus as any,
          // Also sync legacy role field
          role: newStatus === "SERVING" ? "SERVING_CORPER" : newStatus === "ALUMNI" ? "ALUMNI" : "PCM",
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
          newStatus: newStatus as any,
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
