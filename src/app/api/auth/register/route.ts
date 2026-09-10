import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { hashPassword } from "@/shared/lib/auth";
import { sendEmail } from "@/shared/lib/email";
import VerificationEmail from "@/shared/emails/VerificationEmail";
import { z } from "zod";
import React from "react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["PCM", "SERVING_CORPER", "CDS_EXEC", "EMPLOYER", "LGA_INSPECTOR", "ALUMNI"]).default("PCM"),
  stateOfOrigin: z.string().optional(),
  deployedState: z.string().optional(),
  lga: z.string().optional(),
  ppaName: z.string().optional(),
  stateCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(validatedData.password);
    const verificationToken = `vtok_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;

    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase().trim(),
        passwordHash,
        role: validatedData.role,
        stateOfOrigin: validatedData.stateOfOrigin,
        deployedState: validatedData.deployedState,
        lga: validatedData.lga,
        ppaName: validatedData.ppaName,
        stateCode: validatedData.stateCode,
        verificationToken,
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

    // Send real verification email via Resend
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(newUser.email)}`;

    await sendEmail({
      to: newUser.email,
      subject: "Verify your KopaWee email address",
      template: React.createElement(VerificationEmail, {
        name: newUser.name,
        verificationUrl,
      }),
    });

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
    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 }
    );
  }
}
