# Pathway Specification: Dynamic Smart Form Options & Self-Learning Backend (`dynamic_smart_options_20260831`)

## Overview
This pathway converts form dropdowns across **KopaWee** (Field of Study, NYSC Orientation Camp, PPA Category) into dynamic, self-learning backend options. Dropdowns load with a disabled *"Select..."* placeholder, list options dynamically fetched from Neon PostgreSQL (`FormOption` model and `GET/POST /api/options`), and include an `"other"` option. When `"other"` is selected, a custom text input field appears allowing the user to type their custom entry, which is saved to the database on submit so it becomes immediately available in the dropdown for future users.

---

## Key Requirements

1. **Prisma Model & API Route Handler:**
   - Add `FormOption` model (`category`, `value`, `label`, `createdAt`) to `prisma/schema.prisma`.
   - Create `GET/POST /api/options/route.ts` API route handler to fetch options by category and create new entries.
2. **Default Placeholder & "Other (Specify)" Option:**
   - Dropdown defaults to `<option value="" disabled>Select Field of Study...</option>`.
   - Appends `<option value="other">Other (Specify)</option>` at the end of the dynamic options list.
3. **Custom Write-In Input Field:**
   - When `value === "other"`, display a styled text input directly beneath the dropdown (e.g. *"Specify your Field of Study"*).
4. **Self-Learning Backend Persistence:**
   - Submitting the form with a custom field saves the new entry to `FormOption` in Neon PostgreSQL via `POST /api/options`, enriching the dropdown for all subsequent users.

---

## Acceptance Criteria

1. **Dynamic Dropdown Loading:** Dropdowns fetch live options from `GET /api/options?category=field_of_study`.
2. **Custom Write-In Support:** Selecting "Other (Specify)" toggles the custom text input.
3. **Automatic Backend Persistence:** Newly typed courses are saved to Neon PostgreSQL and appear in future dropdown lists.
4. **Build Verification:** 100% clean Next.js production build output across all 23 routes.
