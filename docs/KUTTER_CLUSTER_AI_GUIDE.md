# KUTTER_CLUSTER_AI_GUIDE

## Status

Run K7 + cluster SEO audit: 38 published pages — 12 foundation/service/information pages and 26 symptom-service pages.

## Read first

- `data/kutter-cluster-pages.json`
- `data/kutter-fault-taxonomy.json`
- `data/kutter-fault-evidence.json`
- `data/kutter-brand-models.json`
- `data/kutter-link-graph.json`
- `src/components/parametric/kutter-symptom-service/blueprint.json`

## Boundaries

The cluster covers professional bowl cutters, vertical cutter mixers, cutter/emulsifiers, Blixer-type machines and combination cutter/vegetable-preparation machines. Do not merge standalone vegetable slicers, grinders or household blenders into this cluster.

## Safety rules

- Never publish instructions for bypassing lid, bowl, magnetic or microswitch interlocks.
- Smoke, burning smell, breaker trips, water ingress, damaged blades and brake/interlock failures always require stop-use wording.
- Model-specific drive, speed, brake and error-code claims require matching evidence IDs.
- Internal probable-node IDs must never appear in visible Russian HTML.

## Publication workflow

1. Move the selected page and taxonomy item from `planned` to a source-managed publication state.
2. Create `src/pages/<slug>/page.json` and sections through the standard page lifecycle.
3. Add metadata, sitemap/indexing contract, FAQ source and metrics context.
4. Generate the planned link graph into normal `<a href>` links with analytics attributes.
5. Add the page to `data/kutter-screenshot-audit.json`; the manifest is active and uses local-native Chromium.
6. Run all kutter guards, core, AI and local-native visual capture. GitHub remains manual fallback only.

## Published K3 pilot

- `kuttery-dlya-restoranov.html`
- `remont-kutterov.html`
- `obsluzhivanie-kutterov.html`
- `kak-rabotaet-professionalnyy-kutter.html`
- `kutter-ne-vklyuchaetsya.html`
- `kutter-ne-zapuskaetsya-s-kryshkoy.html`
- `motor-kuttera-gudit-no-nozhi-ne-krutatsya.html`
- `kutter-ploho-izmelchaet.html`

Canonical visual command:

```bash
npm run audit:kutter-screenshots
```

## Mandatory checks

```bash
npm run check:kutter-evidence
npm run check:kutter-fault-taxonomy
npm run check:kutter-brand-models
npm run check:kutter-error-codes
npm run check:kutter-pages
npm run check:kutter-link-graph-layer
npm run check:kutter-link-graph
npm run check:kutter-seo-report
npm run check:kutter-seo-content
npm run check:kutter-cannibalization
npm run check:core
npm run check:ai
```


## K4 foundation layer

Published equipment-family pages: tabletop cutters, vertical cutter mixers, cutter-emulsifiers, Blixer and combination cutter/vegetable-preparation machines. Published guides cover selection and safe cleaning. Technical claims remain model-scoped.


## K5 symptom layer

Published 14 additional P0/P1 symptom-service pages covering bowl detection, overload, vibration, leakage, electrical trips, overheating, speed controls, pulse, timer, scraper and blade brake safety.


## K7 product and critical-safety layer

Published eight P2 symptom-service pages covering emulsification quality, smearing, product heating, damaged blades, post-wash no-start, water ingress, smoke/burning and lid closure.


## K7 full-cluster SEO and linking audit

- Published graph is generated from real crawlable `<a href>` links; planned brand/Direct routes remain planned.
- Every indexable published page requires at least three unique incoming cluster links and depth no greater than two from the hub.
- Generated reports: `reports/kutter-seo-cluster-audit.json` and `.md`.
- Foundation/service pages have page-type word thresholds; technical symptoms retain unique decision paths and FAQ.
- Internal English taxonomy IDs are forbidden in visible HTML.

Canonical audit:

```bash
npm run audit:kutter-seo
```


## K7 brand-service

4 брендовые страницы опубликованы: Robot Coupe, Sammic, HALLDE и Sirman. Технические утверждения ограничены официальными сериями; страницы содержат независимый сервисный disclaimer.


## K8 Direct/noindex — 2026-07-14

Опубликованы три рекламные посадочные страницы: общий ремонт куттеров, симптом «не включается» и Robot Coupe. Они имеют `noindex,follow`, исключены из sitemap, не получают органических входящих ссылок и сохраняют campaign/ad-group/direct-ad attribution в форме. Основной визуальный прогон выполняется локальным Chromium; GitHub остаётся ручным резервом.
