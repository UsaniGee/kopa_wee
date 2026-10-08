# Plan: Flat Borderless Design Refactor

## Status: ✅ COMPLETE

---

## Phase 1 — Navbar Flat Refactor
**Files:** `src/shared/components/Navbar.tsx`

### Tasks
- [x] Remove `border-b border-black/10` from scrolled header bar.
- [x] Remove `border border-black/10` from desktop nav container.
- [x] Update secondary button from `border-2 border-black` to `bg-slate-100 text-black hover:bg-black hover:text-white` (scrolled) / `bg-white/20 text-white hover:bg-white hover:text-black` (transparent).
- [x] Remove `border-2 border-black` from mobile menu toggle button and mobile drawer header.

---

## Phase 2 — Hero Carousel Flat Refactor
**Files:** `src/shared/components/HeroCarousel.tsx`

### Tasks
- [x] Remove `border-t border-black/10` from carousel control bar.
- [x] Update carousel navigation arrow buttons from `border-2 border-black` to `bg-slate-100 text-black hover:bg-slate-200`.
- [x] Update secondary action button from `border-2 border-white` to `bg-white/20 hover:bg-white hover:text-black text-white`.

---

## Phase 3 — Role Onboarding Modal Flat Refactor
**Files:** `src/shared/components/RoleOnboardingModal.tsx`

### Tasks
- [x] Remove `border-2 border-black` from modal dialog container, close button, step tabs nav, form inputs, role cards, badges, role banner, and footer buttons.
- [x] Use `bg-slate-100` for step nav container, `bg-slate-100 focus:bg-slate-200` for form inputs.
- [x] Role cards: selected state `bg-emerald-100 text-black shadow-md`, unselected state `bg-slate-100 hover:bg-slate-200 text-black`.
- [x] Role badges: `bg-black text-white px-2 py-0.5`.
- [x] Secondary buttons: `bg-slate-200 text-black hover:bg-black hover:text-white`.

---

## Phase 4 — Footer Flat Refactor
**Files:** `src/shared/components/Footer.tsx`

### Tasks
- [x] Remove `border-t-2 border-black` and `border-b border-slate-800` from footer container.
- [x] Supporting badge: `bg-slate-900 text-emerald-400` without outline border.
- [x] Ensure clear contrast using flat dark surfaces (`bg-slate-950` / `bg-black`).

---

## Phase 5 — Landing Page (`page.tsx`) Flat Refactor
**Files:** `src/app/page.tsx`

### Tasks
- [x] Remove `border-b border-black/10` from section dividers; use alternating background fills (`bg-white` ↔ `bg-slate-50` ↔ `bg-emerald-50/50`).
- [x] Stat counters: `bg-slate-100` without borders.
- [x] Section indicator badges: `bg-slate-200 text-black` / `bg-emerald-100 text-emerald-800` without borders.
- [x] Service tab buttons: selected state `bg-emerald-100 text-black`, unselected state `bg-white hover:bg-slate-100`.
- [x] Service detail card & preview card: `bg-white` / `bg-slate-100` without borders.
- [x] LEGO architecture boxes & 4-year roadmap items: `bg-white` / `bg-slate-50` / `bg-emerald-100` without borders.
- [x] Calculator container & result cards: `bg-slate-100` / `bg-white` without borders.

---

## Verification & Checkpoint
- [x] Run `pnpm tsc --noEmit` to verify type safety (Exit Code 0).
- [x] Check responsive layout on desktop and mobile.
