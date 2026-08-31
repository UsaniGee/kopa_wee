# Spec: Role-Based Dashboards & App Modules

## Overview
Build the core interactive app dashboards and module pages for KopaWee, matching the 4 primary user roles:
1. **Prospective Corps Member (PCM):** Pre-camp checklist, call-up letter document vault, platoon guides, relocation tips.
2. **Serving Corps Member (Active Corper):** Monthly LGA clearance countdown, attendance check-in, PPA rating, CDS group dues, travel SOS tracker, lodge/roommate finder.
3. **Ex-Corps Member (Alumni / POP):** Post-service job board (NiYA / local gigs), POP item marketplace, alumni mentorship network, service year memory vault.
4. **PPA Employer & LGA Admin:** Corper attendance validation, monthly performance reviews, leave approval workflow, LGA clearance sign-off.

The design will strictly adhere to the project's **Modern Soft-Edge Design System** (Black, White, Green `#10b981`, borderless surfaces, intentional rounded corners, background contrast separation, and image-led content where visual context improves discovery).

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
   - Listing cards use image-led media panels, floating role/location metadata, visible price hierarchy, seller context, and a direct chat action.
3. **Accommodation Page (`/dashboard/accommodation`)**:
   - Lodge listings near PPA centers with rent split calculation.
   - Roommate matching questionnaire card.
   - Lodge cards use image-led media panels, verification/status badges, location and feature summaries, and a clear booking or tour action.
   - Roommate cards use a visual identity panel, budget/gender metadata, preference summary, and a full-width match action.
4. **Safety Page (`/dashboard/safety`)**:
   - Highway trip check-in widget.
   - One-tap SOS Emergency Trigger simulation.
5. **Workplace & CDS (`/dashboard/workplace`, `/dashboard/community`)**:
   - PPA monthly attendance log & review form.
   - CDS dues ledger & meeting schedule.

### FR3 — Visual Aesthetics & Accessibility
- **Soft-Edge Borderless Design:** Avoid structural outline borders; use background contrast (`bg-white`, `bg-slate-50`, `bg-slate-100`, `bg-emerald-50`, `bg-black`) with `rounded-xl` controls, `rounded-2xl` nested panels, `rounded-3xl` primary cards/media, and `rounded-full` pills/compact controls.
- **Color Palette:** Project-wide surfaces use `#E8F5E9`, `#A5D6A7`, `#66BB6A`, and `#1B5E20` through the global Tailwind theme mappings. Keep `text-black` and `text-white` for readable contrast; preserve existing component layouts and geometry while changing color treatment only.
- **Responsive Card Interaction:** Card grids collapse from three columns to one/two columns, retain keyboard-operable buttons, and preserve readable metadata at narrow widths.
- **Accessibility:** Full ARIA dialogs, focus trapping, semantic card markup, descriptive image alternatives where images are used, and zero type errors.

### FR4 — Session Exit
- Dashboard navigation exposes a visible `Logout` control.
- Logout clears the local auth token, active role, and stored user profile before returning to `/auth?mode=signup`.

### FR5 — Landing, Authentication & Shared Navigation
- Landing page service storytelling uses the Hero Carousel as the primary first-viewport experience, with synchronized service selection and responsive CTA links for sign-up and sign-in.
- Landing page service cards use the same soft-edge geometry as dashboard cards, including rounded media, selected states, and responsive stacking.
- Service preview action CTAs route to `/auth?mode=signup`; they do not open a role picker or bypass account creation. Explicit sign-in controls continue to route to `/auth?mode=signin`.
- Authentication reads the `mode=signin` query parameter safely through a Suspense boundary and persists the selected/default role before routing to the dashboard.
- The right-side initial authentication form uses a soft slate background, centered white rounded form card, compact sign-up/log-in pills, rounded inputs, primary/Google actions, and an account-switcher footer. It does not show onboarding progress; the left-side visual panel is not altered.
- The account-creation onboarding flow owns the guided progress visual: a four-step indicator and white rounded form card. Step one is **Basic Information** with “Set up your profile details. No call-up number required.”; later steps collect NYSC stage, journey details, and dashboard preferences.
- Desktop and mobile navigation retain access to sign-up/sign-in actions; mobile navigation provides anchor links to landing-page sections.
- Dashboard navigation prioritizes role switching, search, notifications, and logout without a redundant landing-page backlink.

### FR6 — Shared Styling Rules
- Global base styling provides a `rounded-xl` baseline for native controls and common surface elements.
- Component-level `rounded-2xl`, `rounded-3xl`, and `rounded-full` classes remain the source of truth for prominent cards, media, pills, avatars, and compact controls.
- Decorative gradients, shadows, image overlays, and hover scale transitions may reinforce hierarchy without introducing structural borders.

---

## Acceptance Criteria
- [ ] Landing page verified 100% complete and fully linked to `/dashboard`.
- [ ] `/dashboard` route renders role-aware header, sidebar, role switcher, and quick metrics.
- [ ] All 6 sub-routes (`companion`, `marketplace`, `accommodation`, `safety`, `workplace`, `community`) exist and render dedicated interactive modules.
- [ ] Navigation between landing page and dashboards functions seamlessly.
- [ ] Marketplace and accommodation cards present the image-led soft-edge treatment on desktop and mobile.
- [ ] Logout returns to the sign-up flow with local session data cleared.
- [ ] Landing hero, service selector, authentication flow, and shared navigation use the same documented soft-edge system.
- [ ] Sign-up and sign-in form areas use the auth card treatment without onboarding progress or changes to the left authentication visual panel.
- [ ] Account creation onboarding uses the four-step progress/card treatment, including the Basic Information step copy.
- [ ] `pnpm tsc --noEmit` passes with 0 errors.
