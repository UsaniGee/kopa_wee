import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { z } from "zod";

const ADMIN_ONLY_STATUSES = ["ACTIVE", "AVAILABLE", "REJECTED"];
const PUBLIC_STATUSES = ["ACTIVE", "AVAILABLE"];

const itemSchema = z.object({
  title: z.string().min(3),
  category: z.string(),
  price: z.string(),
  description: z.string(),
  state: z.string(),
  lga: z.string(),
  images: z.array(z.string()).default([]),
});

export async function GET(req: Request) {
  try {
    // Items include seller phone/email — require a session so the feed
    // can't be scraped for PII by anonymous callers hitting the API directly.
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const category = searchParams.get("category");
    const statusParam = searchParams.get("status");

    // Non-public statuses (PENDING_APPROVAL, REJECTED, etc.) are only visible to admins.
    let statusFilter: any = { in: PUBLIC_STATUSES };
    if (statusParam && PUBLIC_STATUSES.includes(statusParam)) {
      statusFilter = statusParam;
    } else if (statusParam && auth.user!.applicationRole === "ADMIN") {
      statusFilter = statusParam;
    }

    const items = await prisma.marketplaceItem.findMany({
      where: {
        status: statusFilter,
        ...(state && { state }),
        ...(category && category !== "All Categories" && { category }),
      },
      include: {
        seller: {
          select: { name: true, phone: true, stateCode: true, avatarUrl: true, email: true },
        },
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
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const body = await req.json();
    const validatedData = itemSchema.parse(body);

    const newItem = await prisma.marketplaceItem.create({
      data: {
        ...validatedData,
        sellerId: auth.user!.id,
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

    const item = await prisma.marketplaceItem.findUnique({
      where: { id },
      select: { sellerId: true },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    const isAdmin = auth.user!.applicationRole === "ADMIN";
    const isOwner = item.sellerId === auth.user!.id;

    // Approval/rejection is a moderation action — only admins may set these.
    if (ADMIN_ONLY_STATUSES.includes(status) && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin access required for this status change" },
        { status: 403 }
      );
    }

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: "You do not have permission to update this item" },
        { status: 403 }
      );
    }

    const updatedItem = await prisma.marketplaceItem.update({
      where: { id },
      data: { status: status as any },
    });

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: `Listing status updated to ${status}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update item status" },
      { status: 500 }
    );
  }
}
