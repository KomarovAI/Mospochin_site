# AI-CONTEXT — compatibility stub

Этот файл оставлен только для обратной совместимости старых AI-команд и ссылок.

## Актуальный маршрут

Новая точка входа:

```text
docs/AI_START_HERE.md
```

Дальше использовать:

```text
AGENTS.md
docs/DOC_INDEX.md
data/project-map.generated.json
data/file-ownership.json
.ai/digest/pages/*.md
```

## Быстрый workflow

```bash
npm run ai:route -- --task content --page <file.html>
npm run check:core
```

Если менялись generated/AI-артефакты:

```bash
npm run sync:generated
npm run check:handoff
```

## Source of truth

Править source/data слой, а не root HTML напрямую:

```text
src/pages/<slug>/page.json
src/pages/<slug>/sections/*.html
src/components/shared/*
src/components/parametric/*/*.template.html
content/components/*/*.json
data/page-metadata.json
data/direct-landing-pages.json
content/faq/*
```

Generated/не править руками:

```text
root *.html
sitemap.xml
.deploy/include-files.txt
data/ai-project-index.json
data/ai-component-map.json
data/project-map.generated.json
.ai/digest/*
reports/source-complexity.*
content/faq/page-faq-registry.json
```

## Почему файл короткий

Подробный старый контекст был схлопнут, чтобы следующая нейронка не читала устаревшие маршруты. Актуальная карта проекта теперь машинная: `data/project-map.generated.json`.
