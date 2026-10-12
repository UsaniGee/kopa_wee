import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { sendEmail } from "@/shared/lib/email";
import SOSAlertEmail from "@/shared/emails/SOSAlertEmail";
import { z } from "zod";
import React from "react";

const sosSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  // Optional: a phone in distress often can't resolve its LGA; the saved profile is used instead
  state: z.string().trim().max(60).optional(),
  lga: z.string().trim().max(80).optional(),
  message: z.string().trim().max(500).default("EMERGENCY SOS: Corper needs assistance!"),
});

const UNKNOWN_AREA = "Unknown";

/**
 * POST /api/safety/sos — logs an SOS with the device's coordinates and emails the user a copy.
 * Trusted contacts and NYSC officials are not alerted yet (no such feature), and the response says so.
 */
export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const input = sosSchema.parse(await req.json());

    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: { email: true, name: true, deployedState: true, lga: true },
    });

    const state = input.state || user?.deployedState || UNKNOWN_AREA;
    const lga = input.lga || user?.lga || UNKNOWN_AREA;

    const sosAlert = await prisma.sOSAlert.create({
      data: {
        userId: auth.user.id,
        latitude: input.latitude,
        longitude: input.longitude,
        state,
        lga,
        message: input.message,
      },
    });

    // Awaited so the response says exactly what happened (a background send could be cut off)
    const emailed = user
      ? (
          await sendEmail({
            to: user.email,
            subject: "🚨 SOS Alert Received — KopaWee Safety",
            template: React.createElement(SOSAlertEmail, {
              name: user.name,
              location: `${lga}, ${state} (${input.latitude.toFixed(4)}, ${input.longitude.toFixed(4)})`,
              timestamp: new Date().toLocaleString("en-NG"),
              alertId: sosAlert.id,
            }),
          }).catch((err) => {
            console.error("[SOS] Email send failed:", err);
            return { success: false };
          })
        ).success
      : false;

    return NextResponse.json(
      {
        success: true,
        data: sosAlert,
        notified: { emailToYou: emailed, trustedContacts: false, nyscOfficials: false },
        message: `SOS logged with your location${emailed ? " and a copy emailed to you" : ""}. KopaWee cannot alert your contacts or NYSC officials yet. If you are in danger, call 112 now.`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Your location is required to send an SOS. Allow location access and try again." },
        { status: 400 }
      );
    }
    console.error("[POST /api/safety/sos] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log SOS. If you are in danger, call 112 now." },
      { status: 500 }
    );
  }
}
