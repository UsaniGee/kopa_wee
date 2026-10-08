# Pathway Specification: Classified Ads Posting, Product Owner `/admin` Dashboard & Email Verification (`classified_ads_admin_email_verify_20260902`)

## Overview
This pathway implements a full Jiji-style Classified Ads posting lifecycle, a dedicated Platform Owner `/admin` portal, and an Email Verification Link sign-up workflow:
1. **Classified Ads Posting Modals:**
   - **Marketplace (`/dashboard/marketplace`):** Clicking `+ POST ITEM FOR SALE` or `+ POST FIRST ITEM FOR SALE` opens a creation modal (`PostItemModal`) allowing users to upload photo URLs, title, category, price, state, lga, condition, and description.
   - **Accommodation (`/dashboard/accommodation`):** Clicking `+ LIST A LODGE` opens a creation modal (`PostLodgeModal`) allowing corpers to submit lodge listings (rent, bedrooms, bathrooms, location, split preference, photos).
   - Submissions are saved to Neon PostgreSQL with status `PENDING_APPROVAL`. Users receive an instant confirmation: *"🎉 Ad submitted! Pending review before going live."*
2. **Dedicated Platform Owner `/admin` Route:**
   - Create a dedicated `/admin` route with an Admin Sign-In login screen (`admin@kopawee.ng`).
   - Platform admins/product owners can view all pending marketplace & accommodation listings, review ad photos & details, and click **Approve Ad** (flips status to `ACTIVE` live status) or **Reject Ad**.
3. **Email Link Verification Sign-Up Flow:**
   - During user Sign Up (`/auth`), send/simulate an email containing a secure magic link (`/auth/verify?token=...&email=...`).
   - Display a clean *"Check your Inbox"* screen. Clicking the email verification link verifies `isVerified: true` in the database and redirects the user cleanly to Onboarding.

---

## Key Requirements

1. **Prisma Schema Update:**
   - Update `ListingStatus` enum in `prisma/schema.prisma` to include `PENDING_APPROVAL`, `ACTIVE`, `REJECTED`, `AVAILABLE`, `RESERVED`, `SOLD`.
   - Add `verificationToken` field to `User` model.
   - Run `npx prisma db push` to sync Neon PostgreSQL.
2. **API Routes for Listings & Admin Moderation:**
   - Update `POST/GET/PATCH /api/marketplace` and `POST/GET/PATCH /api/accommodation` to handle `PENDING_APPROVAL` and admin status transitions.
3. **Posting Modals:**
   - Implement `PostItemModal` in `src/app/dashboard/marketplace/page.tsx`.
   - Implement `PostLodgeModal` in `src/app/dashboard/accommodation/page.tsx`.
4. **Dedicated `/admin` Portal:**
   - Create `src/app/admin/page.tsx` and `src/app/admin/login/page.tsx` with ad moderation tabs for Pending Listings, Active Listings, and User Verifications.
5. **Email Magic Link Verification:**
   - Update `POST /api/auth/register` to generate a verification token and simulated email preview modal/screen.
   - Create `src/app/auth/verify/page.tsx` route handler to verify tokens and activate user accounts.

---

## Acceptance Criteria

1. **Seamless Ad Posting:** Corpers can submit items and lodges; submitted ads immediately enter `PENDING_APPROVAL` status.
2. **Product Owner `/admin` Portal:** Admins can log in at `/admin`, review pending ads, approve them (making them visible to all users), or reject them.
3. **Valid Email Verification Link:** Sign-up generates an email verification link; clicking the link marks the user verified and proceeds to onboarding.
4. **Build Verification:** 100% clean Next.js production build output across all 23+ routes.
