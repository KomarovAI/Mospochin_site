# Cluster Digest — household-dryers

Машинная сводка кластера для AI-правок. Registry: `data/cluster-registry.json`. Контракт страниц: `data/dryer-cluster-pages.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | household-dryers |
| Pages | 17 |
| Guide | — |
| Screenshot manifest | data/dryer-screenshot-audit.json |
| Guard commands | npm run check:dryer-cluster |


## Pages

| Page | Intent/type | Branch | Digest |
| --- | --- | --- | --- |
| sushilnye-mashiny.html | hub | — | .ai/digest/pages/sushilnye-mashiny.md |
| diagnostika-sushilnoy-mashiny.html | service | — | .ai/digest/pages/diagnostika-sushilnoy-mashiny.md |
| sushilnaya-mashina-ne-sushit.html | symptom | — | .ai/digest/pages/sushilnaya-mashina-ne-sushit.md |
| sushilnaya-mashina-dolgo-sushit.html | symptom | — | .ai/digest/pages/sushilnaya-mashina-dolgo-sushit.md |
| sushilnaya-mashina-ne-greet.html | symptom | — | .ai/digest/pages/sushilnaya-mashina-ne-greet.md |
| ne-krutitsya-baraban-sushilnoy-mashiny.html | symptom | — | .ai/digest/pages/ne-krutitsya-baraban-sushilnoy-mashiny.md |
| sushilnaya-mashina-ne-vklyuchaetsya.html | symptom | — | .ai/digest/pages/sushilnaya-mashina-ne-vklyuchaetsya.md |
| sushilnaya-mashina-ne-zapuskaetsya.html | symptom | — | .ai/digest/pages/sushilnaya-mashina-ne-zapuskaetsya.md |
| sushilnaya-mashina-ostanavlivaetsya-v-cikle.html | symptom | — | .ai/digest/pages/sushilnaya-mashina-ostanavlivaetsya-v-cikle.md |
| sushilnaya-mashina-shumit-i-skripit.html | symptom | — | .ai/digest/pages/sushilnaya-mashina-shumit-i-skripit.md |
| techet-sushilnaya-mashina.html | symptom | — | .ai/digest/pages/techet-sushilnaya-mashina.md |
| sushilnaya-mashina-ne-sobiraet-kondensat.html | symptom | — | .ai/digest/pages/sushilnaya-mashina-ne-sobiraet-kondensat.md |
| ne-rabotaet-teplovoy-nasos-sushilnoy-mashiny.html | service | — | .ai/digest/pages/ne-rabotaet-teplovoy-nasos-sushilnoy-mashiny.md |
| zamena-remnya-sushilnoy-mashiny.html | service | — | .ai/digest/pages/zamena-remnya-sushilnoy-mashiny.md |
| remont-ventilyatora-sushilnoy-mashiny.html | service | — | .ai/digest/pages/remont-ventilyatora-sushilnoy-mashiny.md |
| remont-nagreva-sushilnoy-mashiny.html | service | — | .ai/digest/pages/remont-nagreva-sushilnoy-mashiny.md |
| chistka-teploobmennika-i-vozdushnogo-trakta-sushilnoy-mashiny.html | service | — | .ai/digest/pages/chistka-teploobmennika-i-vozdushnogo-trakta-sushilnoy-mashiny.md |


## AI editing rules

- Определяй роль и поисковый интент страницы до добавления нового текста или URL.
- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.
- Не дублируй общий технический текст между symptom/error/brand/service страницами.
- После source-правок обнови production output и generated AI layer.

## Mandatory checks

```bash
npm run check:dryer-cluster
npm run check:core
npm run check:ai
```
