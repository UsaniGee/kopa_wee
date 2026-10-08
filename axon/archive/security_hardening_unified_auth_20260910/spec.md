# Spec: Security Hardening, Unified Auth & Platform Completion

## Overview

KopaWee currently has three critical gaps that block production readiness:

1. **Broken authentication** — two parallel, incompatible auth systems (custom
   email/password with fake localStorage tokens + NextAuth Google OAuth) with
   zero server-side session validation on API routes.
2. **No route protection** — dashboard and admin routes are guarded only by
   client-side `useEffect` redirects, meaning protected pages flash before
   redirect and all API routes are fully open.
3. **Incomplete platform features** — email sending is a UI simulation, the AI
   assistant returns hardcoded keyword responses, and the notification bell is
   decorative despite a full backend existing for both.

This pathway resolves all three in a single, sequenced refactor: auth first,
middleware second, email third, AI + notifications fourth, API audit fifth.

---

## Functional Requirements

### FR-1: Unified NextAuth v5 Session (CredentialsProvider)

- Add a `CredentialsProvider` to the existing NextAuth config
  (`src/app/api/auth/[...nextauth]/route.ts`) that accepts `email` and
  `password`, validates against the DB using bcrypt, and returns the user
  object on success.
- The existing `/api/auth/register` and `/api/auth/login` routes are retained
  but the login route's success path triggers a NextAuth session creation via
  `signIn('credentials', ...)` on the client, replacing the localStorage
  fake-token pattern.
- After successful login (both credentials and Google OAuth), the NextAuth
  session cookie (`__Secure-next-auth.session-token` / `next-auth.session-token`)
  becomes the **sole** source of auth truth.
- Remove all `localStorage.setItem('kopawee_auth_token', ...)` fake token writes
  from the auth page, onboarding, and Google OAuth handler. localStorage may
  still be used for non-sensitive UX state (active role, user name display) but
  never for auth gating.
- Augment the NextAuth session type to include `id`, `role`, `applicationRole`,
  `nyscStatus`, and `isVerified` (already partially done in session callback —
  complete the TypeScript type augmentation via `next-auth.d.ts`).
- Replace `NEXTAUTH_SECRET` fallback hardcoded string with a mandatory env var
  check that throws at startup if missing.

### FR-2: Next.js Middleware Route Protection

- Create `src/middleware.ts` at the project root.
- Use NextAuth's `getToken()` helper (from `next-auth/jwt`) to read the session
  token on the Edge runtime.
- Protected route matcher: `/dashboard/:path*`, `/admin/:path*`,
  `/onboarding/:path*`.
- If no valid token: redirect to `/auth?mode=signin&redirect=<encoded-path>`.
- If token present but role is not `applicationRole: ADMIN` on `/admin/:path*`:
  redirect to `/dashboard`.
- Public routes (`/`, `/auth`, `/auth/verify`, `/api/auth/:path*`) are
  explicitly excluded from the matcher.

### FR-3: Server-Side API Route Authorization

- Create a shared helper `src/shared/lib/apiAuth.ts` that wraps
  `getServerSession(authOptions)`, returns the typed session user, and throws
  a standardised `401`/`403` `NextResponse` if unauthenticated or unauthorized.
- Audit and update **all mutating API routes** to call this helper and verify
  the authenticated user's identity server-side:
  - `/api/clearance` — verify `session.user.id === body.userId`
  - `/api/marketplace` — verify ownership on PATCH/DELETE
  - `/api/accommodation` — verify ownership on PATCH/DELETE
  - `/api/safety/sos` — verify session exists
  - `/api/users/status` — verify `session.user.id === body.userId`
  - `/api/users/journey` — verify `session.user.id`
  - `/api/users/me` — verify session, return session user's data only
  - `/api/notifications` — verify session, scope to session user
  - `/api/packing-items` — verify session user ownership
  - `/api/admin/*` — verify `session.user.applicationRole === 'ADMIN'`
- GET routes that return public data (marketplace listings, states, options) may
  remain unauthenticated.

### FR-4: Resend Email Integration with React Email Templates

- Install `resend` and `@react-email/components`.
- Create `src/shared/lib/email.ts` — a typed `sendEmail()` helper wrapping the
  Resend client, reading `RESEND_API_KEY` from env.
- Create React Email templates in `src/shared/emails/`:
  - `VerificationEmail.tsx` — branded KopaWee email with verification link,
    user name, and NYSC emerald green design system.
  - `PasswordResetEmail.tsx` — reset link with expiry notice.
  - `SOSAlertEmail.tsx` — alert notification with location and timestamp.
  - `ClearanceDueEmail.tsx` — clearance window open reminder.
  - `LogbookApprovedEmail.tsx` — logbook entry approved notification.
