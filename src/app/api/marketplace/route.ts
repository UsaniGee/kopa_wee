import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const itemSchema = z.object({
  sellerId: z.string(),
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
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const category = searchParams.get("category");
    const statusParam = searchParams.get("status");

    const statusFilter = statusParam 
      ? (statusParam as any)
      : { in: ["ACTIVE", "AVAILABLE"] };

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
    const body = await req.json();
    const validatedData = itemSchema.parse(body);

    const newItem = await prisma.marketplaceItem.create({
      data: {
        ...validatedData,
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
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Listing ID and status are required" },
        { status: 400 }
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
