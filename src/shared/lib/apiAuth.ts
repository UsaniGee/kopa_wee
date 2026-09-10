import { auth } from "@/auth";
import { NextResponse } from "next/server";

export interface AuthenticatedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  applicationRole: string;
  nyscStatus: string;
  isVerified: boolean;
}

/**
 * Validates the NextAuth v5 session for an API route.
 * Returns the typed session user on success.
 * Returns a NextResponse 401 if not authenticated — caller must return it.
 */
export async function requireAuth(): Promise<
  { user: AuthenticatedUser; error: null } |
  { user: null; error: NextResponse }
> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  return { user: session.user as AuthenticatedUser, error: null };
}

/**
 * Validates the session AND checks for ADMIN applicationRole.
 * Returns a NextResponse 403 if authenticated but not admin.
 */
export async function requireAdmin(): Promise<
  { user: AuthenticatedUser; error: null } |
  { user: null; error: NextResponse }
> {
  const authResult = await requireAuth();
  if (authResult.error) return authResult;

  if (authResult.user!.applicationRole !== "ADMIN") {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return authResult;
}
