# Dishwasher Cluster AI Guide

## Status

- Cluster key: `dishwasher`
- Phase: `DW7 complete`
- Published total: **40 pages**
- Organic/indexable: **37 pages**
- Direct/noindex: **3 pages**
- Main hub: `posudomoechnye-mashiny.html`
- Household page excluded: `posudomoyki.html`
- Canonical visual pack: **160 PNG** — 40 pages × desktop/mobile × first-view/full-page.

## Source of truth

```text
official manufacturer evidence
→ data/dishwasher-fault-evidence.json
→ taxonomy / brand / error-code contracts
→ data/dishwasher-cluster-pages.json
→ source page models
→ site builder
→ root HTML
→ generated reports and checks
```

Root HTML is generated output. Edit the source model or the relevant data contract and rebuild the site.

## Published architecture

| Layer | Published |
| --- | ---: |
| Hub | 1 |
| Foundation and equipment families | 10 |
| Symptom-service | 20 |
| Brand-service | 6 |
| Direct/noindex | 3 |
| **Total** | **40** |

## Mandatory rules

1. The restaurant hub remains `posudomoechnye-mashiny.html`.
2. `posudomoyki.html` is household repair and is never a dishwasher-cluster member.
3. Error codes require manufacturer + document/model scope + official evidence ID.
4. Do not publish the ambiguous Electrolux `Er-002` row from PM00483 until the manufacturer supplies a corrected document.
5. Safe checks must not require opening electrical panels, bypassing interlocks or disassembling pumps/heaters.
6. Organic pages must not link to Direct/noindex pages.
7. Every organic page must remain reachable from the hub in one click and have at least three relevant inbound links.
8. Equipment-family applicability is mandatory: conveyor and hood symptoms are not injected into undercounter pages unless technically relevant.
9. Direct pages remain crawlable, use `noindex,follow`, are absent from sitemap and have self-canonical URLs.
10. Direct pages may link back to organic service pages, but Direct-to-Direct and organic-to-Direct links are forbidden.
11. Brand pages must include confirmed series, serial-number capture, evidence IDs and an independent-service disclaimer.
12. New public copy must pass the cannibalization and public-language checks.

## Direct pages

- `remont-promyshlennyh-posudomoechnyh-mashin-moskva.html`
- `posudomoechnaya-mashina-ne-slivaet-remont-moskva.html`
- `remont-posudomoechnoy-mashiny-winterhalter-moskva.html`

Each Direct page has campaign/ad-group/direct-ad attribution, a compact service form and organic related links. Direct pages are not included in the organic link graph or sitemap.

## Machine-readable contracts

```text
data/dishwasher-cluster-pages.json
data/dishwasher-fault-taxonomy.json
data/dishwasher-fault-evidence.json
data/dishwasher-error-codes.json
data/dishwasher-brand-models.json
data/dishwasher-symptom-pages.json
data/dishwasher-link-graph.json
data/dishwasher-conversion-pages.json
data/dishwasher-screenshot-audit.json
data/dishwasher-dw7-screenshot-audit.json
data/dishwasher-dw7-fullpage-audit.json
```

## Commands

```bash
npm run audit:dishwasher-cluster
npm run check:dishwasher-evidence
npm run check:dishwasher-fault-taxonomy
npm run check:dishwasher-brand-models
npm run check:dishwasher-brand-pages
npm run check:dishwasher-direct-pages
npm run check:dishwasher-error-codes
npm run check:dishwasher-pages
npm run check:dishwasher-intent-boundaries
npm run check:dishwasher-link-graph
npm run check:dishwasher-cannibalization
npm run audit:dishwasher-screenshots
npm run audit:dishwasher-dw7-screenshots
```

## Completion criteria

The cluster is release-ready only when:

- builder/root parity is 100%;
- sitemap includes all 37 organic URLs and no Direct URLs;
- all three Direct pages expose `noindex,follow` in source HTML;
- organic-to-Direct inbound links are zero;
- broken targets and indexable orphans are zero;
- error codes remain model-scoped;
- core, visual, AI, assets and npm-audit profiles pass;
- canonical desktop/mobile first-view and full-page screenshots exist for all 40 pages.