- Update `/api/auth/register` to call `sendEmail()` with `VerificationEmail`
  instead of returning `verificationUrl` as a JSON field. Remove the
  "Simulate Email Link Click" UI from the auth page.
- Add `/api/auth/forgot-password` and `/api/auth/reset-password` routes for
  the password reset flow with token generation, expiry (1 hour), and
  `PasswordResetEmail` dispatch.
- Trigger `SOSAlertEmail` from `/api/safety/sos` POST on alert creation.
- Trigger `ClearanceDueEmail` from `/api/cron/journey-status` when a user
  becomes eligible for clearance.
- Trigger `LogbookApprovedEmail` from the logbook approval route on status
  change to `APPROVED`.

### FR-5: Gemini AI Assistant

- Create `src/app/api/ai/listing/route.ts` (the directory already exists as a
  stub).
- Install `@google/generative-ai`.
- The route accepts `POST { message: string, context?: string }`, calls the
  Gemini API with a KopaWee-aware system prompt covering: NYSC processes,
  clearance guidance, marketplace listing advice, PPA logbook tips, CDS
  requirements, and safety protocols.
- Return `{ success: true, reply: string }`.
- Replace the hardcoded keyword-matching `handleAskAI` function in the
  dashboard overview page with a `fetch('/api/ai/listing', ...)` call.
- Read `GEMINI_API_KEY` from env. If missing, return a graceful
  `{ success: false, error: 'AI_NOT_CONFIGURED' }` rather than crashing.
- Rate-limit AI requests per session user (max 20 requests/hour) using a simple
  in-memory or DB counter.

### FR-6: Live Notification Bell

- Update `DashboardNavbar` to fetch `/api/notifications?unread=true` on mount
  and on a 60-second polling interval.
- Display an unread count badge on the bell icon when count > 0.
- On bell click, open a dropdown panel listing the 10 most recent notifications
  with title, message, timestamp, and a "Mark all read" action that calls
  `PATCH /api/notifications { markAllRead: true }`.
- Notifications are already stored in the DB (`Notification` model) — no schema
  changes needed.

---

## Non-Functional Requirements

- **NFR-1 Security:** No auth secrets or tokens in localStorage for
  authentication gating. All session validation server-side. HttpOnly cookies
  only.
- **NFR-2 TypeScript:** Full type safety on NextAuth session augmentation.
  No `any` casting in auth callbacks. `next-auth.d.ts` module augmentation
  required.
- **NFR-3 Edge Compatibility:** `middleware.ts` must use only Edge-compatible
  APIs — no Prisma, no Node.js-only modules.
- **NFR-4 Backwards Compatibility:** Existing role-switching UX
  (`RoleContext`, `ROLE_NAV_ITEMS`) is preserved. The active role stored in
  localStorage remains for display purposes — it is not used for security
  decisions.
- **NFR-5 Environment Variables:** All new secrets (`RESEND_API_KEY`,
  `GEMINI_API_KEY`, `NEXTAUTH_SECRET`) must be documented in `.env.example`
  with clear descriptions and no fallback hardcoded values in production paths.
- **NFR-6 Graceful Degradation:** If `RESEND_API_KEY` or `GEMINI_API_KEY` are
  not set (e.g. local dev without keys), the system logs a warning and degrades
  gracefully — no crashes, no unhandled promise rejections.

---

## Acceptance Criteria

- [ ] Registering a new account sends a real verification email via Resend.
- [ ] Logging in with email/password creates a NextAuth session cookie — no
      fake token written to localStorage.
- [ ] Logging in with Google OAuth continues to work and produces the same
      NextAuth session cookie.
- [ ] Visiting `/dashboard` without a session redirects to `/auth` instantly
      (no flash) via middleware.
- [ ] Visiting `/admin` without `applicationRole: ADMIN` redirects to
      `/dashboard`.
- [ ] `POST /api/clearance` with a `userId` that doesn't match the session
      returns `401`.
- [ ] The AI assistant in the dashboard sends a real request to Gemini and
      returns a contextual NYSC response.
- [ ] The notification bell shows an unread count and a dropdown of real
      notifications from the DB.
- [ ] Forgot password flow sends a real reset email and the reset link works.
- [ ] SOS alert creation triggers an email notification.
- [ ] All new env vars are documented in `.env.example`.
- [ ] No `any` type in NextAuth session callbacks or `apiAuth.ts` helper.

---

## Out of Scope

- Migrating from Neon PostgreSQL to any other database.
- Adding new dashboard modules or UI features beyond the notification bell
  dropdown and AI widget connection.
- SMS notifications or push notifications.
- Admin dashboard redesign.
- Two-factor authentication (2FA).
- Role promotion/demotion flows (existing status transition API is unchanged).
