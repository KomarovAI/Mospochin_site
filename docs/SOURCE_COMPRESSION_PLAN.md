# Source Compression Plan

Этот документ описывает следующий слой оптимизации проекта: сжимать не production HTML, а исходный смысл сайта, чтобы человек и AI быстрее понимали проект и меньше ошибались при гибких правках.

## Зачем это нужно

После Static Component Builder и shared components сайт стал безопаснее сопровождать, но source layer всё ещё содержит много мелких HTML-секций. Это лучше, чем 37 монолитных HTML-файлов, но для AI остаётся дорогим по контексту.

Цель:

```text
AI сначала читает digest и карты,
потом открывает только нужный page/component source,
а не сканирует весь src/pages.
```

## Новый слой

Добавлены два инструмента:

```bash
npm run analyze:source-complexity
npm run ai:digest
```

И две проверки:

```bash
npm run check:source-complexity
npm run check:ai-digest
```

Они генерируют:

```text
reports/source-complexity.json
reports/source-complexity.md
.ai/digest/project.md
.ai/digest/content-map.json
.ai/digest/pages/*.md
.ai/digest/components/*.md
```

## Как использовать AI digest

Для любой крупной задачи сначала:

```bash
npm run ai:workspace -- --task "описание задачи"
```

Затем открыть:

```text
.ai/digest/project.md
.ai/digest/pages/<page>.md
.ai/digest/components/<component>.md
```

После этого уже редактировать конкретные source-файлы:

```text
src/pages/<slug>/sections/*.html
src/components/shared/*
styles-combined.css
main.js / telegram-form.js
data/*.json
```

## Что показывает source complexity

Отчёт отвечает на вопросы:

- сколько всего секций в builder;
- какие страницы самые сложные;
- какие компоненты больше всего продублированы локально;
- где много `raw` секций;
- какие shared components уже экономят source HTML;
- что переводить в blueprints и параметризованные компоненты первым.

## Текущий стратегический вывод

После анализа главные кандидаты на следующий уровень сжатия:

1. `raw` sections — много технических/разделительных фрагментов, которые нужно классифицировать или объединить.
2. `proof`, `pricing`, `faq`, `contact-cta` — кандидаты на параметризованные компоненты с props.
3. `lead-form`, `noscript`, `runtime-partials`, `footer-anchor`, `hero` — повторяются почти на всех страницах и должны стать настоящими компонентами, а не копиями секций.
4. Самые длинные restaurant/parokonvektomat pages — кандидаты на page blueprints.

## Что НЕ делать

- Не удалять root HTML как production output.
- Не превращать сайт в SPA.
- Не смешивать ручные правки root HTML и builder source без `check:site-builder`.
- Не переносить тексты в JSON массово без semantic diff и проверки SEO.

## Следующие крупные пакеты

### 1. Page Blueprints

Заменить длинные списки секций на компактную декларацию layout:

```json
{
  "template": "service-page",
  "layout": [
    { "component": "hero", "props": "hero.holodilniki" },
    { "component": "leadForm", "variant": "default" },
    { "component": "faq", "props": "faq.holodilniki" }
  ]
}
```

### 2. Parameterized Components

Вместо десятков HTML-копий сделать:

```text
src/components/hero/template.html
src/components/hero/contract.json
content/components/hero/*.json
```

### 3. Content Registry

Вынести смысловые тексты в компактные JSON/Markdown-файлы:

```text
content/pages/*.json
content/faq/*.json
content/problems/*.json
content/cta/*.json
```

### 4. CSS Componentization

Разложить CSS source по компонентам, но production оставить единым:

```text
styles/components/hero.css
styles/components/lead-form.css
styles/components/faq.css
styles/pages/restaurant.css
```

## Обязательные проверки после изменений source compression слоя

```bash
npm run ai:digest
npm run analyze:source-complexity
npm run check:ai-digest
npm run check:source-complexity
npm run check:site-builder
npm run ai:check
```

## Parameterized Core Conversion Pack

Добавлены два слоя параметризованных компонентов:

- `lead-form / restaurant-parokonvektomat-b2b` — 12 страниц переведены на `templateRef + propsRef`.
- `mobile-contact` mount containers — 72 секции переведены на parametric templates.
- `static-core` — 129 технических секций без page-specific смысла переведены в lossless parametric templates:
  - `noscript` Yandex pixel: 36 refs;
  - `runtime-partials` injector script: 37 refs;
  - `footer-anchor` mount point: 36 refs;
  - breadcrumb marker comments: 20 refs.
- Новый coverage учитывается в `reports/source-complexity.*` как compressed refs.

Текущее состояние после Pack #2:

```text
Parametric refs: 213
Compressed refs: 502
Shared/parametric coverage: 26.0%
src/pages files: 1576
Local sections: 1428
```

Следующие кандидаты после этого слоя:

1. `hero` для household/restaurant service pages;
2. `faq` с content registry и FAQPage schema sync;
3. `proof/trust` как conversion arguments registry;
4. `contact-cta` как CTA variants registry.


## FAQ Registry note

FAQ теперь индексируется в `content/faq/page-faq-registry.json`, а generated FAQPage JSON-LD лежит в `content/faq/schema/*.json` и вставляется в head через `data-generated="faq-registry"`. После правок FAQ запускать `npm run generate:faq-registry`, затем `npm run build:site -- --write` и `npm run check:faq-registry`.


## Scale lock

Масштабирование проекта зафиксировано отдельным contract/gate:

- `docs/SCALE_POLICY.md`
- `data/ai-scale-policy.json`
- `npm run guard:scale`

Смысл: до 100–150 страниц проект можно расширять по текущей builder/source модели, но нельзя снижать shared/parametric coverage и раздувать средние секции/source-файлы на страницу. После 150 страниц рост должен идти только через отдельный blueprint/source-compression этап.
