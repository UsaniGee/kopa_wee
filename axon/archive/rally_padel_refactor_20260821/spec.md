# Spec: Rally Padel Inspired Design Refactor

## Overview
Transform the KopaWee landing page design system to adopt the sharp, high-contrast visual identity and micro-animations inspired by the [Rally Padel template](https://rally-padel-template.webflow.io/). 

Key goals:
1. **Zero Border Radius:** Eliminate all rounded corners (`rounded-full`, `rounded-3xl`, `rounded-2xl`, `rounded-xl`, `rounded-lg`, etc.) across all components and replace with sharp, clean-cut rectangle borders (`rounded-none`).
2. **Text-Roll Tumbling Hover Animations:** Implement Rally Padel's signature double-layer tumbling text hover effect on all Navbar and Footer navigation links.
3. **Typography & Layout Alignment:** Adopt Rally Padel's high-contrast typography, uppercase section labels with dot indicators, sharp icon buttons with double diagonal arrow animations, and clean grid card structures.

---

## Functional Requirements

### FR1 — Zero Border Radius (Sharp Edges Everywhere)
- Remove all `rounded-*` classes (`rounded-full`, `rounded-3xl`, `rounded-2xl`, `rounded-xl`, `rounded-lg`, `rounded-md`, `rounded-sm`) from:
  - `Navbar.tsx` (logo icon, nav container, buttons, mobile menu items, menu toggle)
  - `HeroCarousel.tsx` (carousel buttons, slide dots, progress bar container, action buttons)
  - `RoleOnboardingModal.tsx` (dialog container, step tabs, input fields, role cards, badges, primary/secondary buttons, role banner)
  - `Footer.tsx` (email subscription input, submit button, branding badges)
  - `page.tsx` (all cards, service badges, pricing boxes, stat counters, feature cards)
  - `globals.css` (any default utility classes or component variables)

### FR2 — Tumbling Text-Roll Hover Animation
- Create a CSS/Tailwind component class or helper for tumbling text links (`.text-roll`):
  - Overflow hidden container displaying text.
  - On hover, the default text slides up (`-translate-y-full`) while a duplicate text layer slides into place (`translate-y-0`).
- Apply text-roll animation to:
  - Desktop & Mobile Navbar navigation items (`Navbar.tsx`).
  - Footer menu column links (`Footer.tsx`).

### FR3 — Typography & Icon Micro-Interactions
- Section labels: Uppercase bold tracking (`tracking-widest` / `tracking-[0.2em]`) with a small square/dot indicator.
- Buttons: Primary buttons inherit green background with sharp corners (`rounded-none`); secondary buttons inherit black border (`border-2 border-black rounded-none`).
- Button icons: Add diagonal/up-right arrow hover interactions (`group-hover:translate-x-0.5 group-hover:-translate-y-0.5`).

---

## Acceptance Criteria
- [ ] No element on the landing page or onboarding modal has rounded corners (`border-radius: 0` / `rounded-none`).
- [ ] Navbar links smoothly roll text on mouse hover.
- [ ] Footer links smoothly roll text on mouse hover.
- [ ] Primary buttons maintain green fill (`bg-emerald-500`) with sharp square corners.
- [ ] Secondary buttons maintain black borders (`border-2 border-black`) with sharp square corners.
- [ ] TypeScript check (`pnpm tsc --noEmit`) passes with zero errors.
