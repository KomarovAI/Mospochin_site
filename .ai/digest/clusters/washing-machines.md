# Cluster Digest — washing-machines

Машинная сводка кластера для AI-правок. Registry: `data/cluster-registry.json`. Контракт страниц: `data/washing-machine-cluster-pages.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | washing-machines |
| Pages | 28 |
| Guide | — |
| Screenshot manifest | data/washing-machine-screenshot-audit.json |
| Guard commands | npm run check:washing-machine-cluster |


## Pages

| Page | Intent/type | Branch | Digest |
| --- | --- | --- | --- |
| stiralnye-mashiny.html | hub | — | .ai/digest/pages/stiralnye-mashiny.md |
| diagnostika-stiralnoy-mashiny.html | diagnostic | — | .ai/digest/pages/diagnostika-stiralnoy-mashiny.md |
| stiralnaya-mashina-ne-slivaet-vodu.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-ne-slivaet-vodu.md |
| stiralnaya-mashina-ne-otzhimaet.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-ne-otzhimaet.md |
| stiralnaya-mashina-techet.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-techet.md |
| stiralnaya-mashina-shumit-pri-otzhime.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-shumit-pri-otzhime.md |
| stiralnaya-mashina-prygaet-i-vibriruet.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-prygaet-i-vibriruet.md |
| stiralnaya-mashina-ne-vklyuchaetsya.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-ne-vklyuchaetsya.md |
| stiralnaya-mashina-ne-nabiraet-vodu.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-ne-nabiraet-vodu.md |
| stiralnaya-mashina-ne-greet-vodu.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-ne-greet-vodu.md |
| ne-krutitsya-baraban-stiralnoy-mashiny.html | symptom | — | .ai/digest/pages/ne-krutitsya-baraban-stiralnoy-mashiny.md |
| zamena-slivnogo-nasosa-stiralnoy-mashiny.html | service | — | .ai/digest/pages/zamena-slivnogo-nasosa-stiralnoy-mashiny.md |
| zamena-tena-stiralnoy-mashiny.html | service | — | .ai/digest/pages/zamena-tena-stiralnoy-mashiny.md |
| zamena-podshipnikov-stiralnoy-mashiny.html | service | — | .ai/digest/pages/zamena-podshipnikov-stiralnoy-mashiny.md |
| stiralnaya-mashina-ne-otkryvaetsya.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-ne-otkryvaetsya.md |
| stiralnaya-mashina-ostanavlivaetsya-vo-vremya-stirki.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-ostanavlivaetsya-vo-vremya-stirki.md |
| stiralnaya-mashina-dolgo-stiraet.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-dolgo-stiraet.md |
| stiralnaya-mashina-nabiraet-i-srazu-slivaet-vodu.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-nabiraet-i-srazu-slivaet-vodu.md |
| voda-ostaetsya-v-barabane-stiralnoy-mashiny.html | symptom | — | .ai/digest/pages/voda-ostaetsya-v-barabane-stiralnoy-mashiny.md |
| stiralnaya-mashina-vybivaet-avtomat.html | symptom | — | .ai/digest/pages/stiralnaya-mashina-vybivaet-avtomat.md |
| zamena-manzhety-lyuka-stiralnoy-mashiny.html | service | — | .ai/digest/pages/zamena-manzhety-lyuka-stiralnoy-mashiny.md |
| remont-blokirovki-lyuka-stiralnoy-mashiny.html | service | — | .ai/digest/pages/remont-blokirovki-lyuka-stiralnoy-mashiny.md |
| zamena-amortizatorov-stiralnoy-mashiny.html | service | — | .ai/digest/pages/zamena-amortizatorov-stiralnoy-mashiny.md |
| zamena-remnya-stiralnoy-mashiny.html | service | — | .ai/digest/pages/zamena-remnya-stiralnoy-mashiny.md |
| zamena-zalivnogo-klapana-stiralnoy-mashiny.html | service | — | .ai/digest/pages/zamena-zalivnogo-klapana-stiralnoy-mashiny.md |
| remont-dvigatelya-stiralnoy-mashiny.html | service | — | .ai/digest/pages/remont-dvigatelya-stiralnoy-mashiny.md |
| remont-platy-stiralnoy-mashiny.html | service | — | .ai/digest/pages/remont-platy-stiralnoy-mashiny.md |
| izvlechenie-postoronnego-predmeta-iz-stiralnoy-mashiny.html | service | — | .ai/digest/pages/izvlechenie-postoronnego-predmeta-iz-stiralnoy-mashiny.md |


## AI editing rules

- Определяй роль и поисковый интент страницы до добавления нового текста или URL.
- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.
- Не дублируй общий технический текст между symptom/error/brand/service страницами.
- После source-правок обнови production output и generated AI layer.

## Mandatory checks

```bash
npm run check:washing-machine-cluster
npm run check:core
npm run check:ai
```
