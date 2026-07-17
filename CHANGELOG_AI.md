# AI Change Log — MosPochin

Краткая история AI-правок. Новые агенты должны добавлять запись при каждом handoff.

## 2026-07-14 — kutter cluster K3 pilot

- Published eight source-managed professional-cutter pages: hub, repair, maintenance, how-it-works and four symptom-service pages.
- Activated kutter metadata, sitemap, FAQ/schema, conversion, metrics, link-graph and visual contracts while keeping 37 future pages planned.
- Added safe diagnostic paths for power, lid interlocks, motor hum/blade stall and poor cutting; no protection-bypass instructions are published.
- Captured 32 local-native Chromium PNG files (desktop/mobile, first-view/full-page); GitHub remains manual fallback only.
- Visual QA removed leaked internal English protection terms from visible Russian content.
- Checks: builder 166/166, core, visual, AI and handoff passed.

## 2026-07-14 — sous-vide native visual audit and header correction

- Added a policy-safe native visual path for the four-page sous-vide pilot: system Chromium + Playwright local-content routing, without localhost navigation or browser downloads.
- Added `npm run audit:sous-vide-screenshots:native`; two parallel isolated workers produce and validate 8 full-page PNG files (desktop/mobile for four pages).
- Extended `tools/audit-screenshots.mjs` with local-content routing, ordered page selection and bounded browser page batches for constrained containers.
- Corrected the standard restaurant header offset on the three source-managed non-Direct sous-vide pages and updated `tools/scaffold-restaurant-service.mjs` so future pages keep the urgent bar and navbar fully visible.
- Visual review passed for hero/header, forms, sticky mobile CTA, FAQ and footer regions. Canonical Firefox capture remains available for external Playwright runners.

## 2026-07-14 — ventilation cluster and AI-maintenance hardening

- Registered the 52-page ventilation cluster in `data/cluster-registry.json` with explicit hub/service/system/symptom/guide/audience/integration families.
- Added `data/ventilation-cluster-pages.json`, `data/ventilation-screenshot-audit.json` and `docs/VENTILATION_CLUSTER_AI_GUIDE.md`; generated project-map and cluster digest now route ventilation edits directly.
- Added ventilation photo/screenshot contracts to `data/file-ownership.json` and `data/ai-editing-manifest.json`, plus the canonical AI docs index/entrypoint references.
- Added `npm run audit:ventilation-screenshots`, a `ventilation` visual-audit scope, and a visual-contract guard without requiring Firefox for every source edit.
- Strengthened active GitHub validation with npm cache, concurrency, read-only permissions, builder parity and generated-diff guards.
- Improved visual diagnostics: missing Playwright is actionable, and SIGBUS browser crashes are reported as an environment limitation.
- Checks: `check:core`, `check:ai`, `check:handoff`, `check:ownership`, `check:visual-contract`, `audit:maintenance` passed. Local visual capture remains blocked by Firefox SIGBUS in the container; run it in GitHub Actions/Playwright image.

## 2026-07-13 — workspace and AI-context cleanup

- Added dry-run/apply workspace cleanup: `npm run clean:workspace` and `npm run clean:workspace:apply`.
- Removed only reproducible local artifacts: `.artifacts/`, `.cache/`, `build/` and superseded visual packs; latest `reports/visual-p2-final-20260713` remains available for visual review.
- Reduced `.ai/digest/content-map.json` from about 1.14 MB to about 248 KB by removing section previews duplicated by page digests.
- Added `.gitignore` and handoff exclusions for build output, visual packs, Python caches and nested ZIPs.
- Replaced stale visual/archive commands in active docs with the canonical Firefox/Work Mode and handoff commands.
- Checks: `check:core`, `check:ai`, `check:handoff`, `check:visual-contract`, `audit:docs` passed; docs contain no references to missing `npm run` scripts.

## 2026-07-13 — AI architecture and visual runner hardening

