# Implementation Plan: Form Validation & Loading UX Enhancements (`auth_onboarding_loading_validation_20260831`)

Execution roadmap for enforcing disabled inactive states and animated loading spinners on Auth and Onboarding form buttons.

---

## Phase 1: Refactor Auth Page (`src/app/auth/page.tsx`) Validation & Loaders

- [x] Task: Add Form Validation & Loading Spinner to Auth Submit Buttons
  - [x] Calculate `isAuthValid` based on mode (`signup` vs `signin`)
  - [x] Add `disabled={!isAuthValid || loading}` and muted `opacity-50 cursor-not-allowed` styles
  - [x] Render inline SVG spinner icon when `loading === true`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Refactor Onboarding Page (`src/app/onboarding/page.tsx`) Step Validation

- [x] Task: Add Step-by-Step Validation & Loading Spinner to Onboarding Buttons
  - [x] Step 1 validation (`fullName`, `phone`)
  - [x] Step 2 validation (`nyscStatus`)
  - [x] Step 3 validation (`institution`, `fieldOfStudy`)
  - [x] Step 4 validation (`interests.length > 0`)
  - [x] Add `submitting` loading state to `finishOnboarding` button
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: End-to-End Build & Verification

- [x] Task: End-to-End Build Verification (`npm run build`)
  - [x] Verify 100% clean compilation of all 23 routes with zero TypeScript errors
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

