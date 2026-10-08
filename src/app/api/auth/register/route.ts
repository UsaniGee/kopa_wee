import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { hashPassword } from "@/shared/lib/auth";
import { sendEmail } from "@/shared/lib/email";
import VerificationEmail from "@/shared/emails/VerificationEmail";
import { z } from "zod";
import React from "react";
import { appBaseUrl } from "@/shared/lib/appUrl";
import { newVerificationToken } from "@/shared/lib/verificationToken";

// Sign-up only creates the account. Role and profile are set later through validated
// endpoints (onboarding → PATCH /api/users/me); privileged roles are never self-assigned.
const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase().trim() },
    });

    if (existingUser) {
      // Return different codes depending on verification status
      if (existingUser.isVerified) {
        return NextResponse.json(
          {
            success: false,
            code: "EMAIL_EXISTS_VERIFIED",
            error: "An account with this email already exists. Please sign in.",
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            code: "EMAIL_EXISTS_UNVERIFIED",
            error: "An account with this email exists but hasn't been verified. Please check your inbox or request a new verification email.",
          },
          { status: 400 }
        );
      }
    }

    const passwordHash = await hashPassword(validatedData.password);
    const { token: verificationToken, expiresAt: verificationTokenExpiry } = newVerificationToken();

    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase().trim(),
        passwordHash,
        role: "PCM",
        verificationToken,
        verificationTokenExpiry,
        isVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        deployedState: true,
        lga: true,
        stateCode: true,
        createdAt: true,
      },
    });

    const verificationUrl = `${appBaseUrl()}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(newUser.email)}`;

    const emailResult = await sendEmail({
      to: newUser.email,
      subject: "Verify your KopaWee email address",
      template: React.createElement(VerificationEmail, {
        name: newUser.name,
        verificationUrl,
      }),
    });

    if (!emailResult.success) {
      // The user can still verify via the resend flow. The link (a live token) is logged in development only.
      console.warn(`[register] Email send failed for ${newUser.email}: ${emailResult.error}`);
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[register] Dev verification URL: ${verificationUrl}`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "Registration successful! Please check your email to verify your account.",
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

    // Prisma unique constraint violation — email already registered (race condition)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email already exists. Try signing in instead.",
        },
        { status: 400 }
      );
    }

    console.error("[POST /api/auth/register] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 }
    );
  }
}
