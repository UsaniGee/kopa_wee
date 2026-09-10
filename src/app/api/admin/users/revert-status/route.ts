import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAdmin } from "@/shared/lib/apiAuth";
import { z } from "zod";

const revertSchema = z.object({
  targetUserId: z.string().min(1, "Target user ID required"),
  newStatus: z.enum(["PCM", "SERVING", "ALUMNI"]),
  reason: z.string().min(1, "A reason is required for status reversals"),
});

// POST /api/admin/users/revert-status
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const { targetUserId, newStatus, reason } = revertSchema.parse(body);
    const adminUserId = auth.user!.id;

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { nyscStatus: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Target user not found" },
        { status: 404 }
      );
    }

    if (targetUser.nyscStatus === newStatus) {
      return NextResponse.json(
        {
          success: false,
          error: `User is already in ${newStatus} status. No change needed.`,
        },
        { status: 409 }
      );
    }

    const previousStatus = targetUser.nyscStatus;

    // Execute admin reversal in a transaction
    const [updatedUser, historyEntry] = await prisma.$transaction([
      prisma.user.update({
        where: { id: targetUserId },
        data: {
          nyscStatus: newStatus as any,
          role:
            newStatus === "SERVING"
              ? "SERVING_CORPER"
              : newStatus === "ALUMNI"
              ? "ALUMNI"
              : "PCM",
        },
        select: { id: true, name: true, nyscStatus: true, role: true },
      }),
      prisma.userStatusHistory.create({
        data: {
          userId: targetUserId,
          previousStatus: previousStatus,
          newStatus: newStatus as any,
          changedBy: adminUserId,
          changeType: "ADMIN_REVERSAL",
          reason,
        },
      }),
    ]);

    // Send notification to user about admin correction
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        title: "Your NYSC status has been updated by an administrator",
        message: `Your NYSC status has been updated from ${previousStatus} to ${newStatus} by an administrator. Reason: ${reason}. Contact support if you believe this is an error.`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${updatedUser.name}'s status has been updated from ${previousStatus} to ${newStatus}.`,
      data: { user: updatedUser, historyEntry },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[POST /api/admin/users/revert-status] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to revert user status" },
      { status: 500 }
    );
  }
}
