# Project Map

Compact map of the live repository structure and maintenance surfaces.

## Runtime

- `main.js`
  - shared site runtime for branch detection, shared shell rendering, slot hydration, and runtime behavior
- `telegram-form.js`
  - canonical client-side Telegram form submission runtime for `hasForm=true` pages
- `styles.css`
  - canonical hand-maintained stylesheet
- `styles-built.css`
  - built stylesheet artifact used by pages

## Data Contracts

- `data/page-metadata.json`
  - SEO, branch assignment, indexing
- `data/site-page-contracts.json`
  - shared page-type rules
- `data/runtime-config.json`
  - runtime/form endpoint configuration
- `data/household-*.json`
  - household branch shell and service/slot/proof/taxonomy/policy layers
- `data/restaurant-*.json`
  - restaurant branch shell and service/slot/proof/taxonomy/policy layers

## Tools

- `tools/validate-site.mjs`
  - canonical repo-wide contract validator
- `tools/doctor-page.mjs`
  - shared page doctor
- `tools/doctor-household-page.mjs`
  - household-first doctor entrypoint
- `tools/doctor-restaurant-page.mjs`
  - restaurant-first doctor entrypoint
- `tools/*sync-fallbacks.mjs`
  - branch-specific fallback sync flows
- `tools/scaffold-*.mjs`
  - branch-specific service-page factory entrypoints
- `tools/set-*.mjs`
  - branch-specific narrow authoring helpers

## Deploy And Backend

- `data/runtime-config.json`
  - canonical site-relative form endpoint configuration
- `server/telegram-api.mjs`
  - production form delivery backend
- `deploy/`
  - activation hooks, env examples, systemd units
- `tools/generate-deploy-manifest.mjs`
  - deploy file manifest

## Docs

- `docs/README.md`
  - repo-level operating notes
- `docs/SITE_MAINTENANCE_MODEL.md`
  - canonical site-wide maintenance model
- `docs/STABILIZATION_BACKLOG.md`
  - confirmed rough edges and next hardening queue
- `docs/DOC_STATUS.md`
  - canonical taxonomy for live, reference, and removed historical docs
- `docs/READABILITY_REFACTOR.md`
  - narrow reference for head/script normalization
- `docs/BRANDS_GUIDE.md`
  - narrow reference for restaurant brand content
- `docs/HOUSEHOLD_*`
  - household-specific maintenance docs
- `docs/RESTAURANT_*`
  - restaurant-specific maintenance docs

## Page Families

- Restaurant branch pages:
  - `index.html`, `uslugi.html`, `about.html`, `contact.html`
- Restaurant service pages:
  - `parokonvektomaty.html`, `plity-pechi.html`, `holodilnoe-oborudovanie.html`, `posudomoechnye-mashiny.html`, `grili-mangaly.html`, `ice-machines.html`
- Household branch pages:
  - `bytovaya-index.html`, `bytovaya-uslugi.html`, `bytovaya-about.html`, `bytovaya-contact.html`
- Household public service pages:
  - `holodilniki.html`, `stiralnye-mashiny.html`, `posudomoyki.html`, `plity.html`, `microwaves.html`, `water-heaters.html`
- Household shadow pages:
  - `kompyutery.html`, `routery.html`
