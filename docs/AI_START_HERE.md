# AI_START_HERE — быстрый вход в MosPochin

Этот файл — первая точка входа для нейронки. Он не заменяет подробные гайды, а говорит, куда идти по типу задачи.

## 1. Сначала определить тип задачи

Используй router:

```bash
npm run ai:route -- --task content --page parokonvektomat-rational.html
```

Типы задач:

| Тип | Когда использовать |
|---|---|
| `content` | текст, блоки страницы, коммерческие пояснения |
| `seo` | title, description, canonical, robots, sitemap logic |
| `links` | перелинковка, related links, внутренние ссылки |
| `cluster` | кластер пароконвектоматов или группа страниц |
| `direct` | direct landing pages и Яндекс Директ посадочные |
| `forms` | формы, телефон, WhatsApp, Telegram flow |
| `assets` | картинки, responsive/webp/image budget |
| `generator` | `tools/*.mjs`, builder, генераторы |
| `docs` | AI-гайды, чеклисты, changelog |
| `handoff` | финальный ZIP, SHA256, отчёт |

## 2. Source of truth

Главное правило:

```text
Правим source/data/generator слой, root HTML считаем production output.

Для новой страницы начинай с `npm run page:create -- --branch <restaurant|household> ...`; для существующей страницы — `npm run page:edit -- --page <file.html>`, затем `npm run page:check -- --page <file.html>`.
```

Обычно править:

```text
src/pages/<slug>/page.json
src/pages/<slug>/sections/*.html
src/components/shared/*
src/components/parametric/*/*.template.html
content/components/*/*.json
data/page-metadata.json
data/direct-landing-pages.json
content/faq/*
```

Не править руками без причины:

```text
root *.html
sitemap.xml
.deploy/include-files.txt
data/ai-project-index.json
data/ai-component-map.json
data/project-map.generated.json
.ai/digest/*
reports/source-complexity.*
content/faq/page-faq-registry.json
```

Проверить ownership:

```bash
npm run check:ownership
```

Старый `docs/AI_FILE_OWNERSHIP.md` удалён: единственный актуальный ownership-контракт теперь `data/file-ownership.json`.

## 3. Карта проекта

Единая машинная карта:

```text
data/project-map.generated.json
```

Обновить:

```bash
npm run generate:project-map
```

Проверить:

```bash
npm run check:project-map
```

В карте есть:

```text
страницы
source model / sections dir
branch
cluster
direct landing flag
indexable / sitemap status
required checks
commands
ownership summary
```

## 4. Минимальные проверки

После маленькой правки:

```bash
npm run check:core
```

После правок generated/AI слоя:

```bash
npm run sync:generated
npm run check:handoff
```

Перед архивом:

```bash
npm run check:handoff
```

Перед продом или после визуальных/image/layout-правок:

```bash
npm run check:full
```

## 5. Пароконвектоматы

Если задача касается страниц `parokonvektomat*` или `parokonvektomaty*`, читать:

```text
docs/PAROKONVEKTOMAT_CLUSTER_AI_GUIDE.md
data/parokonvektomat-conversion-pages.json
.ai/digest/clusters/parokonvektomaty.md
```

Обязательная проверка:

```bash
npm run check:conversion-ui
```

Не создавать новые P1/P2 страницы без статистики из Директа, Метрики, Вебмастера или фактических заявок.

## 6. Handoff

Собрать архив автоматически:

```bash
npm run handoff:pack
```

Команда:

```text
синхронизирует generated слой
запускает check:handoff
создаёт `reports/handoff/HANDOFF_REPORT_*.md`
создаёт ZIP
создаёт SHA256
```

## 7. Что делать, если сомневаешься

1. Запусти `npm run ai:route -- --task <type> --page <page.html>`.
2. Посмотри `data/project-map.generated.json`.
3. Проверь `data/file-ownership.json`.
4. Делай минимальную source-правку.
5. Запусти `npm run sync:generated && npm run check:handoff`.

## 8. Maintenance / cleanup audits

Перед следующим удалением мусора не режь файлы на глаз. Сначала запускай аудит:

```bash
npm run audit:maintenance
```

Отчёты:

```text
reports/docs-audit.md
reports/tools-audit.md
reports/ai-overlap-audit.md
reports/unused-assets.md
```

Правило:

```text
удалять только то, что попало в safeDelete/deleteCandidate и не нужно source/runtime/deploy/check слоям.
```

Если аудит показывает `reviewForPrune`, сначала перенеси полезные решения в `docs/PROJECT_DECISIONS.md`, `docs/DOC_INDEX.md`, `reports/manual-review-backlog.md` или `CHANGELOG_AI.md`, потом удаляй.

Legacy docs вроде старых `PROJECT_MAP.md`, `DOC_STATUS.md`, `STATIC_BUILDER_MIGRATION_PLAN.md`, `SOURCE_COMPRESSION_PLAN.md` после prune v2 не являются active entrypoint. Используй generated map и active docs выше.
