# AI Digest — MosPochin Project

Короткая машинная сводка проекта. Начинай работу отсюда, затем открывай только нужные page/component digest-файлы и конкретные source-файлы.

## Быстрая карта

| Область | Источник |
| --- | --- |
| Главный контекст | AI-CONTEXT.md |
| Владение файлами | docs/AI_FILE_OWNERSHIP.md |
| Гибкое редактирование | docs/AI_FLEXIBLE_EDITING.md |
| Builder | docs/STATIC_COMPONENT_BUILDER.md |
| Shared components | docs/DECLARATIVE_COMPONENTS.md |
| Сжатие source | docs/SOURCE_COMPRESSION_PLAN.md |
| Страницы | .ai/digest/pages/*.md |
| Компоненты | .ai/digest/components/*.md |
| Машинная карта | .ai/digest/content-map.json |


## Состояние source

| Метрика | Значение |
| --- | --- |
| Pages | 37 |
| Builder pages | 37 |
| Total sections | 1930 |
| src/pages files | 1576 |
| src/pages HTML section files | 1539 |
| Shared component files | 32 |
| Shared refs | 289 |
| Shared coverage | 26.0% |
| Average sections/page | 52.2 |
| Average source files/page | 56.5 |
| AI component map entries | 12 |


## Как работать AI

1. Для задачи запусти `npm run ai:workspace -- --task "..."`.
2. Открой `.ai/digest/project.md`, затем page/component digest по задаче.
3. Редактируй гибко: `src/pages/<slug>/sections/*`, `src/components/shared/*`, CSS/JS/data при необходимости.
4. После HTML-source правок собери root HTML: `npm run build:site -- --page <file.html> --write` или `npm run build:site -- --write`.
5. Проверь: `npm run ai:review`, `npm run ai:semantic-diff -- --page <file.html>`, `npm run ai:check`.

## Самые сложные страницы

| Page | Sections | Local | Shared |
| --- | --- | --- | --- |
| remont-oborudovaniya-restorana-parokonvektomat.html | 77 | 47 | 23 |
| parokonvektomat-e02-e07-e10.html | 76 | 49 | 20 |
| parokonvektomat-kod-oshibki.html | 76 | 49 | 20 |
| parokonvektomat-ne-greet.html | 76 | 48 | 21 |
| parokonvektomat-net-para.html | 76 | 48 | 21 |
| parokonvektomat-abat.html | 74 | 47 | 20 |
| parokonvektomat-convotherm.html | 74 | 47 | 20 |
| parokonvektomat-electrolux.html | 74 | 49 | 18 |
| parokonvektomat-lainox.html | 74 | 47 | 20 |
| parokonvektomat-rational-e9.html | 74 | 47 | 20 |


## Крупнейшие кандидаты на сжатие смысла

- **high**: raw: 708 локальных секций, shared ratio 3% — кандидат на параметризованный компонент + props.
- **high**: proof: 202 локальных секций, shared ratio 21% — кандидат на параметризованный компонент + props.
- **medium**: section: 63 локальных секций, shared ratio 19% — кандидат на параметризованный компонент + props.
- **medium**: faq: 61 локальных секций, shared ratio 15% — кандидат на параметризованный компонент + props.
- **medium**: lead-form: 25 локальных секций, shared ratio 32% — кандидат на параметризованный компонент + props.
- **medium**: hero: 35 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high**: remont-oborudovaniya-restorana-parokonvektomat.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-e02-e07-e10.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-kod-oshibki.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-ne-greet.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-net-para.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-abat.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.

## Команды digest/source compression

```bash
npm run ai:digest
npm run check:ai-digest
npm run analyze:source-complexity
npm run check:source-complexity
```
