# Plan: Security Hardening, Unified Auth & Platform Completion

## Phase 1: Dependencies & Environment Setup

- [ ] Task: Install required packages
  - [ ] Install `resend` and `@react-email/components` and `@react-email/render`
  - [ ] Install `@google/generative-ai`
  - [ ] Verify all packages resolve without peer-dependency conflicts (`pnpm install`)
- [ ] Task: Update environment variables
  - [ ] Add `RESEND_API_KEY`, `GEMINI_API_KEY`, `NEXTAUTH_SECRET` (mandatory, no fallback) to `.env.local`
  - [ ] Create `.env.example` documenting all required vars with descriptions and no real values
  - [ ] Remove hardcoded `NEXTAUTH_SECRET` fallback string from `[...nextauth]/route.ts`
  - [ ] Remove hardcoded `mock_google_client_id` / `mock_google_client_secret` fallbacks — replace with `process.env.GOOGLE_CLIENT_ID!` / `process.env.GOOGLE_CLIENT_SECRET!`
  - [ ] Remove hardcoded cron secret fallback from `/api/cron/journey-status`
- [ ] Task: Phase 1 Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: NextAuth v5 Session Type Augmentation & CredentialsProvider

- [ ] Task: Write failing tests for CredentialsProvider auth flow
  - [ ] Test: valid email + password returns a session with `id`, `role`, `nyscStatus`, `applicationRole`, `isVerified`
  - [ ] Test: wrong password returns `null` (no session created)
  - [ ] Test: unverified user (`isVerified: false`) is rejected with an appropriate error
  - [ ] Confirm tests fail (Red phase)
- [ ] Task: Create `next-auth.d.ts` type augmentation
  - [ ] Extend `Session.user` with `id: string`, `role: Role`, `applicationRole: ApplicationRole`, `nyscStatus: NyscStatus`, `isVerified: boolean`
  - [ ] Extend `JWT` token with the same fields
  - [ ] Remove all `(session.user as any)` casts from `[...nextauth]/route.ts`
- [ ] Task: Add `CredentialsProvider` to NextAuth config
  - [ ] Accept `email` and `password` credentials
  - [ ] Look up user by email in DB via Prisma
  - [ ] Verify password with `bcrypt.compare`
  - [ ] Reject if `isVerified` is `false` with error message `"EMAIL_NOT_VERIFIED"`
  - [ ] Return typed user object `{ id, email, name, role, applicationRole, nyscStatus, isVerified }`
- [ ] Task: Update `jwt` callback to persist custom fields into the token
- [ ] Task: Update `session` callback to read fields from token (not DB re-query on every request)
- [ ] Task: Run tests — confirm Green phase
- [ ] Task: Phase 2 Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Auth Page & Client-Side Session Migration

- [ ] Task: Write failing tests for client auth flow
  - [ ] Test: successful credentials login calls `signIn('credentials', ...)` and receives `ok: true`
  - [ ] Test: failed login surfaces error message to UI
  - [ ] Test: no localStorage `kopawee_auth_token` fake token is written after login
  - [ ] Confirm tests fail (Red phase)
- [ ] Task: Refactor `src/app/auth/page.tsx` signin flow
  - [ ] Replace `fetch('/api/auth/login')` + localStorage fake token write with `signIn('credentials', { email, password, redirect: false })`
  - [ ] Handle `result.error` from `signIn` — map `EMAIL_NOT_VERIFIED` to a verification notice UI
  - [ ] On success, use `router.push(dest)` as before (redirect logic unchanged)
  - [ ] Remove `localStorage.setItem('kopawee_auth_token', ...)` and `localStorage.setItem('kopawee_user_id', ...)` writes
- [ ] Task: Refactor Google OAuth handler in auth page
  - [ ] Remove the premature `localStorage.setItem('kopawee_auth_token', 'google_oauth_token_...')` write before redirect
  - [ ] Let NextAuth handle session creation after OAuth callback