- Added `tools/visual-runner.mjs` and routed visual npm/CI commands through one Firefox browser-cache contract.
- Added `check:visual-contract` for manifest/registry validation without launching a browser; current Work Mode Firefox capture remains explicitly environment-limited by container sandbox.
- Changed `check-generated-diff` so ZIP/no-Git mode checks builder parity for all 121 pages instead of silently skipping.
- Added `reports/handoff/ai-change-manifest.json` snapshot generation for source/generated hashes when no Git baseline is present.
- Added `data/cluster-registry.json` and registered the parokonvektomat and cooking-kettle clusters for AI routing, guides, digests, visual manifests and guard commands.
- Added the cooking-kettle AI cluster guide and generated cluster digest.
- Replaced hard-coded `/home/artikk/Mospochin_site` documentation links with repository-relative paths.
- Updated handoff ZIP exclusions so browser caches, visual artifacts, nested archives and Python caches do not inflate the package.
- Checks: `check:core`, `check:ai`, `check:handoff`, `check:visual-contract`, `check:ownership`, `validate:data`, `check:conversion-ui` passed. `check:visual-env` reaches the managed Firefox binary but is blocked by container sandbox `/proc/self/uid_map: EROFS`.

## 2026-06-03 — Parokonvektomat AI operating layer

- Добавлены рабочие AI-гайды: `docs/AI_PROJECT_OPERATING_GUIDE.md`, `docs/PAROKONVEKTOMAT_CLUSTER_AI_GUIDE.md`.
- Добавлен checklist: `docs/AI_CHANGE_CHECKLIST.md`.
- Расширен `docs/AI_TASK_RECIPES.md` рецептами по пароконвектоматному кластеру.
- Добавлен machine-readable manifest: `data/ai-editing-manifest.json`.
- Обновлён `AGENTS.md`: новая точка входа и обязательные проверки для AI-правок.
- Добавлена команда `npm run ai:doctor`.
- `tools/generate-ai-digest.mjs` расширен cluster-level digest для `.ai/digest/clusters/parokonvektomaty.md`.
- SEO/root content страниц не менялся; пакет предназначен для дальнейшего AI-сопровождения.
- Проверки handoff см. в финальном отчёте соответствующего ZIP.
## 2026-06-06 — low-resource/high-impact patch

- Added `npm run predeploy:check`; it now aliases the low-resource `check:handoff` chain: core structural/conversion checks, AI freshness checks, assets audit and npm audit.
- Removed the known non-cluster self-link from `bytovaya-index.html` noscript fallback.
- Strengthened high-intent parokonvektomat pages with compact triage copy: what to send to the engineer, when to stop the unit, and how to distinguish heating/steam/error scenarios.
- Kept the strategy unchanged: no new P1/P2 pages without Direct/Metrika/Search Console data.
## 2026-06-06 — low-resource check hierarchy

- Optimized npm check commands around the principle “minimum resources, maximum impact”.
- Added `tools/check-profile.mjs` as the deterministic runner behind `check:core`, `check:ai`, `check:handoff`, `check:full` and related profiles.
- Added layered commands: `check:core`, `check:ai`, `check:assets`, `check:images`, `check:visual`, `check:handoff`, `check:full`, `sync:generated`.
- Kept compatibility aliases: `verify:fast`, `verify`, `lint`, `ai:doctor`, `predeploy:check`.
- Moved heavy image/visual checks out of daily `lint`/fast flow; they remain available through `check:images`, `check:visual`, and `check:full`.
- Updated AI docs/checklists so future agents use the new command hierarchy instead of manually chaining many overlapping checks.
- Optimized `doctor:changed-pages -- --quiet` to avoid unnecessary child stdout buffering in low-resource handoff runs.
- Moved `doctor:changed-pages` out of the normal `check:handoff` chain into `check:doctor` / `check:full`; in no-git ZIP environments it scans all branch pages and is too heavy for the default low-resource path.

## 2026-06-06 — AI navigation pack

