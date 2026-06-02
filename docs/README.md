# Mospochin_site

## Canonical docs

- Scale policy: [docs/SCALE_POLICY.md](/home/artikk/Mospochin_site/docs/SCALE_POLICY.md)

- Operator routing: [docs/OPERATOR_ROUTING.md](/home/artikk/Mospochin_site/docs/OPERATOR_ROUTING.md)
- Site-wide maintenance model: [docs/SITE_MAINTENANCE_MODEL.md](/home/artikk/Mospochin_site/docs/SITE_MAINTENANCE_MODEL.md)
- Repo structure map: [docs/PROJECT_MAP.md](/home/artikk/Mospochin_site/docs/PROJECT_MAP.md)
- Stabilization backlog: [docs/STABILIZATION_BACKLOG.md](/home/artikk/Mospochin_site/docs/STABILIZATION_BACKLOG.md)
- Restaurant visual audit checklist: [docs/RESTAURANT_VISUAL_AUDIT_CHECKLIST.md](/home/artikk/Mospochin_site/docs/RESTAURANT_VISUAL_AUDIT_CHECKLIST.md)
- Doc taxonomy: [docs/DOC_STATUS.md](/home/artikk/Mospochin_site/docs/DOC_STATUS.md)
- Household docs: `docs/HOUSEHOLD_*`
- Restaurant docs: `docs/RESTAURANT_*`

## Narrow reference docs

- `docs/BRANDS_GUIDE.md`
  - restaurant brand reference content

## Source of truth

- Canonical site source lives only in `/home/artikk/Mospochin_site`.
- Matching HTML/CSS/JS files in `/home/artikk` are non-canonical workspace copies and must not be used for deploys or edits.
- Start routine operator/LLM work from `docs/OPERATOR_ROUTING.md`; use the larger canonical docs only after the route is clear.
- Machine-readable operator routing lives in `data/operator-recipes.json`.
- Canonical shared contact contract now lives in `data/contact-config.json` (`phoneDisplay`, `phoneE164`, `whatsappNumber`, default WhatsApp text).
- Canonical shared service-schema defaults now live in `data/schema-profile.json` (`global -> branch -> page` overrides for JSON-LD provider/area/offers fields).
- Canonical shared service KPI layer now lives in branch slot contracts (`data/household-page-slots.json` and `data/restaurant-page-slots.json`) via `serviceKpiDefaults` plus optional page-level `serviceKpi` override.
- The shortest read-only route selector is `npm run recipe:select -- --intent <recipe-id-or-intent> [--page <file.html>] [--branch <household|restaurant|shared>] [--json]`.

## Telegram form runtime contract

- `telegram-form.js` is the canonical client-side form script and must be included exactly once on every `hasForm=true` page.
- `main.js` is the shared site runtime, but it does not replace the dedicated Telegram form client script.
- Production form delivery is configured through `data/runtime-config.json`.
- `telegramFormEndpoint` must point to a live site-relative POST endpoint on the deployed host.
- Local `npm run dev` serves the same path for smoke testing, but its handler is only a mock and does not deliver real Telegram messages.
- Production backend source now lives in `server/telegram-api.mjs`.
- Server activation artifacts now live in-repo under `deploy/`:
  - `deploy/systemd/mospochin-telegram-api.service`
  - `deploy/systemd/mospochin-telegram-tunnel.service`
  - `deploy/post-activate.sh`
  - `deploy/env/telegram.env.example`

## Telegram delivery path

- Public form requests hit `https://mospochin.ru/api/send-telegram`.
- Nginx proxies that path to the local backend on `127.0.0.1:3010`.
- `server/telegram-api.mjs` sends Telegram Bot API requests through `TELEGRAM_PROXY`.
- Production default is `socks5h://127.0.0.1:58161`.
- `mospochin-telegram-tunnel.service` keeps that local SOCKS port open through an SSH tunnel to `primary-vps` (`31.58.58.133`) on port `27016`.
- Only Telegram traffic uses this tunnel; the site and other VPS traffic stay local to the Mospochin host.

## Validation and deploy

- `npm run validate:site` now requires `data/runtime-config.json` and a non-empty `telegramFormEndpoint`.
- `npm run validate:site` now also requires a valid `data/schema-profile.json` and ensures page-level overrides point only to existing household/restaurant pages.
- `npm run validate:site` also enforces the page-level client contract: form pages must include exactly one `telegram-form.js`, and non-form pages must not include it.
- `npm run validate:site` also requires a valid `data/screenshot-audit.json` manifest and confirms that every representative audit page exists and matches its branch/page-type metadata.
- `npm run validate:site` also requires a valid `data/restaurant-screenshot-audit.json` manifest for the full restaurant stabilization path.
- `npm run validate:site` now also fails on docs/recipe drift when required links point to missing repo files or a recipe `preferredEditSurface` file is missing.
- `npm run doctor:changed-pages` runs `doctor:page` only for pages touched by the current diff and is used as an additional CI gate in `.github/workflows/validate.yml`.
- `npm run guard:scale` enforces `data/ai-scale-policy.json`: controlled growth to 100–150 pages without degrading source-layer maintainability.
- `npm run optimize:images` is a local lightweight ffmpeg-based pass for changed raster assets (`jpg/jpeg/png/webp`) and rewrites files only when size reduction is meaningful.
- `npm run audit:assets` is read-only and reports HTML/CSS/JS/JSON asset references, heavy referenced rasters, and tracked assets outside that scan surface.
- Deploy smoke tests call the configured form endpoint after publishing.
- Deploy manifest must include the backend script and deploy hook assets so the VPS can activate them from the same release tree.

## Branch model

- `main.js` is the canonical shared runtime JavaScript for both branches.
- `main.js` hydrates all `tel/wa` contact links from `data/contact-config.json`; HTML uses `data-contact-link="phone|whatsapp"` and optional `data-whatsapp-text`.
- Household and restaurant stay as separate authoring/maintenance workflows on top of the shared runtime.
- Branch-specific contracts live in their own `docs/HOUSEHOLD_*` and `docs/RESTAURANT_*` files.

## Stabilization tracking

- Confirmed rough edges and follow-up hardening work live in [docs/STABILIZATION_BACKLOG.md](/home/artikk/Mospochin_site/docs/STABILIZATION_BACKLOG.md).
- Representative screenshot audit coverage is defined only in `data/screenshot-audit.json`.
- Full restaurant screenshot audit coverage is defined only in `data/restaurant-screenshot-audit.json`.
- `npm run audit:screenshots` runs a local Playwright screenshot pass for the representative pages and stores artifacts under `.artifacts/screenshots/`.
- `npm run audit:representative-pages` runs `doctor:page` for the same representative pages, then captures screenshots, and reminds the operator to log only confirmed issues in the backlog.
- `npm run audit:restaurant-screenshots` runs the same screenshot flow for all restaurant pages and stores artifacts under `.artifacts/screenshots/restaurant/`.
- `npm run audit:restaurant-branch` runs `doctor:page` across the whole restaurant branch, then captures screenshots, and routes review through `docs/RESTAURANT_VISUAL_AUDIT_CHECKLIST.md` before backlog logging.
- This audit flow is a stabilization tool, not a branch authoring workflow or deploy gate.
- For service KPI edits on public service pages use branch helpers (`npm run household:set-service-kpi` / `npm run restaurant:set-service-kpi`) and then sync fallbacks.
