# Cluster Digest — household-dishwasher

Машинная сводка кластера для AI-правок. Registry: `data/cluster-registry.json`. Контракт страниц: `data/household-dishwasher-cluster-pages.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | household-dishwasher |
| Pages | 29 |
| Guide | — |
| Screenshot manifest | data/household-dishwasher-screenshot-audit.json |
| Guard commands | npm run check:household-dishwasher-cluster |


## Pages

| Page | Intent/type | Branch | Digest |
| --- | --- | --- | --- |
| posudomoyki.html | — | — | .ai/digest/pages/posudomoyki.md |
| diagnostika-posudomoechnoy-mashiny.html | — | — | .ai/digest/pages/diagnostika-posudomoechnoy-mashiny.md |
| posudomoechnaya-mashina-ne-slivaet-vodu.html | — | — | .ai/digest/pages/posudomoechnaya-mashina-ne-slivaet-vodu.md |
| posudomoechnaya-mashina-ploho-moet-posudu.html | — | — | .ai/digest/pages/posudomoechnaya-mashina-ploho-moet-posudu.md |
| posudomoechnaya-mashina-techet.html | — | — | .ai/digest/pages/posudomoechnaya-mashina-techet.md |
| posudomoechnaya-mashina-ne-nabiraet-vodu.html | — | — | .ai/digest/pages/posudomoechnaya-mashina-ne-nabiraet-vodu.md |
| posudomoechnaya-mashina-ne-greet-vodu.html | — | — | .ai/digest/pages/posudomoechnaya-mashina-ne-greet-vodu.md |
| posudomoechnaya-mashina-ne-sushit-posudu.html | — | — | .ai/digest/pages/posudomoechnaya-mashina-ne-sushit-posudu.md |
| posudomoechnaya-mashina-ne-vklyuchaetsya.html | — | — | .ai/digest/pages/posudomoechnaya-mashina-ne-vklyuchaetsya.md |
| posudomoechnaya-mashina-ne-zapuskaet-cikl.html | — | — | .ai/digest/pages/posudomoechnaya-mashina-ne-zapuskaet-cikl.md |
| posudomoechnaya-mashina-ostanavlivaetsya-v-cikle.html | — | — | .ai/digest/pages/posudomoechnaya-mashina-ostanavlivaetsya-v-cikle.md |
| posudomoechnaya-mashina-vybivaet-avtomat.html | — | — | .ai/digest/pages/posudomoechnaya-mashina-vybivaet-avtomat.md |
| zamena-slivnogo-nasosa-posudomoechnoy-mashiny.html | — | — | .ai/digest/pages/zamena-slivnogo-nasosa-posudomoechnoy-mashiny.md |
| remont-cirkulyacionnogo-nasosa-posudomoechnoy-mashiny.html | — | — | .ai/digest/pages/remont-cirkulyacionnogo-nasosa-posudomoechnoy-mashiny.md |
| remont-nagreva-posudomoechnoy-mashiny.html | — | — | .ai/digest/pages/remont-nagreva-posudomoechnoy-mashiny.md |
| posudomoechnaya-mashina-postoyanno-slivaet-vodu.html | symptom | — | .ai/digest/pages/posudomoechnaya-mashina-postoyanno-slivaet-vodu.md |
| srabotal-aquastop-posudomoechnoy-mashiny.html | symptom | — | .ai/digest/pages/srabotal-aquastop-posudomoechnoy-mashiny.md |
| posudomoechnaya-mashina-ne-rastvoryaet-tabletku.html | symptom | — | .ai/digest/pages/posudomoechnaya-mashina-ne-rastvoryaet-tabletku.md |
| ne-otkryvaetsya-dozator-posudomoechnoy-mashiny.html | symptom | — | .ai/digest/pages/ne-otkryvaetsya-dozator-posudomoechnoy-mashiny.md |
| ne-vrashchayutsya-razbryzgivateli-posudomoechnoy-mashiny.html | symptom | — | .ai/digest/pages/ne-vrashchayutsya-razbryzgivateli-posudomoechnoy-mashiny.md |
| belyy-nalet-posle-posudomoechnoy-mashiny.html | symptom | — | .ai/digest/pages/belyy-nalet-posle-posudomoechnoy-mashiny.md |
| pena-v-posudomoechnoy-mashine.html | symptom | — | .ai/digest/pages/pena-v-posudomoechnoy-mashine.md |
| posudomoechnaya-mashina-shumit.html | symptom | — | .ai/digest/pages/posudomoechnaya-mashina-shumit.md |
| dver-posudomoechnoy-mashiny-ne-zakryvaetsya.html | symptom | — | .ai/digest/pages/dver-posudomoechnoy-mashiny-ne-zakryvaetsya.md |
| zamena-zalivnogo-klapana-posudomoechnoy-mashiny.html | service | — | .ai/digest/pages/zamena-zalivnogo-klapana-posudomoechnoy-mashiny.md |
| remont-zamka-posudomoechnoy-mashiny.html | service | — | .ai/digest/pages/remont-zamka-posudomoechnoy-mashiny.md |
| remont-dozatora-posudomoechnoy-mashiny.html | service | — | .ai/digest/pages/remont-dozatora-posudomoechnoy-mashiny.md |
| remont-datchika-urovnya-posudomoechnoy-mashiny.html | service | — | .ai/digest/pages/remont-datchika-urovnya-posudomoechnoy-mashiny.md |
| remont-platy-posudomoechnoy-mashiny.html | service | — | .ai/digest/pages/remont-platy-posudomoechnoy-mashiny.md |


## AI editing rules

- Определяй роль и поисковый интент страницы до добавления нового текста или URL.
- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.
- Не дублируй общий технический текст между symptom/error/brand/service страницами.
- После source-правок обнови production output и generated AI layer.

## Mandatory checks

```bash
npm run check:household-dishwasher-cluster
npm run check:core
npm run check:ai
```
