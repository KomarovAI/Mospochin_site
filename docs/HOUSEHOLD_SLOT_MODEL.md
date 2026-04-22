# Household Slot Model

This document defines the first slot-based content layer for public household service pages.

## Purpose

- Keep page layouts and long-form sales copy editable in HTML.
- Move repeatable, high-change content into predictable JSON-driven slots.
- Give Codex/LLM a stable place to update FAQs, form hints, related links, symptom chips, and brand chips without re-reading the entire page.

## Source Of Truth Split

- `data/household-services.json`
  - page identity
  - shadow/public state
  - primary symptoms
  - brand cluster
  - related pages
  - service name / schema name
- `data/household-page-slots.json`
  - FAQ content
  - request-form hint chips
  - request-form placeholders
  - branch-level card sections for household hubs and contact pages
- `data/household-card-presets.json`
  - allowed card tones
  - CTA vocabulary
  - service card icon/tone presets
- HTML page
  - unique layout
  - long-form copy
  - unique visual treatment
  - any section that is intentionally page-specific and not repeated across the branch

## Runtime Behavior

- `main.js` hydrates public household service pages only.
- Slot hydration is additive and must not depend on layout rewrites.
- If slot data is missing, the page must keep working with its static HTML fallback.
- Shadow pages are not hydrated from the household slot model.

## Current Slot Surfaces

- `service-schema`
  - runtime refreshes the page `Service` JSON-LD from page metadata + household registry
- `request-form`
  - runtime injects symptom chips, brand chips, request hint chips, and example guidance
  - runtime updates `type` and `problem` placeholders
- `faq`
  - runtime replaces the main FAQ list with the slot entry for the current page
- `related-links`
  - runtime injects a compact “see also” block after the request section using household registry links
- `category-cards`
  - runtime can replace household hub category grids from registry + card-section config
- `trust-cards`
  - runtime can replace repeatable benefit/result cards on household hub pages
- `contact-channels`
  - runtime can replace the main household contact channel cards from shared slot data

## Editing Rule

- If you are changing FAQ or request copy, edit `data/household-page-slots.json` first.
- If you are changing household hub cards or contact-channel cards, edit `data/household-page-slots.json` first and keep tones/CTA labels aligned with `data/household-card-presets.json`.
- If you are changing symptoms, brand coverage, page identity, or related page topology, edit `data/household-services.json`.
- Only edit HTML when the change is truly layout-specific or intentionally unique to one page.
