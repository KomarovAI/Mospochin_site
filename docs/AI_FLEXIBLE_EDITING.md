# Flexible AI Editing

Документ описывает подход к гибкому редактированию проекта AI-агентами. Цель — не загонять AI в узкие команды, а дать ему карту, impact-анализ и проверки.

## Принцип

AI может редактировать любые файлы проекта, если задача этого требует. Ограничение не в запрете, а в прозрачности последствий:

- перед правкой — понять workspace;
- во время правки — учитывать component map и ownership;
- после правки — сделать review, semantic diff и проверки.

## Основные команды

### Workspace snapshot

```bash
npm run ai:workspace -- --task "переделать hero на странице ремонта холодильников"
```

Показывает:

- вероятные страницы;
- вероятные компоненты;
- файлы, которые стоит открыть первыми;
- риски;
- проверки после правки.

### Impact по файлам

```bash
npm run ai:impact -- --files holodilniki.html,styles-combined.css
```

Показывает:

- тип файла;
- риск;
- связанные компоненты;
- потенциально затронутые страницы;
- команды проверки.

### Review после правок

```bash
npm run ai:review
```

Если есть git, берёт изменённые файлы из `git status`. В архиве без `.git` можно передать файлы явно:

```bash
npm run ai:review -- --files holodilniki.html,styles-combined.css
```

### Semantic diff HTML

```bash
npm run ai:semantic-diff -- --page holodilniki.html
```

Если есть git, сравнивает working tree с `HEAD`. Если git недоступен, показывает текущий семантический снимок страницы.

Проверяет смысловые контракты:

- SEO;
- forms;
- images;
- schema;
- scripts/styles;
- links;
- critical signals.

### Component map

```bash
npm run generate:ai-component-map
npm run check:ai-component-map
```

`data/ai-component-map.json` генерируется детерминированно и показывает, какие страницы содержат ключевые компоненты.

## Примеры задач

### Переделать hero

```bash
npm run ai:workspace -- --task "переделать hero на странице ремонта холодильников"
```

Обычно открыть:

- нужную HTML-страницу;
- `styles-combined.css`;
- возможно image assets.

После правки:

```bash
npm run ai:semantic-diff -- --page holodilniki.html
npm run ai:review -- --files holodilniki.html,styles-combined.css
npm run ai:check
```

### Изменить форму заявки

```bash
npm run ai:workspace -- --task "улучшить форму заявки"
npm run ai:impact -- --files telegram-form.js,holodilniki.html
```

Контракты формы:

- сохранять `action="/api/send-telegram"`;
- сохранять `method="post"`;
- сохранять `name`, `phone` или эквивалентные поля;
- сохранять consent checkbox/текст согласия;
- не уводить token на клиент.

### Поменять контакты

Сначала определить, глобальная ли это правка:

```bash
npm run ai:workspace -- --task "поменять телефон на сайте"
```

Обычно править не один HTML, а конфиги контактов и затем проверять весь сайт.

### Изменить изображения

```bash
npm run ai:workspace -- --task "заменить hero image"
```

После добавления source image:

```bash
npm run generate:responsive-images
npm run generate:webp-sidecars
npm run check:responsive-images
npm run check:webp-sidecars
```

## Когда нужен ручной review

- `deploy/*`;
- `.github/workflows/*`;
- `server/telegram-api.mjs`;
- `telegram-form.js`;
- глобальные CSS/JS изменения;
- массовые HTML-замены;
- изменения security headers/CSP;
- изменения генераторов в `tools/*`.

## Финальное правило

AI не должен бояться гибко менять проект, но должен уметь объяснить:

1. какие файлы изменены;
2. какие компоненты затронуты;
3. какие риски появились;
4. какие проверки прошли;
5. какие места требуют визуального или ручного review.


## Гибкое редактирование страниц через Static Component Builder

Если `ai:context` показывает блок `Static Component Builder`, страница подключена к sectioned source. Это не запрет на ручную правку HTML, но предпочтительный путь такой:

```bash
npm run ai:context -- --page holodilniki.html
# редактировать src/pages/holodilniki/sections/*.html
npm run build:site -- --page holodilniki.html --write
npm run check:site-builder
npm run ai:semantic-diff -- --page holodilniki.html
npm run ai:check
```

Если задача требует массового редизайна hero/form/CTA, такой путь безопаснее, чем править один огромный HTML-файл.

## Перед крупной гибкой правкой

Используй AI digest как сжатую карту проекта:

```bash
npm run ai:workspace -- --task "описание задачи"
npm run ai:digest
```

Открой `.ai/digest/project.md`, затем digest нужной страницы/компонента. Это не ограничивает редактирование, а сокращает объём файлов, которые нужно читать перед правкой.


## FAQ Registry note

FAQ индексируется в `content/faq/page-faq-registry.json`. FAQPage JSON-LD отключена после прекращения FAQ rich results в Google; видимые ответы сохраняются. После правок FAQ запускать `npm run generate:faq-registry`, затем `npm run build:site -- --write` и `npm run check:faq-registry`.
