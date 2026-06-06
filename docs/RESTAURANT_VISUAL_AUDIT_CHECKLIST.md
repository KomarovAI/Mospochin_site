# Restaurant Visual Audit Checklist

Use this checklist after `npm run audit:restaurant-branch`.

This is a restaurant-first stabilization review workflow. It is not a deploy gate, not a design auto-score, and not a replacement for branch authoring helpers.

## Start

1. Run `npm run audit:restaurant-branch`.
2. Open the artifact folder printed by the command under `.artifacts/screenshots/restaurant/`.
3. Review pages strictly in this order:
   - `index.html`
   - `uslugi.html`
   - `about.html`
   - `contact.html`
   - `parokonvektomaty.html`
   - `plity-pechi.html`
   - `holodilnoe-oborudovanie.html`
   - `posudomoechnye-mashiny.html`
   - `grili-mangaly.html`
   - `ice-machines.html`

## Per-Page Review Sequence

1. Open the desktop screenshot.
2. Open the mobile screenshot.
3. Compare both against the page role and the established restaurant branch look.
4. Decide whether the issue is a confirmed backlog item or a non-finding.

## Fixed Rubric

Check every page against the same categories:

- `layout integrity`
  - broken section structure, missing blocks, collapsed shells, or obvious overlap
- `spacing/alignment consistency`
  - uneven gutters, broken card alignment, off-grid sections, or unstable rhythm
- `hierarchy/readability`
  - weak heading contrast, unreadable text density, broken emphasis, or hard-to-scan sections
- `CTA/form clarity`
  - hidden CTA, weak next step, damaged form prominence, or confusing action path
- `content overflow/cropping`
  - clipped text, image crop errors, off-screen controls, or cut cards
- `branch consistency`
  - page visibly drifts from restaurant branch patterns without intent

## Severity Mapping

- `high`
  - broken layout, unreadable content, hidden CTA/form, or severe overlap/cropping
- `medium`
  - obvious hierarchy, spacing, or trust issues that materially weaken the page
- `low`
  - visible polish issue that does not block the page

## Finding Types

Use only:

- `layout`
- `spacing`
- `overflow`
- `readability`
- `cta/form`
- `consistency`

## Do Not File

- Do not log pure taste or style preference.
- Do not log intended branch-specific differences as inconsistency.
- Do not create separate rows for the same root issue across desktop and mobile.
- If the same root issue appears in both viewports, keep one backlog row and mention the affected viewport(s) in `Surface`.

## Backlog Rules

Log only confirmed issues in `reports/manual-review-backlog.md`.

Use the fixed columns:

- `Surface`
- `Severity`
- `Type`
- `Source`
- `Recommended edit surface`
- `Status`

Use this `Source` format for restaurant visual audit findings:

- `restaurant visual audit YYYY-MM-DD <artifact-folder-name>`

Use one backlog row per root issue.

Point `Recommended edit surface` to the smallest likely owner:

- `data/restaurant-branch.json`
- `data/restaurant-services.json`
- `data/restaurant-page-slots.json`
- `data/restaurant-proof-layer.json`
- `data/page-metadata.json`
- page HTML only when the JSON layers are not the owner
