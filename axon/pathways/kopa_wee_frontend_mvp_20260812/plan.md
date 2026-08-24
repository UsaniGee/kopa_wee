# Pathway Implementation Plan: KopaWee Frontend MVP

## Phase 1: Modular Design System & Onboarding ("LEGO Foundation")
- [x] Task: Set up global CSS tokens, dark/light theme variables, and fonts in `src/app/globals.css`
- [x] Task: Build Splash Screen & First-Time Onboarding Modal with "Who Are You?" 5-Role Selector in `src/shared/components/OnboardingModal.tsx`
- [x] Task: Build Modular Navbar & Global Role Switcher in `src/shared/components/Navbar.tsx`
- [x] Task: Build Shared UI Primitives (Cards, Badges, Tabs, Modals, Inputs, Status Badges)
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Visionary Landing Page (`/`)
- [x] Task: Implement Hero Section with animated tagline, live metrics, and dual CTA buttons in `src/app/page.tsx`
- [~] Task: Build Interactive Modular Architecture Showcase component (showing Lego-like mini-products)
- [~] Task: Build Rollout Timeline Infographic & User Lifecycle Flowchart components
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Prospective Corps Member Flow (`/dashboard/prospective`)
- [ ] Task: Build Prospective Dashboard showing ONLY Camp Countdown, Packing Checklist, Registration Timeline, and Travel Planner in `src/app/dashboard/prospective/page.tsx`
- [ ] Task: Build Interactive Camp Packing Checklist with progress bar and Orientation Camp Guide
- [ ] Task: Build "Status Transition" modal (Upgrading Prospective -> Serving Corps Member)
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: Serving Corps Member Flow & Mini-Products (`/dashboard/serving`)
- [ ] Task: Build Serving Dashboard (Today's Schedule, Clearance Reminder, Work Tomorrow, Nearby Corpers) in `src/app/dashboard/serving/page.tsx`
- [ ] Task: Build Marketplace Mini-Product (`/marketplace`) with Buy/Sell feeds, Category filters, Saved items, and "List Item" form
- [ ] Task: Build Safety Mini-Product (`/safety`) with Trusted Contacts, SOS Emergency trigger, Journey Sharing, and Nearby Hospitals/Police
- [ ] Task: Build Community Mini-Product (`/community`) with People Near Me, CDS Group Hub, Events, and Chat
- [ ] Task: Build Accommodation Mini-Product (`/accommodation`) with Corper Housing directory and Roommate Compatibility Finder
- [ ] Task: Build AI Knowledge Assistant (`/ai`) interface for relocation & NYSC regulations
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 5: PPA Representative Flow (`/dashboard/ppa`)
- [ ] Task: Build PPA Employer Dashboard (Today's Attendance summary, Staff list, Pending Leave Requests, Announcements) in `src/app/dashboard/ppa/page.tsx`
- [ ] Task: Build Attendance Clock-In & Mark Present/Absent/Late interface
- [ ] Task: Build Leave Request Review & Approve/Reject workflow modal
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 6: CDS Executive & LGA Inspector Flows (`/dashboard/cds`, `/dashboard/lga`)
- [ ] Task: Build CDS Executive Dashboard (Attendance Register, Projects Tracker, Dues Status, Gallery) in `src/app/dashboard/cds/page.tsx`
- [ ] Task: Build LGA Inspector Dashboard (Today's Clearance Overview, Attendance Log, Statistics, Reports) in `src/app/dashboard/lga/page.tsx`
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 7: Final Polish & Verification
- [ ] Task: Verify role-based navigation switching across all 5 user profiles
- [ ] Task: Complete mobile responsiveness & dark/light theme audit
- [ ] Task: Phase Verification & Checkpoint (Refer to workflow.md)
