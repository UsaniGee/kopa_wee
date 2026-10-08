# Spec: Dummy Data Purge, Data Integrity & AXON Records Unification

**Type:** Refactor + Chore
**Source audit:** [audit.md](./audit.md) (2026-10-08). Finding IDs such as A1 and B4 refer to it.

## Overview

KopaWee should run only on real user and database data. A full audit found about 250 problems:
- Fabricated values written to the database (onboarding, SOS, listings, logbook).
- Hard-coded mockups shown as real (the CDS, PPA, Inspector, vault, safety and leave screens).
- Browser storage used in place of the login session.
- Places where the frontend and API don't match.
- AXON records that no longer describe the code: stale statuses, superseded design decisions, docs that contradict the code.

This pathway removes every piece of dummy data, fixes the data-integrity bugs, wires up the backends that already exist, gives unbuilt features honest "Coming soon" screens, and brings AXON's records and docs back in line with the code.

## Functional Requirements

### FR1 — AXON records unification
1. Normalise every `metadata.json` `status` to one of `new | in_progress | completed | superseded`, and add one where it's missing (`modal_carousel_fix_20260821`).
2. Mark as **superseded**, with a note naming what replaced each:
   - `flat_design_refactor_20260821`, `flat_borderless_sweep_20260821` and `rally_padel_refactor_20260821` → soft-edge bordered design.
   - The Resend parts of `security_hardening_unified_auth_20260910` and `email_invite_auth_errors_20260914` → `nodemailer_gmail_smtp_20260914`.
3. Reconcile open tasks:
   - Tick the `security_hardening_unified_auth_20260910` tasks the 2026-10-06 review confirmed are built.
   - Move the rest (tests, clearance-due and logbook-approved email triggers) into this pathway or a named follow-up.
   - Do the same for `soft_edge_bordered_design_20260827`, `role_dashboards_20260821` and `hero_layout_fix_20260819`.
4. Write retroactive stub `plan.md` files (built from git history) for `theme_fouc_admin_design_ux_fixes_20260910`, `serving_companion_fix_admin_login_redesign_20260910` and `password_flash_invite_roommate_20260911`. Add the missing `index.md` for `flat_borderless_sweep_20260821`.
5. Record in the archive summary that `purge_dummy_data_20260831`, `purge_preselected_options_20260831` and `clear_test_packing_items_20260911` claimed work that was incomplete, and that this pathway finishes it.
6. Move every completed or superseded pathway to `axon/archive/<id>/`. Write `axon/archive/README.md`: one line per pathway with its date, outcome, status, and what superseded it if anything. Leave in `axon/pathways.md` only live pathways plus a link to the archive.
7. Fix the registry format: every link points to `index.md`, and there are no stray blank lines.

### FR2 — Testing foundation
1. Add Vitest. Prisma is mocked; tests target API route handlers and pure logic.
2. Every API route this pathway changes gets tests for success, auth failure and invalid input.
3. Rewrite `axon/workflow.md` to match:
   - API routes and logic are tested first (TDD) with Vitest.
   - UI is checked manually.
   - Every task: `tsc`, `eslint` (no new errors), `next build`.
   - The 80% coverage target is dropped for now.
   - The "Development Commands" section is filled in with the real pnpm commands.

### FR3 — Data integrity (audit section A; fixed before any UI work)
1. **Onboarding** (A1–A3):
   - No hard-coded `stateCode`, `deployedState` or `lga`.
   - Real state and LGA pickers fed by `/api/states`, and an optional state-code input with a format check.
   - Save `nyscStatus` (not just the old `role`), phone, institution, course of study, batch and stream, through a new or extended authenticated profile PATCH.
   - Check the response and show errors.
   - Refresh the session (`useSession().update()`) after saving.
   - Email sign-ups also go through onboarding.
2. **SOS** (A4–A5):
   - Use browser geolocation and the user's saved state and LGA. If the location isn't available, say so and never fill in a fake one.
   - Only show success after the server confirms.
   - API and UI text say exactly what happened (e.g. "Alert logged and emailed to you"), until trusted contacts exist.
3. **Status lifecycle** (A6, A12):
   - System-made status changes no longer write a fake user ID (make `changedBy` nullable plus a `changeType`).
   - Remove or protect the cron POST (CRON_SECRET).
   - Add a `crons` entry to `vercel.json`.
   - Allow the SERVING→ALUMNI manual change.
   - `users/status` and `clearance` stop needing a `userId` from the client.
