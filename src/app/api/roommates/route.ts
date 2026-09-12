import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { z } from "zod";

const roommateSchema = z.object({
  state: z.string(),
  lga: z.string(),
  area: z.string().optional(),
  budget: z.string(),
  accommodationType: z.string(),
  moveInDate: z.string().optional(),
  preferences: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(req.url);
    const myRequest = searchParams.get("my") === "true";
    const state = searchParams.get("state");
    const lga = searchParams.get("lga");

    if (myRequest) {
      // Return the session user's active request + interests received
      const activeRequest = await prisma.roommateRequest.findFirst({
        where: { userId: auth.user!.id, status: { in: ["ACTIVE", "MATCHED"] } },
        include: {
          interests: {
            include: {
              interestedUser: {
                select: { id: true, name: true, ppaName: true, deployedState: true, lga: true, avatarUrl: true },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
      return NextResponse.json({ success: true, data: activeRequest });
    }

    // Browse all active requests (exclude own)
    const roommateRequests = await prisma.roommateRequest.findMany({
      where: {
        status: "ACTIVE",
        userId: { not: auth.user!.id }, // don't show own request in browse
        ...(state && state !== "All States" && { state }),
        ...(lga && lga !== "all" && { lga }),
      },
      include: {
        user: {
          select: { name: true, stateCode: true, avatarUrl: true, ppaName: true },
        },
        interests: {
          select: { id: true, interestedUserId: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Annotate each request with current user's interest status
    const annotated = roommateRequests.map((req) => {
      const myInterest = req.interests.find((i) => i.interestedUserId === auth.user!.id);
      return {
        ...req,
        interestCount: req.interests.length,
        myInterestStatus: myInterest?.status || null,
        myInterestId: myInterest?.id || null,
        interests: undefined, // don't leak all interest data to browse view
      };
    });

    return NextResponse.json({ success: true, data: annotated });
  } catch (error) {
    console.error("[GET /api/roommates]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch roommate requests" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const validatedData = roommateSchema.parse(body);

    const existingActiveRequest = await prisma.roommateRequest.findFirst({
      where: { userId: auth.user!.id, status: "ACTIVE" },
    });

    if (existingActiveRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have an active roommate request. Please cancel your existing request before creating a new one.",
          code: "ACTIVE_REQUEST_EXISTS",
        },
        { status: 400 }
      );
    }

    const newRequest = await prisma.roommateRequest.create({
      data: {
        ...validatedData,
        userId: auth.user!.id,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(
      { success: true, data: newRequest, message: "Roommate request published successfully!" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: error.errors[0].message, code: "VALIDATION_ERROR" }, { status: 400 });
    }
    console.error("[POST /api/roommates]", error);
    return NextResponse.json({ success: false, message: "Failed to create roommate request", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.roommateRequest.updateMany({
      where: {
        ...(id ? { id, userId: auth.user!.id } : { userId: auth.user!.id }),
        status: "ACTIVE",
      },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true, message: "Roommate request cancelled successfully" });
  } catch (error) {
    console.error("[DELETE /api/roommates]", error);
    return NextResponse.json({ success: false, message: "Failed to cancel roommate request", code: "INTERNAL_ERROR" }, { status: 500 });
  }
}
