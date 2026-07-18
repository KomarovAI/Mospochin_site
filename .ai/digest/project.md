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
| Pages | 500 |
| Builder pages | 500 |
| Total sections | 6933 |
| src/pages files | 6341 |
| src/pages HTML section files | 5278 |
| Shared component files | 215 |
| Shared refs | 349 |
| Shared coverage | 45.9% |
| Average sections/page | 13.9 |
| Average source files/page | 19.2 |
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
| parokonvektomaty.html | 77 | 45 | 10 |
| parokonvektomat-abat.html | 75 | 23 | 15 |
| remont-oborudovaniya-restorana-parokonvektomat.html | 73 | 21 | 14 |
| parokonvektomaty-promo.html | 67 | 20 | 15 |
| parokonvektomat-convotherm.html | 64 | 20 | 7 |
| parokonvektomat-electrolux.html | 64 | 22 | 5 |
| parokonvektomat-lainox.html | 64 | 20 | 7 |
| grili-mangaly.html | 63 | 43 | 2 |
| parokonvektomat-e02-e07-e10.html | 55 | 17 | 6 |
| parokonvektomat-rational-e9.html | 55 | 17 | 6 |


## Крупнейшие кандидаты на сжатие смысла

- **high**: section: 526 локальных секций, shared ratio 29% — кандидат на параметризованный компонент + props.
- **high**: pricing: 374 локальных секций, shared ratio 22% — кандидат на параметризованный компонент + props.
- **high**: faq: 418 локальных секций, shared ratio 10% — кандидат на параметризованный компонент + props.
- **high**: lead-form: 337 локальных секций, shared ratio 9% — кандидат на параметризованный компонент + props.
- **high**: contact-cta: 258 локальных секций, shared ratio 27% — кандидат на параметризованный компонент + props.
- **high**: body-preamble: 169 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high**: related-links: 108 локальных секций, shared ratio 25% — кандидат на параметризованный компонент + props.
- **high**: hero: 90 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium**: cause-matrix: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium**: decision-tree: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium**: related-symptoms: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium**: repair-scope: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.

## Команды digest/source compression

```bash
npm run ai:digest
npm run check:ai-digest
npm run analyze:source-complexity
npm run check:source-complexity
```
