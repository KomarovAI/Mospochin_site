# AI Project Operating Guide — MosPochin

Этот документ — главный вход для AI-редактирования проекта. Он не заменяет `AGENTS.md`, а раскрывает рабочий порядок: где источник правды, что generated, какие команды запускать и как не сломать заявки.

## 1. Быстрый старт для новой нейронки

Перед любой содержательной правкой:

```bash
cat docs/AI_START_HERE.md
cat docs/DOC_INDEX.md
npm run ai:route -- --task content --page <file.html>
```

Для глубокого контекста:

```bash
cat AGENTS.md
cat docs/AI_PROJECT_OPERATING_GUIDE.md
cat data/project-map.generated.json
cat data/file-ownership.json
```

`AI-CONTEXT.md` оставлен только как короткий compatibility stub для старых ссылок.

Если задача касается пароконвектоматов, дополнительно открыть:

```bash
cat docs/PAROKONVEKTOMAT_CLUSTER_AI_GUIDE.md
cat data/parokonvektomat-conversion-pages.json
```

Рабочая команда для точечного контекста:

```bash
npm run ai:workspace -- --task "кратко опиши задачу"
npm run ai:context -- --page <file.html>
```

## 2. Source of truth

Root HTML — production output. Основной источник правды:

| Что правим | Где править |
|---|---|
| Структура страниц | `src/site-builder.json`, `src/pages/<slug>/page.json` |
| Уникальные HTML-блоки страницы | `src/pages/<slug>/sections/*.html` |
| Повторяемые блоки | `src/components/shared/*` |
| Parametric-компоненты | `src/components/parametric/*/*.template.html` |
| Тексты/props parametric-компонентов | `content/components/*/*.json` |
| SEO metadata | `data/page-metadata.json` + `npm run sync:metadata` |
| Direct landing pages | `data/direct-landing-pages.json` + `tools/generate-direct-landings.mjs` |
| FAQ | `content/faq/*` + `npm run generate:faq-registry` |
| Sitemap | `npm run generate:sitemap` |
| Deploy manifest | `npm run generate:deploy-manifest` |
| AI index/digest | `npm run generate:ai-index`, `npm run ai:digest` |

Root `*.html` можно менять вручную только если потом синхронизирован source/builder слой. В обычной AI-работе этого избегать.

## 3. Generated / не править руками

Не редактировать вручную без явной причины:

- `sitemap.xml`;
- `.deploy/include-files.txt`;
- `data/ai-project-index.json`;
- `data/ai-component-map.json`;
- `data/project-map.generated.json`;
- `.ai/digest/*`;
- `reports/source-complexity.*`;
- `content/faq/page-faq-registry.json`;
- responsive/WebP/AVIF derivatives.

Использовать соответствующие npm-команды.

## 4. Базовый workflow правки

1. Понять зону задачи через `ai:workspace`, `ai:context`, `.ai/digest/pages/*.md`.
2. Править минимальный source-файл, а не весь HTML.
3. Если менялись direct landing pages — запустить `npm run generate:direct-landings`.
4. Если менялись root/build sources — запустить `npm run build:site -- --write` или точечную сборку.
5. Если менялись metadata/sitemap/deploy/AI-карты — запустить профильные генераторы.
6. Прогнать проверки.
7. Обновить `CHANGELOG_AI.md`.
8. Выдать ZIP и указать, какие проверки прошли.

## 5. Проверки по типу задачи

| Тип изменения | Минимальные проверки |
|---|---|
| Любая небольшая правка source/data/content | `npm run check:core` или совместимый алиас `npm run verify:fast` |
| Формы, телефон, WhatsApp, CTA, перелинковка | `npm run check:conversion-ui`, затем `npm run check:core` |
| Direct landing pages | `npm run generate:direct-landings`, `npm run sync:generated`, `npm run check:handoff` |
| HTML/source builder | `npm run check:site-builder`, при изменении source — `npm run build:site -- --write` |
| SEO metadata | `npm run sync:metadata`, `npm run generate:sitemap`, `npm run check:core` |
| FAQ/schema | `npm run generate:faq-registry`, `npm run check:faq-registry`, `npm run check:core` |
| AI docs/index/digest/project map/generated reports | `npm run sync:generated`, затем `npm run check:ai` или `npm run ai:doctor` |
| Перед финальным ZIP / handoff | `npm run check:handoff` или совместимый алиас `npm run predeploy:check` |
| Перед продом / после визуальных или image-правок | `npm run check:full` |

## 6. Денежные guardrails

Не сдавать правку, если на коммерческих страницах пропали:

- форма заявки;
- hidden problem;
- телефон `tel:`;
- WhatsApp-ссылка;
- `telegram-form.js`;
- `analytics.js`;
- `mobile-footer-container`;
- `whatsapp-float-container`;
- canonical;
- H1;
- FAQ schema;
- sitemap/index/noindex логика.

Для пароконвектоматов это проверяет:

```bash
npm run check:conversion-ui
```

## 7. Правила роста проекта

Проект живёт в режиме controlled growth. Нельзя плодить страницы копипастой. Проверка:

```bash
npm run guard:scale
```

Если scale guard падает — не отключать его. Нужно сжимать повторяющиеся блоки через shared/parametric/blueprint.

## 8. Что считается критичной ошибкой

Критично:

- форма визуально есть, но не отправляется;
- исчез CTA/телефон/WhatsApp;
- SEO-страница получила `noindex`;
- promo/noindex страница попала в sitemap;
- canonical ведёт не на себя;
- direct generator стирает ручные блоки;
- root HTML отличается от builder output;
- появились 404/self-link внутри кластера;
- `npm run verify:fast` падает.

Некритично, но указывать в handoff:

- screenshot-аудит не запущен из-за отсутствия Playwright;
- остались старые warning, не связанные с задачей;
- визуал требует ручной проверки на проде.

## 9. Финальный handoff

В финале всегда писать:

1. Что изменено.
2. Какие файлы/слои затронуты.
3. Какие команды прошли.
4. Какие warning/ограничения остались.
5. Ссылку на ZIP.


## 10. AI navigation layer

Для снижения ресурсоёмкости и ошибок добавлен navigation layer:

```text
docs/AI_START_HERE.md
docs/DOC_INDEX.md
data/project-map.generated.json
data/file-ownership.json
tools/ai-task-router.mjs
tools/handoff-pack.mjs
```

Основной маршрут:

```bash
npm run ai:route -- --task <type> --page <file.html>
# правка source/data
npm run sync:generated
npm run check:handoff
```

Для финального ZIP можно использовать:

```bash
npm run handoff:pack
```
