import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { z } from "zod";

const roleSchema = z.object({
  userId: z.string(),
  role: z.enum(["PCM", "SERVING_CORPER", "CDS_EXEC", "EMPLOYER", "LGA_INSPECTOR", "ALUMNI"]),
  deployedState: z.string().optional(),
  lga: z.string().optional(),
  stateCode: z.string().optional(),
  ppaName: z.string().optional(),
});

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const validatedData = roleSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: validatedData.userId },
      data: {
        role: validatedData.role,
        ...(validatedData.deployedState && { deployedState: validatedData.deployedState }),
        ...(validatedData.lga && { lga: validatedData.lga }),
        ...(validatedData.stateCode && { stateCode: validatedData.stateCode }),
        ...(validatedData.ppaName && { ppaName: validatedData.ppaName }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        deployedState: true,
        lga: true,
        stateCode: true,
        ppaName: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `Role switched to ${updatedUser.role} successfully`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update role" },
      { status: 500 }
    );
  }
}
