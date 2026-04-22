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
  - FAQ and request-form copy for public household pages
- `data/household-taxonomy.json`
  - device families, allowed symptoms, brand pools, semantic related-page rules
- `data/household-page-policy.json`
  - required anchors, required form fields, and scaffold defaults for public/shadow pages
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
  - checks whether one household page is aligned across metadata, registry, slots, taxonomy, and HTML anchors

## Editing Rule

- Use the scaffold first when adding a new household page.
- Edit the registry first for symptoms, brands, related pages, and identity changes.
- Edit slots first for FAQ or request-form copy changes.
- Edit HTML only for unique layout or page-specific narrative.
- Run `npm run validate:site` after changes.

## Design Boundaries

- The factory does not generate the whole site.
- The factory does not replace manual layout work.
- The factory keeps HTML fallback content in place; runtime hydration remains additive.
