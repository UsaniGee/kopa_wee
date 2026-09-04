import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const DEFAULT_PACKING_ITEMS = [
  { name: "Call-up Letter (3 colored copies)", category: "documents" },
  { name: "Green Card & Statement of Result", category: "documents" },
  { name: "Medical Fitness Certificate", category: "documents" },
  { name: "Birth Certificate or Age Declaration", category: "documents" },
  { name: "Passport Photographs (12 copies)", category: "documents" },
  { name: "White Shorts (3 pairs)", category: "clothing" },
  { name: "Plain White T-Shirts (3)", category: "clothing" },
  { name: "NYSC Jungle Boot (white parade ground)", category: "clothing" },
  { name: "Crocs / Rubber Slippers (hostel use)", category: "clothing" },
  { name: "Vest / Singlet (5 pairs)", category: "clothing" },
  { name: "Towels (2)", category: "clothing" },
  { name: "Toothbrush & Toothpaste", category: "toiletries" },
  { name: "Soap & Body Wash", category: "toiletries" },
  { name: "Deodorant / Roll-on", category: "toiletries" },
  { name: "Shaving Stick / Razor", category: "toiletries" },
  { name: "Power Bank (10,000mAh minimum)", category: "electronics" },
  { name: "Torchlight & Batteries", category: "electronics" },
  { name: "Extension Cable", category: "electronics" },
  { name: "Waist Bag", category: "essentials" },
  { name: "Water Bottle (1.5L)", category: "essentials" },
  { name: "Padlock for locker", category: "essentials" },
  { name: "Mosquito Net / Repellent", category: "essentials" },
  { name: "First Aid Kit", category: "essentials" },
];

// GET /api/packing-items?userId=...
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

    // Check if user has any packing items yet; if not, seed defaults
    const existingCount = await prisma.packingItem.count({ where: { userId } });

    if (existingCount === 0) {
      // Seed default items for this user
      await prisma.packingItem.createMany({
        data: DEFAULT_PACKING_ITEMS.map((item) => ({
          userId,
          name: item.name,
          category: item.category,
          isCustom: false,
          pcmCompleted: false,
          servingTrackingStatus: "INTACT",
        })),
        skipDuplicates: true,
      });
    }

    const items = await prisma.packingItem.findMany({
      where: { userId },
      orderBy: [{ category: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("[GET /api/packing-items] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch packing items" },
      { status: 500 }
    );
  }
}

// POST /api/packing-items — create a custom item
const createItemSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1, "Item name is required").max(200),
  category: z.string().default("custom"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, category } = createItemSchema.parse(body);

    const item = await prisma.packingItem.create({
      data: {
        userId,
        name,
        category,
        isCustom: true,
        pcmCompleted: false,
        servingTrackingStatus: "INTACT",
      },
    });

    return NextResponse.json({
      success: true,
      data: item,
      message: "Custom item added",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[POST /api/packing-items] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create packing item" },
      { status: 500 }
    );
  }
}

// PATCH /api/packing-items — update PCM completed or serving tracking status
const updateItemSchema = z.object({
  itemId: z.string().min(1),
  userId: z.string().min(1),
  pcmCompleted: z.boolean().optional(),
  servingTrackingStatus: z.enum(["INTACT", "USED", "MISSING"]).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, userId, pcmCompleted, servingTrackingStatus } =
      updateItemSchema.parse(body);

    // Verify ownership
    const existing = await prisma.packingItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Item not found or not owned by user" },
        { status: 404 }
      );
    }

    const updated = await prisma.packingItem.update({
      where: { id: itemId },
      data: {
        ...(pcmCompleted !== undefined && { pcmCompleted }),
        ...(servingTrackingStatus !== undefined && { servingTrackingStatus }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[PATCH /api/packing-items] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE /api/packing-items — only custom items can be deleted
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, userId } = z
      .object({ itemId: z.string(), userId: z.string() })
      .parse(body);

    const existing = await prisma.packingItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Item not found or not owned by user" },
        { status: 404 }
      );
    }

    if (!existing.isCustom) {
      return NextResponse.json(
        {
          success: false,
          error: "Standard items cannot be deleted. You can uncheck them instead.",
        },
        { status: 403 }
      );
    }

    await prisma.packingItem.delete({ where: { id: itemId } });

    return NextResponse.json({
      success: true,
      message: "Custom item deleted",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[DELETE /api/packing-items] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
