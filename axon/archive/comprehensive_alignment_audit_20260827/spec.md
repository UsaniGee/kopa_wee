# Specification: Comprehensive Codebase & Documentation Alignment Audit

## Overview
Perform an exhaustive alignment audit comparing all implemented user flows, UI components, design system tokens, and navigation architectures across KopaWee+ against our working documentation (`product.md`, `product-guidelines.md`, `tech-stack.md`, `workflow.md`, `pathways.md`).

## Findings & Architectural Alignments

### 1. Design System & CSS Palette Tokens (`src/app/globals.css`)
- **CSS Variables & Palette Mapping:**
  - Active Green (`--nysc-green`, `emerald-500`): `#66bb6a`
  - Pale Mint Surface (`--nysc-green-light`, `emerald-100`, `slate-50`): `#a5d6a7` / `#e8f5e9`
  - Dark Forest Green (`--nysc-green-dark`, `emerald-800`): `#1b5e20`
  - Translucent Border Stroke (`--color-border`): `rgba(27, 94, 32, 0.2)`
  - Glass Card Border (`--card-border`): `rgba(27, 94, 32, 0.12)`
- **Global Base Radius Enforcers:**
  - `@layer base` applies `border-radius: 0.75rem` (`rounded-xl`) by default to `button`, `a`, `input`, `select`, `textarea`, `article`, `div[class*="bg-"]`, and `div[class*="shadow"]`.
- **Modern Soft-Edge & Bordered Aesthetic:**
  - Cards, form inputs, dialogs, and navigation modules feature subtle structural borders (`border border-slate-200` or `1px solid var(--card-border)`) combined with soft mint surface contrast (`bg-slate-50`, `bg-emerald-50`).

### 2. Multi-Role Navigation & Smart Auto-Redirect Architecture
- **6 Supported Roles:** `pcm` (Prospective Corper), `serving` (Serving Corps Member), `cds_exec` (CDS Executive), `ppa` (PPA Representative), `nysc_official` (LGA Inspector), `alumni` (POP Ex-Corper).
- **Sub-Module Navigation Filtering:** `ROLE_NAV_ITEMS` in `src/app/dashboard/layout.tsx` dynamically filters sub-nav tabs based on `currentRole`.
- **Auto-Jump on Role Switch:** Switching roles immediately cleanses visible content and routes to the first tab of the new role (`/dashboard`). Accessing an invalid route for the active role automatically redirects to the first valid tab.

### 3. Progressive Onboarding & Decision Fatigue Protection
- **Full-Screen Edge-to-Edge Split Layout:** Auth (`/auth`) and Onboarding (`/onboarding`) feature a left visual hero panel (`from-emerald-950 via-slate-950 to-black`) and a right form panel.
- **Decision Fatigue Protection:** PPA details (PPA Name, Type, LGA, Area) are conditionally hidden when a serving corper's stage is `orientation_camp` or `waiting_ppa`.
- **Step-Back Navigation:** Prominent `← Back to Home` and `← Back to Step N-1` buttons are exposed at every onboarding stage.
- **State Location Tracking:** Geolocation GPS auto-detection and state selector save the user's service state for state-gated marketplace listings.

### 4. Interactive Modules & Features
- **Camp Essentials Checklist (`CampEssentialsChecklist.tsx`):** Interactive packing list with progress bar, recommended quantities, custom item additions, and official Crocs/footwear disclaimers.
- **P2P Marketplace (`/dashboard/marketplace`):** Peer-to-Peer corper and POP hand-off marketplace with state location filter, category pills, role badge tags, seller chat triggers, and free post modal.
- **Landing Page (`/`):** 8-slide Story Hero Carousel, 4-card Proof Strip, 8-chapter Services Breakdown with live demo preview, LEGO Architecture showcase, 4-Year Rollout Roadmap, and interactive Corper Value & Savings Calculator.
