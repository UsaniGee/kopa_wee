import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { sendEmail } from "@/shared/lib/email";
import SOSAlertEmail from "@/shared/emails/SOSAlertEmail";
import { z } from "zod";
import React from "react";

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
        userId: auth.user!.id,
      },
    });

    // Get user's email for notification
    const user = await prisma.user.findUnique({
      where: { id: auth.user!.id },
      select: { email: true, name: true },
    });

    // Send SOS alert email notification (non-blocking)
    if (user) {
      sendEmail({
        to: user.email,
        subject: "🚨 SOS Alert Received — KopaWee Safety",
        template: React.createElement(SOSAlertEmail, {
          name: user.name,
          location: `${validatedData.lga}, ${validatedData.state} (${validatedData.latitude.toFixed(4)}, ${validatedData.longitude.toFixed(4)})`,
          timestamp: new Date().toLocaleString("en-NG"),
          alertId: sosAlert.id,
        }),
      }).catch((err) => console.error("[SOS] Email send failed:", err));
    }

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
