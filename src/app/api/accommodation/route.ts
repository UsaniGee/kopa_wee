import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";
import { ListingStatus } from "@prisma/client";
import { requireAdmin, requireAuth } from "@/shared/lib/apiAuth";

const listingSchema = z.object({
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

// Contact details are for signed-in users only; visitors see who is listing, not how to reach them
const PUBLIC_PERSON = { name: true, stateCode: true, avatarUrl: true } as const;
const MEMBER_PERSON = { ...PUBLIC_PERSON, phone: true, email: true } as const;

export async function GET(req: Request) {
  const viewer = (await requireAuth()).user;

  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const lga = searchParams.get("lga");
    const statusParam = searchParams.get("status");

    // Non-public statuses (pending, rejected, ...) expose unmoderated listings — admin only
    let statusFilter: ListingStatus | { in: ListingStatus[] } = {
      in: [ListingStatus.ACTIVE, ListingStatus.AVAILABLE],
    };
    if (statusParam) {
      const parsed = z.nativeEnum(ListingStatus).safeParse(statusParam);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: "Invalid status filter" },
          { status: 400 }
        );
      }
      if (parsed.data !== ListingStatus.ACTIVE && parsed.data !== ListingStatus.AVAILABLE) {
        const auth = await requireAdmin();
        if (auth.error) return auth.error;
      }
      statusFilter = parsed.data;
    }

    const listings = await prisma.accommodationListing.findMany({
      where: {
        status: statusFilter,
        ...(state && { state }),
        ...(lga && { lga }),
      },
      include: {
        owner: { select: viewer ? MEMBER_PERSON : PUBLIC_PERSON },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: viewer ? listings : listings.map((l) => ({ ...l, contactPhone: null })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch accommodation listings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const validatedData = listingSchema.parse(body);

    const newListing = await prisma.accommodationListing.create({
      data: {
        ...validatedData,
        ownerId: auth.user.id,
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

/** Moderation endpoint — approves or rejects a listing. Admin only. */
export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const { id } = body;
    const parsedStatus = z.nativeEnum(ListingStatus).safeParse(body.status);

    if (!id || !parsedStatus.success) {
      return NextResponse.json(
        { success: false, error: "Listing ID and status are required" },
        { status: 400 }
      );
    }

    const updatedListing = await prisma.accommodationListing.update({
      where: { id },
      data: { status: parsedStatus.data },
    });

    return NextResponse.json({
      success: true,
      data: updatedListing,
      message: `Lodge status updated to ${parsedStatus.data}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update lodge listing status" },
      { status: 500 }
    );
  }
}
