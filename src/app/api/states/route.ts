import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

const unavailable = (error: string) => NextResponse.json({ success: false, error }, { status: 503 });

/**
 * GET /api/states          → all states with their LGAs
 * GET /api/states?state=X  → LGA names for state X
 * Read-only: States and LGAs are seeded by `prisma db seed`.
 */
export async function GET(req: Request) {
  const stateName = new URL(req.url).searchParams.get("state");

  try {
    const states = await prisma.state.findMany({
      include: { lgas: { select: { name: true } } },
      orderBy: { name: "asc" },
    });

    if (states.length === 0) {
      console.error("[GET /api/states] No states in the database. Run `pnpm prisma db seed`.");
      return unavailable("Location data is not available yet");
    }

    const lgaNames = (lgas: { name: string }[]) => lgas.map((l) => l.name).sort();

    if (stateName) {
      const matched = states.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
      return NextResponse.json({ success: true, data: matched ? lgaNames(matched.lgas) : [] });
    }

    return NextResponse.json({
      success: true,
      data: states.map((s) => ({ id: s.id, name: s.name, code: s.code, lgas: lgaNames(s.lgas) })),
    });
  } catch (error) {
    console.error("[GET /api/states] Error:", error);
    return unavailable("Location data is temporarily unavailable");
  }
}
