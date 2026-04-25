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
- `data/contact-config.json`
  - shared contact contract for phone/WhatsApp hydration across both branches
- `data/schema-profile.json`
  - shared service-schema profile for JSON-LD defaults with branch/page overrides
- `data/operator-recipes.json`
  - machine-readable operator recipe catalog for branch-safe edit routing
- `data/screenshot-audit.json`
  - representative screenshot audit manifest for page coverage and viewport presets
- `data/restaurant-screenshot-audit.json`
  - restaurant-only screenshot audit manifest for full branch stabilization coverage
- `data/household-*.json`
  - household branch shell and service/slot/proof/taxonomy/policy layers
- `data/restaurant-*.json`
  - restaurant branch shell and service/slot/proof/taxonomy/policy layers

## Tools

- `tools/validate-site.mjs`
  - canonical repo-wide contract validator
- `tools/doctor-page.mjs`
  - shared page doctor
- `tools/select-operator-recipe.mjs`
  - read-only recipe selector for branch-safe routing from `data/operator-recipes.json` and `data/page-metadata.json`
- `tools/inspect-page.mjs`
  - read-only page preflight that combines doctor output, metadata, recipes, edit surfaces, and screenshot audit coverage
- `tools/audit-screenshots.mjs`
  - Playwright-based representative screenshot runner on top of the local dev server
- `tools/audit-representative-pages.mjs`
  - orchestration entrypoint for `doctor:page` plus the screenshot pass
- `npm run audit:restaurant-branch`
  - restaurant-only orchestration entrypoint for full branch doctor plus screenshot coverage
- `tools/doctor-changed-pages.mjs`
  - diff-aware doctor gate that runs `doctor:page` only for changed branch pages
- `tools/optimize-images.mjs`
  - local lightweight ffmpeg-based raster optimizer for changed image assets
- `tools/audit-assets.mjs`
  - read-only inventory for HTML/CSS/JS/JSON asset references and tracked asset cleanup candidates
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

- `docs/OPERATOR_ROUTING.md`
  - short LLM/operator routing layer for default workflows
- `docs/README.md`
  - repo-level operating notes
- `docs/SITE_MAINTENANCE_MODEL.md`
  - canonical site-wide maintenance model
- `docs/STABILIZATION_BACKLOG.md`
  - confirmed rough edges and next hardening queue
- `docs/RESTAURANT_VISUAL_AUDIT_CHECKLIST.md`
  - fixed rubric for restaurant full-branch screenshot review and backlog decisions
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
