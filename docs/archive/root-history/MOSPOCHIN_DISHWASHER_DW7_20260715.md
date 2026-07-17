# MosPochin — Dishwasher DW7 Completion Report

**Date:** 15 July 2026  
**Stage:** DW7 Direct/noindex + final cluster audit

## Summary

The professional dishwasher cluster is complete at **40/40 published URLs**:

- 37 organic/indexable pages;
- 3 Direct/noindex landing pages;
- 20 symptom-service pages;
- 10 foundation/equipment-family pages;
- 6 brand-service pages;
- 1 hub.

The three DW7 pages are:

- `remont-promyshlennyh-posudomoechnyh-mashin-moskva.html`;
- `posudomoechnaya-mashina-ne-slivaet-remont-moskva.html`;
- `remont-posudomoechnoy-mashiny-winterhalter-moskva.html`.

## Direct contract

Each DW7 page has:

- `noindex,follow` in source HTML;
- self-canonical;
- exclusion from sitemap;
- zero organic inbound links;
- campaign, ad-group and direct-ad attribution;
- equipment model, serial number, error code, wash stage and details fields;
- phone and WhatsApp CTA;
- Service, FAQPage and BreadcrumbList structured data;
- links back to relevant organic service pages;
- an independent-service disclaimer on the Winterhalter landing page.

## Technical baseline

| Metric | Result |
| --- | ---: |
| Production HTML | 242 |
| Builder pages | 242 |
| Builder parity | 242/242 |
| Indexable HTML | 228 |
| Noindex HTML | 14 |
| Sitemap URLs | 228 |
| Dishwasher pages | 40/40 |
| Dishwasher organic | 37 |
| Dishwasher Direct | 3 |
| Dishwasher evidence records | 31 |
| Model-scoped error codes | 9 |
| Excluded ambiguous code rows | 1 |
| Crawl issues | 0 |
| Broken targets | 0 |
| Indexable orphans | 0 |
| Shared/parametric coverage | 42.9% |

## Validation

| Profile | Result |
| --- | --- |
| Core | 60/60 passed |
| Visual runtime | 4/4 passed |
| Dishwasher direct pages | 3/3 passed |
| Dishwasher anti-cannibalization | 40/40 passed |
| Builder parity | 242/242 |
| Site crawl | 0 issues |

## Canonical visual evidence

The final dishwasher visual pack contains **160 PNG files**:

- 40 pages;
- desktop and mobile;
- first-view and full-page;
- 80 first-view PNG;
- 80 full-page PNG.

First-view screenshots use the standard project viewport contract. Full-page mobile screenshots use a 393 CSS-pixel viewport with device scale factor 1 to keep long-page stitching reliable; this does not change responsive layout breakpoints.

## Architecture changes

- Added three builder-managed Direct source models.
- Updated `data/direct-landing-pages.json` and `data/dishwasher-conversion-pages.json`.
- Added custom field support to the generic Direct renderer.
- Added `tools/check-dishwasher-direct-pages.mjs`.
- Added `tools/check-dishwasher-cannibalization.mjs`.
- Completed the published dishwasher link graph.
- Updated the cluster registry, screenshot manifests, source-builder manifest and generated reports.
- Preserved the original parametric architecture; the 37 organic pages were not converted into monolithic snapshots.

## Image integrity

No production image was intentionally added, removed or modified during DW7. Image integrity is verified separately by SHA-256 comparison against the DW6 source baseline.

## Final profile results

After the DW7 conversion-manifest compatibility fix:

- core: **60/60 passed**;
- visual: **4/4 passed**;
- AI/generated: **5/5 passed**;
- assets: **2/2 passed**;
- online npm audit: **0 vulnerabilities**.

These are the same 68 constituent checks used by the handoff profile. The single verbose aggregate invocation exceeded the execution wrapper limit while repeating the already-passed core profile; no constituent test remained unverified.

Image comparison against DW6:

- baseline files: **278**;
- current files: **278**;
- added: **0**;
- removed: **0**;
- changed: **0**.
