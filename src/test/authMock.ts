import { NextResponse } from "next/server";
import { vi } from "vitest";
import type { AuthenticatedUser } from "@/shared/lib/apiAuth";

const DEFAULT_USER: AuthenticatedUser = {
  id: "user_1",
  name: "Test Corper",
  email: "corper@example.com",
  role: "PCM",
  applicationRole: "USER",
  nyscStatus: "PCM",
  isVerified: true,
};

let currentUser: AuthenticatedUser | null = null;

/** Replacement for `@/shared/lib/apiAuth`, driven by signInAs()/signOut(). */
export const apiAuthMock = {
  requireAuth: vi.fn(async () =>
    currentUser
      ? { user: currentUser, error: null }
      : {
          user: null,
          error: NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 }),
        }
  ),
  requireAdmin: vi.fn(async () => {
    if (!currentUser) {
      return {
        user: null,
        error: NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 }),
      };
    }
    if (currentUser.applicationRole !== "ADMIN") {
      return {
        user: null,
        error: NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 }),
      };
    }
    return { user: currentUser, error: null };
  }),
};

export function signInAs(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  currentUser = { ...DEFAULT_USER, ...overrides };
  return currentUser;
}

export function signOut(): void {
  currentUser = null;
}
