# AI Project Knowledge — MosPochin

Этот файл — не набор жёстких команд, а краткая база знаний для гибкой работы AI с проектом.

## Что это за проект

MosPochin — статический SEO-сайт с большим числом HTML-страниц услуг. Основная ценность сайта: быстрый доступ к заявке, понятная структура услуг, локальное SEO, формы отправки в Telegram и стабильная отдача статических страниц.

Проект не является SPA. Не стоит превращать его в клиентское приложение ради удобства разработки: SEO, отказоустойчивость и скорость первого отображения важнее.

## Главные источники смысла

- `AI-CONTEXT.md` — стартовый контекст для AI.
- `data/ai-project-index.json` — машинная карта страниц.
- `data/ai-component-map.json` — машинная карта повторяющихся компонентов и рисков.
- `data/page-metadata.json` — SEO-метаданные страниц.
- `data/contact-config.json` и `data/runtime-config.json` — контакты и runtime-настройки.
- `content/site-content.json` — снимок/слой контента.
- `docs/AI_FILE_OWNERSHIP.md` — что source, generated, danger-zone.
- `docs/DATA_CONTRACTS.md` — контракты данных.

## Как AI должен мыслить при правке

1. Понять задачу и вероятные страницы/компоненты через `npm run ai:workspace -- --task "..."`.
2. Открыть не весь проект, а релевантные файлы из snapshot.
3. Редактировать гибко: HTML/CSS/JS/JSON можно менять, если задача этого требует.
4. После правок запустить `npm run ai:review` или `npm run ai:impact -- --files ...`.
5. Для HTML-страниц использовать `npm run ai:semantic-diff -- --page <page.html>`.
6. Финально запустить `npm run ai:check`.

## Что нельзя делать автоматически «из лучших побуждений»

- Не превращать статический сайт в SPA/React без отдельного решения.
- Не переносить весь контент в JS: это ухудшит SEO и отказоустойчивость.
- Не пережимать оригинальные изображения вручную. Оригиналы сохраняются, production-деривативы генерируются.
- Не возвращать `id="cd-min"` / `id="cd-sec"`; таймеры используют `data-countdown-min/sec`.
- Не выносить Telegram token в клиентский JS.
- Не удалять `action="/api/send-telegram"`, consent checkbox, поля телефона/имени без замены контракта формы.
- Не удалять canonical, meta description, JSON-LD и sitemap-связь без причины.

## Зоны повышенного риска

### `styles-combined.css`

Глобальный CSS. Любая правка может затронуть все 37 страниц. После изменения нужны `ai:review`, `validate:site` и визуальный smoke review ключевых страниц.

### `main.js`

Глобальное поведение: меню, UI, таймеры, возможно CTA/интерактив. После изменения проверить `node --check main.js`, формы, меню, модалки, таймеры.

### `telegram-form.js` и `server/telegram-api.mjs`

Зона лидов и персональных данных. Нельзя ломать endpoint, fallback submit, required fields, согласие и формат отправки.

### `deploy/*`, `.github/*`

Деплой, compression, headers, manifest. После изменения нужен shell/workflow review и соответствующие проверки.

## Компонентная карта

`data/ai-component-map.json` помогает AI понять, что затрагивает задача: hero, leadForm, contactLinks, countdown, FAQ, schema, responsiveImages, floatingWhatsApp, deploySecurity.

Эта карта не запрещает редактирование. Она подсказывает риски и связанные файлы.

## Семантическая проверка важнее line diff

После HTML-правок обычный diff недостаточен. Нужно понять, изменились ли:

- title/description/canonical/H1;
- число форм и endpoint;
- required fields и consent;
- изображения, `srcset`, `width/height`, lazy/eager;
- JSON-LD types;
- script src и internal links;
- phone/WhatsApp links.

Для этого есть:

```bash
npm run ai:semantic-diff -- --page holodilniki.html
```

## Нормальный flexible workflow

```bash
npm run ai:workspace -- --task "описание задачи"
# гибко редактировать нужные HTML/CSS/JS/JSON
npm run ai:review
npm run ai:semantic-diff -- --page <если менялся HTML>
npm run ai:check
```


## Static Component Builder

В проекте есть полноценный build layer: `src/site-builder.json` + `src/pages/<slug>/*`. Он не ограничивает AI, а разбивает большие HTML на секции. Для HTML-страниц лучше редактировать секции в `src/pages/<slug>/sections`, затем собирать root HTML командой `npm run build:site -- --page <page.html> --write`.

Проверка синхронизации: `npm run check:site-builder`. Если root HTML был изменён вручную и это источник правды, синхронизируй source: `npm run site-builder:bootstrap -- --pages <page.html>`.

## Shared section components

После Static Component Builder проект использует `src/components/shared/*`: одинаковые секции больше не хранятся копиями в каждой странице. Page model ссылается на общий HTML через `componentRef`. Это не коридор для AI, а карта переиспользования: AI может редактировать shared component, но должен понимать, что он влияет на все страницы, где используется.



## FAQ Registry note

FAQ теперь индексируется в `content/faq/page-faq-registry.json`, а generated FAQPage JSON-LD лежит в `content/faq/schema/*.json` и вставляется в head через `data-generated="faq-registry"`. После правок FAQ запускать `npm run generate:faq-registry`, затем `npm run build:site -- --write` и `npm run check:faq-registry`.
