# Static Component Builder

Цель пакета — перевести сайт от режима «37 больших HTML-файлов как единственный источник» к режиму **source sections → static HTML**, не ломая текущую production-отдачу.

Это не React, не SPA и не CMS. Итоговые страницы остаются обычными `.html`, но все индексированные HTML-страницы теперь можно сопровождать через секционные source-файлы в `src/pages/*`.

## Что уже подключено

Подключены все 37 индексированных HTML-страниц из `data/ai-project-index.json`.

Для каждой страницы есть модель:

```text
src/pages/<slug>/page.json
src/pages/<slug>/head.html
src/pages/<slug>/body-open.html
src/pages/<slug>/sections/*.html
src/pages/<slug>/after-body.html
```

Манифест:

```text
src/site-builder.json
```

## Команды

```bash
npm run build:site
npm run build:site -- --page holodilniki.html
npm run build:site -- --page holodilniki.html --write
npm run check:site-builder
npm run site-builder:bootstrap -- --pages holodilniki.html
```

## Рабочий цикл

### Изменить страницу через builder

1. Открыть контекст:

```bash
npm run ai:context -- --page holodilniki.html
```

2. Найти нужную секцию:

```text
src/pages/holodilniki/sections/*hero*.html
src/pages/holodilniki/sections/*faq*.html
src/pages/holodilniki/sections/*lead-form*.html
```

3. Отредактировать секцию.

4. Собрать root HTML:

```bash
npm run build:site -- --page holodilniki.html --write
```

5. Проверить:

```bash
npm run check:site-builder
npm run ai:semantic-diff -- --page holodilniki.html
npm run ai:check
```

### Если root HTML был изменён вручную

Синхронизировать source-секции из текущего root HTML:

```bash
npm run site-builder:bootstrap -- --pages holodilniki.html
npm run check:site-builder
```

## Почему это важно

До builder-слоя нейронке приходилось редактировать большие HTML-файлы целиком. Теперь крупные страницы разбиты на секции с типами:

- `hero`
- `breadcrumb`
- `lead-form`
- `faq`
- `pricing`
- `proof`
- `contact-cta`
- `related-links`
- `mobile-contact`
- `runtime-partials`

Это не ограничивает редактирование, но делает его управляемым: AI может менять любую секцию, а затем собрать и проверить итоговую статическую страницу.

## Правила

- Root `.html` остаются production output.
- Для HTML-страниц source лучше править в `src/pages/<slug>/sections`.
- После правок source обязательно запускать `npm run build:site -- --page <page> --write`.
- `npm run check:site-builder` должен показывать полное совпадение root HTML и builder output.
- Если добавлена новая root HTML-страница, используйте `site-builder:bootstrap`, затем проверьте byte-match.
- Не превращать проект в SPA: SEO и статический HTML важнее.

## Как добавлять новые страницы в builder

```bash
npm run site-builder:bootstrap -- --pages new-page.html
npm run check:site-builder
npm run generate:ai-index
npm run ai:check
```

После этого запустите `npm run generate:ai-index`, чтобы страница появилась в `data/ai-project-index.json` с блоком `siteBuilder`.

## Ограничения текущего этапа

Этот пакет — lossless section builder. Он уже уменьшает сложность сопровождения, но ещё не является полной контентной моделью страниц. Следующий возможный шаг — заменить часть секций декларативными компонентами, например `hero.json + hero.html`, `lead-form.json + lead-form.html`, `faq.json + faq.html`.

## Shared components layer

Повторяющиеся секции builder-а вынесены в `src/components/shared/*`. Локальная секция в page model использует `file`, общая секция использует `componentRef`. Команды: `npm run site-builder:extract-shared` и `npm run check:shared-components`. Root HTML должен по-прежнему совпадать с builder output. Подробности: `docs/DECLARATIVE_COMPONENTS.md`.

