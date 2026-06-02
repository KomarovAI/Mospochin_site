# AI-CONTEXT: MosPochin Site

Краткий рабочий контекст для нейронок. Начинай отсюда, а не с чтения всех HTML.

## Что это за проект

MosPochin — статический маркетинговый сайт сервиса ремонта техники в Москве. У сайта две основные ветки:

- `restaurant` — ресторанное/профессиональное оборудование, B2B, юрлица, срочные выезды, документы, гарантия до 24 месяцев.
- `household` — бытовая техника на дому, B2C, согласование стоимости до ремонта, гарантия до 12 месяцев.
- `neutral` — служебные или общие страницы.

## Главный принцип сопровождения

Не редактируй HTML вслепую, если задача относится к контенту, SEO, FAQ, контактам или связям страниц. Сначала найди источник правды в `data/*.json`, `content/site-content.json` или через AI-команды.

Рабочий цикл:

```bash
npm run ai:context -- --page <file.html>
# или
npm run ai:context -- --query "часть названия/темы"

# внести точечную правку в источник правды
npm run ai:changed
npm run ai:check
```

## Самые важные файлы для AI

| Файл | Назначение |
|---|---|
| `data/ai-project-index.json` | Машинный индекс страниц: ветка, роль, источники, проверки |
| `AI-CONTEXT.md` | Этот краткий контекст |
| `docs/AI_FILE_OWNERSHIP.md` | Что можно менять, что generated, что danger-zone |
| `docs/AI_TASK_RECIPES.md` | Рецепты типовых задач |
| `docs/PROJECT_DECISIONS.md` | Почему проект устроен именно так |
| `.aiignore` | Что не включать в AI-контекст |
| `content/site-content.json` | Снимок текстового контента сайта |
| `content/faq/page-faq-registry.json` | Машинный индекс видимых FAQ и источник generated FAQPage schema |
| `content/faq/schema/*.json` | Generated FAQPage JSON-LD по страницам |
| `data/page-metadata.json` | SEO title/description/canonical/robots/branch |
| `data/contact-config.json` | Телефон, WhatsApp, Telegram, email |
| `data/household-services.json` | Реестр бытовых услуг |
| `data/restaurant-services.json` | Реестр ресторанных услуг |
| `data/household-page-slots.json` | FAQ/KPI/слоты бытовых страниц |
| `data/restaurant-page-slots.json` | FAQ/KPI/слоты ресторанных страниц |


## Scale policy / рост проекта

Текущий режим роста: `controlled-growth-to-150-pages`.

Файлы контракта:

- `docs/SCALE_POLICY.md` — человеческое правило;
- `data/ai-scale-policy.json` — machine-readable лимиты;
- `tools/check-scale-policy.mjs` — проверка;
- `npm run guard:scale` — gate.

Правило: проект можно расширять до 100–150 страниц без большого предварительного blueprint-рефактора, но нельзя ухудшать shared/parametric coverage, среднее число секций и source-файлов на страницу. После 150 страниц новые страницы запрещены до отдельного source-compression/blueprint этапа.

После добавления страниц или source-compression правок запускай:

```bash
npm run analyze:source-complexity
npm run guard:scale
npm run verify
```

## Команды для нейронок

```bash
npm run ai:context -- --summary
npm run ai:context -- --query "ремонт холодильников"
npm run ai:context -- --page holodilniki.html
npm run ai:changed
npm run ai:check
npm run ai:check -- --fast
npm run ai:digest
npm run check:faq-registry
```

Команды индекса:

```bash
npm run generate:ai-index
npm run check:ai-index
```

## Типовые маршруты правок

### SEO страницы

1. `npm run ai:context -- --page <file.html>`
2. Менять `data/page-metadata.json` или использовать профильную команду:
   ```bash
   npm run household:set-metadata -- --page <file.html> --title "..." --description "..."
   npm run restaurant:set-metadata -- --page <file.html> --title "..." --description "..."
   ```
3. `npm run sync:metadata`
4. `npm run ai:check`

### FAQ

Видимый FAQ редактируется в builder source (`src/pages/<slug>/sections/*`, shared или parametric component). Машинный registry и FAQPage JSON-LD пересоздаются командой.

```bash
npm run ai:context -- --page <file.html>
# найти FAQ section/component source
# внести правку
npm run generate:faq-registry
npm run build:site -- --page <file.html> --write
npm run check:faq-registry
npm run ai:semantic-diff -- --page <file.html>
npm run ai:check
```

Если правка идёт через старые branch-команды, после них всё равно запускать `generate:faq-registry`, чтобы visible FAQ и FAQPage schema не разъехались.

### Контакты

```bash
npm run ai:contact -- --phone "+7 (999) 005-71-72" --email "mospochin@yandex.ru"
npm run ai:changed
npm run ai:check
```

### Изображения

Оригиналы не пережимать вручную. Использовать генераторы:

```bash
npm run generate:responsive-images
npm run generate:webp-sidecars
npm run generate:deploy-manifest
npm run ai:check
```

