import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { hashPassword } from "@/shared/lib/auth";
import { z } from "zod";

const acceptSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(2),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, name, password } = acceptSchema.parse(body);

    const invite = await prisma.adminInvite.findUnique({ where: { token } });

    if (!invite) {
      return NextResponse.json({ success: false, error: "Invalid invite token." }, { status: 400 });
    }
    if (invite.usedAt) {
      return NextResponse.json({ success: false, error: "This invite has already been used." }, { status: 400 });
    }
    if (new Date() > invite.expiresAt) {
      return NextResponse.json({ success: false, error: "This invite has expired. Please request a new one." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: invite.email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.create({
        data: {
          name,
          email: invite.email,
          passwordHash,
          role: "PCM",
          applicationRole: invite.role,
          nyscStatus: "PCM",
          isVerified: true,
        },
      }),
      prisma.adminInvite.update({
        where: { token },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Account created successfully. You can now sign in." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error("[POST /api/admin/accept-invite]", error);
    return NextResponse.json({ success: false, error: "Failed to create account" }, { status: 500 });
  }
}
