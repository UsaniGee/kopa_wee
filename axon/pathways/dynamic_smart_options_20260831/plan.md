# Implementation Plan: Dynamic Smart Form Options & Self-Learning Backend (`dynamic_smart_options_20260831`)

Execution roadmap for adding the `FormOption` model to Prisma, building `GET/POST /api/options`, refactoring the Onboarding Field of Study dropdown with "Other" write-in support, and pushing schema changes to Neon PostgreSQL.

---

## Phase 1: Prisma Schema & API Endpoint Setup

- [ ] Task: Update `prisma/schema.prisma`
  - [ ] Add `FormOption` model (`id`, `category`, `value`, `label`, `createdAt`)
  - [ ] Execute `npx prisma db push` to update Neon PostgreSQL
- [ ] Task: Create `src/app/api/options/route.ts`
  - [ ] Implement `GET /api/options?category=field_of_study`
  - [ ] Implement `POST /api/options` to upsert new custom options
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Refactor Onboarding Form Dropdowns & Write-in Component

- [ ] Task: Refactor Field of Study Dropdown in `src/app/onboarding/page.tsx`
  - [ ] Set default placeholder `<option value="" disabled>Select Field of Study...</option>`
  - [ ] Append `<option value="other">Other (Specify)</option>`
  - [ ] Conditionally render custom write-in input field when "Other" is selected
  - [ ] Post custom field of study to `POST /api/options` during `finishOnboarding`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: End-to-End Build & Verification

- [ ] Task: End-to-End Build Verification (`npm run build`)
  - [ ] Verify 100% clean compilation of all 23 routes with zero TypeScript errors
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
