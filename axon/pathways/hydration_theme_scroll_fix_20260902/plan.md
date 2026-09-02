# Implementation Plan: Hydration, Theme & Scroll UX Fix (`hydration_theme_scroll_fix_20260902`)

Execution roadmap for fixing HeroCarousel setState warning, adding suppressHydrationWarning, scroll-aware navbar styling, and system theme preference.

---

## Phase 1: Decouple HeroCarousel State Callback & Root Hydration

- [x] Task: Update `src/shared/components/HeroCarousel.tsx`
  - [x] Move `onSlideChange` to a dedicated `useEffect([activeIndex, onSlideChange])`
  - [x] Simplify `setActiveIndex((current) => (current + 1) % services.length)` in interval
- [x] Task: Update `src/app/layout.tsx`
  - [x] Add `suppressHydrationWarning` to `<html>` and `<body>` tags
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Add System Theme Preference & Scroll-Aware Navbar

- [x] Task: Update `src/shared/components/ThemeToggle.tsx`
  - [x] Add support for system theme mode with `window.matchMedia("(prefers-color-scheme: dark)")`
- [x] Task: Update `src/shared/components/Navbar.tsx`
  - [x] Add scroll event listener to toggle `isScrolled` state (threshold: 20px)
  - [x] Apply dynamic background and border styles on scroll
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: End-to-End Build & Verification

- [x] Task: End-to-End Build Verification (`npm run build`)
  - [x] Verify 100% clean compilation of all 23 routes with zero TypeScript errors
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

