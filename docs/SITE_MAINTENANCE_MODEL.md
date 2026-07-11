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
- `data/contact-config.json`
  - canonical shared contact runtime (phone/WhatsApp/email) for both branches
- `data/schema-profile.json`
  - canonical schema defaults for service JSON-LD (`global -> branch -> page` override model)
- `data/household-page-slots.json` and `data/restaurant-page-slots.json`
  - canonical service KPI defaults (`serviceKpiDefaults`) and optional page-level KPI override (`pages.<page>.serviceKpi`)
- `server/telegram-api.mjs`
  - canonical production Telegram delivery backend
- `analytics.js`, `telegram-form.js` and `data/metrics-event-contract.json`
  - canonical conversion runtime, attribution payload and event/privacy contract
- `data/metrics-scorecard-policy.json` and `ops/mosanalytics/bin/mosanalytics-events-aggregate.py`
  - canonical page-level decision policy and clean scorecard/action outputs
- `data/page-metadata.json`
  - canonical URLs, indexing, branch, page-level metadata
- `data/screenshot-audit.json`
  - canonical representative-page audit coverage, viewport presets, and local screenshot pass settings
- `data/restaurant-screenshot-audit.json`
  - canonical full restaurant branch audit coverage, viewport presets, and local screenshot pass settings
- `data/site-page-contracts.json`
  - shared page-type contract across the whole site
- `src/site-builder.json`
  - canonical page registry and source/output parity contract
- `src/pages/*/page.json` and `src/pages/*/sections/*`
  - canonical editable source for every page
- `src/components/shared/*` and `src/components/parametric/*`
  - canonical reusable section/component layers
- `data/household-*.json`
  - household branch shell, page policy, registry, slots, proof, taxonomy, card presets
- `data/restaurant-*.json`
  - restaurant branch shell, page policy, registry, slots, proof, taxonomy
- `main.js`
  - canonical shared runtime for branch/service hydration
- Root `*.html`
  - generated production output; do not edit it as an independent source

## Branch Separation

- `household` and `restaurant` are separate products on one technical base.
- Do not merge their helpers, policies, proof layers, slots, or taxonomies into one generic authoring model.
- Keep branch-specific workflows separate even when the validator and runtime are shared.

## Editing Rules

- Для создания страницы использовать `npm run page:create`; для AI-контекста — `npm run page:edit`; для точечной проверки — `npm run page:check`.
- Root HTML считается generated output: `check:generated-diff` блокирует изменение HTML без source/data/runtime-изменения.

- Edit the smallest correct JSON source of truth first.
- Use branch-specific doctor/helpers/sync commands for routine public page maintenance.
- Use the screenshot audit flow only for stabilization review; it does not replace branch-specific authoring helpers.
- Keep page edits inside `src/pages/<slug>/sections/*` and shared edits inside `src/components/shared/*` or the explicitly parameterized component layer.
- Root HTML is generated output. If an emergency manual root edit is unavoidable, immediately re-bootstrap that page and run the parity checks.
- Public service-page fallback zones are intentionally duplicated and must stay aligned through branch sync commands.
- KPI/stat blocks on public service pages are a sync-managed fallback zone (`service-kpi`) and should be edited through slot contracts, not by direct hardcoded HTML counters.
- Treat the form path as a concrete contract, not an abstract runtime note:
  - `telegram-form.js` owns client submission
  - `data/runtime-config.json` owns the site-relative endpoint
  - `server/telegram-api.mjs` owns the production delivery backend
- Treat analytics as a concrete backend contract:
  - `analytics.js` sends only allowlisted events to `/api/track-event`
  - `server/telegram-api.mjs` writes redacted/hash-only JSONL rows
  - `data/metrics-event-contract.json` is the source for event names and privacy rules
  - `page_view` carries page context and stable `page_version`; artikk produces `llm_page_scorecard` and `llm_page_improvement_actions`
  - `qualified_lead`, `call_answered`, and `repair_order_created` arrive only through the token-protected server-to-server outcome endpoint
- Treat contact rendering as a concrete contract:
  - `data/contact-config.json` owns shared phone/WhatsApp values
  - HTML contact links expose `data-contact-link="phone|whatsapp"` for runtime hydration
  - optional `data-whatsapp-text` keeps page-specific message context
- Treat service JSON-LD as a concrete contract:
  - `data/schema-profile.json` owns shared schema defaults
  - branch and page overrides are allowed only inside the same contract (`global -> branch -> page`)
  - no standalone schema constants should be duplicated across branch runtimes

## Canonical Workflow

1. Run the narrow page doctor.
2. Edit the smallest source-of-truth layer.
3. Sync fallbacks when the branch workflow requires it.
4. Run `npm run build:site -- --page <page.html> --write` for the affected page, or the full build for a batch.
5. Run `npm run check:architecture`, `npm run check:site-builder`, and `npm run validate:site`.
6. Run any narrow branch/page smoke checks needed for the risk surface.
7. For representative stabilization passes, run `npm run audit:representative-pages`, review `.artifacts/screenshots/`, and add only confirmed findings to `reports/manual-review-backlog.md`.
8. For full restaurant stabilization passes, run `npm run audit:restaurant-branch`, review `.artifacts/screenshots/restaurant/` through `docs/RESTAURANT_VISUAL_AUDIT_CHECKLIST.md`, and add only confirmed findings to `reports/manual-review-backlog.md`.
9. Before merge, run `npm run doctor:changed-pages` (or rely on CI) so modified pages always pass `doctor:page`.
10. If raster assets changed, run `npm run optimize:images` before `npm run check:image-budget`.
11. Before deleting or pruning assets, run `npm run audit:assets` and treat "outside site reference graph" as a candidate list, not automatic deletion approval.

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
- `npm run doctor:changed-pages`
  - runs `doctor:page` only for pages affected by the current diff and serves as a narrow CI doctor gate
- `npm run optimize:images`
  - local lightweight ffmpeg pass for changed raster assets (`jpg/jpeg/png/webp`), replacing files only when size savings are meaningful
- `npm run audit:assets`
  - read-only asset inventory for assets referenced by HTML/CSS/JS/JSON, heavy referenced rasters, and tracked assets that are not referenced by that scan surface
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
- `data/project-map.generated.json`
  - generated machine map of pages, source, clusters, checks and ownership summary
- `docs/SITE_MAINTENANCE_MODEL.md`
  - canonical site-wide maintenance model
- `reports/manual-review-backlog.md`
  - confirmed rough edges and next hardening candidates, including screenshot-audit findings after manual review
- `docs/DOC_INDEX.md`
  - current doc taxonomy and reading route
- `docs/HOUSEHOLD_*`
  - household branch contracts and workflows
- `docs/RESTAURANT_*`
  - restaurant branch contracts and workflows

Any older rollout report, one-off styling note, or transition summary is non-canonical and should not override the documents above.

## Narrow Reference Docs

- `docs/BRANDS_GUIDE.md`
  - restaurant brand reference
