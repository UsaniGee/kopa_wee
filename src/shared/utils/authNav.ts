"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { destinationFor } from "./roleRoutes";

export { getRouteForRole, deriveRole, postSignInDestination, ROLE_ALLOWED_ROUTES } from "./roleRoutes";

/**
 * Keys older versions wrote to localStorage as a stand-in for the session (name, email,
 * role, onboarding profile). The session is the only source now; these are cleared so
 * personal data does not linger on shared devices.
 */
const LEGACY_SESSION_KEYS = [
  "kopawee_user_id",
  "kopawee_user_email",
  "kopawee_user_name",
  "kopawee_active_role",
  "kopawee_user_profile",
  "kopawee_offline_documents", // names of "vault" documents; the vault was never built
];

export function clearLegacySessionStorage(): void {
  try {
    LEGACY_SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage can be unavailable (private mode); nothing to clear then
  }
}

/** Navigates to a dashboard route: visitors go to sign-up, signed-in users to what their role allows. */
export function useAuthNavigate(): (targetRoute: string) => void {
  const router = useRouter();
  const { data: session, status } = useSession();
  return useCallback(
    (targetRoute: string) => {
      const user = status === "authenticated" && session?.user ? session.user : null;
      router.push(destinationFor(targetRoute, user));
    },
    [router, session, status]
  );
}
