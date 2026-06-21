# MosPochin — P8 Final Deploy Handoff Report

Дата: **2026-06-21**

## Input

Base package: `mospochin_interlinking_run7_pack_20260621.zip`  
Base SHA256: `18cd9f793367712a2bb747d9a2e749232a49b88bd3db54d0974d14a34375aabd`

## Generated artifacts inside package

```text
docs/mospochin-deploy-handoff-run8-20260621.md
deploy/run8-production-smoke-checklist.md
deploy/run8-postdeploy-mosanalytics-check.sh
deploy/run8-rollback-plan.md
data/deploy-handoff-run8-manifest.json
```

## Inventory

```text
Root HTML pages: 63
Indexable HTML pages: 58
Noindex HTML pages: 5
Sitemap URLs: 58
Pages with data-page-slug: 63
Total data-cta-id attributes: 2266
Forms total: 79
H1 issues: 0
Missing canonical: 0
Bad target blank: 0
Broken internal links: 0
```

## Status

P8 is a deploy handoff pack. It does not create new SEO pages and does not apply Direct changes.


## Verification

```text
npm ci --ignore-scripts ✅
npm run verify:fast ✅
npm run lint ✅
npm run predeploy:check ✅
npm audit --audit-level=moderate ✅ 0 vulnerabilities
node --check analytics.js ✅
node --check telegram-form.js ✅
node --check server/telegram-api.mjs ✅
local /api/track-event smoke ✅ {"ok":true}
```

## Notes

Visual screenshot audit was not run in this sandbox because it requires Playwright Chromium in the runtime/CI environment.

ZIP integrity ✅
node_modules excluded ✅
