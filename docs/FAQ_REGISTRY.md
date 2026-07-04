# FAQ Registry + FAQPage Schema Sync

Этот слой делает FAQ машинно-читаемым и синхронизирует видимые FAQ-блоки с JSON-LD `FAQPage`.

## Источник правды

- Видимый FAQ пока остаётся в Static Component Builder source: `src/pages/<slug>/sections/*`, `src/components/shared/*` или `src/components/parametric/*`.
- `content/faq/page-faq-registry.json` — машинный индекс видимых FAQ-блоков.
- `content/faq/schema/*.json` — generated FAQPage schema по страницам.
- Generated scripts в `src/pages/<slug>/head.html` помечены `data-generated="faq-registry"` и не редактируются вручную.

## Команды

```bash
npm run generate:faq-registry
npm run check:faq-registry
npm run build:site -- --write
npm run ai:semantic-diff -- --page holodilniki.html
npm run ai:check
```

## Метрики текущего registry

- Страниц с FAQ: 1
- FAQ-блоков: 1
- Вопросов/ответов: 8
- Страниц с generated FAQPage schema: 1
- Вопросов в schema: 8

## Workflow для AI

1. Для понимания FAQ страницы сначала читать `content/faq/page-faq-registry.json`, а не весь HTML.
2. Если меняется видимый FAQ — менять соответствующий section/component source.
3. После правки запускать `npm run generate:faq-registry`, затем `npm run build:site -- --write`.
4. Проверять `npm run check:faq-registry && npm run check:site-builder && npm run ai:semantic-diff -- --page <page.html>`.

## Что считается schemaEligible

В schema попадают только блоки, которые похожи на реальный FAQ: имеют сигнал `FAQ / Частые вопросы / Что обычно спрашивают` и вопросы с вопросительным знаком. Сценарии, мини-кейсы и обучающие accordion-блоки индексируются в registry, но не всегда попадают в `FAQPage`.
