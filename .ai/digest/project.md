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
| Pages | 39 |
| Builder pages | 39 |
| Total sections | 2067 |
| src/pages files | 1032 |
| src/pages HTML section files | 993 |
| Shared component files | 32 |
| Shared refs | 333 |
| Shared coverage | 57.6% |
| Average sections/page | 53.0 |
| Average source files/page | 57.3 |
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
| parokonvektomat-abat.html | 74 | 13 | 20 |
| parokonvektomat-convotherm.html | 74 | 13 | 20 |
| parokonvektomat-e02-e07-e10.html | 74 | 12 | 21 |
| parokonvektomat-electrolux.html | 74 | 15 | 18 |
| parokonvektomat-kod-oshibki.html | 74 | 12 | 21 |
| parokonvektomat-lainox.html | 74 | 13 | 20 |
| parokonvektomat-ne-greet.html | 74 | 12 | 21 |
| parokonvektomat-net-para.html | 74 | 12 | 21 |
| parokonvektomat-rational-e9.html | 74 | 12 | 21 |
| parokonvektomat-rational.html | 74 | 12 | 21 |


## Крупнейшие кандидаты на сжатие смысла

- **high**: proof: 211 локальных секций, shared ratio 22% — кандидат на параметризованный компонент + props.
- **high**: raw: 148 локальных секций, shared ratio 16% — кандидат на параметризованный компонент + props.
- **medium**: section: 64 локальных секций, shared ratio 19% — кандидат на параметризованный компонент + props.
- **medium**: faq: 63 локальных секций, shared ratio 17% — кандидат на параметризованный компонент + props.
- **medium**: hero: 37 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high**: parokonvektomat-abat.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-convotherm.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-e02-e07-e10.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-electrolux.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-kod-oshibki.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-lainox.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-ne-greet.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.

## Команды digest/source compression

```bash
npm run ai:digest
npm run check:ai-digest
npm run analyze:source-complexity
npm run check:source-complexity
```
