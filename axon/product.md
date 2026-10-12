# Product Definition: KopaWee (NYSC Companion)

## Vision
**KopaWee** is an active personal companion for National Youth Service Corps (NYSC) members across Nigeria. Official NYSC portals are administrative records; KopaWee helps from the moment a graduate receives their call-up letter until after passing out (POP).

Status labels below: **Live** works today, **Partly live** has some parts working, **Planned** is not built yet. The app shows the same honesty: unbuilt features use a "Coming soon" panel or a "Soon" badge.

## Target Audience & User Roles
1. **Prospective Corps Members (PCMs):** preparing for mobilization and orientation camp. **Live.**
2. **Serving Corps Members:** clearance, PPA, housing, travel and marketplace. **Live.**
3. **Ex-Corps Members (POP alumni):** selling household items. **Partly live** (marketplace live; careers planned).
4. **CDS executives, PPA employers, LGA officials:** **Planned.** Their dashboards show "Coming soon"; users cannot give themselves these roles.

Every new account starts as a PCM. Status changes go forward (PCM → Serving → Alumni), by the user, by the daily automatic check of camp and service dates, or by an admin.

## Feature Pillars

### 1. Accounts, Onboarding & Roles: Live
- Email/password (with email verification and password reset) and Google sign-in.
- 4-step onboarding saves name, phone, NYSC status, institution, course, batch, stream, deployed state and LGA (from seeded reference data), state code and PPA.
- Dashboards and menus follow the role in the session.

### 2. Camp Companion: Live
- Camp packing checklist saved per user (one list, notes and warnings included), countdown to the camp date.
- **Planned:** document vault, state camp guides.

### 3. Peer-to-Peer Marketplace: Live
- Listings with photos (downscaled in the browser) reviewed by an admin before going live; filter by state and category; optional AI-written draft (Gemini).
- Seller phone and email are shown only to signed-in users; WhatsApp and call links.
- **Planned:** reporting a listing.

### 4. Accommodation & Roommates: Live
- Lodge listings (moderated) with a host contact, filter by LGA.
- Roommate requests: express interest, owner accepts or declines, phone and email shared only after acceptance.
- **Planned:** tenant reviews.

### 5. Clearance & PPA Logbook: Partly live
- Log monthly clearance, see the next eligible date, add it to Google Calendar.
- Daily PPA logbook (summary and hours, one entry per day).
- **Planned:** clearance reminders, employer tools, leave requests.

### 6. Safety: Partly live
- One-tap SOS with the phone's GPS location, logged and emailed to the user; quick link to call 112.
- **Planned:** trip check-ins, alerts to trusted contacts.

### 7. AI Assistant: Partly live (beta)
- General answers from Google Gemini, with a reminder to confirm with official NYSC sources.
- **Planned:** answers grounded in official NYSC documents.

### 8. CDS Hub and Careers: Planned
- CDS meetings, attendance and projects; job listings and a CV builder for alumni.

### 9. Verified Corps Members: Planned
- Confirm corps member identity through a licensed verification provider (e.g. an NYSC-number check plus a selfie match).
