# Household Factory Model

This document defines the first page-factory layer for household service pages.

## Goal

- Create new household pages without hand-editing four or five files from memory.
- Keep layout flexibility in HTML while making repeatable structure machine-safe for Codex/LLM workflows.
- Validate page identity, slot data, and semantic alignment before deploy.

## Source Of Truth Layers

- `data/page-metadata.json`
  - SEO, canonical URL, indexing, branch, form presence
- `data/household-services.json`
  - page identity, symptoms, brand cluster, related pages, section ids, shadow state
- `data/household-page-slots.json`
  - FAQ, request-form copy, and branch-level card sections for household pages, including `bytovaya-about`
- `data/household-card-presets.json`
  - allowed tones, CTA vocabulary, and preset icon/tone mapping for reusable household cards
- `data/household-proof-layer.json`
  - shared proof strip, price-clarity strip, proof cards, objection cards, and branch-level review/confidence/case blocks
- `data/household-taxonomy.json`
  - device families, allowed symptoms, brand pools, semantic related-page rules
- `data/household-page-policy.json`
  - required anchors, required form fields, static body-class contract, scaffold defaults, and shared branch card-slot policy
- HTML page
  - unique layout, unique long-form copy, and page-specific visual treatment

## Factory Tools

- `npm run scaffold:household-service -- --slug <slug> --device-name "<device>" --ui-label "<label>" --service-name "<service>"`
  - creates the HTML page
  - adds metadata
  - adds a service-registry entry
  - adds a slot entry for public pages
  - adds a taxonomy device entry
  - adds public pages to household branch navigation when the page is not shadow
- `npm run doctor:household-page -- --page <file>`
  - checks whether one household page is aligned across metadata, registry, slots, taxonomy, static body classes, and HTML anchors
  - prints the recommended edit surface for routine service-page changes
- `npm run household:set-faq`, `household:set-form-hints`, `household:set-related`, `household:set-proof`, `household:set-metadata`
  - narrow authoring helpers for public household service pages
  - update only the source-of-truth JSON layer for the requested change

## Editing Rule

- Use the scaffold first when adding a new household page.
- Edit the registry first for symptoms, brands, related pages, and identity changes.
- Edit slots first for FAQ or request-form copy changes.
- Edit `data/household-proof-layer.json` first for trust, review, SLA, price-clarity, objections, and conversion-confidence blocks.
- Edit branch card sections in `data/household-page-slots.json` and keep them aligned with `data/household-card-presets.json`.
- Prefer the narrow helper commands for routine public service-page changes before editing JSON by hand.
- Edit HTML only for unique layout or page-specific narrative.
- Run `npm run validate:site` after changes.

## Design Boundaries

- The factory does not generate the whole site.
- The factory does not replace manual layout work.
- The factory keeps HTML fallback content in place; runtime hydration remains additive.
- Shared household styling expects stable body classes (`page-<slug>`, `page-household-branch`, `page-household-service`) to exist in HTML; runtime keeps them normalized as a fallback.
