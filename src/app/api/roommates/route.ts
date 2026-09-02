import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const roommateSchema = z.object({
  userId: z.string(),
  state: z.string(),
  lga: z.string(),
  area: z.string().optional(),
  budget: z.string(),
  accommodationType: z.string(),
  moveInDate: z.string().optional(),
  preferences: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const state = searchParams.get("state");
    const lga = searchParams.get("lga");

    if (userId) {
      // Return specific user's active roommate request
      const activeRequest = await prisma.roommateRequest.findFirst({
        where: { userId, status: "ACTIVE" },
      });
      return NextResponse.json({
        success: true,
        data: activeRequest,
      });
    }

    const roommateRequests = await prisma.roommateRequest.findMany({
      where: {
        status: "ACTIVE",
        ...(state && state !== "All States" && { state }),
        ...(lga && lga !== "all" && { lga }),
      },
      include: {
        user: {
          select: { name: true, phone: true, stateCode: true, avatarUrl: true, ppaName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: roommateRequests,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch roommate requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = roommateSchema.parse(body);

    // BACKEND CONSTRAINT ENFORCEMENT: Only ONE active roommate request per user!
    const existingActiveRequest = await prisma.roommateRequest.findFirst({
      where: {
        userId: validatedData.userId,
        status: "ACTIVE",
      },
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
        status: "ACTIVE",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newRequest,
        message: "Roommate request published successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to create roommate request", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id && !userId) {
      return NextResponse.json(
        { success: false, message: "Request ID or User ID is required", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    await prisma.roommateRequest.updateMany({
      where: {
        ...(id ? { id } : userId ? { userId } : {}),
        status: "ACTIVE",
      },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({
      success: true,
      message: "Roommate request cancelled successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to cancel roommate request", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
