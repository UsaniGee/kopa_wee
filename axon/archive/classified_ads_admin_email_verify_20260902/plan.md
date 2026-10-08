# Implementation Plan: Classified Ads Posting, Product Owner `/admin` Dashboard & Email Verification (`classified_ads_admin_email_verify_20260902`)

Execution roadmap for Prisma schema sync, posting modals, API endpoints, `/admin` portal, and email link verification sign-up.

---

## Phase 1: Prisma Schema Sync & API Endpoint Updates

- [x] Task: Update `prisma/schema.prisma`
  - [x] Add `PENDING_APPROVAL`, `ACTIVE`, `REJECTED` to `ListingStatus` enum
  - [x] Add `verificationToken` String? to `User` model
  - [x] Run `npx prisma db push` to update Neon PostgreSQL
- [x] Task: Update `/api/marketplace` and `/api/accommodation` Route Handlers
  - [x] Support `POST` creation with `PENDING_APPROVAL` status
  - [x] Support `PATCH` admin approval/rejection status transitions
- [x] Task: Create `/api/auth/verify` Endpoint & Update `/api/auth/register`
  - [x] Generate verification token on registration
  - [x] Handle token verification at `GET /api/auth/verify?token=...`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 2: Build Classified Ads Posting Modals

- [x] Task: Build `PostItemModal` in `src/app/dashboard/marketplace/page.tsx`
  - [x] Add title, category, price, state, lga, condition, image URL, and description fields
  - [x] Connect modal to `POST /api/marketplace` and show confirmation banner
- [x] Task: Build `PostLodgeModal` in `src/app/dashboard/accommodation/page.tsx`
  - [x] Add title, rent, state, lga, address, bedrooms, bathrooms, split info, images, and description fields
  - [x] Connect modal to `POST /api/accommodation` and show confirmation banner
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 3: Build Email Magic Link Verification Screen

- [x] Task: Refactor `src/app/auth/page.tsx` Sign-Up Flow
  - [x] Show *"Check Your Email"* screen with simulated email inbox / link click trigger
- [x] Task: Build `src/app/auth/verify/page.tsx` Token Verification Route
  - [x] Verify token with `/api/auth/verify`, mark user as verified, and redirect to `/onboarding`
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 4: Build Platform Owner `/admin` Dashboard Portal

- [x] Task: Create `src/app/admin/login/page.tsx`
  - [x] Build admin authentication login screen (`admin@kopawee.ng`)
- [x] Task: Create `src/app/admin/page.tsx` Admin Dashboard
  - [x] Build moderation tabs for Pending Marketplace Ads, Pending Lodges, Active Ads, and User Verifications
  - [x] Implement **Approve Ad** and **Reject Ad** actions with live DB updates
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

---

## Phase 5: End-to-End Build & Verification

- [x] Task: End-to-End Build Verification (`npm run build`)
  - [x] Verify 100% clean compilation of all routes with zero TypeScript errors
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

