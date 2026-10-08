# Specification: Dynamic Clearance Metric Card & Responsive SCM Role Badge

## Overview
Refactor the Serving Corps Member dashboard view in `src/app/dashboard/page.tsx` to dynamically fetch and display live clearance metrics and user location data in the `Next Clearance` metric card, eliminating static hardcoded strings (`"4 Days Left"`, `"Aug 25 · Ikeja Hub"`). Also refactor the role badge in the banner to responsively render `SCM` on mobile screens and `SERVING CORPS MEMBER` on desktop screens.

---

## Functional Requirements

### 1. Dynamic Next Clearance Metric Card (`src/app/dashboard/page.tsx`)
- **Days Remaining (`val`)**:
  - Dynamically calculate remaining days from `clearanceInfo?.nextEligibleAt`.
  - Display `"[N] Days Left"` when `N > 0`.
  - Display `"Open Now"` when `isEligible` is true.
  - Display `"Completed"` when clearance has been completed for the active window.
- **Subtext (`sub`)**:
  - Format date string from `clearanceInfo?.nextEligibleAt` (e.g., `"Aug 25"`).
  - Format hub location from user's `lga` and `deployedState` (e.g., `"[lga] Hub"` or `"[deployedState] Hub"`).
  - Combine formatted date and hub location: `"[Formatted Date] · [lga || "LGA"] Hub"`.

### 2. Responsive SCM Role Badge (`src/app/dashboard/page.tsx`)
- On small screens (`mobile / sm`), shorten badge role title to `SCM` (e.g. `ROLE: SCM (LA/24A/1042)`).
- On larger screens (`md+`), display `ROLE: SERVING CORPS MEMBER (LA/24A/1042)`.

---

## Acceptance Criteria
- [ ] Hardcoded strings `"4 Days Left"` and `"Aug 25 · Ikeja Hub"` are removed from the `Next Clearance` metric card.
- [ ] `Next Clearance` metric card displays calculated days remaining, formatted target date, and actual user LGA.
- [ ] Serving role badge dynamically displays `SCM` on mobile viewports and `SERVING CORPS MEMBER` on desktop viewports.
