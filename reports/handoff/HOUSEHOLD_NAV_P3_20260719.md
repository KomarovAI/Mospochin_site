# Household navigation and content P3

## Outcome

- One registry now drives the household desktop menu, mobile menu and footer.
- The builder replaces both empty and legacy populated shell containers, preventing stale local shell snapshots from leaking into generated pages.
- All 216 governed household pages were synchronized and rebuilt.
- Kitchen hoods and wine cabinets now use the household shell instead of the restaurant shell.
- Household navigation exposes 10 service categories in three groups: cold and storage, laundry and washing, kitchen and heating.

## Main household page

- Added freezers and dryers to the primary category route.
- Standardized category names.
- Replaced the duplicate category directory with an urgent-symptoms safety block.
- Replaced generic price cards with concise cost factors.
- Replaced the oversized brand matrix with a model-label qualification block.
- Expanded the request form to all 10 categories.
- Reduced generated HTML from 98,941 to 70,558 bytes.

## Services page

- Rebuilt the catalog as 10 consistent category cards with symptom cues.
- Added freezers and dryers.
- Expanded the request form to all 10 categories.
- Reduced generated HTML from 61,945 to 57,726 bytes.

## SEO and architecture

- Updated descriptions for the household home and services pages.
- Metadata synchronization now updates builder source heads as well as generated HTML.
- Canonical synchronization is attribute-order independent and guarantees one canonical per page.
- 500 HTML pages rebuilt; site crawl reports 0 issues.
- 216 household pages pass the shell coverage audit; no restaurant navigation leak remains.

## Verification

- `npm run ai:verify -- --files ...` — passed.
- `npm run check:architecture` — passed.
- `npm run check:html-head` — 500/500 valid.
- `npm run check:site-crawl` — 500 HTML, 482 sitemap URLs, 0 issues.
- `npm run check:hood-cluster` — passed.
- `npm run check:wine-cabinet-cluster` — passed.
- Household integrity and navigation synchronization checks — passed for 216 pages.

## Source-handoff limitation

The supplied artifact is a `source-handoff-lite` archive and intentionally excludes `src/media-source`; media masters are shipped separately. Therefore the global handoff profile reaches and then stops at `check-kutter-images` because four cutter image masters are absent. Generated responsive images are present and the household change does not modify those assets.