- [ ] Task: Update `isUserAuthenticated()` in `src/shared/utils/authNav.ts`
  - [ ] Replace localStorage token check with a session-aware check using `useSession()` from `next-auth/react`
  - [ ] Export a new `useIsAuthenticated()` React hook for client components
  - [ ] Keep `getUserRole()` reading from localStorage (non-security UX state — acceptable)
- [ ] Task: Update `DashboardLayout` auth guard
  - [ ] Replace `isUserAuthenticated()` useEffect check with `useSession()` status
  - [ ] Remove the client-side redirect fallback (middleware now handles this — keep as a secondary safety net only)
- [ ] Task: Run tests — confirm Green phase
- [ ] Task: Phase 3 Verification & Checkpoint (Refer to workflow.md)

---

## Phase 4: `middleware.ts` Route Protection

- [ ] Task: Write failing tests for middleware
  - [ ] Test: unauthenticated request to `/dashboard` returns a redirect to `/auth?mode=signin&redirect=%2Fdashboard`
  - [ ] Test: authenticated request to `/dashboard` passes through
  - [ ] Test: authenticated non-admin request to `/admin` returns redirect to `/dashboard`
  - [ ] Test: authenticated admin request to `/admin` passes through
  - [ ] Test: public routes (`/`, `/auth`, `/api/auth/callback/google`) are not intercepted
  - [ ] Confirm tests fail (Red phase)
- [ ] Task: Create `src/middleware.ts`
  - [ ] Import `getToken` from `next-auth/jwt`
  - [ ] Define matcher: `['/dashboard/:path*', '/admin/:path*', '/onboarding/:path*']`
  - [ ] Read token with `getToken({ req, secret: process.env.NEXTAUTH_SECRET })`
  - [ ] If no token: `NextResponse.redirect` to `/auth?mode=signin&redirect=<pathname>`
  - [ ] If token present but `applicationRole !== 'ADMIN'` on `/admin` paths: redirect to `/dashboard`
  - [ ] Otherwise: `NextResponse.next()`
- [ ] Task: Run tests — confirm Green phase
- [ ] Task: Phase 4 Verification & Checkpoint (Refer to workflow.md)

---

## Phase 5: Server-Side API Authorization Audit

- [ ] Task: Create `src/shared/lib/apiAuth.ts` helper
  - [ ] Write failing test: unauthenticated call returns `NextResponse` with status `401`
  - [ ] Write failing test: authenticated call returns typed session user
  - [ ] Implement `requireAuth(req)` — calls `getServerSession(authOptions)`, returns session user or throws typed `NextResponse 401`
  - [ ] Implement `requireAdmin(req)` — calls `requireAuth`, checks `applicationRole === 'ADMIN'`, throws `NextResponse 403` otherwise
  - [ ] Confirm tests pass (Green phase)
- [ ] Task: Audit and update `/api/clearance`
  - [ ] Add `requireAuth` call
  - [ ] Verify `session.user.id === body.userId` — return `403` if mismatch
- [ ] Task: Audit and update `/api/users/me`
  - [ ] Scope response to `session.user.id` only — ignore any user-supplied id param
- [ ] Task: Audit and update `/api/users/status`
  - [ ] Add `requireAuth`, verify `session.user.id === body.userId`
- [ ] Task: Audit and update `/api/users/journey`
  - [ ] Add `requireAuth`, scope journey fetch/update to session user
- [ ] Task: Audit and update `/api/marketplace` (POST, PATCH, DELETE)
  - [ ] Add `requireAuth` on mutating methods
  - [ ] Verify listing ownership (`listing.userId === session.user.id`) on PATCH/DELETE
- [ ] Task: Audit and update `/api/accommodation` (POST, PATCH, DELETE)
  - [ ] Add `requireAuth` on mutating methods
  - [ ] Verify listing ownership on PATCH/DELETE
- [ ] Task: Audit and update `/api/safety/sos`
  - [ ] Add `requireAuth` — SOS must be linked to authenticated user
- [ ] Task: Audit and update `/api/notifications`
  - [ ] Add `requireAuth`, scope all queries to `session.user.id`
- [ ] Task: Audit and update `/api/packing-items`
  - [ ] Add `requireAuth`, scope all queries/mutations to session user
