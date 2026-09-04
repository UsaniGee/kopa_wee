# Specification: NYSC Platform — Dashboard, Account Settings & Subscription Refinement

## Overview
Refine the NYSC platform user interface and backend logic to provide a contextual, journey-aware experience for PCM, Serving Corps Members, and Alumni. Remove arbitrary role/status switchers from the dashboard, enforce context-aware Account Settings, add POP tracking and automatic transition mechanics (while preserving manual transition overrides and 12-clearance completion triggers), and feature Early Access pricing transparently on the homepage.

---

## 1. Role & Status Architecture
Keep Application Role (`USER`, `ADMIN`, `SUPER_ADMIN`), NYSC Status (`PCM`, `SERVING`, `ALUMNI`), Journey Information (Camp dates, Service dates, PPA, CDS, Clearance), and Subscription (`EARLY_ACCESS`, `FREE`, `PREMIUM`) strictly separated.

### Changes:
- **Remove Role/Status Switcher**: Completely eliminate role dropdowns, status switchers, or "Switch Role" controls from the main dashboard header and user menu.
- **Status Display**: Display the user's authoritative backend status as a read-only badge (e.g. "Prospective Corps Member", "Serving Corps Member", "Alumni Corps Member").

---

## 2. PCM Dashboard & Camp Date Integration
- **Dashboard Focus**: Focus exclusively on NYSC preparation (camp packing checklist, camp info, deployment state, community, accommodation, marketplace, safety, AI assistant, notifications).
- **No Service Dates**: Service Start Year / End Year fields must NOT appear on the PCM dashboard or PCM settings.
- **Camp Dates**: Camp Entry Date and Camp Exit Date remain optional progressive fields.
- **Manual + Automatic Transition**:
  - If camp dates are missing, the manual transition confirmation flow prompts the user to add camp dates or proceed manually.
  - If camp dates are present, the manual transition modal informs the user: *"Your status is scheduled to automatically update on [Camp Exit Date], but would you like to update to Serving now?"*

---

## 3. Serving Corps Member Experience & POP Tracking
- **Account Settings "Service Information" Section**: Expose Service Start Year / Date and Expected Service End Year / Date exclusively for Serving users.
- **Dashboard Service Timeline Banner**: Gentle encouragement banner ("Complete your service timeline") if dates are missing.
- **POP Tracking**: Show expected POP date countdown and timeline ("Your Service Journey: Service Start Jan 2026, Expected Completion Jan 2027, POP is approaching"). Labeled clearly as "Expected Service End Date" / "Expected POP Date".
- **12-Clearance Transition to Alumni**:
  - Monthly clearance continues to enforce 20-day eligibility intervals.
  - After a Serving member completes 12 monthly clearances, the clearance button transitions into a "Complete Service & Transition to Alumni" action button.
- **Automatic Serving -> Alumni Transition**:
  - Backend background evaluator checks `serviceEndDate <= currentDate` to automatically transition `SERVING -> ALUMNI` with audit log, notification, and dashboard state update.

---

## 4. Account Settings Visibility Rules
- **PCM**: Personal info, NYSC/PCM batch, institution, course, deployment info, camp entry/exit dates, preferences, notifications. (Hide Service dates).
- **Serving**: Personal info, NYSC state of service, LGA, PPA info, Service Start/End Year & dates, camp history, preferences, notifications.
- **Alumni**: Personal info, service history summary, batch/year served, state served, career/professional preferences, networking options, notifications. (Hide active serving clearance/PPA widgets).

---

## 5. Early Access Homepage Pricing Section
- **Home Page / Landing Page**: Prominent "Early Access" section/card.
- **Messaging**: "Free for now. Premium plans coming soon." Transparent, early-adoption pricing notice with features list and "View Plans" / "Get Early Access" CTA.
- **No Deceptive Tactics**: No fake countdowns or artificial urgency.

---

## Acceptance Criteria
- [ ] Role/status dropdown completely removed from all user dashboards.
- [ ] User status shown as read-only badge based on backend `nyscStatus`.
- [ ] PCM settings display camp dates only; Service Start/End Years hidden.
- [ ] Manual PCM->SERVING update modal acknowledges camp exit date schedule if present.
- [ ] Serving settings display dedicated "Service Information" section (Start/End Years & dates).
- [ ] Serving dashboard includes POP tracking widget and incomplete timeline banner.
- [ ] Serving clearance widget turns into an Alumni transition button after 12 successful clearances.
- [ ] Automatic `SERVING -> ALUMNI` transition occurs via backend when `serviceEndDate` is reached.
- [ ] Account settings sections strictly follow status context rules (PCM / SERVING / ALUMNI).
- [ ] Homepage includes Early Access transparent pricing card ("Free for now. Premium plans coming soon.").
