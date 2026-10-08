# Pathway Specification: Auth-Gated Navbar Navigation & Dashboard Protection (`auth_gated_navbar_navigation_20260902`)

## Overview
This pathway enforces live authentication checking across all navigation touchpoints:
1. When a user clicks any navbar link (`Camp Guide`, `Corper Housing`, `P2P Market`, `Safety SOS`), the system checks if the user is authenticated (via `kopawee_user_id` / `kopawee_auth_token` in `localStorage`).
2. If authenticated: navigate directly to their requested dashboard module.
3. If unauthenticated: auto-assume first-time user and redirect to `/auth?mode=signup&redirect=...`.
4. Enforces route protection inside `src/app/dashboard/layout.tsx` so direct URL visits to `/dashboard/*` redirect unauthenticated visitors to `/auth?mode=signup`.

---

## Key Requirements

1. **Enhanced `isUserAuthenticated()` Check (`src/shared/utils/authNav.ts`):**
   - Verify presence of `kopawee_user_id`, `kopawee_auth_token`, or `kopawee_user_profile` in `localStorage`.
2. **Navbar Link Handler (`src/shared/components/Navbar.tsx`):**
   - Wire all navbar items (`Camp Guide`, `Corper Housing`, `P2P Market`, `Safety SOS`) to invoke `navigateWithAuthCheck`.
3. **Dashboard Layout Protection (`src/app/dashboard/layout.tsx`):**
   - Add client-side authentication check inside `useEffect` on mount.
   - If user is not authenticated, redirect to `/auth?mode=signup`.

---

## Acceptance Criteria

1. **Authenticated Users:** Clicking any navbar item opens their active dashboard module seamlessly.
2. **Unauthenticated Visitors:** Clicking any navbar item redirects cleanly to the Sign Up page (`/auth?mode=signup`).
3. **Protected Dashboard Routes:** Direct URL navigation to `/dashboard` redirects unauthenticated users to `/auth?mode=signup`.
4. **Build Verification:** 100% clean Next.js production build output across all 23 routes.
