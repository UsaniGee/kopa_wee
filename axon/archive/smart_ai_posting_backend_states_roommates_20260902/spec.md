# Pathway Specification: Smart AI Posting, Backend States API, Roommate System & Posting Fixes (`smart_ai_posting_backend_states_roommates_20260902`)

## Overview
This pathway resolves core architectural bugs and delivers key product features across Accommodation, Marketplace, and Roommates:
1. **Backend States Source of Truth (`GET /api/states`):**
   - Provide a backend API and Prisma model seeded with all 36 Nigerian States + FCT.
   - Refactor frontend components across Onboarding, Accommodation, Marketplace, Community, and Admin to fetch states dynamically from the backend rather than using hard-coded arrays.
2. **Smart AI Posting Service (`POST /api/ai/listing/analyse`):**
   - Introduce Option B ("✨ Create with AI") alongside Option A (Manual Posting) for both Accommodation and Marketplace listings.
   - Users upload device photos and optional brief text. The backend AI service analyzes images/text to propose a structured draft (Title, Category/Type, Price, Location, Amenities/Condition) without hallucinating facts.
   - The user reviews, edits missing information, and explicitly confirms before saving to the database.
3. **Local Storage Image Uploads with Previews:**
   - Allow users to select images directly from local device storage (picker/gallery) with instant preview thumbnails, file validation (type & size), and removal capabilities.
4. **Fix "Failed to Post Item" Root Cause:**
   - Resolve request payload schema mismatches, Prisma enum validation errors, or foreign key constraints. Return structured error payloads (`VALIDATION_ERROR`, `UNAUTHORIZED`, `INTERNAL_ERROR`).
5. **Unlimited Posting Limits:**
   - Remove any artificial posting limits on Marketplace items and Accommodation lodges.
6. **Backend Roommate Request System:**
   - Purge all static dummy roommate data. Create `RoommateRequest` Prisma model and `GET/POST/DELETE /api/roommates` endpoints.
   - Enforce a strict single ACTIVE roommate request constraint per user at the database and API level.
7. **Unverified Accommodation Badges & Location Ranking:**
   - Render a prominent `UNVERIFIED` badge with safety disclaimer on listings without platform verification, while keeping `verificationStatus` schema future-ready (`UNVERIFIED`, `PENDING`, `VERIFIED`, `REJECTED`).
   - Prioritize accommodation and marketplace listings near the user's state/LGA/PPA radius.

---

## Key Requirements

1. **Prisma Models & Seeds:**
   - Create `State` and `LGA` models in `prisma/schema.prisma` and seed all 36 Nigerian states + FCT.
   - Create `RoommateRequest` model with `@unique([userId, status])` or conditional check for active requests.
   - Add `verificationStatus` enum (`UNVERIFIED`, `PENDING`, `VERIFIED`, `REJECTED`) to `AccommodationListing`.
2. **Backend API Endpoints:**
   - `GET /api/states` - Returns state list `{ id, name, code }`.
   - `POST /api/ai/listing/analyse` - AI structured draft generation for accommodation & marketplace.
   - `GET/POST/DELETE /api/roommates` - Roommate request creation, retrieval, and active request enforcement.
3. **Frontend Component Updates:**
   - Refactor `src/app/dashboard/marketplace/page.tsx` & `src/app/dashboard/accommodation/page.tsx` to include Option A and Option B (AI draft generator) modals with device image upload previews.
   - Refactor `src/app/onboarding/page.tsx` and filters to consume `GET /api/states`.
   - Replace static roommate cards in `src/app/dashboard/accommodation/page.tsx` with dynamic `RoommateRequest` feed and single-active request management drawer.

---

## Acceptance Criteria

1. **Backend States Source of Truth:** `GET /api/states` returns all 36 Nigerian states + FCT; frontend dropdowns populate dynamically from backend.
2. **Smart AI Posting:** Users can upload images + type brief text to receive an AI-generated draft, edit fields, and publish after review.
3. **Local File Picker:** File inputs support selecting local images with instant previews and removal buttons.
4. **Error Handling:** "Failed to post item" is resolved with structured error messages.
5. **Roommate DB System:** Dummy data removed; users can submit 1 active roommate request; attempting to create a second active request returns a backend constraint error.
6. **Unverified Badge:** Non-verified accommodation listings display `UNVERIFIED` badge and safety disclaimer.
7. **Production Build:** `npm run build` compiles 100% cleanly without TypeScript or hydration errors.
