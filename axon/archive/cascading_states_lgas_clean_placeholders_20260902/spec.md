# Pathway Specification: Cascading Backend States/LGAs & Clean Placeholders (`cascading_states_lgas_clean_placeholders_20260902`)

## Overview
This pathway establishes a complete backend LGA infrastructure and project-wide cascading location selection:
1. **Backend LGAs Database Source of Truth (`LGA` Prisma Model & `GET /api/states/:id/lgas`):**
   - Seed all 774 Local Government Areas (LGAs) mapped to all 36 Nigerian States + FCT into Neon PostgreSQL.
   - Serve LGAs dynamically via `GET /api/states/[id]/lgas` or `GET /api/lgas?stateId=...` / `GET /api/states?includeLgas=true`.
2. **Cascading Location Select UI (State ➔ LGA ➔ Area):**
   - User selects State (placeholder: `Select State...`).
   - LGA dropdown automatically enables and populates with LGAs for the selected State (placeholder: `Select LGA...`).
   - Area text input allows typing specific neighborhood/landmark (placeholder: `Enter area or landmark...`).
3. **Project-Wide Purge of Hardcoded 'Lagos' Defaults:**
   - Clear all pre-selected "Lagos" or "Ikeja" initial state/LGA values project-wide (Marketplace, Accommodation, Onboarding, Roommates, Auth).
   - Enforce clean generic placeholders across all forms (e.g. `Enter full name...`, `Enter email address...`, `Enter price...`).

---

## Key Requirements

1. **Prisma Schema Update:**
   - Add `LGA` model related to `State` in `prisma/schema.prisma`.
   - Run `npx prisma db push` to update Neon PostgreSQL.
2. **Comprehensive Seed Data & Endpoints:**
   - Create `src/shared/data/nigeriaStatesLgas.ts` containing all 36 states + FCT and their 774 LGAs.
   - Build `GET /api/states/[stateId]/lgas` route handler.
3. **Form Refactoring Project-Wide:**
   - Refactor `PostItemModal` in `Marketplace`.
   - Refactor `PostLodgeModal` and `RequestRoommateModal` in `Accommodation`.
   - Refactor `Onboarding` state/LGA selection.
   - Replace static placeholders with generic input prompts.

---

## Acceptance Criteria

1. **Dynamic LGAs from Backend:** Selecting a state dynamically loads its respective LGAs from `GET /api/states/[stateId]/lgas` API.
2. **Cascading Flow (State ➔ LGA ➔ Area):** User cannot select an LGA before selecting a state; an optional Area text input is available for specific neighborhoods.
3. **Purged 'Lagos' Defaults:** No form fields or filters default to "Lagos" or "Ikeja"; initial placeholders display `Select State...` / `Select LGA...`.
4. **Clean Generic Placeholders:** All text inputs project-wide use neutral guidance placeholders (`Enter full name...`, `Enter email address...`).
5. **Production Build:** `npm run build` compiles 100% cleanly without TypeScript errors.
