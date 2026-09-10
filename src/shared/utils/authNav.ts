"use client";

import { useSession } from "next-auth/react";

export const ROLE_ALLOWED_ROUTES: Record<string, string[]> = {
  pcm: ["/dashboard", "/dashboard/companion", "/dashboard/marketplace", "/dashboard/safety"],
  serving: ["/dashboard", "/dashboard/companion", "/dashboard/marketplace", "/dashboard/accommodation", "/dashboard/safety", "/dashboard/workplace", "/dashboard/community"],
  alumni: ["/dashboard", "/dashboard/marketplace", "/dashboard/workplace"],
  cds_exec: ["/dashboard", "/dashboard/community", "/dashboard/safety"],
  ppa: ["/dashboard", "/dashboard/workplace"],
  nysc_official: ["/dashboard", "/dashboard/companion"],
};

/**
 * React hook — returns true when the NextAuth session is authenticated.
 * Use this in client components instead of checking localStorage.
 */
export function useIsAuthenticated(): boolean {
  const { status } = useSession();
  return status === "authenticated";
}

/**
 * Legacy check kept for non-React contexts (e.g. redirect logic outside hooks).
 * Reads from localStorage UX state — NOT a security gate. Use useIsAuthenticated() for UI guards.
 * Real auth gating is handled by middleware.ts and getServerSession() in API routes.
 */
export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  // Check localStorage UX state only — not a security decision
  const userId = localStorage.getItem("kopawee_user_id");
  const userEmail = localStorage.getItem("kopawee_user_email");
  return Boolean(userId || userEmail);
}

/**
 * Returns the currently stored user role from localStorage (UX display only).
 * Defaults to "serving".
 */
export function getUserRole(): string {
  if (typeof window === "undefined") return "serving";
  return localStorage.getItem("kopawee_active_role") || "serving";
}

/**
 * Resolves the destination route based on user role and allowed routes.
 */
export function getRouteForRole(targetRoute: string, role: string): string {
  const allowed = ROLE_ALLOWED_ROUTES[role] || ROLE_ALLOWED_ROUTES.serving;
  if (allowed.includes(targetRoute)) {
    return targetRoute;
  }
  return allowed[0] || "/dashboard";
}

/**
 * Smart Navigation Action:
 * - If user IS authenticated: navigates directly to role-appropriate route
 * - If user IS NOT authenticated: redirects to sign-up page with redirect callback
 */
export function navigateWithAuthCheck(
  router: { push: (url: string) => void },
  targetRoute: string
): void {
  if (isUserAuthenticated()) {
    const role = getUserRole();
    const dest = getRouteForRole(targetRoute, role);
    router.push(dest);
  } else {
    router.push(`/auth?mode=signup&redirect=${encodeURIComponent(targetRoute)}`);
  }
}
