# Specification: Progressive Onboarding, NYSC Journey Lifecycle & Camp Essentials

## Overview
Transform KopaWee's user onboarding and profile lifecycle from a static form into a progressive, journey-driven onboarding flow. Users sign up once and evolve through their NYSC lifecycle (`prospective_corps_member` ➔ `serving_corps_member` ➔ `alumni`), unlocking state/LGA/PPA context-aware features and custom interactive modules like the **Camp Essentials Checklist** without needing a new account.

---

## Key Functional Requirements

### 1. Authentication & Initial Journey Status Selection (`/onboarding`)
- **Credentials:** Email, Phone number, Password, Name. (No call-up number required at login).
- **Step 1: Journey Stage Selection:**
  1. `prospective_corps_member` ("I'm preparing for NYSC")
  2. `serving_corps_member` ("I'm currently serving")
  3. `alumni` ("I've completed NYSC")
  *(Supported in schema: `ppa_rep`, `cds_exec`, `nysc_official`)*

### 2. Prospective Corps Member (PCM) Onboarding & Profile
- **Basic Profile:** Name, Display Name, Phone, Email, optional photo.
- **NYSC Prep Details:** `pcm_stage` (mobilization, registration, waiting deployment, received call-up letter), Expected Batch (A/B/C/not sure), Year, Stream (optional), Institution Name & State, Searchable Field of Study.
- **Deployment State:** Optional `deployment_state` (36 States + FCT). If unknown, skip with reassurance: *"No worries. You can add your deployment state later when NYSC assigns it."*
- **Interest Profiling:** Multi-select interests (`interests[]`).
- **PCM Dashboard:** Personalised cards showing timeline, camp checklist, state guide (if `deployment_state` is set) or prompt to add deployment state (if null).

### 3. Interactive Camp Essentials Module (`/dashboard/companion` or `/dashboard/camp-essentials`)
- **Categories:** Documents, White Camp Wear, Crocs & Slippers, Bedding, Toiletries & Hygiene, Security & Daily Essentials, Laundry, Optional Comfort.
- **Features:** Item checkboxes, category filtering, recommendation notes (e.g. Crocs usage disclaimer vs parade ground shoes), custom item additions, completion progress percentage bar.
- **Official Notices:** Disclaimers linking to official NYSC documentation requirements and camp official instructions.

### 4. Lifecycle Transition: PCM ➔ Serving Corps Member
- Triggered seamlessly without losing PCM data.
- **Progressive Profile Request:**
  - `service_state` (Required 36 States + FCT)
  - `service_stage` (orientation camp, waiting PPA posting, posted to PPA, serving at PPA)
- **Orientation Camp Stage:** Select/confirm orientation camp location, dashboard personalises around camp schedule, essentials, and nearby corpers.
- **PPA Posting Stage:** Collect PPA Name, PPA Type, Location (State, LGA, Area/Town, Address), Resumption date, Working days/hours.

### 5. Smart Location & Privacy-Preserving Discovery
- `service_state`, `LGA`, and `PPA area` drive nearby recommendations.
- Distance-based discovery matching (2km, 5km, 10km, 20km radius) using approximate distances only ("Ada is serving approximately 3 km from your PPA").
- Opt-in privacy controls for discoverability and safety circle contacts (up to 5 trusted contacts).

### 6. Serving Corper & Alumni Dashboards
- **Serving Dashboard:** Dynamic "Today's Journey" card, PPA work schedule, LGA clearance countdown, CDS reminders, nearby corpers/accommodation.
- **Alumni Dashboard:** POP gear hand-off market, career launchpad, mentorship, and alumni directory.

---

## Out of Scope
- Backend database integration (handled via reactive client state & localStorage mock persistence for initial MVP).
