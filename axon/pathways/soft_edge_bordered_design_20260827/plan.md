# Implementation Plan: Modern Soft-Edge & Bordered Design System Alignment

## Phase 1: CSS Variables & Design System Token Audit
- [x] Task: Audit `src/app/globals.css` theme variables, base layer radius rules (`0.75rem`), and glassmorphism borders (`1px solid var(--card-border)`). — verified 2026-10-08: `1px solid var(--card-border)` present; the 0.75rem radius rule was replaced by a 0rem base layer in 1da4525
- ⏭ Deferred: Task: Synchronize `axon/product-guidelines.md` with explicit soft-edge and bordered design system definitions. — the guidelines still describe rounded corners; rewritten for sharp + bordered in dummy_data_purge_unification_20261008 Phase 8

## Phase 2: Auth & Onboarding Border & Radius Alignment
- [x] Task: Refine `src/app/auth/page.tsx` inputs and form cards with `rounded-xl` / `rounded-2xl` geometry and subtle border strokes (`border border-slate-200`). — verified 2026-10-08: 1px borders present (e.g. auth 60, onboarding 48, dashboard 142 `border` uses); radius part superseded by sharp 0rem edges (1da4525)
- [x] Task: Refactor `src/app/onboarding/page.tsx` form controls, selection cards, and stepper components to use soft borders and mint surface fills. — verified 2026-10-08: 1px borders present (e.g. auth 60, onboarding 48, dashboard 142 `border` uses); radius part superseded by sharp 0rem edges (1da4525)

## Phase 3: Landing Page & Navigation Component Alignment
- [x] Task: Ensure `src/shared/components/Navbar.tsx` and `HeroCarousel.tsx` include border dividers and rounded action pills. — verified 2026-10-08: 1px borders present (e.g. auth 60, onboarding 48, dashboard 142 `border` uses); radius part superseded by sharp 0rem edges (1da4525)
- [x] Task: Audit `src/shared/components/CampEssentialsChecklist.tsx` for bordered inputs, checklist items, and notice callouts. — verified 2026-10-08: 1px borders present (e.g. auth 60, onboarding 48, dashboard 142 `border` uses); radius part superseded by sharp 0rem edges (1da4525)

## Phase 4: Dashboard & Sub-Module Soft-Edge Sweep
- [x] Task: Refactor `/dashboard` overview cards, `/dashboard/marketplace`, `/dashboard/accommodation`, `/dashboard/safety`, `/dashboard/workplace`, and `/dashboard/community` to enforce soft borders and uniform radius hierarchy. — verified 2026-10-08: 1px borders present (e.g. auth 60, onboarding 48, dashboard 142 `border` uses); radius part superseded by sharp 0rem edges (1da4525)

## Phase 5: Verification & Inspection
- ⏭ Not performed: Task: Execute `pnpm tsc --noEmit` and run `axon-inspect` to verify 100% design system alignment without compilation errors. — tsc is clean as of 2026-10-08; no axon-inspect run was recorded