4. **Seed** (A7): the admin account comes from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`, is never printed and never overwritten on update. States, LGAs, fields of study and the packing-item template are seeded in `prisma/seed.ts`, not lazily inside GET handlers.
5. **Fabricated writes** (A8–A10):
   - Listings and lodges send `images: []` when there's no photo; the UI shows a neutral placeholder graphic.
   - `splitInfo` comes from user input.
   - The logbook needs a real summary and hours input, and checks the response.
6. **AI listing helper** (A11):
   - `/api/ai/listing/analyse` requires login and calls Gemini (`gemini-3.8-flash`) with a strict JSON schema.
   - State and LGA are checked against the States table, and are left empty when uncertain.
   - Returns `AI_NOT_CONFIGURED` without a key.
   - No invented price, location, condition or description.
7. **Admin** (A13): the login email field starts empty; sign-out uses `signOut()` from `next-auth/react`.
8. **Security leftovers**:
   - `POST /api/options` requires login, with length and category validation.
   - `register` only accepts the PCM role.
   - Listing GETs stop exposing seller/owner email and phone to signed-out users.
   - Verification tokens get an expiry that is enforced.
   - No `NEXTAUTH_URL` fallback to localhost in production.

### FR4 — Use the backends that already exist (sections B, D and E)
1. Marketplace "Contact Seller" opens WhatsApp or a phone link from `seller.phone`. Lodge cards show `contactPhone`. Only signed-in users can see contact details.
2. Roommate contact uses `POST/PATCH /api/roommates/interest` (express interest; the owner accepts or declines; contact is shown once accepted). MATCHED requests are labelled correctly.
3. Settings shows the real subscription from `/api/subscription`, and lets users edit PPA name, LGA, deployed state, state code and call-up number.
4. Overview, workplace and companion titles, PPA name, LGA and clearance dates come from `/api/users/journey` and `/api/clearance`, with no hard-coded places or dates. "Add to Google Calendar" uses the real `nextEligibleAt` and is labelled honestly.
5. One packing checklist: `CampEssentialsChecklist` uses `/api/packing-items`. Remove `/api/checklist`, the `CampChecklist` model and the duplicate item lists.
6. Remove every client-sent `userId`, `sellerId`, `ownerId` and `adminUserId`. Check every mutation's response before showing success.

### FR5 — Remove fabricated UI, fake behaviour and dead code
1. Delete:
   - Sample and fake arrays: `SAMPLE_LISTINGS`, leave requests, CDS members and dues, safety contacts, documents, `services.ts` preview records.
   - Made-up display fallbacks: distance, verified badges, condition, price `|| 5000`, `|| "Lagos"`, names like "Corper User" and "Google Corper", the "Verified Corper" badge.
   - Fake behaviour: `setTimeout` report submits, label-flip "contact" buttons, buttons that do nothing, the dead search box (remove it).
2. Remove the `kopawee_user_id`, `kopawee_user_email`, `kopawee_user_name`, `kopawee_active_role` and `kopawee_user_profile` localStorage keys. Auth UI uses `useSession()`. The role comes from the session `nyscStatus`. Remove the `RoleContext.setRole` no-op. Theme keys stay.
3. **Landing, footer and marketing**: remove invented stats, or show a real public count. Remove claims of an NYSC HQ partnership, an encrypted vault, push notifications, a QR scanner and bye-law training. Remove the made-up impact-calculator formula. Fix the typo "Allawee". Feature lists only say "Coming soon" for unbuilt features.
4. Remove dead code and assets:
   - `RoleOnboardingModal.tsx`, unused `public/` files, the Unsplash remote pattern.
   - The duplicate `PostLodgeModal` render, the dead `handlePostItem`, the stale TODO.
   - The `resend` dependency; unused email templates either wired up or tracked as follow-ups.
5. Fix the admin page lodges list rendering on the wrong tabs.

### FR6 — Honest "Coming soon" screens for unbuilt features (FR5 decision)
1. Applies to: CDS hub, PPA/employer view, LGA inspector view, document vault, trusted contacts and trip monitor, leave requests, listing reports, job bank and CV builder, and the savings, CDS-attendance and safety-status overview cards.
2. All hard-coded data in these screens is removed.
3. Each shows one shared `ComingSoon` component (consistent with the soft-edge design): what the feature will do, and that it isn't live yet.
4. Navigation items stay but are marked "Soon".
5. Each unbuilt feature gets a line in `product.md` under "Planned".

### FR7 — Docs sync
1. `axon/tech-stack.md`:
   - Email is Nodemailer/Gmail SMTP.
   - Storage is localStorage for UI preferences only; remove the IndexedDB claim.
   - Package manager is pnpm.
   - Vitest added.
   - Note image storage (base64 in the DB) as known debt.
2. `axon/product-guidelines.md`: colour token table updated to the real `globals.css` values (light and dark).
3. `axon/product.md`: each pillar marked **Live** or **Planned**, matching the code.
4. `.env.example`: add `SEED_ADMIN_*`, `CRON_SECRET` and `GEMINI_MODEL` (if the model is made configurable).

## Non-Functional Requirements
- No new hard-coded identities, locations, prices, dates or counts anywhere in `src/`. A grep check (`LA/26A|Ikeja|unsplash|SAMPLE_|kopawee_user`) returns nothing outside approved static data (the states/LGA list, the official packing list).
- Database changes use Prisma migrations and are backward compatible (new columns nullable or defaulted).
- Mobile and dark mode still work on every changed screen.
- `tsc`, `next build` and `vitest run` pass at every phase checkpoint, and ESLint error count doesn't go up.

## Acceptance Criteria
- [ ] Two different new users can complete onboarding, and each user's own state, LGA, status, phone and institution are saved.
- [ ] An SOS alert stores the device's real location, or clearly fails; the UI never says contacts were notified.
- [ ] The status cron runs without database errors, and SERVING→ALUMNI works from the dashboard.
- [ ] No screen shows a hard-coded person, place, count, date or price; unbuilt features show "Coming soon".
- [ ] Nothing in the codebase reads or writes `kopawee_user_*` or `kopawee_active_role`.
- [ ] The AI listing helper either returns real Gemini output or `AI_NOT_CONFIGURED`, never invented locations.
- [ ] `axon/pathways.md` lists only live pathways. `axon/archive/README.md` lists all 46 old ones with accurate statuses. All `metadata.json` statuses use the four allowed values.
- [ ] `tech-stack.md`, `product-guidelines.md`, `product.md` and `workflow.md` match the code.
- [ ] Vitest runs, and the API routes this pathway changes are covered.

## Out of Scope (follow-up pathways)
- Building the "Coming soon" features (CDS, PPA, Inspector, vault plus file storage, trusted contacts and trips, leave, reports, job bank).
- Corps Member Verification (Prembly call-up number lookup plus selfie match).
- Moving image uploads to object storage.
- A persistent rate limiter (Redis or DB) for the AI and resend-verification routes.
- Push notifications and admin audit logging.
