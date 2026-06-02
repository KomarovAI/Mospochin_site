# Mospochin_site Rules

## Source of truth

Prefer the builder/data layer over root production HTML:

- `src/site-builder.json` and `src/pages/<slug>/page.json` — page structure for indexed HTML pages.
- `src/pages/<slug>/sections/*` — page-local HTML sections.
- `src/components/shared/*` — declarative shared HTML sections reused by pages.
- `src/components/parametric/*/*.template.html` — parameterized component markup.
- `content/components/*/*.json` — page/variant props for parameterized components.
- `content/faq/page-faq-registry.json` and `content/faq/schema/*.json` — generated FAQ registry/schema, update with scripts.
- `data/*.json` — contacts, metadata, service registries, slots, AI indexes.
- `styles-combined.css`, `main.js`, `telegram-form.js`, `analytics.js` — production runtime/style sources.
- `tools/*.mjs` — generators, validators, AI workflow tools.

Root `*.html` files are production output and must match the Static Component Builder. Do not edit them directly unless you also sync the builder source or intentionally bootstrap from root HTML.

## Preferred AI workflow

1. Start with `AI-CONTEXT.md`, `docs/AI_FILE_OWNERSHIP.md`, `.ai/digest/project.md`, and the relevant `.ai/digest/pages/*.md` / `.ai/digest/components/*.md`.
2. Use `npm run ai:workspace -- --task "..."` or `npm run ai:context -- --page <file.html>` for targeted context.
3. Edit the smallest source of truth: data, props, section, shared component, or parametric template.
4. Rebuild generated artifacts with the relevant script.
5. Run `npm run verify` before the final summary when practical.

## Generated / do not edit manually

- Root `*.html` production pages, unless intentionally syncing builder state.
- `sitemap.xml` — use `npm run generate:sitemap`.
- `.deploy/include-files.txt` — use `npm run generate:deploy-manifest`.
- `data/ai-project-index.json` — use `npm run generate:ai-index`.
- `data/ai-component-map.json` — use `npm run generate:ai-component-map`.
- `.ai/digest/*` — use `npm run ai:digest`.
- `reports/source-complexity.*` — use `npm run analyze:source-complexity`.
- `content/faq/page-faq-registry.json` and `content/faq/schema/*.json` — use `npm run generate:faq-registry`.
- responsive/WebP/AVIF derivatives — use image generator scripts.

## Risky zones

- `.github/workflows/*`
- `deploy/*` and `.deploy/*`
- `server/telegram-api.mjs`
- `tools/*.mjs`
- `main.js`, `telegram-form.js`, `analytics.js`
- `styles-combined.css`
- SEO metadata, canonicals, sitemap, FAQ schema, forms and contact flow

Keep changes small and do not reformat unrelated HTML, CSS, JS or JSON.


## Scale policy

Проект зафиксирован в режиме `controlled-growth-to-150-pages`.

- До 100–150 страниц можно расти по текущей builder/source модели.
- Нельзя добавлять страницы копипастой root HTML или ухудшать source-layer.
- После 100 страниц нужно активно сжимать повторяемые блоки через shared/parametric.
- После 125 страниц нужны blueprints для повторяемых семейств.
- После 150 страниц рост заблокирован до отдельного source-compression/blueprint этапа.

Machine-readable contract: `data/ai-scale-policy.json`.
Human-readable contract: `docs/SCALE_POLICY.md`.
Gate command: `npm run guard:scale`.

Если `npm run guard:scale` падает, не отключай проверку: сначала выноси повторяемые секции в shared/parametric или blueprint.

## Validation

Use targeted checks while editing and `npm run verify` before handoff when possible.

Common checks:

```bash
npm run validate:data
npm run validate:site
npm run check:site-builder
npm run check:shared-components
npm run check:parameterized-components
npm run check:faq-registry
npm run ai:check
```

After source-compression or AI-map changes:

```bash
npm run analyze:source-complexity
npm run ai:digest
npm run generate:ai-index
npm run generate:ai-component-map
npm run verify
```

## Static Component Builder rules

- Edit page-local sections in `src/pages/<slug>/sections/*`.
- Edit reused sections in `src/components/shared/*`.
- Edit parameterized component structure in `src/components/parametric/*/*.template.html`.
- Edit parameterized per-page text/props in `content/components/*/*.json`.
- Rebuild root HTML with `npm run build:site -- --page <file.html> --write` or all pages with `npm run build:site -- --write`.
- Check root/build parity with `npm run check:site-builder`.

## Restaurant branch guardrails

- Keep restaurant branch behavior in `main.js` and data registries, not in page-specific JS snippets.
- Keep shared restaurant UI in `data/restaurant-branch.json`, `data/restaurant-page-slots.json`, `data/restaurant-services.json`, shared components, or parametric props.
- `index.html` and `uslugi.html` are routers; preserve page-specific copy on vertical restaurant pages.

## Final handoff

In the final summary, state:

1. What changed.
2. Which files were touched.
3. Which checks passed.
4. What still needs visual/manual review, if anything.
