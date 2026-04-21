# Restaurant Branch Contract

This document defines the maintenance contract for the restaurant branch.

## Source of Truth

- `main.js` is the canonical runtime JavaScript for restaurant branch behavior.
- `data/restaurant-branch.json` is the shared restaurant branch data layer for repeated restaurant UI.
- Page-level content remains editable in the HTML pages when the copy is unique to that page.

## Page Roles

- `index.html` and `uslugi.html` act as restaurant routers.
- Vertical restaurant pages keep their own copy and page-specific structure.
- Shared restaurant UI should come from the shared data layer instead of being duplicated across pages.

## Validation

- Check that routed pages still resolve to the correct restaurant sections.
- Verify that shared UI reads from the canonical data layer and not from page-local duplicates.
- Run the normal site validation flow after contract-sensitive edits.
