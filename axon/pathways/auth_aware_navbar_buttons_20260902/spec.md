# Pathway Specification: Dynamic Auth-Aware Navbar Action Buttons (`auth_aware_navbar_buttons_20260902`)

## Overview
This pathway enhances the landing page navigation bar (`src/shared/components/Navbar.tsx`) by dynamically rendering action CTA buttons based on authentication status:
1. When a user IS logged in (`isUserAuthenticated()` returns `true`), the navbar replaces the separate *"Sign In"* and *"Get Started"* buttons with a single, high-visibility **`Go to Dashboard →`** button (linking to `/dashboard`).
2. When a user IS NOT logged in, the navbar continues rendering the standard *"Sign In"* and *"Get Started"* buttons.
3. Applies seamlessly across both desktop header controls and mobile drawer menus.

---

## Key Requirements

1. **Client-Side Auth State Detection (`src/shared/components/Navbar.tsx`):**
   - Check `isUserAuthenticated()` inside `useEffect` on mount.
   - Maintain state `authenticated: boolean`.
2. **Dynamic Desktop Button Rendering:**
   - If `authenticated === true`: render `<Link href="/dashboard">Go to Dashboard →</Link>`.
   - If `authenticated === false`: render `<Link href="/auth?mode=signin">Sign In</Link>` and `<Link href="/auth?mode=signup">Get Started</Link>`.
3. **Dynamic Mobile Drawer Button Rendering:**
   - Update mobile menu bottom controls to render a single prominent *"Go to Dashboard →"* button when authenticated.

---

## Acceptance Criteria

1. **Logged-In Users:** Navbar displays **`Go to Dashboard →`** button directly linking to `/dashboard`.
2. **Logged-Out Visitors:** Navbar displays standard *"Sign In"* and *"Get Started"* buttons.
3. **Build Verification:** 100% clean Next.js production build output across all 23 routes.
