# Cluster Digest — household-wine-cabinets

Машинная сводка кластера для AI-правок. Registry: `data/cluster-registry.json`. Контракт страниц: `data/wine-cabinet-cluster-pages.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | household-wine-cabinets |
| Pages | 15 |
| Guide | — |
| Screenshot manifest | data/wine-cabinet-screenshot-audit.json |
| Guard commands | npm run check:wine-cabinet-cluster |


## Pages

| Page | Intent/type | Branch | Digest |
| --- | --- | --- | --- |
| vinnye-shkafy.html | hub | — | .ai/digest/pages/vinnye-shkafy.md |
| diagnostika-vinnogo-shkafa.html | service | — | .ai/digest/pages/diagnostika-vinnogo-shkafa.md |
| remont-vstroennyh-vinnyh-shkafov.html | service | — | .ai/digest/pages/remont-vstroennyh-vinnyh-shkafov.md |
| vinnyy-shkaf-ne-ohlazhdaet.html | symptom | — | .ai/digest/pages/vinnyy-shkaf-ne-ohlazhdaet.md |
| vinnyy-shkaf-ne-derzhit-temperaturu.html | symptom | — | .ai/digest/pages/vinnyy-shkaf-ne-derzhit-temperaturu.md |
| ne-rabotaet-odna-zona-vinnogo-shkafa.html | symptom | — | .ai/digest/pages/ne-rabotaet-odna-zona-vinnogo-shkafa.md |
| vinnyy-shkaf-peremorazhivaet.html | symptom | — | .ai/digest/pages/vinnyy-shkaf-peremorazhivaet.md |
| kondensat-v-vinnom-shkafu.html | symptom | — | .ai/digest/pages/kondensat-v-vinnom-shkafu.md |
| vinnyy-shkaf-shumit.html | symptom | — | .ai/digest/pages/vinnyy-shkaf-shumit.md |
| vinnyy-shkaf-ne-vklyuchaetsya.html | symptom | — | .ai/digest/pages/vinnyy-shkaf-ne-vklyuchaetsya.md |
| vinnyy-shkaf-rabotaet-bez-ostanovki.html | symptom | — | .ai/digest/pages/vinnyy-shkaf-rabotaet-bez-ostanovki.md |
| ne-rabotaet-ventilyator-vinnogo-shkafa.html | service | — | .ai/digest/pages/ne-rabotaet-ventilyator-vinnogo-shkafa.md |
| remont-datchika-temperatury-vinnogo-shkafa.html | service | — | .ai/digest/pages/remont-datchika-temperatury-vinnogo-shkafa.md |
| remont-platy-vinnogo-shkafa.html | service | — | .ai/digest/pages/remont-platy-vinnogo-shkafa.md |
| poisk-utechki-i-zapravka-vinnogo-shkafa.html | service | — | .ai/digest/pages/poisk-utechki-i-zapravka-vinnogo-shkafa.md |


## AI editing rules

- Определяй роль и поисковый интент страницы до добавления нового текста или URL.
- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.
- Не дублируй общий технический текст между symptom/error/brand/service страницами.
- После source-правок обнови production output и generated AI layer.

## Mandatory checks

```bash
npm run check:wine-cabinet-cluster
npm run check:core
npm run check:ai
```
