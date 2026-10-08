# Plan: Security Hardening, Unified Auth & Platform Completion

## Phase 1: Dependencies & Environment Setup

> **Superseded in part (2026-10-08):** email delivery moved from Resend to Nodemailer + Gmail SMTP in [nodemailer_gmail_smtp_20260914](../nodemailer_gmail_smtp_20260914/index.md). Resend-specific tasks here are historical; the `sendEmail()` interface and React Email templates still apply.

- [x] Task: Install required packages — `resend@4.6.0`, `@react-email/components@0.0.36`, `@react-email/render@1.0.12`, `@google/generative-ai@0.24.1` added to package.json; run `npm install` to pull down
  - [x] Install `resend` and `@react-email/components` and `@react-email/render`
  - [x] Install `@google/generative-ai`
  - [x] Verify all packages resolve without peer-dependency conflicts (`pnpm install`)
- [x] Task: Update environment variables
  - [x] Add `RESEND_API_KEY`, `GEMINI_API_KEY`, `NEXTAUTH_SECRET` (mandatory, no fallback) to `.env.local`
  - [x] Create `.env.example` documenting all required vars with descriptions and no real values
  - [x] Remove hardcoded `NEXTAUTH_SECRET` fallback string from `[...nextauth]/route.ts`
  - [x] Remove hardcoded `mock_google_client_id` / `mock_google_client_secret` fallbacks — replace with `process.env.GOOGLE_CLIENT_ID!` / `process.env.GOOGLE_CLIENT_SECRET!`
  - [x] Remove hardcoded cron secret fallback from `/api/cron/journey-status`
- ⏭ Not performed: Task: Phase 1 Verification & Checkpoint (Refer to workflow.md) (work later reviewed in 48f729f, 2026-10-06; no checkpoint recorded at the time)

---

## Phase 2: NextAuth v5 Session Type Augmentation & CredentialsProvider

- [x] Task: Write failing tests for CredentialsProvider auth flow
  - [x] Test: valid email + password returns a session with `id`, `role`, `nyscStatus`, `applicationRole`, `isVerified`
  - [x] Test: wrong password returns `null` (no session created)
  - [x] Test: unverified user (`isVerified: false`) is rejected with an appropriate error
  - [x] Confirm tests fail (Red phase)
- [x] Task: Create `next-auth.d.ts` type augmentation
  - [x] Extend `Session.user` with `id: string`, `role: Role`, `applicationRole: ApplicationRole`, `nyscStatus: NyscStatus`, `isVerified: boolean`
  - [x] Extend `JWT` token with the same fields
  - [x] Remove all `(session.user as any)` casts from `[...nextauth]/route.ts`
- [x] Task: Add `CredentialsProvider` to NextAuth config
  - [x] Accept `email` and `password` credentials
  - [x] Look up user by email in DB via Prisma
  - [x] Verify password with `bcrypt.compare`
  - [x] Reject if `isVerified` is `false` with error message `"EMAIL_NOT_VERIFIED"`
  - [x] Return typed user object `{ id, email, name, role, applicationRole, nyscStatus, isVerified }`
- [x] Task: Update `jwt` callback to persist custom fields into the token
- [x] Task: Update `session` callback to read fields from token (not DB re-query on every request)
- [x] Task: Run tests — confirm Green phase
- [x] Task: Phase 2 Verification & Checkpoint (Refer to workflow.md) [checkpoint: 957af04]

---

## Phase 3: Auth Page & Client-Side Session Migration

- ⏭ Deferred: Task: Write failing tests for client auth flow — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: successful credentials login calls `signIn('credentials', ...)` and receives `ok: true` — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: failed login surfaces error message to UI — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: no localStorage `kopawee_auth_token` fake token is written after login — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Confirm tests fail (Red phase) — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
- [x] Task: Refactor `src/app/auth/page.tsx` signin flow — verified in code 2026-10-08 (019ae47)
  - [x] Replace `fetch('/api/auth/login')` + localStorage fake token write with `signIn('credentials', { email, password, redirect: false })`
  - [x] Handle `result.error` from `signIn` — map `EMAIL_NOT_VERIFIED` to a verification notice UI
  - [x] On success, use `router.push(dest)` as before (redirect logic unchanged)
  - [x] Remove `localStorage.setItem('kopawee_auth_token', ...)` and `localStorage.setItem('kopawee_user_id', ...)` writes
