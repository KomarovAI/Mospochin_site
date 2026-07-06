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
| Pages | 115 |
| Builder pages | 1 |
| Total sections | 79 |
| src/pages files | 1995 |
| src/pages HTML section files | 1932 |
| Shared component files | 48 |
| Shared refs | 0 |
| Shared coverage | 0.0% |
| Average sections/page | 79.0 |
| Average source files/page | 83.0 |
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
| parokonvektomaty.html | 79 | 79 | 0 |


## Крупнейшие кандидаты на сжатие смысла

- **medium**: raw: 31 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high**: parokonvektomaty.html: 79 секций — кандидат на page blueprint вместо длинного списка sections.
- **high**: parokonvektomaty.html: 31 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.

## Команды digest/source compression

```bash
npm run ai:digest
npm run check:ai-digest
npm run analyze:source-complexity
npm run check:source-complexity
```
