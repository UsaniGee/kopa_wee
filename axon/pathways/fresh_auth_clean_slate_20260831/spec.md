# Pathway Specification: Fresh Auth & Onboarding Clean Slate (`fresh_auth_clean_slate_20260831`)

## Overview
This pathway clears all hardcoded pre-filled dummy credentials (`Chidi Okonkwo`, `chidi.okonkwo@example.ng`, `08012345678`) from `src/app/auth/page.tsx` and `src/app/onboarding/page.tsx`. It implements a production-grade `POST /api/auth/login` route handler featuring `bcrypt` password hash verification against Neon PostgreSQL, auto-login on registration, and a complete database reset to allow real users to sign up from scratch.

---

## Key Requirements

1. **Clear Pre-filled Form Defaults:**
   - In `src/app/auth/page.tsx`, reset `email`, `password`, `fullName`, and `phone` initial state to empty strings (`""`).
   - In `src/app/onboarding/page.tsx`, reset `fullName`, `displayName`, `email`, `phone`, `stateCode`, `ppaName` initial state to empty strings (`""`).
2. **Implement `POST /api/auth/login` Route Handler:**
   - Create `src/app/api/auth/login/route.ts` with email lookup in Prisma, `bcrypt.compare` password verification, and user profile response.
3. **Connect Auth Page Login Flow:**
   - Update `handleAuthSubmit` in `src/app/auth/page.tsx` so that Sign In triggers `POST /api/auth/login`, sets `kopawee_user_id`, `kopawee_user_profile`, and `kopawee_active_role` in `localStorage`, and redirects to `/dashboard` or `/onboarding`.
4. **Pure Neon Database Wipe:**
   - Execute `npx prisma db push --force-reset` on live Neon PostgreSQL to clear all users, lodges, marketplace items, and logbook entries for a 100% fresh start.

---

## Acceptance Criteria

1. **Clean Input Fields:** Auth and Onboarding pages load with pristine empty inputs and helpful HTML placeholder text.
2. **Functional Live Authentication:** Signing up creates a real database record and logs the user in. Logging in verifies credentials against Neon PostgreSQL.
3. **Clean Database Baseline:** Neon database starts with 0 user accounts.
4. **Build Verification:** 100% clean Next.js production build output across all 21 routes.
