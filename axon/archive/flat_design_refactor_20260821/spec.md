# Spec: Flat Borderless Design Refactor

## Overview
Transition the KopaWee landing page and onboarding modal from a border-heavy line style to a modern, ultra-clean **Flat Design system**. 

All structural borders (`border`, `border-2`, `border-t`, `border-b`, `border-black`, `border-slate-*`) will be eliminated. Element hierarchy and section separation will be driven entirely by background contrast bands (`bg-white`, `bg-slate-50`, `bg-slate-100`, `bg-emerald-50`, `bg-black`), shadow elevation, and typography.

---

## Functional Requirements

### FR1 — Complete Removal of Structural Borders
- Remove all `border`, `border-2`, `border-t`, `border-b`, `border-l`, `border-r`, `border-black`, `border-slate-*`, `border-emerald-*`, `border-black/10` classes from:
  - `Navbar.tsx` (header bar, logo, nav container, buttons, mobile drawer)
  - `HeroCarousel.tsx` (carousel controls, slide indicators, action buttons, progress bar)
  - `RoleOnboardingModal.tsx` (backdrop, dialog panel, step nav, input fields, role cards, badges, role banner, buttons)
  - `Footer.tsx` (footer container, brand section, navigation columns, bottom bar)
  - `page.tsx` (proof strip, journey section, services cards, architecture boxes, roadmap items, calculator container, bottom CTA)

### FR2 — Background Color Contrast for Separation & Hierarchy
- **Page Section Bands:** Alternating clean section background bands (`bg-white` ↔ `bg-slate-50` ↔ `bg-emerald-50/50` ↔ `bg-black`).
- **Cards & Surfaces:** Soft background fills (`bg-slate-50`, `bg-slate-100`, `bg-emerald-50`) to group content logically without outlines.
- **Secondary Buttons:** Soft background fill (`bg-slate-100 text-black hover:bg-slate-200` or `bg-black text-white hover:bg-slate-800`) instead of outline borders.
- **Primary Buttons:** Green solid fill (`bg-emerald-500 hover:bg-emerald-600 text-white`) with flat elevation.
- **Input Fields:** `bg-slate-100 text-black focus:bg-slate-200 focus:ring-2 focus:ring-emerald-500` without border lines.
- **Badges:** Soft background tint pills/boxes (`bg-emerald-100 text-emerald-800`, `bg-slate-200 text-slate-800`) with no outline borders.

### FR3 — Preservation of Previous Features
- Retain text-roll tumbling hover animation on Navbar and Footer links.
- Retain sharp square geometry (`rounded-none`).
- Retain full accessibility, ARIA attributes, and keyboard navigation.

---

## Acceptance Criteria
- [ ] Zero visible outline borders across the entire landing page and modal (`border-0` / no `border-*` classes).
- [ ] Elements and sections are clearly distinguished using background fills and background color banding.
- [ ] Primary buttons are green (`bg-emerald-500`), secondary buttons use flat contrasting backgrounds.
- [ ] Tumbling text-roll animations on nav & footer links function smoothly.
- [ ] TypeScript check (`pnpm tsc --noEmit`) passes with zero errors.
