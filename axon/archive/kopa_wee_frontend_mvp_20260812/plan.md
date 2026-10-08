# Pathway Implementation Plan: KopaWee Frontend MVP

## Phase 1: Modular Design System & Onboarding ("LEGO Foundation")
- [x] Task: Set up global CSS tokens, dark/light theme variables, and fonts in `src/app/globals.css`
- [x] Task: Build Splash Screen & First-Time Onboarding Modal with "Who Are You?" 6-Role Selector in `src/shared/components/OnboardingModal.tsx`
- [x] Task: Build Modular Navbar & Global Role Switcher in `src/shared/components/Navbar.tsx`
- [x] Task: Build Shared UI Primitives (Cards, Badges, Tabs, Modals, Inputs, Status Badges)
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 2: Visionary Landing Page (`/`)
- [x] Task: Implement Hero Section with animated tagline, live metrics, and dual CTA buttons in `src/app/page.tsx`
- [x] Task: Build Interactive Modular Architecture Showcase component (showing Lego-like mini-products)
- [x] Task: Build Rollout Timeline Infographic & User Lifecycle Flowchart components
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 3: Prospective Corps Member Flow (`/dashboard`)
- [x] Task: Build Prospective Dashboard showing ONLY Camp Countdown, Packing Checklist, Registration Timeline, and Travel Planner in `/dashboard`
- [x] Task: Build Interactive Camp Packing Checklist with progress bar and Orientation Camp Guide in `CampEssentialsChecklist.tsx`
- [x] Task: Build "Status Transition" modal (Upgrading Prospective -> Serving Corps Member)
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 4: Serving Corps Member Flow & Mini-Products (`/dashboard`)
- [x] Task: Build Serving Dashboard (Today's Schedule, Clearance Reminder, Work Tomorrow, Nearby Corpers) in `/dashboard`
- [x] Task: Build Marketplace Mini-Product (`/dashboard/marketplace`) with Buy/Sell feeds, Category filters, Location state filter, and "List Item" form
- [x] Task: Build Safety Mini-Product (`/dashboard/safety`) with Trusted Contacts, SOS Emergency trigger, Journey Sharing, and Nearby Emergency Contacts
- [x] Task: Build Community Mini-Product (`/dashboard/community`) with People Near Me, CDS Group Hub, Events, and Dues
- [x] Task: Build Accommodation Mini-Product (`/dashboard/accommodation`) with Corper Housing directory and Roommate Finder
- [x] Task: Build AI Knowledge Assistant interface for relocation & NYSC regulations
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 5: PPA Representative Flow (`/dashboard/workplace`)
- [x] Task: Build PPA Employer Dashboard (Today's Attendance summary, Staff list, Pending Leave Requests, Announcements)
- [x] Task: Build Attendance Clock-In & Mark Present/Absent/Late interface
- [x] Task: Build Leave Request Review & Approve/Reject workflow modal
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 6: CDS Executive & LGA Inspector Flows (`/dashboard/community`, `/dashboard/companion`)
- [x] Task: Build CDS Executive Dashboard (Attendance Register, Projects Tracker, Dues Status, Gallery)
- [x] Task: Build LGA Inspector Dashboard (Today's Clearance Overview, Attendance Log, Statistics, Reports)
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)

## Phase 7: Final Polish & Verification
- [x] Task: Verify role-based navigation switching across all 6 user profiles
- [x] Task: Complete mobile responsiveness & flat borderless design audit
- [x] Task: Phase Verification & Checkpoint (Refer to workflow.md)
