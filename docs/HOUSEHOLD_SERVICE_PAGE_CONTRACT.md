# Household Service Page Contract

This document defines the maintenance contract for household service pages.

## Source of Truth

- `data/household-services.json` is the canonical registry for household service-page intent.
- `data/household-page-slots.json` is the slot-content layer for household service pages.
- `data/household-branch.json` remains the shared branch shell layer for top bar, menus, footer links, and branch-level navigation.
- `data/page-metadata.json` remains the canonical SEO/branch metadata layer.
- Page HTML keeps unique copy and layout, but should not become the only source of truth for symptoms, brand clusters, FAQ, request hints, or page identity.

## Registry Fields

Each entry in `data/household-services.json` must define:

- `page`: deployed HTML file name
- `slug`: stable machine identifier without `.html`
- `uiLabel`: short menu/catalog label
- `deviceName`: user-facing device/category name
- `serviceName`: canonical service-page intent label
- `schemaName`: expected top-level `Service.name` value in JSON-LD
- `isShadow`: whether the page is hidden from public UI and must stay `noindex`
- `primarySymptoms[]`: short symptom phrases used for routing and LLM edits
- `brandCluster[]`: representative brands for that service
- `relatedPages[]`: household service pages that can be suggested nearby
- `formExample`: one realistic example payload for the page form
- `sectionIds[]`: section anchors that must exist in the HTML

## Page Contract

Every household service page must keep:

- one metadata entry in `data/page-metadata.json`
- one top-level `Service` JSON-LD block
- one `.telegram-form`
- at least one FAQ block using `.faq-item`
- all section ids declared in the registry entry
- the runtime slot anchors required by the current slot model

## Slot Contract

Public household service pages currently use:

- `data-slot="service-schema"` on the main `Service` JSON-LD script
- `data-slot="request-form"` on the canonical `.telegram-form`
- slot runtime content from `data/household-page-slots.json` for FAQ and request-form copy

## Shadow Pages

- Shadow pages stay in the repo and may remain directly reachable by URL.
- Shadow pages must have `isShadow: true` in the registry.
- Shadow pages must stay `noindex,follow` in metadata.
- Public branch navigation and related links for visible household pages must not point to shadow pages.
