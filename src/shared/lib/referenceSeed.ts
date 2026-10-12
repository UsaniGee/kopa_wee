// Relative imports: this module also runs under `tsx prisma/seed.ts`, outside Next's bundler.
import type { PrismaClient } from "@prisma/client";
import { hashPassword } from "./auth";
import { NIGERIA_STATES_AND_LGAS } from "../data/nigeriaStatesLgas";
import { DEFAULT_FIELDS_OF_STUDY } from "../data/referenceData";

type Log = (message: string) => void;
type SeedEnv = { SEED_ADMIN_EMAIL?: string; SEED_ADMIN_PASSWORD?: string; SEED_ADMIN_NAME?: string };

const MIN_ADMIN_PASSWORD_LENGTH = 12;

/**
 * Ensures the bootstrap admin exists, using credentials from the environment only.
 * An existing account keeps its password: re-seeding must never reset a live admin's login.
 */
export async function seedAdmin(
  prisma: PrismaClient,
  env: SeedEnv,
  log: Log
): Promise<"skipped" | "created" | "kept"> {
  const email = env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    log("Admin: skipped (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one)");
    return "skipped";
  }
  if (password.length < MIN_ADMIN_PASSWORD_LENGTH) {
    throw new Error(`SEED_ADMIN_PASSWORD must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters`);
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true, isVerified: true, applicationRole: true } });
  if (existing) {
    // Anyone can register an unverified account with this email; never hand that account admin rights
    if (!existing.isVerified && existing.applicationRole !== "ADMIN") {
      throw new Error("SEED_ADMIN_EMAIL belongs to an unverified account; verify it or delete it, then seed again");
    }
    await prisma.user.update({ where: { email }, data: { applicationRole: "ADMIN" } });
    log(`Admin: ${email} already exists; role ensured, password unchanged`);
    return "kept";
  }

  await prisma.user.create({
    data: {
      name: env.SEED_ADMIN_NAME?.trim() || "KopaWee Admin",
      email,
      passwordHash: await hashPassword(password),
      role: "PCM",
      applicationRole: "ADMIN",
      nyscStatus: "PCM",
      isVerified: true,
    },
  });
  log(`Admin: created ${email}`);
  return "created";
}

/** Upserts all 36 states + FCT and their LGAs (idempotent). */
export async function seedStatesAndLgas(prisma: PrismaClient): Promise<{ states: number; lgas: number }> {
  let lgas = 0;
  for (const item of NIGERIA_STATES_AND_LGAS) {
    const state = await prisma.state.upsert({
      where: { code: item.code },
      update: { name: item.state },
      create: { name: item.state, code: item.code },
    });
    for (const name of item.lgas) {
      await prisma.lGA.upsert({
        where: { stateId_name: { stateId: state.id, name } },
        update: {},
        create: { name, stateId: state.id },
      });
      lgas++;
    }
  }
  return { states: NIGERIA_STATES_AND_LGAS.length, lgas };
}

/** Upserts the starter "field of study" options shown during onboarding. */
export async function seedFieldsOfStudy(prisma: PrismaClient): Promise<number> {
  for (const value of DEFAULT_FIELDS_OF_STUDY) {
    await prisma.formOption.upsert({
      where: { category_value: { category: "field_of_study", value } },
      update: {},
      create: { category: "field_of_study", value, label: value },
    });
  }
  return DEFAULT_FIELDS_OF_STUDY.length;
}
