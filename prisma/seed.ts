import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding production-standard NYSC data to Neon PostgreSQL...");

  // 1. Clear existing test data
  await prisma.sOSAlert.deleteMany({});
  await prisma.cDSEvent.deleteMany({});
  await prisma.pPALogbookEntry.deleteMany({});
  await prisma.marketplaceItem.deleteMany({});
  await prisma.accommodationListing.deleteMany({});
  await prisma.campChecklist.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash("CorperPassword2026!", 12);

  // 2. Create Users (6 User Roles)
  const corperGrace = await prisma.user.create({
    data: {
      name: "Grace Okafor",
      email: "grace.okafor@kopawee.ng",
      passwordHash,
      phone: "+234 803 123 4567",
      role: "SERVING_CORPER",
      stateOfOrigin: "Anambra",
      deployedState: "Lagos",
      lga: "Ikeja",
      ppaName: "Grace High School",
      stateCode: "LA/26A/1420",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      isVerified: true,
    },
  });

  const employerTunde = await prisma.user.create({
    data: {
      name: "Dr. Tunde Adeleke",
      email: "tunde.adeleke@gracehighschool.ng",
      passwordHash,
      phone: "+234 802 345 6789",
      role: "EMPLOYER",
      deployedState: "Lagos",
      lga: "Ikeja",
      ppaName: "Grace High School",
      isVerified: true,
    },
  });

  const pcmChidi = await prisma.user.create({
    data: {
      name: "Chidi Okonkwo",
      email: "chidi.okonkwo@kopawee.ng",
      passwordHash,
      phone: "+234 812 345 6789",
      role: "PCM",
      stateOfOrigin: "Enugu",
      deployedState: "Lagos",
      lga: "Ikeja",
      isVerified: false,
    },
  });

  const alumniVictor = await prisma.user.create({
    data: {
      name: "Victor Nwosu",
      email: "victor.nwosu@kopawee.ng",
      passwordHash,
      phone: "+234 809 111 2233",
      role: "ALUMNI",
      stateOfOrigin: "Imo",
      deployedState: "Lagos",
      lga: "Surulere",
      isVerified: true,
    },
  });

  // 3. Create Accommodations
  await prisma.accommodationListing.createMany({
    data: [
      {
        ownerId: corperGrace.id,
        title: "Greenfield Corper Lodge (2 Beds Available)",
        description: "Secure corper lodge with 24/7 water, gate security, and fitted kitchen. 5 mins walk to Ikeja LGA Secretariat.",
        location: "Opebi Road, Ikeja, Lagos",
        state: "Lagos",
        lga: "Ikeja",
        price: "₦180,000 / year",
        splitInfo: "₦90,000 per Corper (2-way split)",
        contactPhone: "+234 803 123 4567",
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"],
      },
      {
        ownerId: alumniVictor.id,
        title: "Fully Furnished Studio Apartment (POP Hand-off)",
        description: "Complete apartment hand-off including AC, bed, wardrobe, gas cooker, and standing fan.",
        location: "Surulere LGA, Lagos",
        state: "Lagos",
        lga: "Surulere",
        price: "₦250,000 / year",
        splitInfo: "Full Lease Transfer",
        contactPhone: "+234 809 111 2233",
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
      },
    ],
  });

  // 4. Create Marketplace Items
  await prisma.marketplaceItem.createMany({
    data: [
      {
        sellerId: corperGrace.id,
        title: "Anker 20,000mAh Power Bank (High Speed Charge)",
        category: "Pre-Camp Gear",
        price: "₦16,500",
        description: "Essential for orientation camp. Retains full charge for 4 days.",
        state: "Lagos",
        lga: "Ikeja",
        images: ["https://images.unsplash.com/photo-1609592424522-5c5c1a1f2d5d?w=800&q=80"],
      },
      {
        sellerId: alumniVictor.id,
        title: "Mouka Foam Mattress + OX 18-Inch Standing Fan Bundle",
        category: "POP Bundle",
        price: "₦32,000",
        description: "POP household clearance bundle. Excellent condition.",
        state: "Lagos",
        lga: "Surulere",
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80"],
      },
    ],
  });

  // 5. Create PPA Logbook Entries
  await prisma.pPALogbookEntry.createMany({
    data: [
      {
        userId: corperGrace.id,
        employerId: employerTunde.id,
        date: "2026-08-28",
        summary: "Conducted ICT literacy class for SS2 students and audited lab workstations.",
        hoursWorked: 8,
        status: "APPROVED",
      },
      {
        userId: corperGrace.id,
        employerId: employerTunde.id,
        date: "2026-08-29",
        summary: "Coordinated morning assembly parade drill and assisted with administrative registers.",
        hoursWorked: 8,
        status: "PENDING",
      },
    ],
  });

  console.log("✅ Seed completed successfully! Created 4 users, 2 lodges, 2 marketplace items & 2 logbook entries.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
