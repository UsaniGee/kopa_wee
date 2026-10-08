# Pathway Specification: Hero Section Layout Fix

## 1. Overview
The current landing page hero section layout needs to be refactored. The navbar height should be calculated so the hero section sits directly below it. The hero section must use the background image as a true background layer with the hero text positioned on top. 

## 2. Functional Requirements
- **Navbar & Hero Interaction:** The hero section should sit below the navbar seamlessly.
- **Background Image:** The hero section image must act as a background (e.g., using `absolute` positioning or Next.js `Image` with `fill`) spanning the full width and height of the section.
- **Text Alignment:** The text layered on top of the hero image should be centered on mobile devices and left-aligned on desktop devices for optimal readability.
- **Overlay Gradient:** A greenish-to-transparent gradient (matching the platform's NYSC green and white theme) must be applied over the background image to ensure the text remains legible.

## 3. Acceptance Criteria
- [ ] Hero section background image covers the entire hero container.
- [ ] Text is legible against the background image due to the greenish gradient overlay.
- [ ] Layout behaves correctly on mobile (centered text) and desktop (left-aligned text).
- [ ] Navbar height is accounted for so the hero section is positioned correctly relative to the navbar.

## 4. Out of Scope
- Any logic changes to the carousel functionality itself.
