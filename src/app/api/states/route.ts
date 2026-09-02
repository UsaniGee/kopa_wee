import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { NIGERIA_STATES_AND_LGAS } from "@/shared/data/nigeriaStatesLgas";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const stateName = searchParams.get("state");

    let states = await prisma.state.findMany({
      include: { lgas: true },
      orderBy: { name: "asc" },
    });

    if (states.length === 0) {
      // Seed States and LGAs in DB
      for (const item of NIGERIA_STATES_AND_LGAS) {
        const stateRecord = await prisma.state.upsert({
          where: { code: item.code },
          update: { name: item.state },
          create: { name: item.state, code: item.code },
        });

        for (const lgaName of item.lgas) {
          await prisma.lGA.upsert({
            where: {
              stateId_name: {
                stateId: stateRecord.id,
                name: lgaName,
              },
            },
            update: {},
            create: {
              name: lgaName,
              stateId: stateRecord.id,
            },
          });
        }
      }

      states = await prisma.state.findMany({
        include: { lgas: true },
        orderBy: { name: "asc" },
      });
    }

    if (stateName) {
      const matched = states.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
      const lgas = matched ? matched.lgas.map((l) => l.name).sort() : [];
      return NextResponse.json({
        success: true,
        data: lgas,
      });
    }

    return NextResponse.json({
      success: true,
      data: states.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        lgas: s.lgas.map((l) => l.name).sort(),
      })),
    });
  } catch (error) {
    // Fallback dictionary search
    const { searchParams } = new URL(req.url);
    const stateName = searchParams.get("state");

    if (stateName) {
      const item = NIGERIA_STATES_AND_LGAS.find((s) => s.state.toLowerCase() === stateName.toLowerCase());
      return NextResponse.json({
        success: true,
        data: item ? item.lgas.sort() : [],
      });
    }

    return NextResponse.json({
      success: true,
      data: NIGERIA_STATES_AND_LGAS.map((s, idx) => ({
        id: `state_${s.code.toLowerCase()}_${idx}`,
        name: s.state,
        code: s.code,
        lgas: s.lgas.sort(),
      })),
    });
  }
}