- [ ] Task: Audit and update `/api/admin/*` routes
  - [ ] Replace localStorage admin token check with `requireAdmin()`
- [ ] Task: Phase 5 Verification & Checkpoint (Refer to workflow.md)

---

## Phase 6: Resend Email — React Email Templates & Transactional Flows

- [ ] Task: Create `src/shared/lib/email.ts`
  - [ ] Write failing test: `sendEmail()` called with missing `RESEND_API_KEY` logs warning and returns `{ success: false }` without throwing
  - [ ] Write failing test: `sendEmail()` with valid config calls Resend client with correct `from`, `to`, `subject`, `html`
  - [ ] Implement typed `sendEmail({ to, subject, template })` helper
  - [ ] Graceful degradation: if `RESEND_API_KEY` not set, warn and return early
  - [ ] Confirm tests pass (Green phase)
- [ ] Task: Create `src/shared/emails/VerificationEmail.tsx`
  - [ ] React Email template with KopaWee branding (emerald green, Outfit font)
  - [ ] Props: `{ name: string, verificationUrl: string }`
  - [ ] Sections: greeting, CTA button, expiry notice, footer
- [ ] Task: Create `src/shared/emails/PasswordResetEmail.tsx`
  - [ ] Props: `{ name: string, resetUrl: string }`
  - [ ] 1-hour expiry notice
- [ ] Task: Create `src/shared/emails/SOSAlertEmail.tsx`
  - [ ] Props: `{ name: string, location: string, timestamp: string, alertId: string }`
- [ ] Task: Create `src/shared/emails/ClearanceDueEmail.tsx`
  - [ ] Props: `{ name: string, nextEligibleAt: string }`
- [ ] Task: Create `src/shared/emails/LogbookApprovedEmail.tsx`
  - [ ] Props: `{ name: string, entryDate: string, ppaName: string }`
- [ ] Task: Update `/api/auth/register` to send real verification email
  - [ ] Replace `verificationUrl` JSON response field with `sendEmail(VerificationEmail)`
  - [ ] Remove "Simulate Email Link Click" UI from `src/app/auth/page.tsx`
  - [ ] Update auth page to show "Check your inbox" notice instead
- [ ] Task: Create `/api/auth/forgot-password` route
  - [ ] Accept `{ email }`, find user, generate `passwordResetToken` (crypto random) + `passwordResetExpiry` (now + 1hr)
  - [ ] Store token hash on `User` model (add fields to Prisma schema + migration)
  - [ ] Send `PasswordResetEmail` via Resend
  - [ ] Return `{ success: true }` regardless of whether email exists (prevent enumeration)
- [ ] Task: Create `/api/auth/reset-password` route
  - [ ] Accept `{ token, password }`, verify token hash + expiry, bcrypt hash new password, clear token fields
  - [ ] Return `{ success: true }` on success
- [ ] Task: Add forgot/reset password UI to `src/app/auth/page.tsx`
  - [ ] "Forgot password?" link on sign-in form → email input screen
  - [ ] Reset password page at `/auth/reset-password?token=...`
- [ ] Task: Trigger `SOSAlertEmail` from `/api/safety/sos` POST
- [ ] Task: Trigger `ClearanceDueEmail` from `/api/cron/journey-status` on clearance eligibility
- [ ] Task: Trigger `LogbookApprovedEmail` from logbook approval route
- [ ] Task: Add `passwordResetToken` and `passwordResetExpiry` fields to Prisma `User` model
  - [ ] Generate and run Prisma migration
- [ ] Task: Phase 6 Verification & Checkpoint (Refer to workflow.md)

---

## Phase 7: Gemini AI Assistant

- [ ] Task: Write failing tests for `/api/ai/listing`
  - [ ] Test: POST with `{ message }` returns `{ success: true, reply: string }`
  - [ ] Test: missing `GEMINI_API_KEY` returns `{ success: false, error: 'AI_NOT_CONFIGURED' }` with status `503`
  - [ ] Test: unauthenticated request returns `401`
  - [ ] Test: rate limit exceeded returns `429`
  - [ ] Confirm tests fail (Red phase)