### Sitemap/deploy manifest/AI index после структурных изменений

```bash
npm run generate:sitemap
npm run generate:deploy-manifest
npm run generate:ai-index
npm run ai:check
```

## Что не трогать без причины

- `deploy/*` и `.github/workflows/*` — влияют на выкладку.
- `server/telegram-api.mjs` — серверная отправка заявок и секреты.
- `tools/*.mjs` — менять только если задача про автоматизацию.
- `assets/images/responsive/*`, `*.webp`, `*.avif` — generated, пересоздавать командами.
- `sitemap.xml`, `.deploy/include-files.txt`, `data/ai-project-index.json` — generated, обновлять командами.

## Финальный ответ после правок

Всегда указывай:

1. Что изменено.
2. Какие файлы затронуты.
3. Какие команды/проверки прошли.
4. Что требует ручного визуального review, если такое есть.

## Data contracts

Структурные данные защищены отдельным валидатором:

```bash
npm run validate:data
npm run validate:data -- --page holodilniki.html
```

Перед финальным ответом после любых правок `data/*.json` запускай `npm run validate:data` или полный `npm run ai:check`. Подробнее: `docs/DATA_CONTRACTS.md`.

## Flexible AI Workspace

Для гибкого редактирования проекта не используй только узкие команды. Сначала собери рабочий контекст:

```bash
npm run ai:workspace -- --task "описание задачи"
```

После свободных правок HTML/CSS/JS/JSON запусти:

```bash
npm run ai:review
npm run ai:semantic-diff -- --page <page.html>
npm run ai:check
```

Ключевые файлы:

- `docs/AI_PROJECT_KNOWLEDGE.md` — смысловая база проекта для AI.
- `docs/AI_FLEXIBLE_EDITING.md` — workflow гибких правок.
- `data/ai-component-map.json` — карта компонентов, связанных файлов и рисков.

Инструменты Flexible AI Workspace не запрещают изменения. Они помогают понять последствия и проверить, что SEO, формы, schema, изображения и глобальное поведение не сломались.

## Static Component Builder baseline

Все 37 индексированных HTML-страниц подключены к параллельному builder-слою:

```text
src/site-builder.json
src/pages/<slug>/page.json
src/pages/<slug>/sections/*.html
```

Предпочтительный workflow для HTML-страниц:

```bash
npm run ai:context -- --page holodilniki.html
# редактировать нужную секцию в src/pages/holodilniki/sections
npm run build:site -- --page holodilniki.html --write
npm run check:site-builder
npm run ai:semantic-diff -- --page holodilniki.html
npm run ai:check
```

Если root HTML был изменён вручную и его нужно принять как источник правды:

```bash
npm run site-builder:bootstrap -- --pages holodilniki.html
npm run check:site-builder
npm run generate:ai-index
```

## Declarative shared components

Повторяющиеся секции вынесены в `src/components/shared/*`. В `src/pages/<slug>/page.json` такие секции имеют `componentRef`; локальные секции имеют `file`. Для изменения одного блока одной страницы редактируй `src/pages/<slug>/sections/*`. Для изменения общего блока редактируй `src/components/shared/*`, затем запускай `npm run build:site -- --write`, `npm run check:shared-components`, `npm run check:site-builder` и `npm run ai:check`.


## AI Digest / Source Compression

Для крупных задач сначала читать сжатый контекст:

```bash
npm run ai:workspace -- --task "описание задачи"
npm run ai:digest
```

Главные файлы:

- `.ai/digest/project.md` — короткая карта проекта для AI.
- `.ai/digest/content-map.json` — машинная карта страниц, компонентов, источников и проверок.
- `.ai/digest/pages/*.md` — digest конкретной страницы.
- `.ai/digest/components/*.md` — digest компонента.
- `reports/source-complexity.md` — где source перегружен и что сжимать дальше.
- `docs/SOURCE_COMPRESSION_PLAN.md` — стратегия перехода к blueprints, parameterized components и content registry.

После структурных изменений запускать:

```bash
npm run analyze:source-complexity
npm run ai:digest
npm run check:source-complexity
npm run check:ai-digest
```

## Parameterized components

Проект теперь поддерживает parametric sections в `src/pages/<slug>/page.json` через `templateRef + propsRef`.

- Шаблоны: `src/components/parametric/*/*.template.html`
- Props: `content/components/*/*.json`
- Контракты: `src/components/parametric/*/*.contract.json`
- Проверка: `npm run check:parameterized-components`

Если section имеет `componentMode: "parametric"`, не ищи локальный `sections/*.html`: builder рендерит HTML из template + props. Для page-specific текста меняй props, для структуры — template.

Pack #2 добавил `static-core` parametric sections для технических повторов без смыслового контента: `noscript`, `runtime-partials`, `footer-anchor`, breadcrumb marker comments. Эти refs меняются через `src/components/parametric/static/*`, а не через page-local sections.
