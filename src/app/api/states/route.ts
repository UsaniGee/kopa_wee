import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export const NIGERIAN_STATES_DATA = [
  { name: "Abia", code: "AB" },
  { name: "Adamawa", code: "AD" },
  { name: "Akwa Ibom", code: "AK" },
  { name: "Anambra", code: "AN" },
  { name: "Bauchi", code: "BA" },
  { name: "Bayelsa", code: "BY" },
  { name: "Benue", code: "BN" },
  { name: "Borno", code: "BO" },
  { name: "Cross River", code: "CR" },
  { name: "Delta", code: "DE" },
  { name: "Ebonyi", code: "EB" },
  { name: "Edo", code: "ED" },
  { name: "Ekiti", code: "EK" },
  { name: "Enugu", code: "EN" },
  { name: "FCT - Abuja", code: "FC" },
  { name: "Gombe", code: "GO" },
  { name: "Imo", code: "IM" },
  { name: "Jigawa", code: "JI" },
  { name: "Kaduna", code: "KD" },
  { name: "Kano", code: "KN" },
  { name: "Katsina", code: "KT" },
  { name: "Kebbi", code: "KB" },
  { name: "Kogi", code: "KO" },
  { name: "Kwara", code: "KW" },
  { name: "Lagos", code: "LA" },
  { name: "Nasarawa", code: "NA" },
  { name: "Niger", code: "NI" },
  { name: "Ogun", code: "OG" },
  { name: "Ondo", code: "ON" },
  { name: "Osun", code: "OS" },
  { name: "Oyo", code: "OY" },
  { name: "Plateau", code: "PL" },
  { name: "Rivers", code: "RI" },
  { name: "Sokoto", code: "SO" },
  { name: "Taraba", code: "TA" },
  { name: "Yobe", code: "YO" },
  { name: "Zamfara", code: "ZA" },
];

export async function GET() {
  try {
    let states = await prisma.state.findMany({
      orderBy: { name: "asc" },
    });

    if (states.length === 0) {
      // Auto-seed all 36 States + FCT into Neon DB
      await prisma.state.createMany({
        data: NIGERIAN_STATES_DATA,
        skipDuplicates: true,
      });

      states = await prisma.state.findMany({
        orderBy: { name: "asc" },
      });
    }

    return NextResponse.json({
      success: true,
      data: states.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
      })),
    });
  } catch (error) {
    // Fallback response with all 36 states + FCT if DB connection delays
    return NextResponse.json({
      success: true,
      data: NIGERIAN_STATES_DATA.map((s, idx) => ({
        id: `state_${s.code.toLowerCase()}_${idx}`,
        name: s.name,
        code: s.code,
      })),
    });
  }
}
