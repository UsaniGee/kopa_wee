# Specification: Flat Borderless Design System Sweep Across KopaWee+

## Overview
Enforce pure Flat Design standards across the entire application — from Landing Page to Authentication, Onboarding, and Dashboard sub-modules. Eliminates all unnecessary visual borders (`border-slate-200`, `border-slate-100`), rounds corner clutter, and relies on solid color planes, pure whitespace, strong high-contrast typography, and KopaWee's official Emerald Green & Obsidian Black brand palette.

## Key Requirements
1. **No Border Clutter:** Remove all artificial `border`, `border-slate-200`, `border-slate-300`, and `border-slate-100` separators around cards, inputs, and layout containers. Rely on background color contrast and spacing.
2. **Flat Color Planes:** Use crisp background shifts (`bg-slate-50`, `bg-white`, `bg-black`, `bg-emerald-500`, `bg-emerald-950`) to demarcate sections instead of stroke outlines.
3. **Consistent Brand Palette:** Maintain Obsidian Black (`#09090b` / `bg-black`), NYSC Emerald Green (`#10b981` / `bg-emerald-500`), and clean White across all pages.
4. **Edge-to-Edge & Full-Screen Layouts:** Auth (`/auth`) and Onboarding (`/onboarding`) maintain edge-to-edge full-screen split layout.
5. **Dashboard & Sub-Modules:** Ensure `/dashboard`, `/dashboard/companion`, `/dashboard/marketplace`, `/dashboard/accommodation`, `/dashboard/safety`, `/dashboard/workplace`, and `/dashboard/community` adhere to flat borderless principles.
