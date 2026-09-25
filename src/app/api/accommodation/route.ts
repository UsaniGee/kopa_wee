import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { z } from "zod";

const ADMIN_ONLY_STATUSES = ["ACTIVE", "AVAILABLE", "REJECTED"];

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

const PUBLIC_STATUSES = ["ACTIVE", "AVAILABLE"];

export async function GET(req: Request) {
  try {
    // Listings include owner phone/email — require a session so the feed
    // can't be scraped for PII by anonymous callers hitting the API directly.
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const lga = searchParams.get("lga");
    const statusParam = searchParams.get("status");

    // Non-public statuses (PENDING_APPROVAL, REJECTED, etc.) are only visible to admins.
    let statusFilter: any = { in: PUBLIC_STATUSES };
    if (statusParam && PUBLIC_STATUSES.includes(statusParam)) {
      statusFilter = statusParam;
    } else if (statusParam && auth.user!.applicationRole === "ADMIN") {
      statusFilter = statusParam;
    }

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
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.json();
    const validatedData = listingSchema.parse(body);

    const newListing = await prisma.accommodationListing.create({
      data: {
        ...validatedData,
        ownerId: auth.user!.id,
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
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Listing ID and status are required" },
        { status: 400 }
      );
    }

    const listing = await prisma.accommodationListing.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    const isAdmin = auth.user!.applicationRole === "ADMIN";
    const isOwner = listing.ownerId === auth.user!.id;

    // Approval/rejection is a moderation action — only admins may set these.
    if (ADMIN_ONLY_STATUSES.includes(status) && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin access required for this status change" },
        { status: 403 }
      );
    }

    // Non-moderation transitions (e.g. marking as SOLD/RESERVED) are
    // limited to the listing's owner or an admin.
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: "You do not have permission to update this listing" },
        { status: 403 }
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
