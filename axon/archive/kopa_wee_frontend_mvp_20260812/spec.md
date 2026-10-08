# Pathway Specification: KopaWee Frontend MVP

## Overview
**KopaWee** is a modular platform built like "LEGO" pieces—a unified app housing distinct mini-products tailored to the user's role. Rather than a single overwhelming dashboard, KopaWee uses a shared core infrastructure (Authentication, Profile, Notifications, Location, Payments, Messaging, Documents) and dynamically presents role-specific experiences.

---

## 1. Shared Core Infrastructure ("LEGO Foundation")
- **Authentication & Onboarding:** Sign up (Email, Phone, Password, Verification) leading to the critical **"Who Are You?" Role Selector**:
  - Prospective Corps Member
  - Serving Corps Member
  - Ex-Corps Member / Alumni
  - PPA Representative (Employer)
  - CDS Executive
  - LGA Inspector / NYSC Official
- **Global Role Switcher & Status Transition:** Allows seamless previewing and status upgrades (e.g., Prospective transitioning to Serving after Orientation Camp).
- **Shared Utilities:** Notification Center, Location Services, P2P Payments mock, Messaging System, Document Storage Vault.

---

## 2. Role-Based Dynamic Experiences (Mini-Products)

### Flow 1: Prospective Corps Member Experience
Shows **ONLY** relevant pre-camp tools:
- **Camp Countdown & Registration Timeline**
- **Smart Packing Checklist** (with interactive progress)
- **Orientation Camp Guide & State Orientation Guides**
- **Travel Planner** (pre-camp travel routes & tips)
- **AI Assistant** (Instant guidance on mobilization, call-up, and requirements)

### Flow 2: Serving Corps Member Experience
Unlocks active service year mini-products:
- **Serving Dashboard:** Today's Schedule, Clearance Reminder, Work Tomorrow, Nearby Corps Members.
- **Marketplace Mini-Product (`/marketplace`):** Buy, Sell, Nearby items (mattresses, gas cylinders, appliances), Categories, Saved items, and "List Item" Form.
- **Safety Mini-Product (`/safety`):** Trusted Contacts, SOS Emergency trigger, Journey Sharing, Emergency Numbers, Nearby Police & Hospitals.
- **Community Mini-Product (`/community`):** People Near Me, CDS Group Hub, Events, Groups, and Chat.
- **Accommodation Mini-Product (`/accommodation`):** Housing Directory near PPA, Roommate Matching quiz and scorecards.
- **AI Knowledge Assistant (`/ai`):** Dedicated query interface for relocation, clearance rules, and service regulations.

### Flow 3: PPA Representative (Employer) Experience
Tailored management portal for host organizations:
- **PPA Dashboard:** Today's Attendance summary, Staff list, Pending Leave Requests, Announcements, Reports.
- **Attendance Module:** Clock In/Out UI, Mark Present/Absent/Late log.
- **Leave Request Management:** Review, Approve, or Reject corper leave applications with reason notes.

### Flow 4: CDS Executive Experience
Leadership portal for Community Development Service groups:
- **CDS Dashboard:** CDS Attendance register, Active Projects tracker, Group Announcements, Dues collection status, Reports, and Event Gallery.

### Flow 5: LGA Inspector / Official Experience
Administrative oversight portal:
- **LGA Dashboard:** Today's Clearance overview, Biometric/Clearance Attendance log, LGA Statistics, Official Messages, and Reports.

---

## 3. Visionary Landing Page (`/`)
- Communicates the KopaWee vision, modular "LEGO" platform breakdown, 4-year rollout timeline, and interactive role-based preview modal.

---

## Acceptance Criteria
1. First-time onboarding flow includes the "Who Are You?" role selection step that immediately customizes the visible navigation and dashboard.
2. The navbar role switcher allows seamless switching between all 5 role experiences (Prospective, Serving, PPA Rep, CDS Exec, LGA Inspector).
3. Each mini-product (Marketplace, Safety, Community, Accommodation, PPA Portal, CDS Hub, LGA Portal) renders its specialized, standalone interface.
4. Mobile and desktop viewports are fully responsive with high-contrast emerald visual aesthetics.