- [ ] Task: Create `src/app/api/ai/listing/route.ts`
  - [ ] Add `requireAuth` guard
  - [ ] Initialize `GoogleGenerativeAI` client from `@google/generative-ai`
  - [ ] Define KopaWee system prompt covering: NYSC processes, clearance guidance, marketplace listing advice, PPA logbook tips, CDS requirements, safety protocols, state deployment guidance
  - [ ] Accept `POST { message: string, context?: string }`
  - [ ] Call `gemini-1.5-flash` model (cost-efficient) with system prompt + user message
  - [ ] Return `{ success: true, reply: string }`
  - [ ] Graceful degradation if `GEMINI_API_KEY` missing
  - [ ] Simple rate limiting: track request count per `session.user.id` in DB or in-memory map (max 20/hour)
- [ ] Task: Update dashboard AI widget
  - [ ] Replace hardcoded `handleAskAI` keyword-matching function with `fetch('/api/ai/listing', { method: 'POST', body: JSON.stringify({ message }) })`
  - [ ] Handle loading, error, and `AI_NOT_CONFIGURED` states gracefully in UI
- [ ] Task: Run tests — confirm Green phase
- [ ] Task: Phase 7 Verification & Checkpoint (Refer to workflow.md)

---

## Phase 8: Live Notification Bell

- [ ] Task: Write failing tests for notification bell
  - [ ] Test: `GET /api/notifications?unread=true` returns only unread notifications for the session user
  - [ ] Test: `PATCH /api/notifications { markAllRead: true }` marks all session user notifications as read
  - [ ] Test: unauthenticated requests to both endpoints return `401`
  - [ ] Confirm tests fail (Red phase)
- [ ] Task: Update `DashboardNavbar` notification bell
  - [ ] Add `useEffect` to fetch `/api/notifications?unread=true` on mount
  - [ ] Set up 60-second polling interval (cleared on unmount)
  - [ ] Display unread count badge on bell icon when count > 0
  - [ ] On bell click: open dropdown panel with 10 most recent notifications
  - [ ] Each notification row: title, message preview, relative timestamp
  - [ ] "Mark all read" button calls `PATCH /api/notifications { markAllRead: true }` and refreshes count
- [ ] Task: Update `/api/notifications` route to use `requireAuth` (from Phase 5 audit)
  - [ ] Support `?unread=true` query param filter
  - [ ] Support `PATCH { markAllRead: true }` body
  - [ ] Ensure all queries are scoped to `session.user.id`
- [ ] Task: Run tests — confirm Green phase
- [ ] Task: Phase 8 Verification & Checkpoint (Refer to workflow.md)

---

## Phase 9: Final Cleanup & Documentation

- [ ] Task: Remove dead code
  - [ ] Remove `/api/auth/login` route's client-side response data that is no longer used for token storage
  - [ ] Remove any remaining `localStorage.setItem('kopawee_auth_token', ...)` writes across the entire codebase
  - [ ] Remove "Simulate Email Link Click" button and associated mock UI from auth page (done in Phase 6 but verify sweep)
- [ ] Task: Update `.env.example` with all new variables
  - [ ] `NEXTAUTH_SECRET` — mandatory, generate with `openssl rand -base64 32`
  - [ ] `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth Console
  - [ ] `RESEND_API_KEY` — Resend dashboard
  - [ ] `GEMINI_API_KEY` — Google AI Studio
  - [ ] `DATABASE_URL` — Neon PostgreSQL connection string
  - [ ] `CRON_SECRET` — random secret for cron endpoint protection
- [ ] Task: Update `axon/tech-stack.md` to document new dependencies
  - [ ] Add `resend`, `@react-email/components`, `@react-email/render`, `@google/generative-ai`
- [ ] Task: Run full lint + type check
  - [ ] `pnpm lint` — zero errors
  - [ ] `pnpm tsc --noEmit` — zero type errors
- [ ] Task: Phase 9 Verification & Checkpoint (Refer to workflow.md)
