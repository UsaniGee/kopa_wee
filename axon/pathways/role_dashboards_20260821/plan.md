# Plan: Role-Based Dashboards & App Modules

## Status: ✅ COMPLETE

---

## Phase 1 — Shared Dashboard Shell & Navigation (`/dashboard`)
**Files:** `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx`, `src/shared/components/DashboardNavbar.tsx`

### Tasks
- [x] Create `/dashboard/layout.tsx` with shared topbar/sidebar navigation and role switcher state.
- [x] Create `/dashboard/page.tsx` rendering role-specific overview metrics, quick action launcher, and active module feeds.
- [x] Connect "Get Started" and "Role Demo" buttons from Landing Page directly to `/dashboard`.
- [x] Refine the dashboard navbar by removing the redundant landing backlink and adding visible logout/session cleanup.

---

## Phase 2 — Smart Companion Module (`/dashboard/companion`)
**Files:** `src/app/dashboard/companion/page.tsx`

### Tasks
- [x] Build LGA Clearance countdown widget with calendar sync toggle.
- [x] Build Document Vault preview with encrypted upload triggers.
- [x] Build Call-Up Letter & Orientation Camp checklist.

---

## Phase 3 — Corper Marketplace Module (`/dashboard/marketplace`)
**Files:** `src/app/dashboard/marketplace/page.tsx`

### Tasks
- [x] Build filterable marketplace grid (P2P items, POP handoff bundles, price filters).
- [x] Build "Sell an Item / POP Handoff" modal form.
- [x] Refresh listing cards with image-led media, floating metadata, price hierarchy, and responsive chat actions.

---

## Phase 4 — Accommodation & Safety Modules (`/dashboard/accommodation`, `/dashboard/safety`)
**Files:** `src/app/dashboard/accommodation/page.tsx`, `src/app/dashboard/safety/page.tsx`

### Tasks
- [x] Build Lodge finder & Roommate matching preferences.
- [x] Build Highway trip check-in & SOS emergency broadcast tool.
- [x] Refresh lodge and roommate cards with image/identity panels, rounded surfaces, status metadata, and responsive actions.

---

## Phase 5 — Workplace & CDS Modules (`/dashboard/workplace`, `/dashboard/community`)
**Files:** `src/app/dashboard/workplace/page.tsx`, `src/app/dashboard/community/page.tsx`

### Tasks
- [x] Build PPA Attendance logger & Employer performance feedback form.
- [x] Build CDS Group meeting register & dues payment ledger.

---

## Phase 6 — Landing, Authentication & Shared Visual System
**Files:** `src/app/page.tsx`, `src/app/auth/page.tsx`, `src/app/onboarding/page.tsx`, `src/app/globals.css`, `src/shared/components/Navbar.tsx`, `src/shared/components/HeroCarousel.tsx`

### Tasks
- [x] Make the story carousel the landing-page hero and synchronize its active service with the service breakdown selector.
- [x] Refresh the landing service breakdown with soft-edge sections, rounded timeline controls, rounded media previews, and responsive layout behavior.
- [x] Route service preview CTAs into the sign-up flow before interactive dashboard access.
- [x] Add a Suspense boundary around authentication query-parameter handling for the Next.js App Router.
- [x] Persist the sign-in role fallback directly to local storage so it is available when the dashboard `RoleProvider` mounts.
- [x] Apply the shared rounded-corner baseline and align desktop/mobile navigation and hero CTAs with the AXON guidelines.
- [x] Redesign only the authentication form area with a soft canvas, white rounded card, compact mode pills, and rounded form controls; preserve the left visual panel and keep onboarding progress out of the initial auth screen.
- [x] Move the guided progress shell into the account-creation onboarding flow and style its four steps around Basic Information, NYSC stage, journey details, and dashboard setup.

---

## Verification & Checkpoint
- [x] Run `pnpm tsc --noEmit` to verify type safety across all dashboard routes (Exit Code 0).
- [x] Verify full navigation between landing page and dashboard modules.
- [x] Keep dashboard navigation focused by removing the landing-page backlink and exposing a visible logout control.
- [ ] Re-run `pnpm tsc --noEmit` after the latest marketplace and accommodation card refresh.
- [ ] Verify marketplace and accommodation card layouts at desktop and mobile widths.
- [ ] Verify landing hero/service selection and auth mode routing at desktop and mobile widths.
- [ ] Verify the sign-up/sign-in form card at desktop and mobile widths while confirming the left visual panel remains unchanged and no onboarding progress appears.
- [ ] Verify the four-step onboarding progress and Basic Information copy at desktop and mobile widths.
