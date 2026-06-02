# Static Builder Migration Plan

## Цель

Перевести сайт в модель:

```text
data + templates + section components → generated static HTML
```

без потери текущих URL, SEO, форм и статической отдачи.

## Этап 1 — sectioned baseline, сделано

- Все 37 индексированных HTML-страниц подключены к `src/pages/*`.
- Builder воспроизводит root HTML byte-to-byte.
- `check:site-builder` подключён к `lint` и `ai:check`.
- Root HTML остаётся production output, а `src/pages/*` становится удобным source-слоем для AI и человека.

Команды:

```bash
npm run check:site-builder
npm run build:site -- --page holodilniki.html
npm run build:site -- --page holodilniki.html --write
```

## Этап 2 — декларативные компоненты

Следующий большой шаг — не просто хранить HTML-секции, а постепенно заменить наиболее повторяющиеся зоны на настоящие data-driven components.

Начать с зон, которые чаще всего меняются и влияют на конверсию:

1. `hero`
2. `lead-form`
3. `contact-cta`
4. `faq`
5. `related-links`
6. `proof/trust`

Предлагаемая структура:

```text
src/components/hero/template.html
src/components/hero/schema.json
src/components/lead-form/template.html
src/components/faq/template.html
src/page-data/<slug>.json
```

Важно: переход должен быть постепенным. Каждая декларативная секция должна уметь собираться в тот же production HTML или проходить semantic diff без потери форм, schema, CTA и ссылок.

## Этап 3 — landing factory

После декларативных `hero`, `faq`, `related-links`, `proof` можно вводить фабрику посадочных:

- symptom pages;
- brand pages;
- geo pages;
- campaign landing pages.

Важно: только с quality gates, уникальными интентами и noindex/canonical-политикой там, где нужно.

## Этап 4 — visual QA

Для гибкого редактирования дизайна нужен браузерный smoke-test:

```bash
npm run visual:smoke
```

Минимум: открыть ключевые страницы в desktop/mobile, проверить JS errors, overflow, hero, форму, CTA и сохранить скриншоты.
