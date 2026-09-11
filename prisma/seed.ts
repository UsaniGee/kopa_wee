import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

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

  console.log(`✅ Subscription plan seeded: ${earlyAccessPlan.name}`);

  // ─── Default Packing Items (shared template) ──────────────────────────────
  // These are the standard NYSC camp items. They will be created per-user when 
  // a user first accesses their checklist. This seed just defines the canonical list.
  const defaultPackingItems = [
    // Documents
    { name: "Call-up Letter (3 colored copies)", category: "documents" },
    { name: "Green Card & Statement of Result", category: "documents" },
    { name: "Medical Fitness Certificate", category: "documents" },
    { name: "Birth Certificate or Age Declaration", category: "documents" },
    { name: "Passport Photographs (12 copies)", category: "documents" },
    // Clothing
    { name: "White Shorts (3 pairs)", category: "clothing" },
    { name: "Plain White T-Shirts (3)", category: "clothing" },
    { name: "NYSC Jungle Boot (white parade ground)", category: "clothing" },
    { name: "Crocs / Rubber Slippers (hostel use)", category: "clothing" },
    { name: "Vest / Singlet (5 pairs)", category: "clothing" },
    { name: "Towels (2)", category: "clothing" },
    // Toiletries
    { name: "Toothbrush & Toothpaste", category: "toiletries" },
    { name: "Soap & Body Wash", category: "toiletries" },
    { name: "Deodorant / Roll-on", category: "toiletries" },
    { name: "Shaving Stick / Razor", category: "toiletries" },
    // Electronics
    { name: "Power Bank (10,000mAh minimum)", category: "electronics" },
    { name: "Torchlight & Batteries", category: "electronics" },
    { name: "Extension Cable", category: "electronics" },
    // Essentials
    { name: "Waist Bag", category: "essentials" },
    { name: "Water Bottle (1.5L)", category: "essentials" },
    { name: "Padlock for locker", category: "essentials" },
    { name: "Mosquito Net / Repellent", category: "essentials" },
    { name: "First Aid Kit", category: "essentials" },
  ];

  // Store the canonical list in FormOption for reference
  for (const item of defaultPackingItems) {
    await prisma.formOption.upsert({
      where: {
        category_value: {
          category: "default_packing_item",
          value: item.name,
        },
      },
      update: { label: item.name },
      create: {
        category: "default_packing_item",
        value: item.name,
        label: `${item.category}:${item.name}`,
      },
    });
  }

  console.log(
    `✅ Default packing items reference seeded: ${defaultPackingItems.length} items`
  );

  // ─── Super Admin Seed ─────────────────────────────────────────────────────
  const { hashPassword: hashPwd } = await import("../src/shared/lib/auth");
  const adminPasswordHash = await hashPwd("KopaWeeAdmin2026!");
  await prisma.user.upsert({
    where: { email: "admin@kopawee.ng" },
    update: { applicationRole: "ADMIN", isVerified: true, passwordHash: adminPasswordHash },
    create: {
      name: "KopaWee Admin",
      email: "admin@kopawee.ng",
      passwordHash: adminPasswordHash,
      role: "PCM",
      applicationRole: "ADMIN",
      nyscStatus: "PCM",
      isVerified: true,
    },
  });
  console.log("✅ Super-admin seeded: admin@kopawee.ng / KopaWeeAdmin2026!");

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
