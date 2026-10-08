# Implementation Plan: Progressive Onboarding, NYSC Journey Lifecycle & Camp Essentials

## Phase 1: Authentication & Multi-Step Progressive Onboarding Flow
- [x] Task: Create `/onboarding` page with mobile-first step-by-step wizard.
- [x] Sub-task: Step 1 — Auth & Journey Stage Selection (`prospective_corps_member`, `serving_corps_member`, `alumni`).
- [x] Sub-task: Step 2 — Basic Profile & PCM Details (`pcm_stage`, batch, stream, institution, searchable field of study).
- [x] Sub-task: Step 3 — Optional Deployment State (`deployment_state`, call-up letter status, skip prompt).
- [x] Sub-task: Step 4 — Interest Profiling (`interests[]`).

## Phase 2: Interactive Camp Essentials Module
- [x] Task: Create standalone Camp Essentials component with item categories, recommended quantities, official disclaimers, and interactive checklist.
- [x] Sub-task: Add official disclaimers for Crocs on parade ground vs bathroom/hostel use and mandatory document checks.
- [x] Sub-task: Integrate progress bar and custom item addition.

## Phase 3: Lifecycle Transition & Serving Corper Progressive Profile
- [x] Task: Implement seamless PCM ➔ Serving Corps Member status upgrade modal/wizard.
- [x] Sub-task: Collect `service_state` (required), `service_stage`, orientation camp name, PPA details (Name, Type, State, LGA, Area, days/hours).
- [x] Sub-task: Add accommodation & marketplace preference profiling.

## Phase 4: Privacy-Preserving Location & Community Matching
- [x] Task: Implement location-aware discovery with privacy controls.
- [x] Sub-task: Distance-based matching (2km, 5km, 10km, 20km) with approximate proximity.
- [x] Sub-task: Safety circle contact setup (up to 5 trusted contacts) with explicit location sharing consent.

## Phase 5: Verification & Checkpoint
- [x] Task: Run TypeScript verification (`pnpm tsc --noEmit`) and verify user flows end-to-end.
