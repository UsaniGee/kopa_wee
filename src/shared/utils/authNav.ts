"use client";

export const ROLE_ALLOWED_ROUTES: Record<string, string[]> = {
  pcm: ["/dashboard", "/dashboard/companion", "/dashboard/marketplace", "/dashboard/safety"],
  serving: ["/dashboard", "/dashboard/companion", "/dashboard/marketplace", "/dashboard/accommodation", "/dashboard/safety", "/dashboard/workplace", "/dashboard/community"],
  alumni: ["/dashboard", "/dashboard/marketplace", "/dashboard/workplace"],
  cds_exec: ["/dashboard", "/dashboard/community", "/dashboard/safety"],
  ppa: ["/dashboard", "/dashboard/workplace"],
  nysc_official: ["/dashboard", "/dashboard/companion"],
};

/**
 * Checks if the user is authenticated (can be updated when backend API is plugged in)
 */
export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("kopawee_auth_token");
  return Boolean(token && token.trim().length > 0);
}

/**
 * Returns the currently stored user role (defaults to "serving")
 */
export function getUserRole(): string {
  if (typeof window === "undefined") return "serving";
  return localStorage.getItem("kopawee_active_role") || "serving";
}

/**
 * Resolves the destination route based on user role and system design rules.
 * If targetRoute is allowed for role, returns targetRoute.
 * Otherwise, returns the role's primary dashboard landing page.
 */
export function getRouteForRole(targetRoute: string, role: string): string {
  const allowed = ROLE_ALLOWED_ROUTES[role] || ROLE_ALLOWED_ROUTES.serving;
  if (allowed.includes(targetRoute)) {
    return targetRoute;
  }
  // Fallback to role's first allowed route or /dashboard
  return allowed[0] || "/dashboard";
}

/**
 * Smart Navigation Action:
 * - If user IS authenticated: detects auth & navigates directly to role-appropriate route
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
