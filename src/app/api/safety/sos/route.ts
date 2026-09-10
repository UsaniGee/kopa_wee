import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { z } from "zod";

const sosSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  state: z.string(),
  lga: z.string(),
  message: z.string().default("EMERGENCY SOS: Corper needs assistance!"),
});

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const validatedData = sosSchema.parse(body);

    const sosAlert = await prisma.sOSAlert.create({
      data: {
        ...validatedData,
        userId: auth.user!.id, // Always use session user — never trust client-supplied userId
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: sosAlert,
        message: "EMERGENCY BROADCAST SENT: Safety contacts & local NYSC reps notified.",
      },
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
      { success: false, error: "Failed to trigger SOS alert" },
      { status: 500 }
    );
  }
}
