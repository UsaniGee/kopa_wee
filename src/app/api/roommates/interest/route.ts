import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { z } from "zod";
import { CONTACT_SELECT, contactIfAccepted } from "@/shared/lib/roommateContact";

// POST /api/roommates/interest — express interest in a roommate request
export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const { requestId, message } = z
      .object({
        requestId: z.string().min(1),
        message: z.string().max(300).optional(),
      })
      .parse(body);

    // Load the request
    const roommateRequest = await prisma.roommateRequest.findUnique({
      where: { id: requestId },
      select: { id: true, userId: true, status: true },
    });

    if (!roommateRequest) {
      return NextResponse.json({ success: false, error: "Roommate request not found." }, { status: 404 });
    }

    if (roommateRequest.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "This roommate request is no longer active." },
        { status: 400 }
      );
    }

    // Cannot express interest in your own request
    if (roommateRequest.userId === auth.user!.id) {
      return NextResponse.json(
        { success: false, error: "You cannot express interest in your own roommate request." },
        { status: 400 }
      );
    }

    // Check for duplicate interest
    const existing = await prisma.roommateInterest.findUnique({
      where: {
        requestId_interestedUserId: {
          requestId,
          interestedUserId: auth.user!.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "You have already expressed interest in this request." },
        { status: 409 }
      );
    }

    // Create interest record
    const interest = await prisma.roommateInterest.create({
      data: {
        requestId,
        interestedUserId: auth.user!.id,
        message: message || null,
        status: "PENDING",
      },
      include: {
        interestedUser: { select: { name: true } },
      },
    });

    // Notify the request owner
    const interestedUser = await prisma.user.findUnique({
      where: { id: auth.user!.id },
      select: { name: true, ppaName: true },
    });

    await prisma.notification.create({
      data: {
        userId: roommateRequest.userId,
        title: "Someone is interested in rooming with you!",
        message: `${interestedUser?.name || "A corps member"} (${interestedUser?.ppaName || "KopaWee user"}) has expressed interest in your roommate request.${message ? ` They said: "${message}"` : ""} Open the Accommodation tab to accept or decline.`,
      },
    });

    return NextResponse.json({
      success: true,
      data: interest,
      message: "Interest expressed! The request owner will be notified.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error("[POST /api/roommates/interest]", error);
    return NextResponse.json({ success: false, error: "Failed to express interest" }, { status: 500 });
  }
}

// PATCH /api/roommates/interest — accept or decline interest (request owner only)
export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const { interestId, action } = z
      .object({
        interestId: z.string().min(1),
        action: z.enum(["ACCEPT", "DECLINE"]),
      })
      .parse(body);

    // Load the interest with its request
    const interest = await prisma.roommateInterest.findUnique({
      where: { id: interestId },
      include: {
        request: { select: { id: true, userId: true, status: true } },
        interestedUser: { select: { id: true, name: true, ppaName: true } },
      },
    });

    if (!interest) {
      return NextResponse.json({ success: false, error: "Interest record not found." }, { status: 404 });
    }

    // Only the request owner can accept or decline
    if (interest.request.userId !== auth.user!.id) {
      return NextResponse.json(
        { success: false, error: "Only the request owner can accept or decline interest." },
        { status: 403 }
      );
    }

    if (interest.request.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "This roommate request is no longer active." },
        { status: 409 }
      );
    }

    if (interest.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "This interest has already been responded to." },
        { status: 409 }
      );
    }

    const owner = await prisma.user.findUnique({
      where: { id: auth.user!.id },
      select: { name: true, ppaName: true },
    });

    if (action === "ACCEPT") {
      // Accept: mark interest as ACCEPTED, mark request as MATCHED, close the other pending interests
      await prisma.$transaction([
        prisma.roommateInterest.update({
          where: { id: interestId },
          data: { status: "ACCEPTED" },
        }),
        prisma.roommateRequest.update({
          where: { id: interest.request.id },
          data: { status: "MATCHED" },
        }),
        prisma.roommateInterest.updateMany({
          where: { requestId: interest.request.id, status: "PENDING", NOT: { id: interestId } },
          data: { status: "DECLINED" },
        }),
        // Notify the interested user
        prisma.notification.create({
          data: {
            userId: interest.interestedUser.id,
            title: "🎉 Roommate request accepted!",
            message: `${owner?.name || "A corps member"} has accepted your roommate interest. Their phone number and email are now shown under "My interests" in the Accommodation tab.`,
          },
        }),
        // Notify the request owner
        prisma.notification.create({
          data: {
            userId: auth.user!.id,
            title: "Roommate match confirmed!",
            message: `You accepted ${interest.interestedUser.name}'s roommate request. Their phone number and email are now shown on your request in the Accommodation tab.`,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        action: "ACCEPTED",
        message: `You matched with ${interest.interestedUser.name}! Both of you have been notified.`,
      });
    } else {
      // Decline
      await prisma.roommateInterest.update({
        where: { id: interestId },
        data: { status: "DECLINED" },
      });

      return NextResponse.json({
        success: true,
        action: "DECLINED",
        message: "Interest declined.",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0].message }, { status: 400 });
    }
    console.error("[PATCH /api/roommates/interest]", error);
    return NextResponse.json({ success: false, error: "Failed to update interest" }, { status: 500 });
  }
}

// GET /api/roommates/interest?requestId=... — interests received on a request (owner only)
// GET /api/roommates/interest?mine=true    — interests the user has expressed, with the owner's contact once accepted
export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");

    if (searchParams.get("mine") === "true") {
      const mine = await prisma.roommateInterest.findMany({
        where: { interestedUserId: auth.user!.id },
        include: {
          request: {
            select: {
              id: true, state: true, lga: true, area: true, budget: true, accommodationType: true, status: true,
              user: { select: { name: true, avatarUrl: true, ...CONTACT_SELECT } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({
        success: true,
        data: mine.map((i) => ({ ...i, request: { ...i.request, user: contactIfAccepted(i.status, i.request.user) } })),
      });
    }

    if (!requestId) {
      return NextResponse.json({ success: false, error: "requestId is required" }, { status: 400 });
    }

    // Verify the requester owns this request
    const roommateRequest = await prisma.roommateRequest.findUnique({
      where: { id: requestId },
      select: { userId: true },
    });

    if (!roommateRequest) {
      return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
    }

    if (roommateRequest.userId !== auth.user!.id) {
      return NextResponse.json(
        { success: false, error: "You can only view interests for your own requests." },
        { status: 403 }
      );
    }

    const interests = await prisma.roommateInterest.findMany({
      where: { requestId },
      include: {
        interestedUser: {
          select: {
            id: true,
            name: true,
            ppaName: true,
            deployedState: true,
            lga: true,
            avatarUrl: true,
            ...CONTACT_SELECT,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: interests.map((i) => ({ ...i, interestedUser: contactIfAccepted(i.status, i.interestedUser) })),
    });
  } catch (error) {
    console.error("[GET /api/roommates/interest]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch interests" }, { status: 500 });
  }
}
