# AI Digest — MosPochin Project

Короткая машинная сводка проекта. Начинай работу отсюда, затем открывай только нужные page/component digest-файлы и конкретные source-файлы.

## Быстрая карта

| Область | Источник |
| --- | --- |
| AI entrypoint | docs/AI_START_HERE.md |
| Doc index | docs/DOC_INDEX.md |
| Project map | data/project-map.generated.json |
| AI operating guide | docs/AI_PROJECT_OPERATING_GUIDE.md |
| AI editing manifest | data/ai-editing-manifest.json |
| Пароконвектоматы AI guide | docs/PAROKONVEKTOMAT_CLUSTER_AI_GUIDE.md |
| Владение файлами | data/file-ownership.json |
| Гибкое редактирование | docs/AI_FLEXIBLE_EDITING.md |
| Builder | docs/STATIC_COMPONENT_BUILDER.md |
| Shared components | docs/DECLARATIVE_COMPONENTS.md |
| Scale/source decisions | docs/PROJECT_DECISIONS.md |
| Страницы | .ai/digest/pages/*.md |
| Компоненты | .ai/digest/components/*.md |
| Машинная карта | .ai/digest/content-map.json |


## Состояние source

| Метрика | Значение |
| --- | --- |
| Pages | 63 |
| Builder pages | 63 |
| Total sections | 2686 |
| src/pages files | 1525 |
| src/pages HTML section files | 1462 |
| Shared component files | 48 |
| Shared refs | 354 |
| Shared coverage | 55.4% |
| Average sections/page | 42.6 |
| Average source files/page | 46.6 |
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
| parokonvektomat-abat.html | 77 | 18 | 18 |
| parokonvektomat-convotherm.html | 77 | 18 | 18 |
| parokonvektomat-electrolux.html | 77 | 20 | 16 |
| parokonvektomat-lainox.html | 77 | 18 | 18 |
| parokonvektomat-e02-e07-e10.html | 75 | 15 | 19 |
| parokonvektomat-kod-oshibki.html | 75 | 15 | 19 |
| parokonvektomat-ne-greet.html | 75 | 14 | 19 |
| parokonvektomat-net-para.html | 75 | 14 | 19 |
| parokonvektomat-rational-e9.html | 75 | 15 | 19 |
| parokonvektomat-rational.html | 75 | 14 | 19 |


## Крупнейшие кандидаты на сжатие смысла

- **high**: proof: 235 локальных секций, shared ratio 24% — кандидат на параметризованный компонент + props.
- **high**: mobile-contact: 161 локальных секций, shared ratio 33% — кандидат на параметризованный компонент + props.
- **high**: raw: 151 локальных секций, shared ratio 16% — кандидат на параметризованный компонент + props.
- **high**: faq: 81 локальных секций, shared ratio 19% — кандидат на параметризованный компонент + props.
- **medium**: related-links: 66 локальных секций, shared ratio 31% — кандидат на параметризованный компонент + props.
- **medium**: section: 67 локальных секций, shared ratio 16% — кандидат на параметризованный компонент + props.
- **medium**: contact-cta: 70 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium**: lead-form: 55 локальных секций, shared ratio 15% — кандидат на параметризованный компонент + props.
- **medium**: hero: 37 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium**: body-preamble: 25 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high**: parokonvektomat-abat.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-convotherm.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.

## Команды digest/source compression

```bash
npm run ai:digest
npm run check:ai-digest
npm run analyze:source-complexity
npm run check:source-complexity
```
