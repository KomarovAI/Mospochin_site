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
| Pages | 136 |
| Builder pages | 136 |
| Total sections | 3331 |
| src/pages files | 2281 |
| src/pages HTML section files | 2145 |
| Shared component files | 128 |
| Shared refs | 269 |
| Shared coverage | 47.9% |
| Average sections/page | 24.5 |
| Average source files/page | 28.4 |
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
| parokonvektomaty.html | 78 | 48 | 9 |
| parokonvektomat-abat.html | 76 | 51 | 15 |
| parokonvektomat-convotherm.html | 76 | 23 | 15 |
| parokonvektomat-electrolux.html | 76 | 25 | 13 |
| parokonvektomat-lainox.html | 76 | 23 | 15 |
| remont-oborudovaniya-restorana-parokonvektomat.html | 74 | 21 | 14 |
| parokonvektomat-e02-e07-e10.html | 68 | 20 | 16 |
| parokonvektomat-kod-oshibki.html | 68 | 20 | 16 |
| parokonvektomat-ne-greet.html | 68 | 20 | 16 |
| parokonvektomat-net-para.html | 68 | 20 | 16 |


## Крупнейшие кандидаты на сжатие смысла

- **high**: proof: 259 локальных секций, shared ratio 16% — кандидат на параметризованный компонент + props.
- **high**: raw: 191 локальных секций, shared ratio 13% — кандидат на параметризованный компонент + props.
- **high**: lead-form: 137 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high**: body-preamble: 134 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high**: faq: 101 локальных секций, shared ratio 17% — кандидат на параметризованный компонент + props.
- **high**: breadcrumb: 87 локальных секций, shared ratio 20% — кандидат на параметризованный компонент + props.
- **high**: related-links: 93 локальных секций, shared ratio 14% — кандидат на параметризованный компонент + props.
- **medium**: section: 79 локальных секций, shared ratio 13% — кандидат на параметризованный компонент + props.
- **medium**: contact-cta: 72 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium**: hero: 37 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high**: parokonvektomaty.html: 78 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomat-abat.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.

## Команды digest/source compression

```bash
npm run ai:digest
npm run check:ai-digest
npm run analyze:source-complexity
npm run check:source-complexity
```
