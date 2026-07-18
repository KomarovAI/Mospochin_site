# FAQ Registry

Этот слой индексирует видимые FAQ-блоки. Генерация `FAQPage` JSON-LD отключена: Google перестал показывать FAQ rich results 7 мая 2026 года и удалил документацию функции.

Источник: https://developers.google.com/search/updates#removing-faq-rich-result

## Источник правды

- Видимый FAQ остаётся в Static Component Builder source: `src/pages/<slug>/sections/*`, `src/components/shared/*` или `src/components/parametric/*`.
- `content/faq/page-faq-registry.json` — машинный индекс видимых FAQ-блоков.
- `content/faq/schema/*.json` должен оставаться пустым.
- В `src/pages/<slug>/head.html` не должно быть `FAQPage` JSON-LD.

## Команды

```bash
npm run generate:faq-registry
npm run check:faq-registry
npm run build:site -- --write
npm run ai:semantic-diff -- --page holodilniki.html
npm run ai:check
```

## Метрики текущего registry

- Страниц с FAQ: 499
- FAQ-блоков: 501
- Вопросов/ответов: 1937
- Страниц с FAQPage schema: 0
- Вопросов в schema: 0

## Workflow для AI

1. Для понимания FAQ страницы сначала читать `content/faq/page-faq-registry.json`, а не весь HTML.
2. Менять только полезный видимый FAQ в соответствующем section/component source.
3. После правки запускать `npm run generate:faq-registry`, затем `npm run build:site -- --write`.
4. Проверять `npm run check:faq-registry && npm run check:site-builder && npm run ai:semantic-diff -- --page <page.html>`.

FAQPage-разметку не возвращать без нового подтверждённого изменения в документации Google.
