# Restaurant Factory Model

This document defines the first page-factory layer for restaurant service pages.

## Goal

- Create new restaurant pages without hand-editing multiple files from memory.
- Keep layout flexibility in HTML while making repeatable structure machine-safe for Codex/LLM workflows.
- Validate page identity, slot data, and semantic alignment before deploy.

## Source Of Truth Layers

- `data/page-metadata.json`
  - SEO, canonical URL, indexing, branch, form presence
- `data/restaurant-services.json`
  - page identity, symptoms, brand cluster, related pages, section ids
- `data/restaurant-page-slots.json`
  - FAQ, request-form copy, and `requestOverview` for public restaurant service pages
- `data/restaurant-proof-layer.json`
  - shared restaurant SLA and proof defaults used by service-page hydration and fallback sync
- `data/restaurant-taxonomy.json`
  - equipment families and semantic related-page rules
- `data/restaurant-page-policy.json`
  - required anchors, required form fields, sync zones, and body-class contract
- HTML page
  - unique layout and page-specific narrative

## Factory Tools

- `npm run scaffold:restaurant-service -- --slug <slug> --device-name "<device>" --ui-label "<label>" --service-name "<service>" --family <family>`
  - creates the HTML page
  - adds metadata
  - adds a service-registry entry
  - adds a slot entry
  - adds a taxonomy device entry
  - adds the page to restaurant branch navigation
- `npm run doctor:restaurant-page -- --page <file>`
  - checks whether one restaurant page is aligned across metadata, registry, slots, taxonomy, static body classes, sync zones, and HTML anchors
- `npm run restaurant:set-faq`, `restaurant:set-form-hints`, `restaurant:set-related`, `restaurant:set-proof`, `restaurant:set-metadata`
  - narrow authoring helpers for public restaurant service pages
- `npm run restaurant:sync-fallbacks [-- --page <file>]`
  - updates the sync-safe fallback zones in public restaurant service-page HTML
  - covers `service-schema`, `request-overview`, `faq-items`, `service-proof`, and `related-links`

## Editing Rule

- Use the scaffold first when adding a new restaurant page.
- Edit the registry first for symptoms, brands, related pages, and identity changes.
- Edit slots first for FAQ, request-form copy, or `requestOverview` changes.
- Edit `data/restaurant-proof-layer.json` first for shared SLA/proof defaults.
- After helper or direct JSON edits on a public restaurant service page, run `npm run restaurant:sync-fallbacks`.
- Edit HTML only for unique layout or long-form narrative.
- Run `npm run validate:site` after changes.
