# Pathway Specification: Form Validation & Loading UX Enhancements (`auth_onboarding_loading_validation_20260831`)

## Overview
This pathway enhances the user experience of **Auth** (`src/app/auth/page.tsx`) and **Onboarding** (`src/app/onboarding/page.tsx`) by enforcing strict required field validation on form buttons. Primary submit/continue buttons will remain disabled with muted inactive styling (`opacity-50 cursor-not-allowed`) until all mandatory fields in the active step are filled. Upon submission, buttons will render animated inline spinner loaders and clear feedback text (e.g. *"Creating Account..."*, *"Authenticating..."*, *"Saving Profile..."*).

---

## Key Requirements

1. **Auth Page Button Inactive & Loading UX (`src/app/auth/page.tsx`):**
   - **Sign Up Mode:** Disable button unless `fullName`, `email`, and `password` are filled.
   - **Sign In Mode:** Disable button unless `email` and `password` are filled.
   - **Loading State:** Display animated circular spinner icon + action text when submitting.
2. **Onboarding Page Step Validation (`src/app/onboarding/page.tsx`):**
   - **Step 1 (Identity):** Disable **Continue** button until `fullName` and `phone` are filled.
   - **Step 2 (Status):** Disable **Continue** button until `nyscStatus` is selected.
   - **Step 3 (Academic & State):** Disable **Continue** button until `institution` and `fieldOfStudy` (or `customFieldOfStudy` if "other" is chosen) are filled.
   - **Step 4 (Priorities & Finish):** Disable **Complete Setup** button until at least 1 interest priority is selected.
   - **Submitting State:** Render loading spinner during `finishOnboarding` API sync.

---

## Acceptance Criteria

1. **Strict Inactive Buttons:** Buttons remain visually muted and non-clickable until all mandatory fields in the current view are filled.
2. **Smooth Loading Spinners:** Submitting displays an inline spinner without layout shift.
3. **Build Verification:** 100% clean Next.js production build output across all 23 routes.
