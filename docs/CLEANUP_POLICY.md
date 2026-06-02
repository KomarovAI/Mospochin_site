# Cleanup Policy

Цель этого файла — не дать проекту снова зарасти одноразовыми скриптами и устаревшими командами.

## Что считается live source

- `src/site-builder.json`
- `src/pages/**`
- `src/components/shared/**`
- `src/components/parametric/**`
- `content/components/**`
- `content/faq/**`
- `data/**`
- `server/**`
- `tools/*.mjs`, которые подключены в `package.json` или используются валидаторами/генераторами
- root `*.html`, `main.js`, `telegram-form.js`, `analytics.js`, `styles-combined.css` как production output/runtime

## Что не добавлять обратно

Не возвращать одноразовые HTML-оптимизаторы, которые мутируют root HTML напрямую:

- `tools/optimize-html.mjs`
- `tools/optimize-site.mjs`
- `tools/optimize-all.mjs`
- `tools/normalize-html.mjs`
- `tools/build-partials.mjs`
- ad-hoc Python scripts для ручной чистки отдельных страниц

Для структурных правок использовать builder/source layer:

```bash
npm run build:site -- --page <file.html> --write
npm run check:site-builder
npm run verify
```

## Как чистить безопасно

1. Удалять только файлы, которые не участвуют в live scripts, deploy manifest, validators и builder contracts.
2. После чистки запускать:
   ```bash
   npm run verify:fast
   npm run lint
   npm run audit:assets
   npm audit
   ```
3. Не удалять оригиналы изображений только потому, что страницы используют responsive derivatives: генераторы используют оригиналы как source library.
