# Implementation Plan: Replace Lucide React with React Icons Dependency Migration

## Phase 1: Package Management & Tech Stack Update
- [ ] Task: Uninstall `lucide-react` and install `react-icons` package using `pnpm`.
- [ ] Task: Synchronize `axon/tech-stack.md` to reflect `react-icons`.

## Phase 2: Refactor Shared Data & Components
- [ ] Task: Update `src/shared/data/services.ts` icon imports to `react-icons`.
- [ ] Task: Update `src/shared/components/Navbar.tsx`, `Footer.tsx`, `HeroCarousel.tsx`, and `RoleOnboardingModal.tsx`.
- [ ] Task: Update `src/shared/components/CampEssentialsChecklist.tsx` and `DashboardNavbar.tsx`.

## Phase 3: Refactor Landing, Auth & Onboarding Pages
- [ ] Task: Refactor `src/app/page.tsx` landing page.
- [ ] Task: Refactor `src/app/auth/page.tsx` auth split screen.
- [ ] Task: Refactor `src/app/onboarding/page.tsx` progressive wizard.

## Phase 4: Refactor Dashboard Sub-Modules
- [ ] Task: Refactor `src/app/dashboard/layout.tsx` & `src/app/dashboard/page.tsx`.
- [ ] Task: Refactor `/dashboard/marketplace/page.tsx`, `/dashboard/accommodation/page.tsx`, `/dashboard/safety/page.tsx`, `/dashboard/workplace/page.tsx`, `/dashboard/community/page.tsx`, and `/dashboard/companion/page.tsx`.

## Phase 5: Verification & Inspection
- [ ] Task: Execute `pnpm tsc --noEmit` to verify 100% type safety with zero missing icon imports.
