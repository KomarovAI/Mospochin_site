# AI Task Recipes — MosPochin

Короткие рецепты для типовых задач. Их цель — уменьшить импровизацию и не заставлять AI читать весь HTML.

## Узнать, где править страницу

```bash
npm run ai:context -- --page holodilniki.html
```

Команда покажет ветку, роль страницы, связанные JSON-файлы, безопасные команды и проверки.

## Найти страницу по смыслу

```bash
npm run ai:context -- --query "ремонт холодильников"
```

Используй результат, затем открой контекст конкретной страницы.

## Изменить SEO title/description

1. Проверь страницу:
   ```bash
   npm run ai:context -- --page holodilniki.html
   ```
2. Измени `data/page-metadata.json` или используй профильную команду:
   ```bash
   npm run household:set-metadata -- --page holodilniki.html --title "..." --description "..."
   ```
3. Синхронизируй HTML:
   ```bash
   npm run sync:metadata
   ```
4. Проверь:
   ```bash
   npm run ai:check
   ```

## Добавить или заменить FAQ

Household:

```bash
npm run household:set-faq -- --page holodilniki.html --faq-json '[{"question":"...","answer":"..."}]'
```

Restaurant:

```bash
npm run restaurant:set-faq -- --page parokonvektomaty.html --faq-json '[{"question":"...","answer":"..."}]'
```

После:

```bash
npm run doctor:page -- --page <file.html>
npm run ai:check
```

## Изменить контакты

```bash
npm run ai:contact -- --phone "+7 (999) 005-71-72" --email "mospochin@yandex.ru"
```

Потом:

```bash
npm run ai:changed
npm run ai:check
```

## Добавить новую страницу услуги

Household:

```bash
npm run scaffold:household-service -- --page new-service.html --slug new-service --service-name "..."
```

Restaurant:

```bash
npm run scaffold:restaurant-service -- --page new-service.html --slug new-service --service-name "..."
```

После добавления обязательно:

```bash
npm run generate:sitemap
npm run generate:deploy-manifest
npm run generate:ai-index
npm run ai:check
```

## Изменить изображение или добавить новое

1. Положи оригинал в правильную папку `assets/images/...`.
2. Запусти:
   ```bash
   npm run generate:responsive-images
   npm run generate:webp-sidecars
   npm run generate:deploy-manifest
   ```
3. Проверь:
   ```bash
   npm run check:responsive-images
   npm run check:webp-sidecars
   npm run check:image-budget
   npm run ai:check
   ```

Оригиналы не пережимай вручную. Production-деривативы должны быть воспроизводимыми.

## Изменить форму заявки

1. Проверь контракт формы в HTML и `telegram-form.js`.
2. Не выноси Telegram token в клиентский JS.
3. Сохраняй fallback `action="/api/send-telegram"` и `method="post"`.
4. После изменения:
   ```bash
   node --check telegram-form.js
   npm run validate:site
   npm run ai:check
   ```

## Перед финальным ответом

```bash
npm run ai:changed
npm run ai:check
```

В ответе укажи: что изменено, какие файлы затронуты, какие проверки прошли, что требует ручного визуального ревью.

## Проверить контракты данных

Когда задача меняет `data/*.json`, сначала проверь данные отдельно:

```bash
npm run validate:data
```

Для страницы:

```bash
npm run validate:data -- --page <file.html>
npm run ai:context -- --page <file.html>
```

Если валидатор ругается на AI index, запусти:

```bash
npm run generate:ai-index
npm run validate:data
```

## Гибкая правка без узких команд

Когда задача не укладывается в простую замену данных, начинай не с ручного поиска по всем файлам, а с workspace snapshot:

```bash
npm run ai:workspace -- --task "описание задачи"
```

Дальше можно свободно редактировать HTML/CSS/JS/JSON, но после правок выполнить:

```bash
npm run ai:review
npm run ai:semantic-diff -- --page <если менялся HTML>
npm run ai:check
```

Если известны изменённые файлы, можно явно запросить impact/review:

```bash
npm run ai:impact -- --files holodilniki.html,styles-combined.css
npm run ai:review -- --files holodilniki.html,styles-combined.css
```

Semantic diff особенно важен для HTML, потому что обычный diff не показывает, потерялись ли формы, schema, canonical, srcset или consent.

## Изменить B2B-форму пароконвектоматов

1. Для текста конкретной страницы открой `content/components/lead-form/<slug>.json`.
2. Для общей структуры формы открой `src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.template.html`.
3. Проверь impact:

```bash
npm run ai:impact -- --files src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.template.html
```

4. Собери/проверь:

```bash
npm run build:site -- --write
npm run check:parameterized-components
npm run check:site-builder
npm run ai:check
```


## FAQ Registry note

FAQ теперь индексируется в `content/faq/page-faq-registry.json`, а generated FAQPage JSON-LD лежит в `content/faq/schema/*.json` и вставляется в head через `data-generated="faq-registry"`. После правок FAQ запускать `npm run generate:faq-registry`, затем `npm run build:site -- --write` и `npm run check:faq-registry`.
