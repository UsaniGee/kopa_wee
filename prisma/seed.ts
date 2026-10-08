import { PrismaClient } from "@prisma/client";
import { seedAdmin, seedFieldsOfStudy, seedStatesAndLgas } from "../src/shared/lib/referenceSeed";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding reference data...");

  // ─── Subscription Plans ───────────────────────────────────────────────────
  const earlyAccessPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: "early-access" },
    update: {
      isActive: true,
      isEarlyAccess: true,
    },
    create: {
      name: "Early Access",
      slug: "early-access",
      description:
        "Full platform access during Early Access phase. Free for all users who join now.",
      price: 0,
      isActive: true,
      isEarlyAccess: true,
      features: [
        "Complete PCM Camp Preparation Checklist",
        "Monthly Clearance Tracker",
        "Corper Peer Marketplace",
        "Accommodation & Roommate Finder",
        "PPA Logbook & Workplace Hub",
        "CDS Group Manager",
        "Travel Safety & SOS Tracker",
        "AI Regulatory Assistant",
        "NYSC Journey Auto-Transitions",
      ],
    },
  });
  console.log(`✅ Subscription plan: ${earlyAccessPlan.name}`);

  // ─── States, LGAs and onboarding options (previously seeded lazily inside GET routes) ──
  const { states, lgas } = await seedStatesAndLgas(prisma);
  console.log(`✅ States: ${states}, LGAs: ${lgas}`);

  const fields = await seedFieldsOfStudy(prisma);
  console.log(`✅ Fields of study: ${fields}`);

  // The packing template now lives in src/shared/data/referenceData.ts; drop the unused copy
  const removed = await prisma.formOption.deleteMany({ where: { category: "default_packing_item" } });
  if (removed.count > 0) console.log(`🧹 Removed ${removed.count} unused default_packing_item rows`);

  // ─── Bootstrap admin (credentials from env only, never printed) ─────────────
  const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME } = process.env;
  await seedAdmin(prisma, { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME }, (msg) => console.log(`✅ ${msg}`));

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
