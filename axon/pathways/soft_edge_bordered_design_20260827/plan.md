# Implementation Plan: Modern Soft-Edge & Bordered Design System Alignment

## Phase 1: CSS Variables & Design System Token Audit
- [ ] Task: Audit `src/app/globals.css` theme variables, base layer radius rules (`0.75rem`), and glassmorphism borders (`1px solid var(--card-border)`).
- [ ] Task: Synchronize `axon/product-guidelines.md` with explicit soft-edge and bordered design system definitions.

## Phase 2: Auth & Onboarding Border & Radius Alignment
- [ ] Task: Refine `src/app/auth/page.tsx` inputs and form cards with `rounded-xl` / `rounded-2xl` geometry and subtle border strokes (`border border-slate-200`).
- [ ] Task: Refactor `src/app/onboarding/page.tsx` form controls, selection cards, and stepper components to use soft borders and mint surface fills.

## Phase 3: Landing Page & Navigation Component Alignment
- [ ] Task: Ensure `src/shared/components/Navbar.tsx` and `HeroCarousel.tsx` include border dividers and rounded action pills.
- [ ] Task: Audit `src/shared/components/CampEssentialsChecklist.tsx` for bordered inputs, checklist items, and notice callouts.

## Phase 4: Dashboard & Sub-Module Soft-Edge Sweep
- [ ] Task: Refactor `/dashboard` overview cards, `/dashboard/marketplace`, `/dashboard/accommodation`, `/dashboard/safety`, `/dashboard/workplace`, and `/dashboard/community` to enforce soft borders and uniform radius hierarchy.

## Phase 5: Verification & Inspection
- [ ] Task: Execute `pnpm tsc --noEmit` and run `axon-inspect` to verify 100% design system alignment without compilation errors.
