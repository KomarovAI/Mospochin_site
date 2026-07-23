# Mobile navigation hotfix — 21 July 2026

## Scope

Global runtime fix for the MosPochin mobile header/menu, with the household branch as the primary regression target.

## Changed files

- `main.js`
- `styles-combined.css`

## Fixed behavior

- navbar offset follows the measured top-bar height, including wrapped text;
- mobile menu height is constrained to the remaining dynamic viewport;
- menu content scrolls independently with overscroll containment;
- background page scroll is locked and restored at the original position;
- bottom mobile contact bar is hidden while the menu is open;
- menu closes on Escape, outside click, navigation, and desktop breakpoint;
- button `aria-expanded`, `aria-label`, icon, focus return and Tab loop are synchronized;
- services submenu resets after closing;
- header safe-space CSS variable is recalculated with `ResizeObserver`.

## Regression target viewports

- 320 × 568
- 360 × 800
- 390 × 844
- 412 × 915
- 1024 × 768 breakpoint reset
