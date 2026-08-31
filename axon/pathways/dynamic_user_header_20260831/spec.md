# Pathway Specification: Dynamic User Profile & Header Sync (`dynamic_user_header_20260831`)

## Overview
This pathway replaces hardcoded user header elements (`Corper Chidi` and `LA/24A/1042`) in `src/shared/components/DashboardNavbar.tsx` with dynamic user profile attributes. The navbar will read the logged-in user's name and state code from `localStorage` (`kopawee_user_name`, `kopawee_user_profile`) and sync with `GET /api/users/me` to ensure that every authenticated user sees their real name, display name, and active NYSC state code in the top header.

---

## Key Requirements

1. **Purge Hardcoded Header Strings:**
   - Remove hardcoded `"Corper Chidi"` and `"LA/24A/1042"` from `src/shared/components/DashboardNavbar.tsx`.
2. **Dynamic State Management:**
   - Implement `userName` and `stateCode` state variables in `DashboardNavbar`.
   - On component mount, read stored values from `localStorage` (`kopawee_user_name`, `kopawee_user_profile`).
3. **Database Sync via `GET /api/users/me`:**
   - Fetch user details from `GET /api/users/me?userId=...` when `kopawee_user_id` exists, updating the header automatically when user profile details change.
4. **Fallback Handling:**
   - Default `userName` to `"Corps Member"` if no profile name exists yet.
   - Default `stateCode` to `"NYSC Verified"` if state code is pending onboarding.

---

## Acceptance Criteria

1. **Live User Name Display:** Header renders the actual user's full name or display name created during sign-up/onboarding.
2. **Live State Code Display:** Header renders the user's state code or active verification status.
3. **Build Verification:** 100% clean Next.js production build output across all 23 routes.
