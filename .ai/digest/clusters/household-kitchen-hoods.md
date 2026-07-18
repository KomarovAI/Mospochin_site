# Cluster Digest — household-kitchen-hoods

Машинная сводка кластера для AI-правок. Registry: `data/cluster-registry.json`. Контракт страниц: `data/hood-cluster-pages.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | household-kitchen-hoods |
| Pages | 15 |
| Guide | — |
| Screenshot manifest | data/hood-screenshot-audit.json |
| Guard commands | npm run check:hood-cluster |


## Pages

| Page | Intent/type | Branch | Digest |
| --- | --- | --- | --- |
| kuhonnye-vytyazhki.html | hub | — | .ai/digest/pages/kuhonnye-vytyazhki.md |
| diagnostika-kuhonnoy-vytyazhki.html | service | — | .ai/digest/pages/diagnostika-kuhonnoy-vytyazhki.md |
| kuhonnaya-vytyazhka-ne-vklyuchaetsya.html | symptom | — | .ai/digest/pages/kuhonnaya-vytyazhka-ne-vklyuchaetsya.md |
| kuhonnaya-vytyazhka-ploho-tyanet.html | symptom | — | .ai/digest/pages/kuhonnaya-vytyazhka-ploho-tyanet.md |
| kuhonnaya-vytyazhka-shumit.html | symptom | — | .ai/digest/pages/kuhonnaya-vytyazhka-shumit.md |
| kuhonnaya-vytyazhka-vibriruet.html | symptom | — | .ai/digest/pages/kuhonnaya-vytyazhka-vibriruet.md |
| kuhonnaya-vytyazhka-ne-pereklyuchaet-skorosti.html | symptom | — | .ai/digest/pages/kuhonnaya-vytyazhka-ne-pereklyuchaet-skorosti.md |
| ne-rabotaet-sensor-kuhonnoy-vytyazhki.html | symptom | — | .ai/digest/pages/ne-rabotaet-sensor-kuhonnoy-vytyazhki.md |
| ne-rabotaet-podsvetka-kuhonnoy-vytyazhki.html | symptom | — | .ai/digest/pages/ne-rabotaet-podsvetka-kuhonnoy-vytyazhki.md |
| kuhonnaya-vytyazhka-vybivaet-avtomat.html | symptom | — | .ai/digest/pages/kuhonnaya-vytyazhka-vybivaet-avtomat.md |
| remont-dvigatelya-kuhonnoy-vytyazhki.html | service | — | .ai/digest/pages/remont-dvigatelya-kuhonnoy-vytyazhki.md |
| remont-platy-kuhonnoy-vytyazhki.html | service | — | .ai/digest/pages/remont-platy-kuhonnoy-vytyazhki.md |
| remont-knopochnogo-bloka-kuhonnoy-vytyazhki.html | service | — | .ai/digest/pages/remont-knopochnogo-bloka-kuhonnoy-vytyazhki.md |
| zamena-krylchatki-kuhonnoy-vytyazhki.html | service | — | .ai/digest/pages/zamena-krylchatki-kuhonnoy-vytyazhki.md |
| obsluzhivanie-filtrov-kuhonnoy-vytyazhki.html | service | — | .ai/digest/pages/obsluzhivanie-filtrov-kuhonnoy-vytyazhki.md |


## AI editing rules

- Определяй роль и поисковый интент страницы до добавления нового текста или URL.
- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.
- Не дублируй общий технический текст между symptom/error/brand/service страницами.
- После source-правок обнови production output и generated AI layer.

## Mandatory checks

```bash
npm run check:hood-cluster
npm run check:core
npm run check:ai
```