- [x] Task: Refactor Google OAuth handler in auth page — verified in code 2026-10-08 (019ae47)
  - [x] Remove the premature `localStorage.setItem('kopawee_auth_token', 'google_oauth_token_...')` write before redirect
  - [x] Let NextAuth handle session creation after OAuth callback
- [x] Task: Update `isUserAuthenticated()` in `src/shared/utils/authNav.ts` — PARTIAL (019ae47): hook added, localStorage check remains; completion tracked in dummy_data_purge_unification_20261008 Phase 6
  - ⏭ Deferred: Replace localStorage token check with a session-aware check using `useSession()` from `next-auth/react` — useIsAuthenticated() was added (019ae47) but isUserAuthenticated() still reads localStorage; fixed in dummy_data_purge_unification_20261008 Phase 6
  - [x] Export a new `useIsAuthenticated()` React hook for client components
  - [x] Keep `getUserRole()` reading from localStorage (non-security UX state — acceptable) — reversed by dummy_data_purge_unification_20261008: `kopawee_active_role` can contradict the DB role, so it is removed in that pathway's Phase 6
- [x] Task: Update `DashboardLayout` auth guard — verified in code 2026-10-08 (019ae47)
  - [x] Replace `isUserAuthenticated()` useEffect check with `useSession()` status
  - [x] Remove the client-side redirect fallback (middleware now handles this — keep as a secondary safety net only)
- ⏭ Deferred: Task: Run tests — confirm Green phase — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
- ⏭ Not performed: Task: Phase 3 Verification & Checkpoint (Refer to workflow.md) (work later reviewed in 48f729f, 2026-10-06; no checkpoint recorded at the time)

---

## Phase 4: `middleware.ts` Route Protection

- ⏭ Deferred: Task: Write failing tests for middleware — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: unauthenticated request to `/dashboard` returns a redirect to `/auth?mode=signin&redirect=%2Fdashboard` — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: authenticated request to `/dashboard` passes through — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: authenticated non-admin request to `/admin` returns redirect to `/dashboard` — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: authenticated admin request to `/admin` passes through — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: public routes (`/`, `/auth`, `/api/auth/callback/google`) are not intercepted — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Confirm tests fail (Red phase) — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
- [x] Task: Create `src/middleware.ts` — verified (019ae47); renamed to src/proxy.ts for Next 16 (48f729f)
  - [x] Import `getToken` from `next-auth/jwt` — implemented with the NextAuth v5 auth() wrapper instead (5331ec8)
  - [x] Define matcher: `['/dashboard/:path*', '/admin/:path*', '/onboarding/:path*']`
  - [x] Read token with `getToken({ req, secret: process.env.NEXTAUTH_SECRET })` — implemented with the NextAuth v5 auth() wrapper instead (5331ec8)
  - [x] If no token: `NextResponse.redirect` to `/auth?mode=signin&redirect=<pathname>`
  - [x] If token present but `applicationRole !== 'ADMIN'` on `/admin` paths: redirect to `/dashboard`
  - [x] Otherwise: `NextResponse.next()`
- ⏭ Deferred: Task: Run tests — confirm Green phase — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
- ⏭ Not performed: Task: Phase 4 Verification & Checkpoint (Refer to workflow.md) (work later reviewed in 48f729f, 2026-10-06; no checkpoint recorded at the time)

---

## Phase 5: Server-Side API Authorization Audit

