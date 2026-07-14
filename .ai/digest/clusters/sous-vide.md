# Cluster Digest — sous-vide

Машинная сводка кластера для AI-правок. Registry: `data/cluster-registry.json`. Контракт страниц: `data/sous-vide-cluster-pages.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | sous-vide |
| Pages | 15 |
| Guide | docs/SOUS_VIDE_CLUSTER_AI_GUIDE.md |
| Screenshot manifest | data/sous-vide-screenshot-audit.json |
| Guard commands | npm run check:conversion-ui, npm run check:visual-contract |


## Pages

| Page | Intent/type | Branch | Digest |
| --- | --- | --- | --- |
| sous-vide-restoranov.html | hub | restaurant | .ai/digest/pages/sous-vide-restoranov.md |
| remont-sous-vide.html | service | restaurant | .ai/digest/pages/remont-sous-vide.md |
| sous-vide-termostaty.html | service | restaurant | .ai/digest/pages/sous-vide-termostaty.md |
| vakuumnye-upakovshiki-dlya-restorana.html | service | restaurant | .ai/digest/pages/vakuumnye-upakovshiki-dlya-restorana.md |
| remont-termostata-sous-vide.html | service | restaurant | .ai/digest/pages/remont-termostata-sous-vide.md |
| remont-vakuumnogo-upakovshika.html | service | restaurant | .ai/digest/pages/remont-vakuumnogo-upakovshika.md |
| obsluzhivanie-sous-vide.html | service | restaurant | .ai/digest/pages/obsluzhivanie-sous-vide.md |
| kak-rabotaet-sous-vide.html | guide | restaurant | .ai/digest/pages/kak-rabotaet-sous-vide.md |
| kak-vybrat-sous-vide-dlya-restorana.html | guide | restaurant | .ai/digest/pages/kak-vybrat-sous-vide-dlya-restorana.md |
| sous-vide-i-vakuumnaya-upakovka.html | guide | restaurant | .ai/digest/pages/sous-vide-i-vakuumnaya-upakovka.md |
| sous-vide-i-shokovoe-okhlazhdenie.html | guide | restaurant | .ai/digest/pages/sous-vide-i-shokovoe-okhlazhdenie.md |
| bezopasnost-sous-vide.html | guide | restaurant | .ai/digest/pages/bezopasnost-sous-vide.md |
| sous-vide-remont-moskva.html | promo | restaurant | .ai/digest/pages/sous-vide-remont-moskva.md |
| remont-termostata-sous-vide-reklama.html | promo | restaurant | .ai/digest/pages/remont-termostata-sous-vide-reklama.md |
| remont-vakuumnogo-upakovshika-reklama.html | promo | restaurant | .ai/digest/pages/remont-vakuumnogo-upakovshika-reklama.md |


## AI editing rules

- Определяй роль и поисковый интент страницы до добавления нового текста или URL.
- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.
- Не дублируй общий технический текст между symptom/error/brand/service страницами.
- После source-правок обнови production output и generated AI layer.

## Mandatory checks

```bash
npm run check:conversion-ui
npm run check:visual-contract
npm run check:core
npm run check:ai
```
