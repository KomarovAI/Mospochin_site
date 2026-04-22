# Site Maintenance Model

This document is the canonical high-level map for maintaining `Mospochin_site`.

## Source Of Truth

- `telegram-form.js`
  - canonical client-side form runtime for pages with `hasForm=true`
- `data/runtime-config.json`
  - canonical form endpoint/runtime configuration
- `server/telegram-api.mjs`
  - canonical production Telegram delivery backend
- `data/page-metadata.json`
  - canonical URLs, indexing, branch, page-level metadata
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

## Canonical Docs

- `docs/README.md`
  - repo-level operational overview
- `docs/PROJECT_MAP.md`
  - compact structural map of runtime/data/docs/tooling
- `docs/SITE_MAINTENANCE_MODEL.md`
  - canonical site-wide maintenance model
- `docs/STABILIZATION_BACKLOG.md`
  - confirmed rough edges and next hardening candidates
- `docs/HOUSEHOLD_*`
  - household branch contracts and workflows
- `docs/RESTAURANT_*`
  - restaurant branch contracts and workflows

Any older rollout report, one-off styling note, or transition summary is non-canonical and should not override the documents above.
