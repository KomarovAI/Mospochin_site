# AI File Ownership — MosPochin

Этот документ объясняет, какие файлы являются источником правды, какие файлы генерируются, а какие требуют особенно осторожного ревью.

## Быстрое правило

Перед изменением контента сначала ищи источник в `data/*.json` и `content/site-content.json`. HTML открывай только для проверки результата или когда задача явно про разметку.

## Источник правды: можно редактировать при обычных задачах

| Задача | Где менять | Что запускать после |
|---|---|---|
| SEO title/description/canonical/robots | `data/page-metadata.json` или команды `household:set-metadata` / `restaurant:set-metadata` | `npm run sync:metadata`, `npm run validate:site` |
| FAQ страницы | `data/household-page-slots.json`, `data/restaurant-page-slots.json` или команды `*:set-faq` | `npm run validate:site`, `npm run doctor:page -- --page <file.html>` |
| KPI/доказательства/related pages | `data/*-page-slots.json`, `data/*-proof-layer.json`, `data/*-services.json` | профильный `doctor:*`, затем `npm run validate:site` |
| Контакты | `data/contact-config.json` | `npm run validate:site` |
| Общие тексты для AI-поиска | `content/site-content.json` | при необходимости `npm run content:extract` |
| Повторяемые UI-блоки и структура страниц | `src/components/shared/*`, `src/components/parametric/*`, `src/pages/<slug>/*` | `npm run check:site-builder`, `npm run check:parameterized-components`, `npm run validate:site` |
| Runtime partials, загружаемые браузером | `partials/*.html`, `partials-injector.js` | менять только как production runtime-файлы; затем `npm run validate:site`, визуальная проверка |
| Стили | `styles-combined.css` | `npm run validate:site`, визуальная проверка |
| Клиентская логика | `main.js`, `telegram-form.js`, `analytics.js` | `node --check <file>`, `npm run validate:site` |

## Generated: не редактировать вручную без причины

| Файлы | Как обновлять |
|---|---|
| `sitemap.xml` | `npm run generate:sitemap` |
| `.deploy/include-files.txt` | `npm run generate:deploy-manifest` |
| WebP sidecars | `npm run generate:webp-sidecars` |
| Responsive image derivatives | `npm run generate:responsive-images` |
| Контентный индекс для нейронок | `npm run generate:ai-index` |

## Danger zone: менять только точечно и с явным отчётом

| Зона | Почему осторожно |
|---|---|
| `deploy/*` | влияет на production-выкатку, nginx headers, precompression |
| `.github/workflows/*` | влияет на CI/CD |
| `server/telegram-api.mjs` | серверная отправка заявок, токены, антиспам |
| `tools/*.mjs` | автоматизация, генераторы и валидаторы |
| `package.json` scripts | меняет команды сопровождения |

## Как действовать AI-агенту

1. Запусти `npm run ai:context -- --page <file.html>` для страницы или `npm run ai:context -- --query "текст"` для поиска.
2. Меняй источник правды, а не производный файл.
3. Запусти `npm run ai:changed`, чтобы понять вторичные команды.
4. Запусти `npm run ai:check` перед финальным ответом.
5. В финальном отчёте перечисли изменённые файлы и проверки.

## Data contracts

Ключевые `data/*.json` описаны schema-документами в `schemas/*.schema.json` и проверяются командой:

```bash
npm run validate:data
```

После изменения `data/page-metadata.json`, service registry, page slots, contacts, runtime config или AI index обязательно запускать `npm run validate:data`.

## Flexible AI Workspace files

Source/editable AI tooling:

- `tools/ai-workspace.mjs` — собирает контекст под задачу.
- `tools/ai-impact.mjs` — оценивает последствия правок по файлам.
- `tools/ai-review.mjs` — делает review изменённых файлов или явно переданного списка.
- `tools/ai-semantic-diff.mjs` — показывает смысловые изменения HTML.
- `tools/ai-semantic-lib.mjs` — общая библиотека semantic/impact логики.
- `tools/generate-ai-component-map.mjs` — генерирует `data/ai-component-map.json`.

Generated:

- `data/ai-component-map.json` — детерминированная карта компонентов. Не редактировать вручную, использовать `npm run generate:ai-component-map`.

## Static Component Builder ownership

`src/site-builder.json` и `src/pages/*` — source layer для всех индексированных HTML-страниц. Root HTML считается production output, который должен совпадать с builder output.

- Править дизайн/структуру страницы предпочтительно в `src/pages/<slug>/sections/*.html`, затем пересобирать root HTML через builder.
- После правки source запускать `npm run build:site -- --page <page.html> --write`.
- Если root HTML изменён вручную, синхронизировать source через `npm run site-builder:bootstrap -- --pages <page.html>`.
- Проверка: `npm run check:site-builder`.

## Shared declarative components

`src/components/shared/*` — source layer для одинаковых HTML-секций, используемых несколькими страницами. Эти файлы можно редактировать гибко, но считать high-impact: один shared component может изменить несколько root HTML после сборки. Проверки: `npm run check:shared-components`, `npm run check:site-builder`, `npm run ai:check`.


## AI Digest и Source Compression

`reports/source-complexity.*` и `.ai/digest/*` — generated semantic maps для AI. Их не редактируют вручную; обновлять командами:

```bash
npm run analyze:source-complexity
npm run ai:digest
```

Эти файлы должны оставаться видимыми для AI, потому что они заменяют чтение тысяч мелких HTML-секций.

## Parameterized component ownership

| Path | Role | Edit policy |
|---|---|---|
| `src/components/parametric/*/*.template.html` | Source of truth for parametric component markup | Edit when changing shared component structure; high impact |
| `content/components/*/*.json` | Page/variant props for parametric components | Edit for page-specific texts/placeholders/buttons |
| `src/components/parametric/*/*.contract.json` | Component quality contract | Edit only when component contract changes intentionally |

After editing any of these files run:

```bash
npm run check:parameterized-components
npm run check:site-builder
npm run ai:check
```


## FAQ Registry note

FAQ теперь индексируется в `content/faq/page-faq-registry.json`, а generated FAQPage JSON-LD лежит в `content/faq/schema/*.json` и вставляется в head через `data-generated="faq-registry"`. После правок FAQ запускать `npm run generate:faq-registry`, затем `npm run build:site -- --write` и `npm run check:faq-registry`.
