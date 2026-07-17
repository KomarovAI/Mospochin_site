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
| Pages | 296 |
| Builder pages | 296 |
| Total sections | 4333 |
| src/pages files | 3436 |
| src/pages HTML section files | 3139 |
| Shared component files | 182 |
| Shared refs | 297 |
| Shared coverage | 48.0% |
| Average sections/page | 14.6 |
| Average source files/page | 18.5 |
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
| parokonvektomaty.html | 77 | 49 | 10 |
| parokonvektomat-abat.html | 75 | 27 | 15 |
| parokonvektomat-convotherm.html | 75 | 26 | 16 |
| parokonvektomat-electrolux.html | 75 | 28 | 14 |
| parokonvektomat-lainox.html | 75 | 26 | 16 |
| remont-oborudovaniya-restorana-parokonvektomat.html | 73 | 25 | 14 |
| parokonvektomat-e02-e07-e10.html | 67 | 23 | 16 |
| parokonvektomat-rational-e9.html | 67 | 23 | 16 |
| parokonvektomat-rational.html | 67 | 23 | 16 |
| parokonvektomat-unox-af02-af08.html | 67 | 23 | 16 |


## Крупнейшие кандидаты на сжатие смысла

- **high**: faq: 247 локальных секций, shared ratio 7% — кандидат на параметризованный компонент + props.
- **high**: proof: 209 локальных секций, shared ratio 13% — кандидат на параметризованный компонент + props.
- **high**: breadcrumb: 211 локальных секций, shared ratio 8% — кандидат на параметризованный компонент + props.
- **high**: lead-form: 167 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high**: body-preamble: 152 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high**: contact-cta: 143 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high**: raw: 103 локальных секций, shared ratio 20% — кандидат на параметризованный компонент + props.
- **medium**: section: 78 локальных секций, shared ratio 34% — кандидат на параметризованный компонент + props.
- **high**: related-links: 86 локальных секций, shared ratio 15% — кандидат на параметризованный компонент + props.
- **medium**: hero: 56 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium**: cause-matrix: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium**: decision-tree: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.

## Команды digest/source compression

```bash
npm run ai:digest
npm run check:ai-digest
npm run analyze:source-complexity
npm run check:source-complexity
```
