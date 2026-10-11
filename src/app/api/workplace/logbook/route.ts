import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";
import { requireAuth } from "@/shared/lib/apiAuth";

// employerId is not accepted from the client: it would let anyone link an entry to any user
const logbookSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  summary: z.string().trim().min(5, "Describe what you did (at least 5 characters)").max(1000),
  hoursWorked: z.number().int("Hours must be a whole number").min(1).max(24),
});

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const entries = await prisma.pPALogbookEntry.findMany({
      where: { userId: auth.user.id },
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
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const validatedData = logbookSchema.parse(body);

    const existing = await prisma.pPALogbookEntry.findFirst({
      where: { userId: auth.user.id, date: validatedData.date },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "ALREADY_LOGGED", message: "You have already logged this day." },
        { status: 409 }
      );
    }

    const newEntry = await prisma.pPALogbookEntry.create({
      data: { userId: auth.user.id, ...validatedData },
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
