# Implementation Plan: Flat Borderless Design Sweep Across KopaWee+

## Phase 1: Auth & Onboarding Flat Design Alignment
- [x] Task: Audit & refine `src/app/auth/page.tsx` — remove input border strokes (`border-slate-200`) and replace with flat background contrast (`bg-slate-100`).
- [x] Task: Audit & refine `src/app/onboarding/page.tsx` — remove card borders, input borders, and badge outlines; enforce pure color planes and flat step progress.

## Phase 2: Landing Page & Shared Navigation Sweep
- [x] Task: Audit `src/shared/components/Navbar.tsx`, `HeroCarousel.tsx`, `Footer.tsx` — eliminate subtle border divider lines, ensuring pure background color contrast.
- [x] Task: Audit `src/app/page.tsx` landing sections.

## Phase 3: Dashboard Layout & Sub-Module Borderless Refactor
- [x] Task: Refactor `src/app/dashboard/layout.tsx` & `DashboardNavbar.tsx` to remove border lines.
- [x] Task: Refactor `/dashboard/page.tsx` overview cards.
- [x] Task: Refactor `/dashboard/companion/page.tsx` & `CampEssentialsChecklist.tsx`.
- [x] Task: Refactor `/dashboard/marketplace/page.tsx` location bar & listing cards.
- [x] Task: Refactor `/dashboard/accommodation/page.tsx`, `/dashboard/safety/page.tsx`, `/dashboard/workplace/page.tsx`, `/dashboard/community/page.tsx`.

## Phase 4: Verification & Inspection
- [x] Task: Execute `pnpm tsc --noEmit` and run `axon-inspect` to verify 100% flat borderless consistency.
