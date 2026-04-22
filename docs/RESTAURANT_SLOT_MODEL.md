# Restaurant Slot Model

Restaurant branch and service pages use the same maintenance principle as household, but they keep their own branch semantics and editing workflow.

## Source Of Truth

- `data/restaurant-branch.json`
  Shared branch shell, navigation, footer links, route strips.
- `data/restaurant-services.json`
  Restaurant service identity, related pages, symptoms, brand clusters, schema names.
- `data/restaurant-page-slots.json`
  Repeatable slot content for restaurant branch pages and public service pages.
- `data/restaurant-proof-layer.json`
  Shared restaurant service proof defaults and branch-level proof/review/case sections.
- `data/page-metadata.json`
  SEO, canonical, robots, Open Graph metadata.
- HTML pages
  Unique hero, narrative layout, page-specific visual structure.

## Branch Pages

Restaurant branch pages are:

- `index.html`
- `uslugi.html`
- `about.html`
- `contact.html`

Repeatable branch sections must be edited through slot/proof data, not by manually rewriting the card grids in HTML:

- `categoryCards`
- `trustCards`
- `contactChannels`
- `routingHint`
- `proofCards`
- `reviewCards`
- `caseCards`

HTML keeps the shell and the slot hosts via `data-slot="..."`.

## Service Pages

Restaurant service pages keep runtime + sync parity for:

- `service-schema`
- `request-overview`
- `faq`
- `service-proof`
- `related-links`

Use restaurant helper commands for routine edits. Do not use household helpers on restaurant pages.

## Editing Rule

Edit JSON first when the change is:

- repeatable card/proof content
- FAQ
- request-form hints
- related links
- service proof defaults

Edit HTML only when the change is:

- unique hero copy
- unique long-form narrative
- page-specific shell/layout
- adding a new slot host required by policy

## Validation

Before finalizing restaurant changes, run:

```bash
npm run restaurant:sync-fallbacks
npm run doctor:restaurant-page -- --page index.html
npm run doctor:restaurant-page -- --page grili-mangaly.html
npm run validate:site
```
