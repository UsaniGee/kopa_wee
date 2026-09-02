import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token && !email) {
      return NextResponse.json(
        { success: false, error: "Verification token or email required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(token ? [{ verificationToken: token }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid verification link or user not found" },
        { status: 404 }
      );
    }

    // Mark user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
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
    return NextResponse.json(
      { success: false, error: "Failed to verify email link" },
      { status: 500 }
    );
  }
}
