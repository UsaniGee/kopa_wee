# Pathway Specification: Purge Pre-Selected Options & Checked Defaults (`purge_preselected_options_20260831`)

## Overview
This pathway audits the entire codebase to eliminate pre-checked checkboxes and pre-selected form values. It sets `packed: false` for 100% of items in `DEFAULT_CAMP_ITEMS` (`src/shared/components/CampEssentialsChecklist.tsx`) so new users start with 0% packed progress. It also updates all `<select>` form elements across `src/app/onboarding/page.tsx` and dashboard modules to start with disabled `<option value="" disabled>Select...</option>` placeholders.

---

## Key Requirements

1. **Uncheck 100% of Camp Checklist Items:**
   - In `DEFAULT_CAMP_ITEMS` (`src/shared/components/CampEssentialsChecklist.tsx`), update all items to `packed: false`.
2. **Onboarding Select Placeholders:**
   - In `src/app/onboarding/page.tsx`:
     - `institutionState`: Initialized to `""` with `<option value="" disabled>Select State...</option>`.
     - `serviceState`: Initialized to `""` with `<option value="" disabled>Select Service State...</option>`.
     - `ppaType`: Initialized to `""` with `<option value="" disabled>Select PPA Category...</option>`.
     - `ppaLGA`: Initialized to `""` with `<option value="" disabled>Select LGA...</option>`.
     - `serviceYear`: Initialized to `""` with `<option value="" disabled>Select Service Year...</option>`.
     - `alumniState`: Initialized to `""` with `<option value="" disabled>Select State...</option>`.
     - `industry`: Initialized to `""` with `<option value="" disabled>Select Industry...</option>`.
3. **Pristine Form Baseline:**
   - Ensure no form or modal loads with pre-selected options or checked checkboxes.

---

## Acceptance Criteria

1. **0% Initial Camp Progress:** Checklist loads with 0 items checked until the user manually clicks them.
2. **Disabled Placeholder Default:** All dropdowns show a clean, disabled *"Select..."* placeholder when unselected.
3. **Build Verification:** 100% clean Next.js production build output across all 23 routes.
