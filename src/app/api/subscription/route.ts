import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

// GET /api/subscription?userId=...
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

    // Find or create user subscription (default: early access)
    let subscription = await prisma.userSubscription.findUnique({
      where: { userId },
      include: { plan: true },
    });

    if (!subscription) {
      // Auto-assign the Early Access plan
      const earlyAccessPlan = await prisma.subscriptionPlan.findUnique({
        where: { slug: "early-access" },
      });

      if (earlyAccessPlan) {
        subscription = await prisma.userSubscription.create({
          data: {
            userId,
            planId: earlyAccessPlan.id,
            status: "ACTIVE",
          },
          include: { plan: true },
        });
      }
    }

    // Also get all available plans for the Plans & Pricing page
    const allPlans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        subscription,
        allPlans,
      },
    });
  } catch (error) {
    console.error("[GET /api/subscription] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
