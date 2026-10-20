export type RoleType = "pcm" | "serving" | "cds_exec" | "ppa" | "nysc_official" | "alumni";

export const ROLE_ALLOWED_ROUTES: Record<RoleType, string[]> = {
  pcm: ["/dashboard", "/dashboard/companion", "/dashboard/marketplace", "/dashboard/safety"],
  serving: ["/dashboard", "/dashboard/companion", "/dashboard/marketplace", "/dashboard/accommodation", "/dashboard/safety", "/dashboard/workplace", "/dashboard/community"],
  alumni: ["/dashboard", "/dashboard/marketplace", "/dashboard/workplace"],
  cds_exec: ["/dashboard", "/dashboard/community", "/dashboard/safety"],
  ppa: ["/dashboard", "/dashboard/workplace"],
  nysc_official: ["/dashboard", "/dashboard/companion"],
};

/** Dashboard role from the session's nyscStatus and legacy role; special legacy roles win. */
export function deriveRole(nyscStatus?: string | null, legacyRole?: string | null): RoleType {
  if (legacyRole === "CDS_EXEC") return "cds_exec";
  if (legacyRole === "EMPLOYER") return "ppa";
  if (legacyRole === "LGA_INSPECTOR") return "nysc_official";
  if (nyscStatus === "ALUMNI") return "alumni";
  if (nyscStatus === "SERVING") return "serving";
  return "pcm";
}

/** Open to every signed-in role (not a role tab). */
const SHARED_ROUTES = ["/dashboard/settings"];

/** The target route if the role may open it, else the role's first allowed route. */
export function getRouteForRole(targetRoute: string, role: string): string {
  const allowed = ROLE_ALLOWED_ROUTES[role as RoleType] ?? ROLE_ALLOWED_ROUTES.pcm;
  return allowed.includes(targetRoute) || SHARED_ROUTES.includes(targetRoute) ? targetRoute : allowed[0];
}

/** Where a link should go: sign-up for visitors, otherwise the route the session role allows. */
export function destinationFor(
  targetRoute: string,
  sessionUser: { nyscStatus?: string | null; role?: string | null } | null
): string {
  if (!sessionUser) return `/auth?mode=signup&redirect=${encodeURIComponent(targetRoute)}`;
  return getRouteForRole(targetRoute, deriveRole(sessionUser.nyscStatus, sessionUser.role));
}

/**
 * Where to go right after signing in, from the /api/users/me profile (null if it failed to load).
 * Admins go to the admin panel and skip onboarding, unless they followed a link to a user page.
 */
export function postSignInDestination(
  profile: { applicationRole?: string | null; nyscStatus?: string | null; role?: string | null; onboardingComplete?: boolean } | null,
  redirectUrl: string | null
): string {
  if (!profile) return "/dashboard";
  if (profile.applicationRole === "ADMIN" && !redirectUrl) return "/admin";
  if (profile.applicationRole !== "ADMIN" && !profile.onboardingComplete) {
    return redirectUrl ? `/onboarding?redirect=${encodeURIComponent(redirectUrl)}` : "/onboarding";
  }
  return redirectUrl ? getRouteForRole(redirectUrl, deriveRole(profile.nyscStatus, profile.role)) : "/dashboard";
}
