import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { sendEmail } from "@/shared/lib/email";
import PasswordResetEmail from "@/shared/emails/PasswordResetEmail";
import { z } from "zod";
import crypto from "crypto";
import React from "react";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotSchema.parse(body);

    // Always return success to prevent email enumeration attacks
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      // Generate a secure random token
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: tokenHash,
          passwordResetExpiry: expiry,
        },
      });

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/auth/reset-password?token=${rawToken}`;

      await sendEmail({
        to: user.email,
        subject: "Reset your KopaWee password",
        template: React.createElement(PasswordResetEmail, {
          name: user.name,
          resetUrl,
        }),
      });
    }

    // Always return 200 regardless of whether user exists
    return NextResponse.json({
      success: true,
      message: "If an account exists for this email, a reset link has been sent.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[POST /api/auth/forgot-password] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
