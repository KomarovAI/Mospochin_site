# Maintenance audit pack — 2026-06-06

Цель пакета: добавить безопасную разведку перед следующим prune-этапом. Этот пакет ничего не удаляет; он показывает, что можно удалять/схлопывать дальше без риска для сайта.

## Добавленные команды

```bash
npm run audit:docs
npm run audit:tools
npm run audit:ai-overlap
npm run audit:maintenance
```

`audit:maintenance` запускает docs/tools/AI-overlap/assets audit одной командой.

## Итоги аудита

| Зона | Итог | Следующее действие |
|---|---:|---|
| Docs | 39 docs, 6 review-for-prune candidates | Prune v2 после переноса полезных решений |
| Tools | 79 tools, 0 delete candidates | Не удалять tools пока; только future consolidation |
| AI generated overlap | 2 review findings | Compact `ai-editing-manifest` и `.ai/digest/content-map.json` позже |
| Assets | 166 assets, safeDelete=0 | После safe assets prune новых безопасных удалений нет |

## Docs candidates

Кандидаты на следующий ручной docs-prune v2:

```text
docs/AI_PROJECT_KNOWLEDGE.md
docs/DOC_STATUS.md
docs/PROJECT_MAP.md
docs/SOURCE_COMPRESSION_PLAN.md
docs/STABILIZATION_BACKLOG.md
docs/STATIC_BUILDER_MIGRATION_PLAN.md
```

Правило: не удалять до переноса полезных решений в `docs/PROJECT_DECISIONS.md`, `docs/DOC_INDEX.md` или `CHANGELOG_AI.md`.

## Tools conclusion

Аудит не нашёл безопасных кандидатов на удаление в `tools/`:

```text
npmScriptEntry=68
importedByTool=10
deployUsed=1
reviewForPrune=0
```

Следующий шаг по tools — не удаление, а отдельная архитектурная консолидация branch helpers, если это когда-нибудь станет нужным.

## AI overlap conclusion

Сохраняем:

```text
data/project-map.generated.json
data/file-ownership.json
docs/AI_START_HERE.md
.ai/digest/pages/*.md
.ai/digest/clusters/*.md
data/ai-project-index.json
data/ai-component-map.json
```

Будущие кандидаты на compaction:

```text
data/ai-editing-manifest.json
.ai/digest/content-map.json
```

## Assets conclusion

После safe assets prune:

```text
safeDelete=0
missingReferences=0
```

Значит assets больше не резать без нового отчёта.
