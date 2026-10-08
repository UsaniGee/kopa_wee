# Specification: Purge Hardcoded Serving Dashboard Banner Data & Dynamic User Fetching

## Overview
Purge hardcoded dummy placeholder strings ("LA/24A/1042", "Corper Chidi", "Ikeja LGA Hub, Lagos State", "4 days") from the Serving Corps Member dashboard view in `src/app/dashboard/page.tsx`. Dynamically fetch and display the logged-in user's actual name, state code, deployed state, LGA, and upcoming clearance date from the backend database/API.

---

## Functional Requirements

### 1. Dynamic Serving Dashboard Banner (`src/app/dashboard/page.tsx`)
- **State Code & Role**: Replace `"ROLE: SERVING CORPS MEMBER (LA/24A/1042)"` with `"ROLE: SERVING CORPS MEMBER ([user.stateCode || "State Code Pending"])"`.
- **User Name**: Replace `"Welcome back, Corper Chidi"` with `"Welcome back, [user.name || "Corper"]"`.
- **Location & Clearance Info**: Replace `"Monthly LGA Clearance in 4 days (Ikeja LGA Hub, Lagos State)"` with:
  - Dynamically calculated days remaining until `nextEligibleAt` clearance window.
  - Dynamically fetched user `lga` and `deployedState` (e.g. `"[lga || "LGA"] Hub, [deployedState || "State"]"`).

### 2. User Data API Synchronization
- Fetch live user details from `/api/users/me?userId=[userId]` or `/api/users/journey?userId=[userId]` inside the Serving Dashboard component.
- Ensure fallback text is clean and professional when optional profile fields are not yet filled by the user.

---

## Acceptance Criteria
- [ ] No hardcoded names ("Chidi"), state codes ("LA/24A/1042"), or LGAs ("Ikeja LGA Hub, Lagos State") remain in the Serving dashboard banner.
- [ ] Logged-in user's actual name, state code, deployed state, and LGA are dynamically rendered in the banner.
- [ ] Next clearance days remaining is calculated dynamically from the backend clearance API.