- Added `docs/AI_START_HERE.md` as the concise first entry for AI agents.
- Added `docs/DOC_INDEX.md` to mark docs as active/reference/generated/legacy.
- Added `data/file-ownership.json` and `npm run check:ownership` to separate manual, generated and danger-zone files.
- Added generated `data/project-map.generated.json` via `npm run generate:project-map` / `npm run check:project-map`.
- Added `npm run ai:route` task router to map task/page to source files and checks.
- Added `npm run handoff:pack` for automated sync, handoff checks, report, ZIP and SHA256 packaging.
- Updated `AGENTS.md`, AI operating guide, AI checklist and AI editing manifest to use the new navigation layer.

## 2026-06-06 — AI/docs prune pack

Changed:
- Removed stale root handoff/patch reports from the working tree.
- Removed `docs/AI_NAVIGATION_PACK.md` after the navigation layer became active.
- Removed duplicate `docs/AI_FILE_OWNERSHIP.md`; current ownership contract is `data/file-ownership.json`.
- Reduced `AI-CONTEXT.md` to a compatibility stub and made `docs/AI_START_HERE.md` the main AI entrypoint.
- Cleaned `AGENTS.md`, `docs/DOC_INDEX.md`, AI tooling references and generated AI digest entrypoints.
- Moved new handoff reports generated by `npm run handoff:pack` to `reports/handoff/` instead of the project root.

Checks to run:
- `npm run sync:generated`
- `npm run check:core`
- `npm run check:ai`
- `npm run check:handoff`


## 2026-06-06 — Safe assets prune pack

- Added `tools/audit-unused-assets.mjs` with `audit:unused-assets` and `prune:unused-assets` scripts.
- Removed only assets proven safe by the audit: not referenced, not deploy-included, not responsive source originals, and not generated responsive derivatives required by `check:responsive-images`.
- Removed 33 unused asset files / 5.35 MB, mostly obsolete root-image WebP sidecars and unused flag/icon files.
- Kept original image sources that are needed to regenerate responsive derivatives, preserving future image maintenance quality.
- Added `audit-unused-assets` to the `check:assets` profile so future asset drift is visible.


## 2026-06-06 — Maintenance audit pack

- Added audit-only maintenance commands: `audit:docs`, `audit:tools`, `audit:ai-overlap`, and `audit:maintenance`.
- Added generated reports: `reports/docs-audit.*`, `reports/tools-audit.*`, `reports/ai-overlap-audit.*`, and `reports/MAINTENANCE_AUDIT_20260606.md`.
- Docs audit found 6 review-for-prune candidates; docs prune v2 later removed/squashed them into active docs and reports.
- Tools audit found 0 safe delete candidates; tools should not be pruned blindly.
- AI overlap audit marked `data/ai-editing-manifest.json` and `.ai/digest/content-map.json` as future compaction candidates, not immediate delete targets.
- Assets audit remains clean after safe assets prune: `safeDelete=0`, `missingReferences=0`.

## 2026-06-06 — Docs prune v2

- Removed 6 legacy/duplicate docs after preserving live decisions in `docs/PROJECT_DECISIONS.md` and routing in `docs/DOC_INDEX.md`:
  - `docs/AI_PROJECT_KNOWLEDGE.md`
  - `docs/DOC_STATUS.md`
  - `docs/PROJECT_MAP.md`
  - `docs/SOURCE_COMPRESSION_PLAN.md`
  - `docs/STABILIZATION_BACKLOG.md`
  - `docs/STATIC_BUILDER_MIGRATION_PLAN.md`
- Replaced old human project map/status docs with `data/project-map.generated.json`, `docs/DOC_INDEX.md`, and `data/file-ownership.json`.
- Moved active visual/manual findings process to `reports/manual-review-backlog.md`.
- Updated docs contracts, AI checks, digest generation and routing references to avoid deleted legacy docs.

## Sous-vide pilot — 2026-07-14

