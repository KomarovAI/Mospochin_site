# AI/docs prune report — 2026-06-06

Цель: уменьшить шум для будущих AI-агентов без потери проверок и source-of-truth.

## Удалено

- `HANDOFF_REPORT_20260606T080529Z.md`
- `PATCH_REPORT_CHECK_HIERARCHY_20260606.md`
- `PATCH_REPORT_LOW_RESOURCE_20260606.md`
- `docs/AI_NAVIGATION_PACK.md`
- `docs/AI_FILE_OWNERSHIP.md`

## Схлопнуто

- `AI-CONTEXT.md` превращён в короткий compatibility stub.
- `AGENTS.md` очищен от старого AI-маршрута.
- `docs/DOC_INDEX.md` теперь явно показывает active/reference/removed документы.

## Обновлено

- `docs/AI_START_HERE.md`
- `docs/AI_PROJECT_OPERATING_GUIDE.md`
- `docs/AI_PROJECT_KNOWLEDGE.md`
- `docs/PROJECT_DECISIONS.md`
- `data/ai-editing-manifest.json`
- `data/file-ownership.json`
- AI tools: `ai-check`, `ai-context`, `ai-workspace`, `ai-maintenance-lib`, `generate-ai-digest`.
- `tools/handoff-pack.mjs`: новые handoff-отчёты пишутся в `reports/handoff/`, не в root.

## Что не трогали

- Публичный HTML/SEO/контент страниц.
- Кластер пароконвектоматов.
- Runtime JS/CSS/forms.
- Assets pruning перенесён в отдельный этап.
