# Implementation Plan: Form Validation & Loading UX Enhancements (`auth_onboarding_loading_validation_20260831`)

Execution roadmap for enforcing disabled inactive states and animated loading spinners on Auth and Onboarding form buttons.

---

## Phase 1: Refactor Auth Page (`src/app/auth/page.tsx`) Validation & Loaders

- [ ] Task: Add Form Validation & Loading Spinner to Auth Submit Buttons
  - [ ] Calculate `isAuthValid` based on mode (`signup` vs `signin`)
  - [ ] Add `disabled={!isAuthValid || loading}` and muted `opacity-50 cursor-not-allowed` styles
  - [ ] Render inline SVG spinner icon when `loading === true`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Refactor Onboarding Page (`src/app/onboarding/page.tsx`) Step Validation

- [ ] Task: Add Step-by-Step Validation & Loading Spinner to Onboarding Buttons
  - [ ] Step 1 validation (`fullName`, `phone`)
  - [ ] Step 2 validation (`nyscStatus`)
  - [ ] Step 3 validation (`institution`, `fieldOfStudy`)
  - [ ] Step 4 validation (`interests.length > 0`)
  - [ ] Add `submitting` loading state to `finishOnboarding` button
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: End-to-End Build & Verification

- [ ] Task: End-to-End Build Verification (`npm run build`)
  - [ ] Verify 100% clean compilation of all 23 routes with zero TypeScript errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