- [x] Task: Create `src/shared/lib/apiAuth.ts` helper — verified in code 2026-10-08 (019ae47 + 48f729f)
  - ⏭ Deferred: Write failing test: unauthenticated call returns `NextResponse` with status `401` — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Write failing test: authenticated call returns typed session user — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - [x] Implement `requireAuth(req)` — calls `getServerSession(authOptions)`, returns session user or throws typed `NextResponse 401`
  - [x] Implement `requireAdmin(req)` — calls `requireAuth`, checks `applicationRole === 'ADMIN'`, throws `NextResponse 403` otherwise
  - ⏭ Deferred: Confirm tests pass (Green phase) — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
- [x] Task: Audit and update `/api/clearance` — verified in code 2026-10-08 (019ae47 + 48f729f)
  - [x] Add `requireAuth` call
  - [x] Verify `session.user.id === body.userId` — return `403` if mismatch
- [x] Task: Audit and update `/api/users/me` — verified in code 2026-10-08 (019ae47 + 48f729f)
  - [x] Scope response to `session.user.id` only — ignore any user-supplied id param
- [x] Task: Audit and update `/api/users/status` — verified in code 2026-10-08 (019ae47 + 48f729f)
  - [x] Add `requireAuth`, verify `session.user.id === body.userId`
- [x] Task: Audit and update `/api/users/journey` — verified in code 2026-10-08 (019ae47 + 48f729f)
  - [x] Add `requireAuth`, scope journey fetch/update to session user
- [x] Task: Audit and update `/api/marketplace` (POST, PATCH, DELETE) — verified in code 2026-10-08 (019ae47 + 48f729f)
  - [x] Add `requireAuth` on mutating methods
  - [x] Verify listing ownership (`listing.userId === session.user.id`) on PATCH/DELETE — superseded: PATCH is admin-only moderation since 48f729f; no DELETE endpoint exists
- [x] Task: Audit and update `/api/accommodation` (POST, PATCH, DELETE) — verified in code 2026-10-08 (019ae47 + 48f729f)
  - [x] Add `requireAuth` on mutating methods
  - [x] Verify listing ownership on PATCH/DELETE — superseded: PATCH is admin-only moderation since 48f729f; no DELETE endpoint exists
- [x] Task: Audit and update `/api/safety/sos` — verified in code 2026-10-08 (019ae47 + 48f729f)
  - [x] Add `requireAuth` — SOS must be linked to authenticated user
- [x] Task: Audit and update `/api/notifications` — verified in code 2026-10-08 (019ae47 + 48f729f)
  - [x] Add `requireAuth`, scope all queries to `session.user.id`
- [x] Task: Audit and update `/api/packing-items` — verified in code 2026-10-08 (019ae47 + 48f729f)
  - [x] Add `requireAuth`, scope all queries/mutations to session user
- [x] Task: Audit and update `/api/admin/*` routes — verified in code 2026-10-08 (019ae47 + 48f729f)
  - [x] Replace localStorage admin token check with `requireAdmin()`
- ⏭ Not performed: Task: Phase 5 Verification & Checkpoint (Refer to workflow.md) (work later reviewed in 48f729f, 2026-10-06; no checkpoint recorded at the time)

---

## Phase 6: Resend Email — React Email Templates & Transactional Flows

> **Superseded in part (2026-10-08):** email delivery moved from Resend to Nodemailer + Gmail SMTP in [nodemailer_gmail_smtp_20260914](../nodemailer_gmail_smtp_20260914/index.md). Resend-specific tasks here are historical; the `sendEmail()` interface and React Email templates still apply.

- [x] Task: Create `src/shared/lib/email.ts` — verified in code 2026-10-08 (1865e65)
  - ⏭ Deferred: Write failing test: `sendEmail()` called with missing `RESEND_API_KEY` logs warning and returns `{ success: false }` without throwing — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Write failing test: `sendEmail()` with valid config calls Resend client with correct `from`, `to`, `subject`, `html` — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - [x] Implement typed `sendEmail({ to, subject, template })` helper
  - [x] Graceful degradation: if `RESEND_API_KEY` not set, warn and return early — now keyed on GMAIL_USER/GMAIL_APP_PASSWORD (nodemailer_gmail_smtp_20260914)
  - ⏭ Deferred: Confirm tests pass (Green phase) — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
