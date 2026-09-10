import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Session } from "next-auth";

export type AuthenticatedUser = Session["user"];

/**
 * Validates the NextAuth session for an API route.
 * Returns the typed session user on success.
 * Returns a NextResponse 401 if not authenticated — caller must return it.
 */
export async function requireAuth(): Promise<
  { user: AuthenticatedUser; error: null } |
  { user: null; error: NextResponse }
> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  return { user: session.user, error: null };
}

/**
 * Validates the session AND checks for ADMIN applicationRole.
 * Returns a NextResponse 403 if authenticated but not admin.
 */
export async function requireAdmin(): Promise<
  { user: AuthenticatedUser; error: null } |
  { user: null; error: NextResponse }
> {
  const auth = await requireAuth();
  if (auth.error) return auth;

  if (auth.user!.applicationRole !== "ADMIN") {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return auth;
}
