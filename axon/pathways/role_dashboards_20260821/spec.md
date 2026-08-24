# Spec: Role-Based Dashboards & App Modules

## Overview
Build the core interactive app dashboards and module pages for KopaWee, matching the 4 primary user roles:
1. **Prospective Corps Member (PCM):** Pre-camp checklist, call-up letter document vault, platoon guides, relocation tips.
2. **Serving Corps Member (Active Corper):** Monthly LGA clearance countdown, attendance check-in, PPA rating, CDS group dues, travel SOS tracker, lodge/roommate finder.
3. **Ex-Corps Member (Alumni / POP):** Post-service job board (NiYA / local gigs), POP item marketplace, alumni mentorship network, service year memory vault.
4. **PPA Employer & LGA Admin:** Corper attendance validation, monthly performance reviews, leave approval workflow, LGA clearance sign-off.

The design will strictly adhere to the project's **Flat Borderless Design System** (Black, White, Green `#10b981`, zero borders, sharp square edges, background contrast separation).

---

## Route Structure

- `/dashboard` — Main Unified App Dashboard (Role-aware dashboard header, active role toggle, metric widgets, quick action launcher, notifications).
- `/dashboard/companion` — Smart Clearance & Admin Assistant (biometric countdown, document vault, LGA office directions).
- `/dashboard/marketplace` — Peer-to-Peer Corper Marketplace (buy/sell items, POP setup handoffs).
- `/dashboard/accommodation` — Lodge Finder & Roommate Matcher.
- `/dashboard/safety` — Travel SOS & Highway Emergency Tracker.
- `/dashboard/workplace` — PPA Attendance & Performance Reviews.
- `/dashboard/community` — CDS Group Manager & Dues Register.

---

## Functional Requirements

### FR1 — Role-Aware Dashboard Shell (`/dashboard`)
- Shared sidebar / header navigation for app modules (`Companion`, `Marketplace`, `Accommodation`, `Safety`, `Workplace`, `CDS`).
- Role Selector Banner allowing instantaneous preview switching between **PCM**, **Serving Corper**, **Ex-Corper**, and **PPA Employer**.
- Quick stats panel (Clearance status, Allawee savings, CDS attendance, emergency status).

### FR2 — Mini-Product Pages
1. **Companion Page (`/dashboard/companion`)**:
   - Monthly LGA Clearance countdown widget with reminder toggles.
   - Encrypted Document Vault preview (Call-up letter, Green Card, Medical certificate).
2. **Marketplace Page (`/dashboard/marketplace`)**:
   - Filterable product grid (Mattresses, Fans, Gas Cylinders, Kitchenware, POP Kits).
   - "Post New Listing" drawer / modal.
3. **Accommodation Page (`/dashboard/accommodation`)**:
   - Lodge listings near PPA centers with rent split calculation.
   - Roommate matching questionnaire card.
4. **Safety Page (`/dashboard/safety`)**:
   - Highway trip check-in widget.
   - One-tap SOS Emergency Trigger simulation.
5. **Workplace & CDS (`/dashboard/workplace`, `/dashboard/community`)**:
   - PPA monthly attendance log & review form.
   - CDS dues ledger & meeting schedule.

### FR3 — Visual Aesthetics & Accessibility
- **Flat Borderless Design:** Zero `border-*` classes, using background contrast (`bg-white`, `bg-slate-50`, `bg-slate-100`, `bg-emerald-50`, `bg-black`).
- **Color Palette:** Primary green (`bg-emerald-500 hover:bg-emerald-600`), black, white, soft slate.
- **Sharp Geometry:** `rounded-none` everywhere.
- **Accessibility:** Full ARIA dialogs, focus trapping, semantic markup, zero type errors.

---

## Acceptance Criteria
- [ ] Landing page verified 100% complete and fully linked to `/dashboard`.
- [ ] `/dashboard` route renders role-aware header, sidebar, role switcher, and quick metrics.
- [ ] All 6 sub-routes (`companion`, `marketplace`, `accommodation`, `safety`, `workplace`, `community`) exist and render dedicated interactive modules.
- [ ] Navigation between landing page and dashboards functions seamlessly.
- [ ] `pnpm tsc --noEmit` passes with 0 errors.
