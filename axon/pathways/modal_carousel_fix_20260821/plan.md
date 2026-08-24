# Plan: Modal & Carousel Fix + Black/White/Green Redesign

## Status: ✅ COMPLETE

## Phase 1 — Carousel Mobile Autoplay Fix
**File:** `src/shared/components/HeroCarousel.tsx`

### Tasks
- [x] Move `isTouchDevice` tracking to a `useRef` to persist across renders without triggering re-renders.
- [x] Add `onTouchStart` / `onTouchEnd` handlers to detect swipe gestures.
- [x] Guard mouse hover pause behind `!isTouchDevice.current` so mobile never blocks autoplay.
- [x] Restart interval on `activeIndex` change to prevent stale closure in `next()`.

---

## Phase 2 — Modal Hook Order Fix
**File:** `src/shared/components/RoleOnboardingModal.tsx`

### Tasks
- [x] Move all `useState` declarations to the very top of the component function.
- [x] Move all `useEffect` declarations above the `if (!isOpen) return null` guard.
- [x] Extract static `ROLES` and `STEPS` arrays outside the component to prevent re-creation.
- [x] Remove duplicate `useState` declarations introduced by a failed multi-replace edit.
- [x] Remove orphaned object literals (lines 85–92, 107–114, 129–136) from broken prior edit.
- [x] Fix stray `>` character in backdrop JSX on original line 146.

---

## Phase 3 — Black/White/Green Redesign
**File:** `src/shared/components/RoleOnboardingModal.tsx`

### Tasks
- [x] Backdrop: `bg-black/40 backdrop-blur-sm` (dark semi-transparent).
- [x] Modal panel: `bg-white text-black border border-black/10 rounded-3xl`.
- [x] Green top progress bar (`bg-emerald-500`) animates across steps via inline `style.width`.
- [x] Close button: `border-2 border-black` secondary style (black-bordered, inverts on hover).
- [x] Step tabs — active: `bg-emerald-500 text-white`; past: `bg-white border border-black/20`; future: `text-slate-500`.
- [x] Sign-up form inputs: `bg-slate-50 border-slate-200` with `focus:ring-emerald-500`.
- [x] Primary buttons (Verify, Explore): `bg-emerald-500 hover:bg-emerald-600`.
- [x] Secondary buttons (Change Role, Back to Roles): `border-2 border-black hover:bg-black hover:text-white`.
- [x] Role cards — selected: `border-emerald-500 bg-emerald-50`; unselected: `border-black/10 bg-white`.
- [x] Role badges: `border-black text-black bg-white`.
- [x] Feature bullets: `bg-emerald-500`.
- [x] Role banner on preview step: `bg-emerald-500 text-white`.

---

## Phase 4 — Accessibility
**File:** `src/shared/components/RoleOnboardingModal.tsx`

### Tasks
- [x] `role="dialog"` + `aria-modal="true"` + `aria-label` on dialog panel.
- [x] `role="radiogroup"` + `role="radio"` + `aria-checked` on role grid.
- [x] `aria-current="step"` on active step tab button.
- [x] `role="progressbar"` + `aria-valuenow/min/max` on progress strip.
- [x] `htmlFor` / `id` on all form labels + inputs.
- [x] `autoComplete` attributes on all form fields.
- [x] `Escape` key closes modal (`keydown` listener).
- [x] `useEffect` auto-focuses close button (`closeRef`) on open.
- [x] Body scroll locked (`overflow: hidden`) while modal open.
- [x] All buttons and role cards have `focus-visible` outline styles.
- [x] `aria-hidden="true"` on decorative elements (logo badge, bullet dots).
- [x] `onKeyDown` Enter/Space handler on role cards for keyboard activation.

---

## Phase 5 — Animations
**File:** `src/shared/components/RoleOnboardingModal.tsx`

### Tasks
- [x] `modalSlideIn` keyframe: `opacity 0→1`, `translateY 24px→0`, `scale 0.97→1`, `cubic-bezier(0.22,1,0.36,1)` spring easing (0.28s).
- [x] `stepFadeIn` keyframe: `opacity 0→1`, `translateY 10px→0` (0.22s ease-out).
- [x] `animKey` state integer bumped on every `changeStep()` call to re-mount the step wrapper and replay `stepFadeIn`.
- [x] Button hover/active micro-interactions: `hover:scale-[1.02]` + `active:scale-[0.99]`.
- [x] Tab state transitions: `transition-all duration-200`.
- [x] Role card hover: `hover:scale-[1.01]`.

---

## Verification
- TypeScript check: `pnpm tsc --noEmit` → exit code 0 ✅
- Visual inspection: modal renders correctly across all 3 steps ✅
- Carousel mobile: touch swipe tested, auto-advance restored ✅
