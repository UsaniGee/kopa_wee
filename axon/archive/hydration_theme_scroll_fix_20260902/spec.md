# Pathway Specification: Hydration, Theme & Scroll UX Fix (`hydration_theme_scroll_fix_20260902`)

## Overview
This pathway resolves critical browser runtime console warnings and upgrades navbar theme responsiveness:
1. Fixes the `Cannot update a component ('LandingPage') while rendering a different component ('HeroCarousel')` React warning by decoupling parent state callbacks (`onSlideChange`) from the functional state updater in `HeroCarousel.tsx`.
2. Fixes hydration mismatch warnings caused by browser extensions (`cz-shortcut-listen`, dark mode extensions) by adding `suppressHydrationWarning` to `<html>` and `<body>` tags in `src/app/layout.tsx`.
3. Adds scroll-aware background and border styling to `src/shared/components/Navbar.tsx` so the navbar adapts dynamically on scroll.
4. Enhances `ThemeContext.tsx` with **System Default** mode support, observing `window.matchMedia("(prefers-color-scheme: dark)")` when theme preference is set to `"system"`.

---

## Key Requirements

1. **Decouple `onSlideChange` Callback in `HeroCarousel.tsx`:**
   - Remove `onSlideChange?.(nextIdx)` from inside `setActiveIndex((current) => ...)` functional updater.
   - Use a dedicated `useEffect` observing `[activeIndex, onSlideChange]` to safely notify `LandingPage`.
2. **Suppress Extension Hydration Mismatches:**
   - Add `suppressHydrationWarning` to `<html>` and `<body>` in `src/app/layout.tsx`.
3. **Scroll-Aware Navbar Responsiveness:**
   - Implement `isScrolled` scroll listener state in `src/shared/components/Navbar.tsx`.
   - Apply dynamic glassmorphism and subtle border styling when user scrolls past 20px.
4. **System Default Theme Support:**
   - Update `ThemeContext` type to `'light' | 'dark' | 'system'`.
   - Automatically match system OS dark mode preferences when `"system"` is active.

---

## Acceptance Criteria

1. **Zero React Render Warnings:** `HeroCarousel` updates state cleanly without triggering cross-component setState warnings.
2. **Zero Hydration Console Errors:** Page loads cleanly without browser extension attribute mismatch warnings.
3. **Dynamic Scroll Navbar:** Navbar smoothly changes background on page scroll.
4. **System Theme Support:** Users can select System Default mode alongside Light & Dark modes.
5. **Build Verification:** 100% clean Next.js production build output across all 23 routes.