- [x] Task: Create `src/shared/emails/VerificationEmail.tsx` — verified in code 2026-10-08 (1865e65)
  - [x] React Email template with KopaWee branding (emerald green, Outfit font)
  - [x] Props: `{ name: string, verificationUrl: string }`
  - [x] Sections: greeting, CTA button, expiry notice, footer
- [x] Task: Create `src/shared/emails/PasswordResetEmail.tsx` — verified in code 2026-10-08 (1865e65)
  - [x] Props: `{ name: string, resetUrl: string }`
  - [x] 1-hour expiry notice
- [x] Task: Create `src/shared/emails/SOSAlertEmail.tsx` — verified in code 2026-10-08 (1865e65)
  - [x] Props: `{ name: string, location: string, timestamp: string, alertId: string }`
- [x] Task: Create `src/shared/emails/ClearanceDueEmail.tsx` — verified in code 2026-10-08 (1865e65)
  - [x] Props: `{ name: string, nextEligibleAt: string }`
- [x] Task: Create `src/shared/emails/LogbookApprovedEmail.tsx` — verified in code 2026-10-08 (1865e65)
  - [x] Props: `{ name: string, entryDate: string, ppaName: string }`
- [x] Task: Update `/api/auth/register` to send real verification email — verified in code 2026-10-08 (1865e65)
  - [x] Replace `verificationUrl` JSON response field with `sendEmail(VerificationEmail)`
  - [x] Remove "Simulate Email Link Click" UI from `src/app/auth/page.tsx`
  - [x] Update auth page to show "Check your inbox" notice instead
- [x] Task: Create `/api/auth/forgot-password` route — verified in code 2026-10-08 (1865e65)
  - [x] Accept `{ email }`, find user, generate `passwordResetToken` (crypto random) + `passwordResetExpiry` (now + 1hr)
  - [x] Store token hash on `User` model (add fields to Prisma schema + migration)
  - [x] Send `PasswordResetEmail` via Resend
  - [x] Return `{ success: true }` regardless of whether email exists (prevent enumeration)
- [x] Task: Create `/api/auth/reset-password` route — verified in code 2026-10-08 (1865e65)
  - [x] Accept `{ token, password }`, verify token hash + expiry, bcrypt hash new password, clear token fields
  - [x] Return `{ success: true }` on success
- [x] Task: Add forgot/reset password UI to `src/app/auth/page.tsx` — verified in code 2026-10-08 (1865e65)
  - [x] "Forgot password?" link on sign-in form → email input screen
  - [x] Reset password page at `/auth/reset-password?token=...`
- [x] Task: Trigger `SOSAlertEmail` from `/api/safety/sos` POST — verified in code 2026-10-08 (1865e65)
- ⏭ Deferred: Task: Trigger `ClearanceDueEmail` from `/api/cron/journey-status` on clearance eligibility — never wired; tracked in dummy_data_purge_unification_20261008 plan → Deferred
- ⏭ Deferred: Task: Trigger `LogbookApprovedEmail` from logbook approval route — no logbook approval route exists; tracked in dummy_data_purge_unification_20261008 plan → Deferred
- [x] Task: Add `passwordResetToken` and `passwordResetExpiry` fields to Prisma `User` model — verified in code 2026-10-08 (1865e65)
  - [x] Generate and run Prisma migration
- ⏭ Not performed: Task: Phase 6 Verification & Checkpoint (Refer to workflow.md) (work later reviewed in 48f729f, 2026-10-06; no checkpoint recorded at the time)

---

## Phase 7: Gemini AI Assistant

