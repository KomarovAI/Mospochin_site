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


## 2026-07-14 — Sous-vide pilot и multi-template Direct

**Решение:** запускать новый кластер с четырёх разных intent-страниц и регистрировать blueprint до масштабирования. Direct-генератор сохраняет legacy-шаблон пароконвектоматов, но поддерживает page-level renderer для новых кластеров. Технологические материалы не содержат универсальных режимов пищевой безопасности без профильной проверки.

## 2026-07-14 — Local-native Chromium is the primary visual runtime

**Решение:** все штатные screenshot manifests выполняются локально через предустановленный системный Chromium, Playwright `page.setContent()` и local `route.fulfill()` для CSS/JS/images. Launcher изолирует страницы по worker-процессам, проверяет PNG, сохраняет fingerprint/state/logs и поддерживает возобновление после прерывания.

**Причина:** управляемая среда блокирует навигацию `localhost`/`file://` через browser policy и может не позволять скачать Firefox. Local-content renderer использует настоящий Chromium без изменения policy и без сетевой зависимости.

**GitHub policy:** `.github/workflows/*visual*.yml` являются только ручным резервом и могут иметь исключительно `workflow_dispatch`. Автоматические `push`, `pull_request`, `schedule` и `workflow_call` запрещены и проверяются `npm run check:visual-workflows`.

**Не делать:** не возвращать Firefox/localhost как основной локальный путь, не устанавливать browser binaries в обычном AI-run, не считать GitHub visual автоматическим deploy/PR gate и не объявлять visual review успешным без созданных и просмотренных PNG.
## 2026-07-14 — Sous-vide MVP без симптомных и брендовых разветвлений

Решение: завершить MVP на уровне 15 страниц: hub, оборудование, ремонт, обслуживание, технологические связи и три рекламных landing. Симптомные и брендовые страницы не добавлять до отдельного blueprint и подтверждённого спроса. Direct landing остаются `noindex,follow` и исключаются из sitemap.
## 2026-07-14 — Quality-gated growth and symptom-service pages

- Removed the artificial 150-page hard stop. Site growth is blocked only by measurable quality failures.
- Technical symptom pages require an official evidence record and machine-readable taxonomy entry.
- Manufacturer error codes are model-scoped and may not be generalized.
- GitHub visual capture remains manual fallback; local system Chromium is primary.
