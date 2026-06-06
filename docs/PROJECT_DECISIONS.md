# Project Decisions — MosPochin

Журнал решений для будущих AI-агентов и разработчиков. Новые архитектурные решения добавляй сюда кратко: дата, решение, причина, чего не делать.

## 2026-06 — Safe optimization over destructive compression

**Решение:** оригинальные изображения не пережимать и не заменять. Генерировать responsive/WebP production-деривативы отдельными командами.

**Причина:** сайт должен становиться легче на отдаче, но исходники должны сохранять качество и быть воспроизводимыми.

**Не делать:** не заменять оригинальные JPEG/PNG вручную «оптимизированными» копиями без явного visual review и без генератора.

## 2026-06 — AI-maintainable workflow

**Решение:** добавить `.aiignore`, AI/project maps, ownership contract, task recipes и команды `ai:context`, `ai:changed`, `ai:check`. В 2026-06 ownership был упрощён: `docs/AI_FILE_OWNERSHIP.md` удалён, актуальный контракт — `data/file-ownership.json`.

**Причина:** нейросетям проще и безопаснее работать через источники правды и машинный индекс, чем читать десятки HTML-страниц.

**Не делать:** не редактировать generated-файлы вручную, если есть команда генерации.

## 2026-06 — Forms security contract

**Решение:** формы используют серверный endpoint `/api/send-telegram`, а клиентский JS не хранит токен.

**Причина:** Telegram token и логика отправки должны оставаться на сервере.

**Не делать:** не добавлять токены, секреты или private chat id в HTML/JS/CSS.

## 2026-06 — Metadata source of truth

**Решение:** SEO-метаданные страниц хранить в `data/page-metadata.json`, а HTML синхронизировать командой `npm run sync:metadata`.

**Причина:** это снижает риск расхождения title/description/canonical между страницами.

**Не делать:** не менять `<title>` и `<meta name="description">` вручную на десятках страниц без последующей синхронизации.

## 2026-06 — Static Component Builder baseline

Решение: добавить параллельный `src/`-слой для всех индексированных HTML-страниц и собирать root HTML из section components.

Причина: большие HTML-файлы сложно сопровождать человеку и AI. Sectioned source даёт гибкость без перехода на SPA/CMS.

Правило: root HTML для builder pages должен совпадать с builder output. Проверка: `npm run check:site-builder`.

Не делать: не удалять root HTML и не считать builder полноценной контентной моделью, пока не выделены декларативные компоненты.

## 2026-06 — Docs prune v2: generated maps over stale human maps

Решение: удалить устаревшие human-map/status/planning документы `AI_PROJECT_KNOWLEDGE`, `PROJECT_MAP`, `DOC_STATUS`, `SOURCE_COMPRESSION_PLAN`, `STABILIZATION_BACKLOG`, `STATIC_BUILDER_MIGRATION_PLAN` из активного дерева docs.

Причина: после появления `docs/AI_START_HERE.md`, `docs/DOC_INDEX.md`, `data/project-map.generated.json`, `data/file-ownership.json` и `npm run ai:route` старые документы стали дублировать маршрут и путать AI.

Новый маршрут:

- human entrypoint: `docs/AI_START_HERE.md`;
- doc taxonomy: `docs/DOC_INDEX.md`;
- machine project map: `data/project-map.generated.json`;
- file ownership: `data/file-ownership.json`;
- confirmed manual findings: `reports/manual-review-backlog.md`.

Не делать: не возвращать отдельные human-map/status документы, если их смысл уже есть в generated map, ownership contract или active AI guide.

## 2026-06 — Keep static-builder, avoid heavy stack migration

Решение: сохранить модель `src/pages + components + data -> generated static HTML` и не переносить сайт в SPA/CMS без отдельного решения.

Причина: текущая статическая модель быстрее, проще для SEO и уже покрыта проверками `check:site-builder`, `check:core`, `check:handoff`.

Не делать: не переписывать проект на React/Next/CMS ради удобства редактирования; сначала использовать source/builder/data слой и task router.

## 2026-06 — Future source compression must be incremental

Решение: дальнейшее сжатие source делать только инкрементально через shared/parameterized components, content registries and semantic checks.

Причина: массовый перенос текста в JSON или templates без semantic diff может сломать SEO, формы, FAQ schema, canonical/noindex and conversion UI.

Не делать: не превращать content registry или blueprints в большой рискованный rewrite. Каждый новый component/registry должен проходить `sync:generated`, `check:site-builder`, `check:conversion-ui`, `check:ai`.

