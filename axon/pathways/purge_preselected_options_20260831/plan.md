# Implementation Plan: Purge Pre-Selected Options & Checked Defaults (`purge_preselected_options_20260831`)

Execution roadmap for setting `packed: false` across all camp checklist items and adding disabled placeholders to all select elements.

---

## Phase 1: Uncheck 100% of Camp Checklist Items

- [ ] Task: Update `src/shared/components/CampEssentialsChecklist.tsx`
  - [ ] Set `packed: false` for all entries in `DEFAULT_CAMP_ITEMS`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Add Disabled Placeholders to Onboarding Form Selects

- [ ] Task: Update `src/app/onboarding/page.tsx`
  - [ ] Update `institutionState`, `serviceState`, `ppaType`, `ppaLGA`, `serviceYear`, `alumniState`, and `industry` initial values to `""`
  - [ ] Add disabled `<option value="" disabled>Select...</option>` placeholders to all `<select>` inputs
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: End-to-End Build & Verification

- [ ] Task: End-to-End Build Verification (`npm run build`)
  - [ ] Verify 100% clean compilation of all 23 routes with zero TypeScript errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
