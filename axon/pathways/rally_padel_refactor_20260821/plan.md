# Plan: Rally Padel Inspired Design Refactor

## Status: ✅ COMPLETE

---

## Phase 1 — Global CSS & Text-Roll Animation Utility
**Files:** `src/app/globals.css`

### Tasks
- [x] Add `.text-roll` utility classes in `globals.css` for tumbling text-roll animations on nav & footer links.
- [x] Ensure universal reset for rounded corners where applicable.

---

## Phase 2 — Navbar Refactor
**Files:** `src/shared/components/Navbar.tsx`

### Tasks
- [x] Remove all `rounded-*` classes (`rounded-xl`, `rounded-full`, etc.) from logo badge, nav bar pill, buttons, and mobile menu.
- [x] Implement text-roll hover animation on desktop nav links and mobile menu links.
- [x] Ensure buttons use sharp square corners (`rounded-none`).

---

## Phase 3 — Footer Refactor
**Files:** `src/shared/components/Footer.tsx`

### Tasks
- [x] Remove all `rounded-*` classes from footer form, email input, subscribe button, social links, and card surfaces.
- [x] Implement text-roll hover animation on all footer navigation menu links.

---

## Phase 4 — Hero Carousel Refactor
**Files:** `src/shared/components/HeroCarousel.tsx`

### Tasks
- [x] Remove all `rounded-*` classes from hero action buttons, slide navigation buttons, dot indicators, and progress bar container.
- [x] Apply sharp square buttons with hover translation effects.

---

## Phase 5 — Role Onboarding Modal Refactor
**Files:** `src/shared/components/RoleOnboardingModal.tsx`

### Tasks
- [x] Remove all `rounded-*` classes (`rounded-3xl`, `rounded-2xl`, `rounded-xl`, `rounded-full`) from dialog panel, progress bar, close button, step tabs, input fields, role cards, badges, role banner, and footer buttons.
- [x] Maintain black/white/green color rules (green primary CTAs, black-bordered secondary CTAs) with sharp square styling.

---

## Phase 6 — Landing Page (`page.tsx`) Refactor
**Files:** `src/app/page.tsx`

### Tasks
- [x] Remove all `rounded-*` classes from service cards, stat counters, pricing cards, FAQ accordion items, and CTA section banners.
- [x] Add sharp section indicator badges with small square/dot icons.

---

## Verification & Checkpoint
- [x] Run `pnpm tsc --noEmit` to verify type safety.
- [x] Check responsive layout on desktop and mobile.
