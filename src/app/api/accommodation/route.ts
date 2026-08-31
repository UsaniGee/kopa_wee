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

    const listings = await prisma.accommodationListing.findMany({
      where: {
        ...(state && { state }),
        ...(lga && { lga }),
      },
      include: {
        owner: {
          select: { name: true, phone: true, stateCode: true, avatarUrl: true },
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
      data: validatedData,
    });

    return NextResponse.json(
      { success: true, data: newListing, message: "Listing posted successfully" },
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
