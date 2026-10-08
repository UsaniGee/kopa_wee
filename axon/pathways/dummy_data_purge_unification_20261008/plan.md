# Plan: Dummy Data Purge, Data Integrity & AXON Records Unification

Spec: [spec.md](./spec.md) · Audit: [audit.md](./audit.md). Labels like "FR3.2" point to spec requirements; codes like "A1" point to audit findings.

## Phase 1: Testing Foundation & Workflow (FR2) [checkpoint: 14e6257]

- [x] Task: Install and configure Vitest 4819880
  - [x] Add `vitest` as a dev dependency. Create `vitest.config.mts` with the `@/` path alias. (Deviation: Vite's built-in `resolve.alias` instead of `vite-tsconfig-paths`, one fewer dependency.)
  - [x] Add a `test` script (`vitest run`) to `package.json`.
  - [x] Add a shared Prisma mock (`src/test/prismaMock.ts`) and an auth mock for `requireAuth`/`requireAdmin` (`src/test/authMock.ts`, wired in `src/test/setup.ts`, self-tested in `src/test/mocks.test.ts`).
  - [x] Write one smoke test for `GET /api/health` and confirm it runs.
- [x] Task: Rewrite `axon/workflow.md` for how the project actually works 14e6257
  - [x] TDD for API routes and logic; manual verification for UI.
  - [x] Drop the 80% coverage target. Fill in "Development Commands" with the real commands: `pnpm dev`, `pnpm test`, `pnpm lint`, `npx tsc --noEmit`, `pnpm build`, and the Prisma migrate/seed commands.
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: AXON Records Unification (FR1) [checkpoint: 220c8dc]

- [x] Task: Normalise all `metadata.json` statuses ed99720
  - [x] Use `new | in_progress | completed | superseded` for all 46. Create the missing `modal_carousel_fix_20260821/metadata.json`.
- [x] Task: Mark superseded pathways 39bc5f3
  - [x] `flat_design_refactor_20260821`, `flat_borderless_sweep_20260821` and `rally_padel_refactor_20260821` are superseded by `soft_edge_bordered_design_20260827`. Add a note to each `index.md`.
  - [x] Add a note on the Resend tasks in `security_hardening_unified_auth_20260910` and `email_invite_auth_errors_20260914` saying they were superseded by `nodemailer_gmail_smtp_20260914`.
- [x] Task: Reconcile open tasks in finished pathways 6ab56e5
  - [x] `security_hardening_unified_auth_20260910`: tick the tasks the 2026-10-06 review confirmed are built, citing `48f729f` and earlier commits. Move the remaining tasks (tests, clearance-due and logbook-approved email triggers) into the "Deferred" section of this plan.
  - [x] Check `soft_edge_bordered_design_20260827`'s 8 tasks against the code and tick what is done. Do the same for `role_dashboards_20260821` (5) and `hero_layout_fix_20260819` (1).
- [x] Task: Fill the missing pathway files 4ddd0e6
  - [x] Write retroactive `plan.md` files from git history for `theme_fouc_admin_design_ux_fixes_20260910`, `serving_companion_fix_admin_login_redesign_20260910` and `password_flash_invite_roommate_20260911`. Add the missing `index.md`/`spec.md` stubs and `flat_borderless_sweep_20260821/index.md`.
- [x] Task: Archive and restructure the registry 220c8dc
  - [x] Move every completed or superseded pathway to `axon/archive/<id>/`.
  - [x] Write `axon/archive/README.md`: one line per pathway with date, outcome and status. Note that the three "purge dummy data" pathways were incomplete and are finished by this pathway.
  - [x] Rewrite `axon/pathways.md` to hold only live pathways (Nodemailer, this one) plus an archive link. Every link points to `index.md`, with no stray blank lines.
  - [x] Update `axon/index.md` to link the archive.
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Backend Data Integrity (FR3, API side)

- [x] Task: Schema migration 455255d
  - [x] Write the Prisma migration: make `UserStatusHistory.changedBy` nullable (keep `changeType`); add `User.verificationTokenExpiry DateTime?`. All changes backward compatible.
  - [x] Baseline Prisma Migrate (owner decision 2026-10-08; the schema was previously applied with `db push`): offline `0_init` (20 tables = 20 models) plus `20261008000000_nullable_changedby_verification_expiry`. Add `directUrl` for Neon. Document `DIRECT_URL`. Fix the workflow.md migration commands.
- [ ] Task: Status lifecycle (A6, A12)
  - [ ] Write failing tests:
    - SERVING→ALUMNI is allowed.
    - `users/status` takes the user from the session (no body `userId`).
    - The cron evaluator writes `changedBy: null` for system changes.
    - Cron POST without CRON_SECRET returns 401.
  - [ ] Implement:
    - Update `ALLOWED_MANUAL_TRANSITIONS`.
    - Remove the body `userId` from `users/status` and `clearance`.
    - Change `"SYSTEM"` → `null` in the cron route.
    - Protect the cron POST.
    - Add a `crons` entry to `vercel.json`.
  - [ ] Run the tests (Green).
- [ ] Task: Profile save endpoint for onboarding (A1–A3)
  - [ ] Write failing tests:
    - PATCH saves `nyscStatus`, phone, institution, courseOfStudy, batch, stream, deployedState, lga and stateCode for the session user.
    - Rejects a malformed state code.
    - Returns 409 when the state code is already taken.
    - Rejects an LGA not in the chosen state.
  - [ ] Implement it (extend `PATCH /api/users/role` or add `PATCH /api/users/me`), validating state and LGA against the States table.
  - [ ] Run the tests (Green).
- [ ] Task: Seed and reference data (A7)
  - [ ] Write failing tests for the seed helpers: admin is created from env only, an existing admin password is not overwritten, and nothing is printed.
  - [ ] Implement:
    - Admin from `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`.
    - Seed States/LGAs, fields of study and the packing template.
    - `/api/states`, `/api/options` and `/api/packing-items` read from seeded data, with no lazy writes in GET handlers.
    - `/api/states` returns 503 on a DB error instead of fake IDs.
  - [ ] Run the tests (Green).
- [ ] Task: AI listing helper with real Gemini (A11)
  - [ ] Write failing tests (Gemini client mocked):
    - Returns 401 when signed out.
    - Returns `AI_NOT_CONFIGURED` with no key.
    - A state/LGA not in the States table comes back as `null`.
    - Never returns a stock image or default location.
  - [ ] Implement `/api/ai/listing/analyse` with `gemini-3.8-flash` and a strict JSON response schema. Accept images as input.
  - [ ] Run the tests (Green).
- [ ] Task: Security leftovers (FR3.8)
  - [ ] Write failing tests:
    - `POST /api/options` returns 401 when signed out and 400 for oversized or unknown-category values.
    - `register` rejects any role other than PCM.
    - Listing GETs for signed-out users hide seller/owner email and phone.
    - Verification fails once the token has expired.
  - [ ] Implement:
    - Auth and validation on options.
    - Lock the role on register.
    - Select contact fields only when signed in.
    - Set and check `verificationTokenExpiry`.
    - One required-env helper for `NEXTAUTH_URL` (no localhost fallback in production).
    - Unify the minimum password length at 8.
  - [ ] Run the tests (Green).
- [ ] Task: Honest SOS API wording (A5)
  - [ ] Write a failing test: the response message describes only what actually happened, and `latitude`/`longitude` are required numbers.
  - [ ] Implement, then run the tests (Green).
- [ ] Task: Apply migrations on the Neon dev branch (owner creates the branch; never production)
  - [ ] Confirm `.env.local` `DATABASE_URL`/`DIRECT_URL` host differs from production (`ep-super-fire-aykwex2w`).
  - [ ] Check for drift: `prisma migrate diff --from-url $DIRECT_URL --to-migrations prisma/migrations` (or `--to-schema-datamodel` of the pre-change schema) shows no difference before baselining.
  - [ ] `prisma migrate resolve --applied 0_init`, then `prisma migrate deploy`.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: Frontend Data Integrity (FR3, UI side)

- [ ] Task: Rebuild onboarding saving (A1–A3)
  - [ ] Remove the hard-coded `stateCode`, the "Lagos"/"Ikeja" defaults and the fake form defaults.
  - [ ] Add state and LGA pickers from `/api/states` and an optional state-code input with a format hint.
  - [ ] Call the profile endpoint, check the response, show errors, then call `useSession().update()`.
  - [ ] Send email sign-ups to `/onboarding` after their first sign-in when the profile is incomplete.
  - [ ] Manual check: two new users complete onboarding with different states, and both are saved correctly.
- [ ] Task: SOS location (A4)
  - [ ] Use `navigator.geolocation` plus the user's saved state/LGA. Show an error if permission is denied.
  - [ ] Only show success after the server confirms.
  - [ ] Remove the "trusted contacts notified" wording.
- [ ] Task: Stop fabricated writes (A8–A10)
  - [ ] Marketplace and accommodation send `images: []` when there's no photo and render a neutral placeholder graphic.
  - [ ] Add a `splitInfo` input.
  - [ ] Logbook gets summary and hours inputs and a response check. `loggedToday` is derived from today's existing entry.
  - [ ] Wire the marketplace "Create with AI" button to the new response shape, and refresh the LGA list when the AI sets the state.
- [ ] Task: Admin fixes (A13)
  - [ ] Start the login email field empty, use `signOut()` from `next-auth/react`, and fix the lodges list showing on the wrong tabs.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 5: Wire Existing Backends (FR4)

- [ ] Task: Contact flows
  - [ ] Marketplace "Contact Seller" opens WhatsApp or a phone link. Lodge cards show `contactPhone`. Both only when signed in.
  - [ ] Write failing tests for the roommate interest flow: express interest, owner accepts or declines, contact shown after acceptance, MATCHED requests can't be edited. Fix the route if needed (Green).
  - [ ] UI: express interest, a list of incoming interests with accept/decline, and correct MATCHED labels.
- [ ] Task: Real profile data everywhere
  - [ ] Overview, workplace and companion: take PPA name, LGA, state and dates from `/api/users/journey` and `/api/clearance`. Remove all hard-coded places and dates.
  - [ ] Calendar link uses the real `nextEligibleAt`, labelled "Add to Google Calendar".
  - [ ] Settings: show the real subscription from `/api/subscription`, and add editable PPA name, LGA, deployed state, state code and call-up number.
- [ ] Task: One packing checklist
  - [ ] Switch `CampEssentialsChecklist` to `/api/packing-items`.
  - [ ] Remove `/api/checklist` and its tests, the `CampChecklist` model (migration) and the duplicate item lists.
- [ ] Task: Clean up client requests
  - [ ] Remove every client-sent `userId`, `sellerId` and `ownerId`.
  - [ ] Check every mutation's response before showing success, and roll back optimistic updates on failure.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 6: Remove Fabricated UI, localStorage Shadows & Dead Code (FR5)

- [ ] Task: Remove fake records and fallbacks
  - [ ] Delete the fake arrays: `SAMPLE_LISTINGS`, leave requests, CDS members and dues, safety contacts, vault documents, `services.ts` preview records.
  - [ ] Delete the made-up fallbacks: `distanceKm` and the distance slider, fake verified badges and "condition", `|| 5000`, `|| "Lagos"`, "Corper User", "Google Corper", "Verified Corper".
  - [ ] Delete the fake behaviour: `setTimeout` report submits, the label-flip contact button, buttons that do nothing, the navbar search box.
- [ ] Task: Remove localStorage stand-ins for the session
  - [ ] Delete `kopawee_user_id`, `kopawee_user_email`, `kopawee_user_name`, `kopawee_active_role` and `kopawee_user_profile`.
  - [ ] Navbar, Footer and authNav use `useSession()`. The auth page redirect uses the `/api/users/me` result. Remove the `RoleContext.setRole` no-op.
- [ ] Task: Honest marketing
  - [ ] Landing: remove the invented stats (or show a real public user count), the HQ partnership wording and the impact-calculator formula. Fix "Allawee".
  - [ ] Footer and `services.ts`: remove claims for features that don't exist. Remove the false "audited" claims from the admin login and invite email.
- [ ] Task: Dead code and dependencies
  - [ ] Delete `RoleOnboardingModal.tsx`, the unused `public/` files, the Unsplash remote pattern, the duplicate `PostLodgeModal`, the dead `handlePostItem`, the stale TODO and the `resend` package.
  - [ ] Fix the layout title: "KopaWee".
- [ ] Task: Run the dummy-data grep (`LA/26A|Ikeja|unsplash|SAMPLE_|kopawee_user|kopawee_active_role`) and confirm nothing turns up outside the approved static data.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 7: Honest "Coming Soon" States (FR6)

- [ ] Task: Build a shared `ComingSoon` component (soft-edge design, dark mode, mobile) and a "Soon" nav badge.
- [ ] Task: Replace the mockups
  - [ ] CDS hub (community page and overview CDS view).
  - [ ] PPA/employer view (overview and workplace).
  - [ ] LGA inspector (overview and companion).
  - [ ] Document vault (companion).
  - [ ] Trusted contacts and trip monitor (safety).
  - [ ] Leave requests, listing reports, job bank and CV builder (alumni card).
  - [ ] The savings, CDS-attendance and safety-status overview cards.
- [ ] Task: Run the `axon-compose` checks on every changed screen.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 8: Docs Sync & Final Audit (FR7)

- [ ] Task: Update `axon/tech-stack.md` (Nodemailer, no IndexedDB, pnpm, Vitest, image-storage debt), `axon/product-guidelines.md` (real colour tokens, light and dark; rewrite the radius rules for the canonical **sharp-edged (0rem) + bordered** system confirmed 2026-10-08) and `axon/product.md` (each pillar Live or Planned).
- [ ] Task: Update `.env.example` with `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `CRON_SECRET` and `GEMINI_MODEL` (if made configurable).
- [ ] Task: Re-run the audit greps and walk through every acceptance criterion in spec.md. Record the results in this plan.
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Deferred (follow-up pathways, not part of this pathway)
- Build the "Coming soon" features: CDS, PPA/employer, inspector, document vault with file storage, trusted contacts and trips, leave requests, reports, job bank.
- Corps Member Verification (Prembly call-up number lookup plus selfie match).
- Move image uploads to object storage.
- A persistent rate limiter for the AI and resend-verification routes.
- Send the clearance-due and logbook-approved emails (from `security_hardening_unified_auth_20260910`).