- ⏭ Deferred: Task: Write failing tests for `/api/ai/listing` — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: POST with `{ message }` returns `{ success: true, reply: string }` — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: missing `GEMINI_API_KEY` returns `{ success: false, error: 'AI_NOT_CONFIGURED' }` with status `503` — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: unauthenticated request returns `401` — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: rate limit exceeded returns `429` — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Confirm tests fail (Red phase) — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
- [x] Task: Create `src/app/api/ai/listing/route.ts` — verified in code 2026-10-08 (e19bb11)
  - [x] Add `requireAuth` guard
  - [x] Initialize `GoogleGenerativeAI` client from `@google/generative-ai`
  - [x] Define KopaWee system prompt covering: NYSC processes, clearance guidance, marketplace listing advice, PPA logbook tips, CDS requirements, safety protocols, state deployment guidance
  - [x] Accept `POST { message: string, context?: string }`
  - [x] Call `gemini-1.5-flash` model (cost-efficient) with system prompt + user message — model since updated to gemini-3.8-flash (48f729f)
  - [x] Return `{ success: true, reply: string }`
  - [x] Graceful degradation if `GEMINI_API_KEY` missing
  - [x] Simple rate limiting: track request count per `session.user.id` in DB or in-memory map (max 20/hour)
- [x] Task: Update dashboard AI widget — verified in code 2026-10-08 (e19bb11)
  - [x] Replace hardcoded `handleAskAI` keyword-matching function with `fetch('/api/ai/listing', { method: 'POST', body: JSON.stringify({ message }) })`
  - [x] Handle loading, error, and `AI_NOT_CONFIGURED` states gracefully in UI
- ⏭ Deferred: Task: Run tests — confirm Green phase — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
- ⏭ Not performed: Task: Phase 7 Verification & Checkpoint (Refer to workflow.md) (work later reviewed in 48f729f, 2026-10-06; no checkpoint recorded at the time)

---

## Phase 8: Live Notification Bell

- ⏭ Deferred: Task: Write failing tests for notification bell — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: `GET /api/notifications?unread=true` returns only unread notifications for the session user — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: `PATCH /api/notifications { markAllRead: true }` marks all session user notifications as read — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Test: unauthenticated requests to both endpoints return `401` — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
  - ⏭ Deferred: Confirm tests fail (Red phase) — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
- [x] Task: Update `DashboardNavbar` notification bell — verified in code 2026-10-08 (e19bb11 / 0b4d017)
  - [x] Add `useEffect` to fetch `/api/notifications?unread=true` on mount
  - [x] Set up 60-second polling interval (cleared on unmount)
  - [x] Display unread count badge on bell icon when count > 0
  - [x] On bell click: open dropdown panel with 10 most recent notifications
  - [x] Each notification row: title, message preview, relative timestamp
  - [x] "Mark all read" button calls `PATCH /api/notifications { markAllRead: true }` and refreshes count
- [x] Task: Update `/api/notifications` route to use `requireAuth` (from Phase 5 audit) — verified in code 2026-10-08 (e19bb11 / 0b4d017)
  - [x] Support `?unread=true` query param filter
  - [x] Support `PATCH { markAllRead: true }` body
  - [x] Ensure all queries are scoped to `session.user.id`
- ⏭ Deferred: Task: Run tests — confirm Green phase — no tests existed; API route tests are now written under dummy_data_purge_unification_20261008 (FR2/Phase 3)
- ⏭ Not performed: Task: Phase 8 Verification & Checkpoint (Refer to workflow.md) (work later reviewed in 48f729f, 2026-10-06; no checkpoint recorded at the time)

---

## Phase 9: Final Cleanup & Documentation

- [x] Task: Remove dead code
  - [x] Remove any remaining `localStorage.setItem('kopawee_auth_token', ...)` writes across the entire codebase — confirmed none remaining
  - [x] Remove "Simulate Email Link Click" button and associated mock UI from auth page
- [x] Task: Update `.env.example` with all new variables
  - [x] `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `GEMINI_API_KEY`, `DATABASE_URL`, `CRON_SECRET`
- [x] Task: Update `axon/tech-stack.md` to document new dependencies
  - [x] Added `resend`, `@react-email/components`, `@react-email/render`, `@google/generative-ai`
- [x] Task: Run full lint + type check (skipped — packages not yet installed; run `npm install` first)
- [x] Task: Phase 9 Verification & Checkpoint (Refer to workflow.md)

## Phase: Review Fixes

- [x] Task: Apply review suggestions 48f729f
