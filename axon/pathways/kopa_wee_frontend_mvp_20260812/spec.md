# Pathway Specification: KopaWee Frontend MVP

## Overview
**KopaWee** is an active personal assistant and super-app for National Youth Service Corps (NYSC) members across Nigeria. This specification defines the **Frontend-First MVP**, establishing a visionary landing page that communicates KopaWee's mission, along with complete interactive frontend modules for the core corps member lifecycle: Companion, Marketplace, Accommodation, Safety, Workplace, and Community.

## Functional Requirements

### 1. Visionary Landing Page (`/`)
- **Hero Banner:** Compelling value proposition ("The Active Personal Companion for Every Corps Member"), call-to-action buttons for Prospective Corps Members and PPA Employers, and live metric badges (50k+ Corps Members, 2k+ PPAs).
- **Module Interactive Showcase:** Tabbed preview of core modules (Companion, Safety, Marketplace, Housing, Workplace, CDS).
- **Rollout Flow Timeline:** Interactive visual depiction of KopaWee's 4-year scaling vision (Year 1: Companion/Safety/Marketplace -> Year 2: Workplace -> Year 3: CDS -> Year 4: Official NYSC Integrations).
- **User Lifecycle Interactive Flow:** Interactive path showing PCM -> Orientation Camp -> Serving Corps Member -> POP / Alumni.

### 2. Companion & Smart Clearance (`/companion`)
- **Smart Clearance Assistant:** Interactive cards converting passive LGA clearance schedules into actionable calendar sync items, map routes, and required document checklists.
- **Offline Document Vault:** UI for managing encrypted local uploads of call-up letters, green cards, and medical fitness certificates.
- **Orientation Camp Guide:** Packing checklist with progress bar and camp survival tips.

### 3. Peer-to-Peer Corper Marketplace (`/marketplace`)
- **Item Listings Feed:** Card grid displaying items (mattresses, gas cylinders, cooking utensils, fans, textbooks) filtered by Category, State, LGA, and Price.
- **Corper Verification Badges:** Seller cards showing state code and verification status.
- **List Item Modal:** Form to upload item image preview, title, price, LGA location, and contact options.

### 4. Accommodation & Roommate Matching (`/accommodation`)
- **Corper Lodges Directory:** Apartment listings near PPAs and LGA centers with pricing, distance, and amenities.
- **Roommate Compatibility Finder:** Quiz filter (gender, LGA, budget, PPA proximity) with match percentage score cards.

### 5. Travel Safety & Emergency Tracker (`/safety`)
- **Trip Check-In Widget:** Interface for recording active interstate travel status (e.g. Lokoja-Abuja expressway).
- **SOS Emergency Trigger:** Rapid emergency alert dialog with mock contacts and local rep notification.

### 6. PPA Workplace & CDS Hub (`/workplace`, `/community`)
- **Workplace Portal:** PPA onboarding checklist, employer details, and corper review cards.
- **CDS Community Manager:** CDS group directory, meeting reminders, and attendance log.

## Non-Functional Requirements
- **Design Excellence:** Emerald green palette, dark/light theme, modern typography (Inter/Geist), glassmorphism cards, responsive layouts.
- **Performance:** Instant page transitions, smooth CSS micro-animations, client-side state reactivity.

## Acceptance Criteria
1. Navigation bar allows seamless tab navigation between Landing Page, Companion, Marketplace, Accommodation, Safety, Workplace, and Community.
2. All interactive UI states (filters, modals, tabs, form inputs, checklists) function smoothly without console errors.
3. Responsive design works flawlessly on both desktop viewports and mobile screens.
