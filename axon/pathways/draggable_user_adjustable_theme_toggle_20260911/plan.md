# Implementation Plan: User-Adjustable Draggable Theme Toggle for Mobile Navigation

## Phase 1: Component Creation & Layout Integration
- [x] Task: Create `DraggableThemeToggle.tsx` in `src/shared/components/` with touch & mouse drag support and boundary constraints.
- [x] Task: Update `src/app/layout.tsx` to render `DraggableThemeToggle` instead of static `ThemeToggle`.

## Phase 2: Verification
- [x] Task: Verify TypeScript build via `npx tsc --noEmit`.
- [x] Task: Register pathway in AXON registry `axon/pathways.md`.
