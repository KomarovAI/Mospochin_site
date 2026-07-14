# DOC_INDEX — статусы документации MosPochin

Цель файла — показать, какие документы читать первыми, какие являются справочниками, а какие нужны только для специальных задач. Старые handoff/patch notes и дублирующие AI-входы удаляются или переводятся в compatibility stub, чтобы нейронка не спотыкалась о прошлые маршруты.

## Активные входы

| Документ | Статус | Когда читать |
|---|---|---|
| `docs/AI_START_HERE.md` | active / entrypoint | Всегда первым для AI-правок |
| `AGENTS.md` | active / rules | Перед нетривиальной правкой |
| `docs/AI_PROJECT_OPERATING_GUIDE.md` | active / architecture | Для source/data/generator/check workflow |
| `data/project-map.generated.json` | generated / machine map | Быстро найти source, cluster, checks по странице |
| `data/file-ownership.json` | active / machine contract | Понять manual/generated/danger zones |
| `data/cluster-registry.json` | active / machine contract | Найти кластер, guide, digest, visual manifest и guard commands |
| `data/visual-runtime.json` | active / machine contract | Проверить primary local screenshot runtime и manual-only GitHub fallback |
| `docs/AI_CHANGE_CHECKLIST.md` | active / handoff | Перед ZIP / handoff |
| `docs/PAROKONVEKTOMAT_CLUSTER_AI_GUIDE.md` | active / cluster | Только для кластера пароконвектоматов |
| `docs/PISHEVAROCHNYE_KOTLY_CLUSTER_AI_GUIDE.md` | active / cluster | Только для кластера пищеварочных котлов |
| `docs/VENTILATION_CLUSTER_AI_GUIDE.md` | active / cluster | Для 52 страниц вентиляции ресторана |
| `.ai/digest/clusters/parokonvektomaty.md` | generated / cluster digest | Быстрый AI digest по кластеру |
| `.ai/digest/clusters/ventilyatsiya.md` | generated / cluster digest | Быстрый AI digest по кластеру вентиляции |
| `.ai/digest/pages/*.md` | generated / page digest | Перед точечной правкой страницы |
| `docs/AI_TASK_RECIPES.md` | reference / recipes | Когда нужна типовая последовательность правок |
| `docs/DATA_CONTRACTS.md` | reference / data | При изменении data contracts |
| `docs/SCALE_POLICY.md` | active / guardrail | Перед добавлением новых страниц |
| `docs/VISUAL_CHECKS.md` | active / visual architecture | Перед screenshot capture, visual QA или изменением GitHub visual workflows |
| `docs/AI_VISUAL_REVIEW_WORKFLOW.md` | active / visual review | Для цикла PNG → review → исправление → повторный capture |
| `AI-CONTEXT.md` | compatibility stub | Только для старых tools/ссылок; не основной вход |

## Специальные reference-документы

| Документ | Статус | Когда читать |
|---|---|---|
| `docs/PROJECT_DECISIONS.md` | reference / decisions | Для причин архитектурных решений и сохранённых решений из удалённых legacy-docs |
| `reports/manual-review-backlog.md` | report / backlog | Только для подтверждённых visual/runtime findings после ручной проверки |
| `data/project-map.generated.json` | generated / machine map | Вместо старого human `PROJECT_MAP.md` |
| `docs/RESTAURANT_*` | branch reference | Только для restaurant branch/slots/factory задач |
| `docs/HOUSEHOLD_*` | branch reference | Только для household branch/slots/factory задач |
| `docs/*VISUAL_AUDIT*` | visual reference | Перед screenshot/visual аудитом |

## Удалённые/схлопнутые документы

| Документ | Что произошло | Почему |
|---|---|---|
| `docs/AI_NAVIGATION_PACK.md` | removed | Описывал уже внедрённый пакет и дублировал changelog/start docs |
| `docs/AI_FILE_OWNERSHIP.md` | removed | Заменён машинным контрактом `data/file-ownership.json` и кратким маршрутом в `AI_START_HERE.md` |
| `docs/AI_PROJECT_KNOWLEDGE.md` | removed | Живые правила перенесены в `AI_START_HERE.md`, `AI_PROJECT_OPERATING_GUIDE.md`, `PROJECT_DECISIONS.md` |
| `docs/DOC_STATUS.md` | removed | Заменён `DOC_INDEX.md` и `data/docs-contracts.json` |
| `docs/PROJECT_MAP.md` | removed | Заменён generated-картой `data/project-map.generated.json` |
| `docs/SOURCE_COMPRESSION_PLAN.md` | removed | Стратегические решения перенесены в `PROJECT_DECISIONS.md` и `SCALE_POLICY.md` |
| `docs/STABILIZATION_BACKLOG.md` | removed | Активный backlog перенесён в `reports/manual-review-backlog.md` |
| `docs/STATIC_BUILDER_MIGRATION_PLAN.md` | removed | Baseline/future notes перенесены в `PROJECT_DECISIONS.md` |
| `HANDOFF_REPORT_20260606T080529Z.md` | removed | Старый generated handoff report, перенесён в историю |
| `PATCH_REPORT_CHECK_HIERARCHY_20260606.md` | removed | Старый patch report, перенесён в историю |
| `PATCH_REPORT_LOW_RESOURCE_20260606.md` | removed | Старый patch report, перенесён в историю |

## Правило чтения

Для обычной AI-правки достаточно:

```text
docs/AI_START_HERE.md
AGENTS.md
data/project-map.generated.json
data/file-ownership.json
релевантный .ai/digest/pages/*.md
```

Для пароконвектоматов добавить:

```text
docs/PAROKONVEKTOMAT_CLUSTER_AI_GUIDE.md
data/parokonvektomat-conversion-pages.json
.ai/digest/clusters/parokonvektomaty.md
```

Для вентиляции добавить:

```text
docs/VENTILATION_CLUSTER_AI_GUIDE.md
data/ventilation-cluster-pages.json
data/ventilation-photo-map.json
.ai/digest/clusters/ventilyatsiya.md
```

## Что может устаревать

Generated-документы и карты обновляются командой:

```bash
npm run sync:generated
```

Если менялись pages/data/tools/docs, не доверяй старому digest до `sync:generated`.

## Maintenance audit reports

| Отчёт | Статус | Что показывает |
|---|---|---|
| `reports/docs-audit.md` | generated / maintenance | Кандидаты на docs prune v2 |
| `reports/tools-audit.md` | generated / maintenance | Какие `tools/*.mjs` являются script/import/deploy-used |
| `reports/ai-overlap-audit.md` | generated / maintenance | Дубли и future compaction в AI generated layer |
| `reports/unused-assets.md` | generated / maintenance | Safe-delete assets и source/runtime/deploy группы |
| `reports/MAINTENANCE_AUDIT_20260606.md` | report / handoff | Краткий итог maintenance audit pack |

Команда:

```bash
npm run audit:maintenance
```

Эти отчёты не являются инструкцией к немедленному удалению. Они дают список кандидатов, которые надо проверять по правилу: минимум ресурсов, максимум импакта, без потери качества.

## Sous-vide pilot

- `docs/SOUS_VIDE_CLUSTER_AI_GUIDE.md` — маршрут правок кластера.
- `data/sous-vide-cluster-pages.json` — intent/indexing/conversion contract.
- `data/sous-vide-screenshot-audit.json` — desktop/mobile visual manifest.
