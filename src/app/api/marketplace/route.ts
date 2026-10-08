import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";
import { ListingStatus } from "@prisma/client";
import { requireAdmin, requireAuth } from "@/shared/lib/apiAuth";

const itemSchema = z.object({
  title: z.string().min(3),
  category: z.string(),
  price: z.string(),
  description: z.string(),
  state: z.string(),
  lga: z.string(),
  images: z.array(z.string()).default([]),
});

// Contact details are for signed-in users only; visitors see who is selling, not how to reach them
const PUBLIC_PERSON = { name: true, stateCode: true, avatarUrl: true } as const;
const MEMBER_PERSON = { ...PUBLIC_PERSON, phone: true, email: true } as const;

export async function GET(req: Request) {
  const viewer = (await requireAuth()).user;

  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const category = searchParams.get("category");
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

    const items = await prisma.marketplaceItem.findMany({
      where: {
        status: statusFilter,
        ...(state && { state }),
        ...(category && category !== "All Categories" && { category }),
      },
      include: {
        seller: { select: viewer ? MEMBER_PERSON : PUBLIC_PERSON },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch marketplace items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const validatedData = itemSchema.parse(body);

    const newItem = await prisma.marketplaceItem.create({
      data: {
        ...validatedData,
        sellerId: auth.user.id,
        status: "PENDING_APPROVAL",
      },
    });

    return NextResponse.json(
      { success: true, data: newItem, message: "Item submitted for approval" },
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
      { success: false, error: "Failed to post item" },
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

    const updatedItem = await prisma.marketplaceItem.update({
      where: { id },
      data: { status: parsedStatus.data },
    });

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: `Listing status updated to ${parsedStatus.data}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update item status" },
      { status: 500 }
    );
  }
}
