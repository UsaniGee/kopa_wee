import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const listingSchema = z.object({
  ownerId: z.string(),
  title: z.string().min(3),
  description: z.string(),
  location: z.string(),
  state: z.string(),
  lga: z.string(),
  price: z.string(),
  splitInfo: z.string().optional(),
  contactPhone: z.string(),
  images: z.array(z.string()).default([]),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const lga = searchParams.get("lga");
    const statusParam = searchParams.get("status");

    const statusFilter = statusParam 
      ? (statusParam as any)
      : { in: ["ACTIVE", "AVAILABLE"] };

    const listings = await prisma.accommodationListing.findMany({
      where: {
        status: statusFilter,
        ...(state && { state }),
        ...(lga && { lga }),
      },
      include: {
        owner: {
          select: { name: true, phone: true, stateCode: true, avatarUrl: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: listings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch accommodation listings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = listingSchema.parse(body);

    const newListing = await prisma.accommodationListing.create({
      data: {
        ...validatedData,
        status: "PENDING_APPROVAL",
      },
    });

    return NextResponse.json(
      { success: true, data: newListing, message: "Lodge listing submitted for approval" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to post accommodation listing" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Listing ID and status are required" },
        { status: 400 }
      );
    }

    const updatedListing = await prisma.accommodationListing.update({
      where: { id },
      data: { status: status as any },
    });

    return NextResponse.json({
      success: true,
      data: updatedListing,
      message: `Lodge status updated to ${status}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update lodge listing status" },
      { status: 500 }
    );
  }
}
