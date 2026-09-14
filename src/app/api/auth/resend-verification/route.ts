import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { sendEmail } from "@/shared/lib/email";
import VerificationEmail from "@/shared/emails/VerificationEmail";
import { z } from "zod";
import React from "react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

// NOTE: In-memory rate limiter — resets on cold starts/serverless restarts.
// For production at scale, replace with a persistent store (e.g., Upstash Redis / KV).
const rateLimitMap = new Map<string, number>();
const COOLDOWN_MS = 60 * 1000; // 60 seconds

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit check
    const lastSent = rateLimitMap.get(normalizedEmail);
    if (lastSent && Date.now() - lastSent < COOLDOWN_MS) {
      const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - lastSent)) / 1000);
      return NextResponse.json(
        { success: false, error: `Please wait ${remaining} seconds before requesting another email.` },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true, isVerified: true, verificationToken: true },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true, message: "If an account exists, a verification email has been sent." });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, error: "This account is already verified. Please sign in." },
        { status: 400 }
      );
    }

    // Generate a cryptographically secure fresh token
    const newToken = `vtok_${crypto.randomUUID().replace(/-/g, '')}_${Date.now()}`;

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: newToken },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/auth/verify?token=${newToken}&email=${encodeURIComponent(user.email)}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your KopaWee email address",
      template: React.createElement(VerificationEmail, {
        name: user.name,
        verificationUrl,
      }),
    });

    // Record send time for rate limiting
    rateLimitMap.set(normalizedEmail, Date.now());

    return NextResponse.json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error("[POST /api/auth/resend-verification]", error);
    return NextResponse.json({ success: false, error: "Failed to send verification email." }, { status: 500 });
  }
}