- Blueprint: `data/sous-vide-cluster-pages.json`.
- AI guide: `docs/SOUS_VIDE_CLUSTER_AI_GUIDE.md`.
- Visual manifest: `data/sous-vide-screenshot-audit.json`.
- Four-page pilot targets 125 total production pages.
## 2026-07-14 — local-native visual runtime architecture

- System Chromium + Playwright local-content is now the primary screenshot path.
- Added resumable page workers, fingerprint/state/logs, timeout/retry and PNG SHA-256 validation.
- Mobile full-page capture uses Chromium viewport chunks stitched by Python Pillow to avoid tall-page hangs.
- Added `data/visual-runtime.json` and cluster `visualCommand` entries.
- GitHub visual workflows are manual `workflow_dispatch` fallback only and guarded against automatic triggers.
## 2026-07-14 — Sous-vide MVP expansion

- Кластер расширен с 4 до 15 страниц и с 125 до 136 production HTML.
- Добавлены 5 service-страниц, 4 guide/article и 2 noindex Direct landing.
- Обновлены conversion manifest, screenshot manifest, Direct registry, restaurant taxonomy и source-builder.
- Материалы по безопасности не содержат универсальных температур, времени охлаждения или хранения.

## 2026-07-14 — Sous-vide Run 5 SEO/schema/analytics hardening

- Added `npm run check:sous-vide-run5` and included it in core/handoff profiles.
- Added machine-readable Run 5 SEO, schema, internal-link and metrics rules to the sous-vide cluster manifest.
- Split FAQ out of monolithic page sections into first-class builder `faq` components for all 15 pages.
- Moved all sous-vide FAQPage JSON-LD to the generated FAQ Registry; visible FAQ and schema are now contract-checked.
- Added stable analytics IDs to every cluster link so internal-link funnel reports can observe the graph.
- Removed indexable SEO links to noindex Direct landing pages.
- Enriched Article, Service, CollectionPage and BreadcrumbList schema with canonical identity, language and hierarchy.
- Corrected metrics semantics for informational, equipment-service, repair and maintenance intents.
## 2026-07-14 — symptom-service architecture
- Removed false 150-page hard stop.
- Added scale fixtures for 150/151/250/500 pages.
- Added sous-vide fault taxonomy, official evidence, model-scoped error codes, symptom-service blueprint and validators.


## Kutter cluster K1–K2 (2026-07-14)

- Guide: `docs/KUTTER_CLUSTER_AI_GUIDE.md`.
- Machine contracts: `data/kutter-*.json`.
- No root kutter HTML is published before K3 source-builder rollout.


## 2026-07-14 — Kutter K6 full-cluster SEO and linking audit

- Reconciled 38 published pages with the machine-readable link graph.
- Replaced 30 stale planned node statuses and generated published edges from actual crawlable links.
- Increased minimum incoming-link coverage from two to three; seven weak pages were reinforced contextually.
- Enriched thin repair, maintenance, diagnostic, equipment-family and guide pages with unique model-scoped content.
- Removed a duplicate FAQ, shortened two titles and eliminated the visible `safety chain` internal term.
- Added generated Kutter SEO reports and permanent core/handoff checks.


## K8 Direct/noindex — 2026-07-14

Опубликованы три рекламные посадочные страницы: общий ремонт куттеров, симптом «не включается» и Robot Coupe. Они имеют `noindex,follow`, исключены из sitemap, не получают органических входящих ссылок и сохраняют campaign/ad-group/direct-ad attribution в форме. Основной визуальный прогон выполняется локальным Chromium; GitHub остаётся ручным резервом.
## 2026-07-14 — K9 pre-deploy gate

- Added deterministic full-site crawler and reports.
- Removed duplicate canonical tags and organic links to noindex promo pages.
- Added Kutter lead E2E smoke with UTM/Direct attribution, rate limiting, accessibility errors and network fallback.
- Form error handling now sets `aria-invalid`, links the status text and moves focus to the invalid control.
- Injected consent checkbox is guaranteed to be at least 24×24 CSS px.
- K9 checks are part of core and handoff.

