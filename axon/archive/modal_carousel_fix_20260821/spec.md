# Spec: Modal & Carousel Fix + Black/White/Green Redesign

## Overview
Three interconnected fixes and a design upgrade to the landing page components:
1. Fix the React Hook ordering error in `RoleOnboardingModal.tsx` caused by `useEffect` being called after a conditional `return null`.
2. Fix the `HeroCarousel.tsx` autoplay not advancing on mobile — caused by a stale-closure bug in the `useEffect` interval and `isTransitioning` blocking the `goTo` call.
3. Redesign `RoleOnboardingModal.tsx` to use the canonical **Black / White / Green** design system with:
   - Primary CTA buttons: `bg-emerald-500` (green)
   - Secondary buttons: `border-2 border-black` with transparent background
   - Modal panel: white background, black text
   - Semi-transparent black backdrop overlay

## Functional Requirements

### FR1 — Carousel Autoplay Fix
- The carousel MUST auto-advance on mobile devices at the configured `AUTOPLAY_MS` interval.
- Swipe left/right on touch devices MUST trigger `next`/`prev`.
- Mouse hover pause MUST only apply on non-touch devices.
- The interval MUST be rebuilt safely without stale closure issues.

### FR2 — Modal Hook Fix
- All `useState` and `useEffect` hooks MUST be declared before any conditional `return` statements.
- `React.useEffect` for `defaultRole` sync MUST be moved above the `if (!isOpen) return null` guard.
- Static role data (`ROLES`, `STEPS`) defined outside the component to prevent re-creation on every render.

### FR3 — Modal Black/White/Green Redesign
- **Backdrop:** `bg-black/40 backdrop-blur-sm` — semi-transparent dark overlay.
- **Modal panel:** White background (`bg-white`), black text, `border border-black/10` hairline border.
- **Primary buttons:** `bg-emerald-500 hover:bg-emerald-600 text-white` — green fill.
- **Secondary buttons:** `border-2 border-black text-black hover:bg-black hover:text-white` — black border, transparent fill that inverts on hover.
- **Step tabs active:** `bg-emerald-500 text-white` — green active state.
- **Step tabs completed:** `bg-white border border-black/20 text-black` — white with subtle border.
- **Role cards selected:** `border-emerald-500 bg-emerald-50` — green accent border.
- **Role badges:** Plain black text on white background with `border-black` border.
- **Feature bullets:** `bg-emerald-500` dots, `text-slate-700` text.
- **Progress bar:** `bg-emerald-500` animated top strip showing step progression.

### FR4 — Accessibility Improvements
- `role="dialog"` + `aria-modal="true"` + `aria-label` on dialog panel.
- `role="radiogroup"` + `aria-checked` on role selector cards.
- `aria-current="step"` on active step tab.
- `role="progressbar"` + `aria-valuenow/min/max` on progress bar.
- Close button auto-focuses when modal opens.
- `Escape` key closes the modal.
- Body scroll locked while modal is open.
- All interactive elements have `focus-visible` ring styles.

### FR5 — Animations
- Modal entry: `modalSlideIn` keyframe — slide up + scale from 0.97 → 1.
- Step transitions: `stepFadeIn` keyframe — fade + slide up, re-triggered via `animKey` state bump.
- Button micro-interactions: `hover:scale-[1.02]` + `active:scale-[0.99]` with `transition-all duration-200`.
- Tab transitions: `transition-all duration-200`.

## Acceptance Criteria
- [x] Carousel advances every 6s on mobile (swipe left/right works).
- [x] No React console errors (hook ordering violation fixed).
- [x] TypeScript type check (`pnpm tsc --noEmit`) exits with code 0.
- [x] Modal overlay is dark semi-transparent (`bg-black/40`).
- [x] Modal panel is white with black text.
- [x] Primary buttons are green (`bg-emerald-500`).
- [x] Secondary buttons have black borders (`border-2 border-black`).
- [x] All 6 roles display correctly with correct feature/hiddenModule data.
- [x] Ex-Corps Member role features correct alumni-specific features.
- [x] Modal is fully keyboard accessible (Escape, Tab, Enter/Space on role cards).
- [x] Step progress bar animates correctly across steps.

## Out of Scope
- Authentication logic (form is demo-only).
- Adding new routes or dashboard pages.
- Dark mode support (deferred to a later pathway).
