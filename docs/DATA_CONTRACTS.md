# Data Contracts — MosPochin

Этот документ описывает слой строгой проверки данных для AI-сопровождения проекта. Цель — ловить ошибки в `data/*.json` до того, как они попадут в HTML, sitemap, schema.org или deploy manifest.

## Главная команда

```bash
npm run validate:data
```

Проверка входит в:

```bash
npm run ai:check
npm run lint
```

Для диагностики конкретной страницы:

```bash
npm run validate:data -- --page holodilniki.html
npm run ai:context -- --page holodilniki.html
```

`ai:context` теперь показывает блок `Data contracts по странице`.

## Что проверяется

### 1. JSON-синтаксис

Валидатор читает JSON из:

- `data/*.json`
- `content/*.json`
- `schemas/*.json`

Любой битый JSON считается ошибкой.

### 2. Наличие контрактных файлов

Карта `schemas/data-files-manifest.json` связывает ключевые data-файлы со schema-документами:

- `data/page-metadata.json`
- `data/contact-config.json`
- `data/runtime-config.json`
- `data/household-services.json`
- `data/restaurant-services.json`
- `data/household-page-slots.json`
- `data/restaurant-page-slots.json`
- `data/household-branch.json`
- `data/restaurant-branch.json`
- `data/schema-profile.json`
- `data/site-page-contracts.json`
- `data/ai-project-index.json`

Schema-файлы лежат в `schemas/*.schema.json`. Они документируют структуру, а прикладные cross-file проверки выполняет `tools/validate-data.mjs`.

### 3. SEO metadata

Для `data/page-metadata.json` проверяется:

- каждая страница имеет HTML-файл;
- `title` не пустой и не слишком длинный;
- `description` не пустой и не слишком длинный;
- `branch` входит в `restaurant`, `household`, `neutral`;
- `hasForm` является boolean;
- `canonical` и `ogUrl` совпадают с URL страницы;
- для `index.html` допустим canonical `https://mospochin.ru/`;
- для `404.html` canonical/ogUrl должны быть `null`, а robots — `noindex,follow`.

### 4. Контакты и runtime

Для `data/contact-config.json` проверяется:

- `phoneE164` в формате `+7XXXXXXXXXX`;
- `whatsappNumber` в формате `7XXXXXXXXXX`;
- `telegramHref` начинается с `https://` или `tg://`;
- `email` похож на валидный email;
- `whatsappDefaultText` не пустой.

Для `data/runtime-config.json` проверяется, что `telegramFormEndpoint` начинается с `/`.

### 5. Реестры услуг

Для `data/household-services.json` и `data/restaurant-services.json` проверяется:

- нет дублей `page` и `slug`;
- каждая service-page существует в metadata и как HTML;
- `slug` в kebab-case;
- обязательные поля заполнены;
- `primarySymptoms` содержит минимум 3 симптома;
- `relatedPages` существуют и не ссылаются на саму страницу;
- ветка в service registry совпадает с `branch` в `page-metadata.json`.

### 6. Page slots

Для `data/household-page-slots.json` и `data/restaurant-page-slots.json` проверяется:

- `serviceKpiDefaults` заполнен;
- каждая страница из `pages` есть в metadata;
- FAQ-вопросы и ответы не пустые;
- FAQ-вопросы не дублируются внутри одной страницы;
- `formHints` имеет ожидаемую структуру, если задан.

### 7. Branch config и schema profile

Проверяется, что навигационные ссылки из branch config ведут на известные страницы, если это не внешний URL и не anchor-link.

Для `data/schema-profile.json` проверяется наличие базового provider-профиля и шаблонов веток.

### 8. AI index

Проверяется, что `data/ai-project-index.json`:

- содержит те же страницы, что `data/page-metadata.json`;
- совпадает с детерминированным результатом `tools/generate-ai-index.mjs`.

Если индекс устарел:

```bash
npm run generate:ai-index
```

## Как действовать AI-агенту

Перед правкой страницы:

```bash
npm run ai:context -- --page <file.html>
```

После правки данных:

```bash
npm run validate:data
npm run ai:changed
npm run ai:check
```

Если правка затрагивает SEO:

```bash
npm run sync:metadata
npm run generate:sitemap
npm run generate:ai-index
npm run validate:data
```

Если правка затрагивает изображения:

```bash
npm run generate:responsive-images
npm run generate:webp-sidecars
npm run generate:deploy-manifest
npm run validate:data
```

## Важное ограничение

Валидатор не заменяет визуальный review. Он защищает структуру данных, связи страниц, SEO-контракты, контакты, FAQ и AI-index, но не может гарантировать, что блок визуально выглядит идеально во всех viewport.
