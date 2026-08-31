# Pathway Specification: Google OAuth 2.0 Authentication Integration (`google_oauth_auth_20260831`)

## Overview
This pathway implements standard Google OAuth 2.0 authentication for **KopaWee**. It configures NextAuth v5 Google Provider with route handler `src/app/api/auth/[...nextauth]/route.ts`, environment variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), updates the *"Continue with Google"* button on `src/app/auth/page.tsx`, and automatically provisions authenticated Google accounts into the Neon PostgreSQL `User` table.

---

## Key Requirements

1. **NextAuth.js Route Handler:**
   - Create `src/app/api/auth/[...nextauth]/route.ts` configured with `GoogleProvider`.
   - Implement `signIn` and `jwt` callbacks to create/upsert Google users in Neon PostgreSQL.
2. **Environment Variable Configuration:**
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` configuration helpers to `.env` / `.env.local` with fallback mock credentials for local dev safety.
3. **Frontend Google Auth Integration:**
   - Wire `handleGoogleAuth` on `src/app/auth/page.tsx` to invoke NextAuth `signIn("google")` or standard Google OAuth flow.
   - Automatically redirect new Google signups to `/onboarding` and returning users to `/dashboard`.
4. **Session Synchronization:**
   - Sync Google user `id`, `name`, `email`, and `avatarUrl` into `localStorage` (`kopawee_user_id`, `kopawee_auth_token`, `kopawee_user_email`, `kopawee_user_name`).

---

## Acceptance Criteria

1. **Working Google Auth Handler:** Route `GET/POST /api/auth/[...nextauth]` returns standard NextAuth OAuth response.
2. **Seamless UI Action:** Clicking *"Continue with Google"* initiates Google OAuth redirect.
3. **Database Provisioning:** Google user records are created/updated in Neon PostgreSQL with verified email status.
4. **Build Verification:** 100% clean Next.js production build output across all 22 routes.
