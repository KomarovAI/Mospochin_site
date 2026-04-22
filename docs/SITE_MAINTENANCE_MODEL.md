# Site Maintenance Model

This document is the canonical high-level map for maintaining `Mospochin_site`.

For the shortest practical entrypoint, start with [docs/OPERATOR_ROUTING.md](/home/artikk/Mospochin_site/docs/OPERATOR_ROUTING.md) and come back here when you need the wider model.

## Source Of Truth

- `data/operator-recipes.json`
  - machine-readable operator routing for branch-safe edit recipes
- `telegram-form.js`
  - canonical client-side form runtime for pages with `hasForm=true`
- `data/runtime-config.json`
  - canonical form endpoint/runtime configuration
- `server/telegram-api.mjs`
  - canonical production Telegram delivery backend
- `data/page-metadata.json`
  - canonical URLs, indexing, branch, page-level metadata
- `data/screenshot-audit.json`
  - canonical representative-page audit coverage, viewport presets, and local screenshot pass settings
- `data/restaurant-screenshot-audit.json`
  - canonical full restaurant branch audit coverage, viewport presets, and local screenshot pass settings
- `data/site-page-contracts.json`
  - shared page-type contract across the whole site
- `data/household-*.json`
  - household branch shell, page policy, registry, slots, proof, taxonomy, card presets
- `data/restaurant-*.json`
  - restaurant branch shell, page policy, registry, slots, proof, taxonomy
- `main.js`
  - canonical shared runtime for branch/service hydration
- HTML pages
  - unique layout, hero, long-form narrative, slot hosts, sync-safe fallback zones

## Branch Separation

- `household` and `restaurant` are separate products on one technical base.
- Do not merge their helpers, policies, proof layers, slots, or taxonomies into one generic authoring model.
- Keep branch-specific workflows separate even when the validator and runtime are shared.

## Editing Rules

- Edit the smallest correct JSON source of truth first.
- Use branch-specific doctor/helpers/sync commands for routine public page maintenance.
- Use the screenshot audit flow only for stabilization review; it does not replace branch-specific authoring helpers.
- Keep HTML edits limited to unique layout, narrative, and required slot/sync hosts.
- Public service-page fallback zones are intentionally duplicated and must stay aligned through branch sync commands.
- Treat the form path as a concrete contract, not an abstract runtime note:
  - `telegram-form.js` owns client submission
  - `data/runtime-config.json` owns the site-relative endpoint
  - `server/telegram-api.mjs` owns the production delivery backend

## Canonical Workflow

1. Run the narrow page doctor.
2. Edit the smallest source-of-truth layer.
3. Sync fallbacks when the branch workflow requires it.
4. Run `npm run validate:site`.
5. Run any narrow branch/page smoke checks needed for the risk surface.
6. For representative stabilization passes, run `npm run audit:representative-pages`, review `.artifacts/screenshots/`, and add only confirmed findings to `docs/STABILIZATION_BACKLOG.md`.
7. For full restaurant stabilization passes, run `npm run audit:restaurant-branch`, review `.artifacts/screenshots/restaurant/` through `docs/RESTAURANT_VISUAL_AUDIT_CHECKLIST.md`, and add only confirmed findings to `docs/STABILIZATION_BACKLOG.md`.

## Screenshot Audit Workflow

- `data/screenshot-audit.json` is the single source of truth for representative audit coverage.
- `data/restaurant-screenshot-audit.json` is the single source of truth for full restaurant audit coverage.
- `npm run audit:screenshots`
  - starts the local `tools/dev-server.mjs`, opens only the representative pages from the manifest with Playwright, and writes desktop/mobile full-page screenshots under `.artifacts/screenshots/`
- `npm run audit:representative-pages`
  - runs `doctor:page` on the same manifest pages, then runs the screenshot pass and prints a compact summary
- `npm run audit:restaurant-screenshots`
  - starts the same local dev server, opens all restaurant pages from the full restaurant manifest with Playwright, and writes desktop/mobile full-page screenshots under `.artifacts/screenshots/restaurant/`
- `npm run audit:restaurant-branch`
  - runs `doctor:page` on the same restaurant manifest pages, then runs the screenshot pass and prints a compact summary
- `docs/RESTAURANT_VISUAL_AUDIT_CHECKLIST.md`
  - fixed human review rubric for restaurant full-branch screenshot inspection and backlog triage
- The workflow is intentionally semi-automated:
  - no baseline snapshots in git
  - no pixel-diff gating
  - no visual auto-scoring
- Household and restaurant remain separate authoring models; the manifest only defines cross-branch audit coverage.

## Canonical Docs

- `docs/OPERATOR_ROUTING.md`
  - short operator routing for default workflows and stop-rules
- `data/operator-recipes.json`
  - machine-readable recipe catalog for default edit routes and branch-safe command paths
- `docs/README.md`
  - repo-level operational overview
- `docs/PROJECT_MAP.md`
  - compact structural map of runtime/data/docs/tooling
- `docs/SITE_MAINTENANCE_MODEL.md`
  - canonical site-wide maintenance model
- `docs/STABILIZATION_BACKLOG.md`
  - confirmed rough edges and next hardening candidates, including screenshot-audit findings after manual review
- `docs/DOC_STATUS.md`
  - canonical doc taxonomy and status map
- `docs/HOUSEHOLD_*`
  - household branch contracts and workflows
- `docs/RESTAURANT_*`
  - restaurant branch contracts and workflows

Any older rollout report, one-off styling note, or transition summary is non-canonical and should not override the documents above.

## Narrow Reference Docs

- `docs/READABILITY_REFACTOR.md`
  - normalization and asset-loading reference
- `docs/BRANDS_GUIDE.md`
  - restaurant brand reference
