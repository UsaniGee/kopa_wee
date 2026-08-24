# Product Guidelines: KopaWee

## Brand Identity & Tone
- **Voice:** Encouraging, trustworthy, energetic, and culturally resonant with Nigerian youth.
- **Tone:** Practical, clear, and action-oriented during administrative procedures; warm and community-driven in social and marketplace interactions.

## Design System & Visual Aesthetics

### Aesthetic Style: Modern Flat Design (Zero Borders)
- **Zero Structural Borders:** No outline border lines (`border-0` / no `border-*` classes). Content hierarchy and section separation are driven entirely by alternating background color bands, soft surface fills, and typography.
- **Geometry:** Sharp square edges (`rounded-none`).

### Color Palette (Canonical — enforced across all components)
| Role | Color | Tailwind Token | Notes |
|------|-------|----------------|-------|
| Primary accent | Emerald green | `emerald-500` (`#10b981`) | Buttons, active progress indicators, feature highlights |
| Primary dark | Emerald dark | `emerald-600` (`#059669`) | Hover states on green elements |
| Page Surface (Light) | White | `bg-white` | Primary content section background |
| Alternating Surface | Soft Slate | `bg-slate-50` / `bg-slate-100` | Section background banding & card contrast fills |
| Accent Surface | Soft Emerald | `bg-emerald-50` / `bg-emerald-100` | Selected card state & highlighted journey callouts |
| Dark Surface | Deep Black | `bg-black` | Header scrolled state, hero CTA, footer, primary text |
| Text Main | Black | `text-black` | Headings & primary body copy |
| Text Muted | Slate-500 | `text-slate-500` | Subtitles & secondary labels |

### Component Hierarchy
- **Primary Action Button:** `bg-emerald-500 hover:bg-emerald-600 text-white` — solid green fill with hover arrow translation.
- **Secondary Action Button:** `bg-slate-100 text-black hover:bg-black hover:text-white` (on light surfaces) or `bg-white/20 text-white hover:bg-white hover:text-black` (on dark/hero surfaces) — flat solid contrast fills without outlines.
- **Cards & Boxes:** Flat surface fills (`bg-slate-100`, `bg-emerald-100`, `bg-white` with soft shadow) — zero border lines.
- **Form Inputs:** `bg-slate-100 text-black focus:bg-slate-200 focus:ring-2 focus:ring-emerald-500` — borderless flat inputs.
- **Badges:** Soft solid fills (`bg-emerald-100 text-emerald-800`, `bg-slate-200 text-black`, `bg-black text-white`) — borderless.

### Navigation & Micro-Interactions
- **Tumbling Text-Roll Hover:** Double-layer text-roll hover animation (`.text-roll-wrapper`) on all Navbar and Footer links.
- **Diagonal Arrow Motion:** Action buttons feature right/upward arrow translations on hover (`group-hover:translate-x-1`).

### Accessibility Standards
- High text-to-background contrast across light, slate, emerald, and dark surfaces.
- Dialogs: `role="dialog"`, `aria-modal="true"`, `aria-label`.
- Keyboard navigation: Escape key closes modals; Enter/Space activates custom role radio cards.
- Body scroll locked while modals are open.
