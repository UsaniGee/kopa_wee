import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { hashPassword } from "@/shared/lib/auth";
import { z } from "zod";
import crypto from "crypto";

const resetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = resetSchema.parse(body);

    // Hash the raw token to compare against stored hash
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpiry: { gt: new Date() }, // Token must not be expired
      },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token. Please request a new one." },
        { status: 400 }
      );
    }

    const newPasswordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        passwordResetToken: null,
        passwordResetExpiry: null,
        isVerified: true, // Mark verified if they successfully received the email
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successful. You can now sign in with your new password.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[POST /api/auth/reset-password] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
