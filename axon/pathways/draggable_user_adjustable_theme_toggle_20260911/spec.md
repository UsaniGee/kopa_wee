# Spec: User-Adjustable Draggable Theme Toggle for Mobile Navigation

## Overview
The fixed bottom-right position of the floating theme switcher (`bottom-6 right-6`) can overlap or obscure bottom mobile navigation controls, action bars, or admin controls on mobile screens. To solve this, the floating theme toggle needs to be user-adjustable via touch and drag gestures, remembering its custom position across page navigations.

## Requirements
1. Build a `DraggableThemeToggle` component that wraps `ThemeToggle`.
2. Support both touch gestures (`onTouchStart`, `onTouchMove`, `onTouchEnd`) and mouse dragging (`onMouseDown`, `onMouseMove`, `onMouseUp`).
3. Differentiate between a quick tap/click (which toggles theme) and a drag movement (which repositions the toggle element).
4. Restrict drag coordinates within visible viewport boundaries so the button cannot be dragged off-screen.
5. Save user-defined position coordinates to `localStorage` (`kopawee_theme_pos`) to maintain custom placement across page navigations.
6. Provide default mobile offset (`bottom-20 right-4` on mobile, `bottom-6 right-6` on desktop) so it defaults out of the way of standard bottom mobile navbars.

## Acceptance Criteria
- [x] Theme toggle is smoothly draggable on mobile touch screens and desktop mice.
- [x] Single tap/click toggles light/dark/system theme cleanly without triggering a reposition drag.
- [x] Custom position is saved in `localStorage` and restored on page refresh.
- [x] Button stays within visible viewport bounds.
- [x] Global layout uses `DraggableThemeToggle` in `src/app/layout.tsx`.
- [x] TypeScript build passes cleanly.
