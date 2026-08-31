import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const sosSchema = z.object({
  userId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  state: z.string(),
  lga: z.string(),
  message: z.string().default("EMERGENCY SOS: Corper needs assistance!"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = sosSchema.parse(body);

    const sosAlert = await prisma.sOSAlert.create({
      data: validatedData,
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
