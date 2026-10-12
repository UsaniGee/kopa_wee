# Product Guidelines: KopaWee

## Brand Identity & Tone
- **Voice:** Encouraging, trustworthy, energetic, and culturally resonant with Nigerian youth.
- **Tone:** Practical, clear, and action-oriented during administrative procedures; warm and community-driven in social and marketplace interactions.
- **Honesty:** Say only what the product does today. Unbuilt features use the shared `ComingSoon` panel or a "Soon" badge; never sample people, invented numbers or fake success messages. Show success only after the server confirms.

## Design System & Visual Aesthetics

### Aesthetic Style: Sharp-Edged & Bordered (canonical, confirmed 2026-10-08)
- **No border radius.** `border-radius: 0` is the base for buttons, inputs, selects, textareas and panels (`@layer base` in `src/app/globals.css`). Do not add `rounded-*` to panels, cards, inputs or buttons.
- **Exceptions (round on purpose):** the draggable theme toggle pill, loading spinners, and small status dots (`rounded-full`).
- **Borders carry the structure.** Panels and controls use a 1px border (`border-slate-300/60` light, `dark:border-slate-800`); the active or selected state switches the border to emerald (`border-emerald-600`). Dashed borders mark planned, not-yet-built items.
- **Flat surfaces.** Separate areas with surface colour and borders, not shadows or gradients. Small shadows only on primary buttons.

### Color Tokens (`src/app/globals.css`)
The Tailwind `emerald-*` and `slate-*` scales are overridden with the brand palette, so `bg-emerald-600`, `text-slate-500` etc. already use these values.

| Role | Light | Dark | Use |
|------|-------|------|-----|
| Page background (`--color-background`) | `#eaf5ed` | `#0a0f0d` | Page canvas (`bg-[#eaf5ed] dark:bg-[#0a0f0d]`) |
| Surface (`--color-surface`) | `#dcece1` | `#121a16` | Panels and sections (`bg-[#dcece1] dark:bg-[#121a16]`) |
| Inset surface | `#eaf5ed` | `#0a0f0d` | Inputs and rows inside a panel |
| Text primary (`--color-text-primary`) | `#0d1712` | `#f1f5f3` | Headings and body (`text-[#121815] dark:text-white`) |
| Text muted (`--color-text-muted`) | `#425b4d` | `#8b9e93` | Supporting text (`text-slate-600 dark:text-slate-400`) |
| Accent (`--color-accent`) | `#5db35d` | `#5db35d` | Highlights and progress |
| Action green | `emerald-600` `#2d8544` / hover `emerald-700` `#1c5d2b` | same | Primary buttons and links |
| Border (`--color-border`) | `rgba(28, 93, 43, 0.15)` | `rgba(255, 255, 255, 0.1)` | Dividers and panel borders |
| Ink banner | `#121815` | `#121815` | Page header banners and the dashboard navbar |
| Danger | `red-600`/`red-700` | `red-400` | SOS, errors, destructive actions |
| Warning | `amber-500`/`amber-700` | `amber-400` | Unverified, pending, AI drafts |

### Typography
- **Display:** `font-display` for headings, uppercase labels with wide tracking (`uppercase tracking-widest`).
- **Body:** Plus Jakarta Sans (`--font-jakarta`) for text and controls.
- **Mono:** `font-mono` for codes, counts and small status labels (state codes, "Coming soon", step numbers).

### Component Patterns
- **Inputs & selects:** `px-4 py-3 bg-[#eaf5ed] dark:bg-[#0a0f0d] border border-slate-300/60 dark:border-slate-800 text-xs focus:border-emerald-600`. Label above (uppercase, 11px), hint or error below (10px; errors in red with `aria-invalid`).
- **Primary buttons:** `bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider`, at least 44px tall on touch screens; disabled state at 50% opacity.
- **Secondary buttons:** transparent with a 1px slate border; border darkens on hover.
- **Panels:** surface colour + 1px border, `p-6`/`p-8`. Cards only when the whole card is an interaction (a listing, a selectable option).
- **Badges:** small mono uppercase text with a 1px border in the state colour (Live = emerald, Partly live/pending = amber, Soon = slate).
- **Coming soon:** `src/shared/components/ComingSoon.tsx`: label, feature name, one sentence, optional planned list (dashed), one link to something that works today.

### Navigation & Motion
- **Text-roll hover** on Navbar and Footer links (`.text-roll-wrapper`).
- **Arrow nudge** on action buttons (`group-hover:translate-x-1`).
- **Entrance:** `animate-fadeIn` (200 ms) for modals and placeholder panels; disabled under `prefers-reduced-motion`.
- **Role routing:** the dashboard menu comes from the session role; items for unbuilt pages carry a "Soon" badge.
- **Onboarding:** 4 steps (Identity, NYSC status, Academic, Deployment) with Back navigation; fields required only where the status needs them.

### Accessibility Standards
- Aim for WCAG AA text contrast on mint, sage, ink and dark surfaces (not yet measured; check muted text on `#dcece1` first).
- Dialogs: `role="dialog"`, `aria-modal="true"`, labelled by their heading.
- Custom choices use real buttons (`role="radio"` / `role="checkbox"` with `aria-checked`); errors use `role="alert"`; live results (SOS) use `aria-live`.
- Every input has a `<label htmlFor>`; touch targets are at least 44×44px.
