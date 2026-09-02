# Implementation Plan: Hydration, Theme & Scroll UX Fix (`hydration_theme_scroll_fix_20260902`)

Execution roadmap for fixing HeroCarousel setState warning, adding suppressHydrationWarning, scroll-aware navbar styling, and system theme preference.

---

## Phase 1: Decouple HeroCarousel State Callback & Root Hydration

- [ ] Task: Update `src/shared/components/HeroCarousel.tsx`
  - [ ] Move `onSlideChange` to a dedicated `useEffect([activeIndex, onSlideChange])`
  - [ ] Simplify `setActiveIndex((current) => (current + 1) % services.length)` in interval
- [ ] Task: Update `src/app/layout.tsx`
  - [ ] Add `suppressHydrationWarning` to `<html>` and `<body>` tags
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Add System Theme Preference & Scroll-Aware Navbar

- [ ] Task: Update `src/shared/context/ThemeContext.tsx`
  - [ ] Add support for `'system'` theme mode with `window.matchMedia("(prefers-color-scheme: dark)")`
- [ ] Task: Update `src/shared/components/Navbar.tsx`
  - [ ] Add scroll event listener to toggle `isScrolled` state (threshold: 20px)
  - [ ] Apply dynamic background and border styles on scroll
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: End-to-End Build & Verification

- [ ] Task: End-to-End Build Verification (`npm run build`)
  - [ ] Verify 100% clean compilation of all 23 routes with zero TypeScript errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
