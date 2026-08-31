# Specification: Smart AI Engine, Location Recommendations & Core Platform Interactivity

## Overview
Implement the unbuilt interactive capabilities and intelligence layers of KopaWee+ as outlined in the core product architecture vision. This includes an Indeed-style location-based recommendation engine for accommodation and marketplace items, trust badging with scam warnings, interactive roommate matching (% match scores), a working NYSC AI Assistant & AI Listing Generator, an interactive Safety Circle & SOS broadcast system, and live leave approval/clock-in state management for PPA Reps and CDS Executives.

## Functional Requirements

### 1. Indeed-Style Location Recommendation Engine & Trust Badges
- **Distance & Context Ranking:** Surface accommodation and marketplace items filtered and ranked by `service_state`, `lga`, `ppa_area`, and customizable discovery radius (2km, 5km, 10km, 20km).
- **Trust Badges:** Display prominent badges on cards:
  - `🟢 Verified`
  - `🟡 Unverified` (with explicit disclaimer: *"This listing has not been verified by the platform. Do not send money prior to inspection."*)
  - `🔵 Posted by Corps Member`
  - `🏢 Posted by Property Owner/Agent`
- **Scam Protection & Flagging:** Interactive "Report Listing / Scam Warning" modal allowing users to report suspicious ads.

### 2. Smart Roommate Matcher & Preferences Engine
- **Compatibility Scoring:** Calculate and display % match scores (e.g. `87% Match`) based on budget range, distance to PPA (< 5km), gender preference, and move-in timeline.
- **Privacy Controls:** Expose approximate proximity only (e.g. *"Ada is serving ~3 km from your PPA"*). Exact address and phone number require mutual connection approval.

### 3. Interactive NYSC AI Knowledge Assistant & Conversational Listing Generator
- **NYSC Regulations Assistant:** Interactive chat interface answering questions about relocation procedures, camp rules, monthly clearance, and document verification.
- **AI Listing Creation Assistant:** Allow users to paste raw text (e.g. *"One room available in Kubwa near Arab Road, N180k/year, shared compound"*); AI extracts property type, location, price, and amenities for instant confirmation before publishing.

### 4. Interactive Safety Circle & Trip Monitor
- **Trusted Contacts Editor:** Manage up to 5 safety circle contacts (Name, Relationship, Phone Number).
- **Active Trip Check-In:** Highway transit check-in timer with status check-in prompts.
- **SOS Alert Broadcast:** Interactive emergency SOS trigger modal with countdown and alert dispatch to safety circle.

### 5. PPA Employer & CDS Executive Live State Management
- **Leave Request Management:** Interactive Approve/Reject modal with optional feedback note for PPA Representatives.
- **Attendance & Dues Register:** Interactive clock-in system (Present, Absent, Late) and CDS dues collection tracker.
