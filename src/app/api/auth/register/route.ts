import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { hashPassword } from "@/shared/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["PCM", "SERVING_CORPER", "CDS_EXEC", "EMPLOYER", "LGA_INSPECTOR", "ALUMNI"]).default("PCM"),
  stateOfOrigin: z.string().optional(),
  deployedState: z.string().optional(),
  lga: z.string().optional(),
  ppaName: z.string().optional(),
  stateCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password & create user
    const passwordHash = await hashPassword(validatedData.password);

    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        role: validatedData.role,
        stateOfOrigin: validatedData.stateOfOrigin,
        deployedState: validatedData.deployedState,
        lga: validatedData.lga,
        ppaName: validatedData.ppaName,
        stateCode: validatedData.stateCode,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        deployedState: true,
        lga: true,
        stateCode: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 }
    );
  }
}
