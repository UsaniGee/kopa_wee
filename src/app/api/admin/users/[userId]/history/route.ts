import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAdmin } from "@/shared/lib/apiAuth";

// GET /api/admin/users/[userId]/history
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { userId } = await params;


    const [user, statusHistory] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          nyscStatus: true,
          applicationRole: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.userStatusHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user, statusHistory },
    });
  } catch (error) {
    console.error("[GET /api/admin/users/[userId]/history] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user history" },
      { status: 500 }
    );
  }
}
