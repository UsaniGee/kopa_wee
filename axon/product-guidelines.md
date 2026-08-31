# Product Guidelines: KopaWee

## Brand Identity & Tone
- **Voice:** Encouraging, trustworthy, energetic, and culturally resonant with Nigerian youth.
- **Tone:** Practical, clear, and action-oriented during administrative procedures; warm and community-driven in social and marketplace interactions.

## Design System & Visual Aesthetics

### Aesthetic Style: Modern Soft-Edge & Bordered Design
- **Intentional Structural Borders:** Use subtle border strokes (`border border-slate-200`, `border-emerald-500/20`, or `1px solid var(--card-border)`) on inputs, cards, containers, and dividers to ensure clear visual separation and structure.
- **Base Geometry & Radius Standard:** Baseline `border-radius: 0.75rem` (`rounded-xl`) is enforced on native buttons, inputs, selects, textareas, and cards via `@layer base` in `src/app/globals.css`.
- **Hierarchy of Corner Radii:**
  - `rounded-xl` (`0.75rem`): Form controls, inputs, dropdown options, and compact card items.
  - `rounded-2xl` / `rounded-3xl` (`1rem` - `1.5rem`): Hero containers, auth & onboarding cards, primary dashboard overview panels.
  - `rounded-full`: Compact action pills, status badges, avatar rings, and step indicators.

### Color Palette & CSS Tokens (`src/app/globals.css`)
| Role | Color | CSS / Tailwind Token | Hex / Value | Notes |
|------|-------|----------------------|-------------|-------|
| Primary NYSC Accent | Active Green | `--nysc-green` / `emerald-500` | `#66bb6a` | Action buttons, progress bars, highlights |
| Primary Light Green | Mint Light | `--nysc-green-light` / `emerald-100` | `#a5d6a7` | Selected state fills & soft callouts |
| Primary Dark Green | Forest Green | `--nysc-green-dark` / `emerald-800` | `#1b5e20` | Headings & dark surface fills |
| Page Surface (Light) | Pure White | `--color-background` / `bg-white` | `#ffffff` | Primary background |
| Pale Mint Surface | Soft Mint | `--color-surface` / `slate-50` | `#e8f5e9` | Alternating section fills & card contrast |
| Border Stroke Light | Subtle Green-Slate | `--color-border` / `border-slate-200` | `rgba(27, 94, 32, 0.2)` | Card, input, & table divider borders |
| Card Border Glass | Translucent Green | `--card-border` | `rgba(27, 94, 32, 0.12)` | Glassmorphism card borders |

### Component Hierarchy & Styling Guidelines
- **Form Inputs & Selects:** `bg-slate-100 border border-slate-200 text-black rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500` — clear border strokes with focus glow.
- **Primary Action Buttons:** `bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md` — sharp green fill with hover state.
- **Secondary Buttons:** `bg-slate-100 hover:bg-slate-200 text-black border border-slate-200 rounded-xl` — soft mint/slate fill with subtle border outline.
- **Cards & Panels:** Fills (`bg-white`, `bg-slate-50`, `bg-emerald-50`) with explicit border strokes (`border border-slate-200` or `1px solid var(--card-border)`) and `rounded-2xl` corners.
- **Badges:** Soft solid fills (`bg-emerald-100 text-emerald-800`, `bg-slate-200 text-black`, `bg-black text-white`) with optional subtle border outlines.

### Navigation & Micro-Interactions
- **Tumbling Text-Roll Hover:** Double-layer text-roll hover animation (`.text-roll-wrapper`) on all Navbar and Footer links.
- **Diagonal Arrow Motion:** Action buttons feature right/upward arrow translations on hover (`group-hover:translate-x-1`).
- **Role Switcher & Jump Flow:** Role selection automatically redirects users to the first tab of their active role view.
- **Onboarding Progress:** 4-step progressive wizard with step-back navigation and stage-gated field visibility (eliminating decision fatigue).

### Accessibility Standards
- High text-to-background contrast across light, mint, emerald, and dark surfaces.
- Dialogs: `role="dialog"`, `aria-modal="true"`, `aria-label`.
- Keyboard navigation: Escape key closes modals; Enter/Space activates custom role cards.
