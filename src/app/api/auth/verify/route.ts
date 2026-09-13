import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    // Token is required — reject email-only requests (security: prevents bypass)
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Verification token is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification link. Please request a new one." },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Email is already verified. You can sign in.",
        data: { id: user.id, email: user.email, name: user.name },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });

    return NextResponse.json({
      success: true,
      message: "Email address verified successfully!",
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("[GET /api/auth/verify]", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify email link." },
      { status: 500 }
    );
  }
}
