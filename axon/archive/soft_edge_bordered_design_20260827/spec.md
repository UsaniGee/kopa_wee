# Specification: Modern Soft-Edge & Bordered Design System Alignment

## Overview
Realign KopaWee+'s visual language across all pages (Landing, Auth, Onboarding, and Dashboard Sub-modules) from flat edge-to-edge visuals to the **Modern Soft-Edge & Bordered Design System** defined in `src/app/globals.css`.

This specification formalizes intentional border strokes (`var(--card-border)`, `border-slate-200`, `border-emerald-500/20`), structured surface backgrounds (`#ffffff`, `#e8f5e9`, `#a5d6a7`), and uniform rounded geometry (`rounded-xl` default base, `rounded-2xl` cards, `rounded-full` controls).

## Key Requirements

### 1. Color Palette & Token Enforcement (`globals.css`)
- **Primary NYSC Emerald Accent:** `#66bb6a` (`emerald-500`, `--nysc-green`).
- **Primary Dark Green:** `#1b5e20` (`emerald-600` - `emerald-950`, `--nysc-green-dark`).
- **Light Mint Surface Fills:** `#e8f5e9` (`slate-50`, `emerald-50`, `--color-surface`).
- **Border Tokens:** `--color-border: rgba(27, 94, 32, 0.2)` and `--card-border: rgba(27, 94, 32, 0.12)`.

### 2. Structural Border Lines & Card Enclosures
- Replace flat edge transitions with explicit, high-clarity structural borders on form inputs, card containers, dialogs, and navigation dividers.
- Inputs, selects, and textareas feature subtle borders (`border border-slate-200` or `border border-emerald-500/30`) with `focus:ring-2 focus:ring-emerald-500`.

### 3. Surface Radius Standard (`rounded-xl` to `rounded-3xl`)
- Form controls, inputs, and small badges use `rounded-xl` (`0.75rem`).
- Cards, modals, and primary containers use `rounded-2xl` or `rounded-3xl`.
- Compact action pills, avatar rings, and status dots use `rounded-full`.

### 4. Glassmorphic & Bordered Cards
- Panel and modal cards utilize `.glass-panel` or `.glass-card` with `1px solid var(--card-border)`.
