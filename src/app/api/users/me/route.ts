import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/apiAuth";
import { LEGACY_ROLE_FOR_STAGE } from "@/shared/lib/statusTransitions";

const PROFILE_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  applicationRole: true,
  nyscStatus: true,
  stateOfOrigin: true,
  deployedState: true,
  lga: true,
  ppaName: true,
  stateCode: true,
  callUpNo: true,
  avatarUrl: true,
  isVerified: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id }, // Scoped to session user only
      select: {
        ...PROFILE_SELECT,
        nyscJourney: { select: { institution: true, courseOfStudy: true, batch: true, stream: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { nyscJourney, ...profile } = user;
    // Onboarding asks for both; sign-in sends users without them back to /onboarding
    const onboardingComplete = Boolean(profile.phone && nyscJourney?.institution);

    return NextResponse.json({ success: true, data: { ...profile, journey: nyscJourney, onboardingComplete } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch user profile" }, { status: 500 });
  }
}

// "" clears a field (null); omitted keeps it unchanged (undefined)
const clearable = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? null : v), schema.nullable()).optional();

/** Accepts 0803…, 234803… or +234803… (spaces/dashes allowed); stores +234XXXXXXXXXX. */
const nigerianPhone = z
  .string()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .transform((v) => (v.startsWith("0") ? `+234${v.slice(1)}` : v.startsWith("234") ? `+${v}` : v))
  .refine((v) => /^\+234[789][01]\d{8}$/.test(v), "Enter a valid Nigerian phone number");

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100).optional(),
  phone: clearable(nigerianPhone),
  nyscStatus: z.enum(["PCM", "SERVING", "ALUMNI"]).optional(),
  stateOfOrigin: clearable(z.string().trim().max(60)),
  deployedState: clearable(z.string().trim().max(60)),
  lga: clearable(z.string().trim().max(80)),
  ppaName: clearable(z.string().trim().max(120)),
  // e.g. LA/26A/1234: state abbreviation / year + batch / serial
  stateCode: clearable(
    z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{2}\/\d{2}[A-C]\/\d{4,5}$/, "State code should look like LA/26A/1234")
  ),
  // e.g. NYSC/UNN/2026/123456
  callUpNo: clearable(
    z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^NYSC\/[A-Z]{2,6}\/\d{4}\/\d{4,7}$/, "Call-up number should look like NYSC/UNN/2026/123456")
  ),
  institution: clearable(z.string().trim().max(150)),
  courseOfStudy: clearable(z.string().trim().max(120)),
  batch: clearable(z.string().trim().max(40)),
  stream: clearable(z.string().trim().max(40)),
});

const badRequest = (error: string) => NextResponse.json({ success: false, error }, { status: 400 });

/**
 * PATCH /api/users/me — the single profile-save endpoint (onboarding and settings).
 * Always updates the session user; states/LGAs are checked against the seeded tables.
 * NYSC status can be self-declared once (no history yet); later changes use /api/users/status.
 */
export async function PATCH(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = auth.user.id;

  let input: z.infer<typeof profileSchema>;
  try {
    input = profileSchema.parse(await req.json());
  } catch (error) {
    return badRequest(error instanceof z.ZodError ? error.errors[0].message : "Invalid request body");
  }

  try {
    const current = await prisma.user.findUnique({
      where: { id: userId },
      select: { deployedState: true, nyscStatus: true },
    });
    if (!current) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const stateIds: Record<string, string> = {};
    for (const field of ["stateOfOrigin", "deployedState"] as const) {
      const name = input[field];
      if (!name) continue;
      const state = await prisma.state.findUnique({ where: { name }, select: { id: true } });
      if (!state) return badRequest(`Unknown state: ${name}`);
      stateIds[field] = state.id;
    }

    if (input.lga) {
      const stateName = input.deployedState === undefined ? current.deployedState : input.deployedState;
      if (!stateName) return badRequest("Choose your deployed state before your LGA");
      const stateId =
        stateIds.deployedState ??
        (await prisma.state.findUnique({ where: { name: stateName }, select: { id: true } }))?.id;
      const lga = stateId
        ? await prisma.lGA.findUnique({ where: { stateId_name: { stateId, name: input.lga } }, select: { id: true } })
        : null;
      if (!lga) return badRequest(`${input.lga} is not an LGA in ${stateName}`);
    }

    if (input.stateCode) {
      const owner = await prisma.user.findFirst({
        where: { stateCode: input.stateCode, NOT: { id: userId } },
        select: { id: true },
      });
      if (owner) {
        return NextResponse.json(
          { success: false, error: "STATE_CODE_TAKEN", message: "That state code is already linked to another account." },
          { status: 409 }
        );
      }
    }

    const statusChanged = input.nyscStatus !== undefined && input.nyscStatus !== current.nyscStatus;
    if (statusChanged && (await prisma.userStatusHistory.count({ where: { userId } })) > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "STATUS_ALREADY_SET",
          message: "Your NYSC status is already set. Use the status update on your dashboard to change it.",
        },
        { status: 409 }
      );
    }

    const { institution, courseOfStudy, batch, stream, nyscStatus, ...userFields } = input;
    const journeyFields = Object.fromEntries(
      Object.entries({ institution, courseOfStudy, batch, stream }).filter(([, v]) => v !== undefined)
    );

    const user = await prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: userId },
        data: {
          ...userFields,
          ...(statusChanged && nyscStatus ? { nyscStatus, role: LEGACY_ROLE_FOR_STAGE[nyscStatus] } : {}),
        },
        select: PROFILE_SELECT,
      });

      if (Object.keys(journeyFields).length > 0) {
        await tx.nYSCJourney.upsert({
          where: { userId },
          update: journeyFields,
          create: { userId, ...journeyFields },
        });
      }

      if (statusChanged && nyscStatus) {
        await tx.userStatusHistory.create({
          data: {
            userId,
            previousStatus: current.nyscStatus,
            newStatus: nyscStatus,
            changedBy: userId,
            changeType: "MANUAL",
            reason: "ONBOARDING_SELF_DECLARED",
          },
        });
      }

      return updated;
    });

    return NextResponse.json({ success: true, data: user, statusChanged });
  } catch (error) {
    // Two users claiming the same state code at once: the unique index decides
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "STATE_CODE_TAKEN", message: "That state code is already linked to another account." },
        { status: 409 }
      );
    }
    console.error("[PATCH /api/users/me] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to save profile" }, { status: 500 });
  }
}
