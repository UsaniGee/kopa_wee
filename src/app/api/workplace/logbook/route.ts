import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const logbookSchema = z.object({
  userId: z.string(),
  date: z.string(),
  summary: z.string().min(5),
  hoursWorked: z.number().default(8),
  employerId: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId parameter required" },
        { status: 400 }
      );
    }

    const entries = await prisma.pPALogbookEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch logbook entries" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = logbookSchema.parse(body);

    const newEntry = await prisma.pPALogbookEntry.create({
      data: validatedData,
    });

    return NextResponse.json(
      { success: true, data: newEntry, message: "Logbook entry logged" },
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
      { success: false, error: "Failed to save logbook entry" },
      { status: 500 }
    );
  }
}
