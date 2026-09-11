import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAdmin } from "@/shared/lib/apiAuth";
import { sendEmail } from "@/shared/lib/email";
import AdminInviteEmail from "@/shared/emails/AdminInviteEmail";
import { z } from "zod";
import crypto from "crypto";
import React from "react";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});

// POST — create invite (admin only)
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const { email, role } = inviteSchema.parse(body);

    // Check no existing user with that email
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "A user with this email already exists." }, { status: 400 });
    }

    // Generate secure token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    // Upsert invite (replace if already invited)
    const invite = await prisma.adminInvite.upsert({
      where: { email: email.toLowerCase() },
      update: { token: rawToken, role, invitedBy: auth.user!.id, expiresAt, usedAt: null },
      create: { email: email.toLowerCase(), token: rawToken, role, invitedBy: auth.user!.id, expiresAt },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const inviteUrl = `${baseUrl}/auth/accept-invite?token=${rawToken}`;

    // Get inviter name
    const inviter = await prisma.user.findUnique({ where: { id: auth.user!.id }, select: { name: true } });

    await sendEmail({
      to: email,
      subject: "You have been invited to KopaWee Admin",
      template: React.createElement(AdminInviteEmail, {
        inviterName: inviter?.name || "KopaWee Admin",
        inviteUrl,
        role,
        expiresIn: "48 hours",
      }),
    });

    // Suppress unused variable warning
    void invite;

    return NextResponse.json({ success: true, inviteUrl, message: `Invite sent to ${email}` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error("[POST /api/admin/invite]", error);
    return NextResponse.json({ success: false, error: "Failed to send invite" }, { status: 500 });
  }
}

// GET — list pending invites
export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const invites = await prisma.adminInvite.findMany({
    where: { usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: invites });
}
