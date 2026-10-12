import { Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

export type NyscStage = "PCM" | "SERVING" | "ALUMNI";

/** The legacy `User.role` value kept in sync with each NYSC stage. */
export const LEGACY_ROLE_FOR_STAGE = {
  PCM: "PCM",
  SERVING: "SERVING_CORPER",
  ALUMNI: "ALUMNI",
} as const;

type AutomaticReason = "CAMP_EXIT_DATE_REACHED" | "SERVICE_END_DATE_REACHED";

const NOTIFICATIONS: Record<AutomaticReason, { title: string; message: string }> = {
  CAMP_EXIT_DATE_REACHED: {
    title: "Welcome to your service year! 🎉",
    message:
      "Based on the camp dates you provided, we've updated your NYSC status to Serving Corps Member. Your dashboard now shows features for your service year.",
  },
  SERVICE_END_DATE_REACHED: {
    title: "Congratulations on completing your service year! 🎓",
    message:
      "Based on your service end date, your status is now Alumni. Your dashboard now shows post-service features.",
  },
};

/**
 * Decides whether a user's saved journey dates call for an automatic stage change.
 * Only one step is taken per evaluation (PCM→SERVING or SERVING→ALUMNI).
 */
export function dueAutomaticTransition(
  stage: string,
  journey: { campExitDate: Date | null; serviceEndDate: Date | null } | null,
  now: Date
): { to: NyscStage; reason: AutomaticReason } | null {
  if (!journey) return null;
  if (stage === "PCM" && journey.campExitDate && now >= journey.campExitDate) {
    return { to: "SERVING", reason: "CAMP_EXIT_DATE_REACHED" };
  }
  if (stage === "SERVING" && journey.serviceEndDate && now >= journey.serviceEndDate) {
    return { to: "ALUMNI", reason: "SERVICE_END_DATE_REACHED" };
  }
  return null;
}

/**
 * Applies a system-initiated stage change atomically: user update, audit row and notification.
 * `changedBy` is null because no user made the change (the column references User).
 * Returns false (and writes nothing) if the user is no longer in `from`, e.g. they changed it
 * themselves while the nightly job was running.
 */
export async function applyAutomaticTransition(
  userId: string,
  from: NyscStage,
  to: NyscStage,
  reason: AutomaticReason
): Promise<boolean> {
  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId, nyscStatus: from },
        data: { nyscStatus: to, role: LEGACY_ROLE_FOR_STAGE[to] },
      }),
      prisma.userStatusHistory.create({
        data: { userId, previousStatus: from, newStatus: to, changedBy: null, changeType: "AUTOMATIC", reason },
      }),
      prisma.notification.create({
        data: { userId, ...NOTIFICATIONS[reason] },
      }),
    ]);
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return false;
    throw error;
  }
}
