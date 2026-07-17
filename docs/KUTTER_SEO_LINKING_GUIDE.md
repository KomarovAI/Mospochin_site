# KUTTER SEO AND INTERNAL LINKING GUIDE

## Source of truth

- Pages and status: `data/kutter-cluster-pages.json`
- Actual/planned graph: `data/kutter-link-graph.json`
- Generated audit: `reports/kutter-seo-cluster-audit.json`
- Human summary: `reports/kutter-seo-cluster-audit.md`

## Rules

1. Published graph edges are generated from normal crawlable `<a href>` links in production HTML.
2. Planned nodes and edges may remain for K7/K8, but cannot be marked published before the page exists.
3. Every published indexable page except the hub must have at least three unique incoming cluster links.
4. Maximum depth from `kuttery-dlya-restoranov.html` is two clicks.
5. Organic pages do not link to Direct/noindex landing pages.
6. Anchors describe the destination symptom or equipment family; generic “Подробнее” links are not used in the cluster graph.
7. FAQ questions, title, description, H1 and diagnostic paths must remain unique.
8. Model-specific technical claims require registered evidence IDs.

## Commands

```bash
npm run generate:kutter-link-graph
npm run report:kutter-seo
npm run audit:kutter-seo
```

Both generated files are checked by core and handoff profiles.
