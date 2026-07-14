# Cluster Digest — pishevarochnye-kotly

Машинная сводка кластера для AI-правок. Registry: `data/cluster-registry.json`. Контракт страниц: `data/cooking-kettles-screenshot-audit.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | pishevarochnye-kotly |
| Pages | 28 |
| Guide | docs/PISHEVAROCHNYE_KOTLY_CLUSTER_AI_GUIDE.md |
| Screenshot manifest | data/cooking-kettles-screenshot-audit.json |
| Guard commands | npm run check:core |


## Pages

| Page | Intent/type | Branch | Digest |
| --- | --- | --- | --- |
| pishevarochnye-kotly.html | service | restaurant | .ai/digest/pages/pishevarochnye-kotly.md |
| pishevarochnyj-kotel-ne-greet.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-ne-greet.md |
| pishevarochnyj-kotel-dolgo-greet.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-dolgo-greet.md |
| pishevarochnyj-kotel-techet.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-techet.md |
| pishevarochnyj-kotel-vybivaet-avtomat.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-vybivaet-avtomat.md |
| pishevarochnyj-kotel-ne-vklyuchaetsya.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-ne-vklyuchaetsya.md |
| pishevarochnyj-kotel-kod-oshibki.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-kod-oshibki.md |
| pishevarochnyj-kotel-suhoy-hod.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-suhoy-hod.md |
| pishevarochnyj-kotel-ne-nabiraet-vodu.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-ne-nabiraet-vodu.md |
| pishevarochnyj-kotel-ne-derzhit-davlenie.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-ne-derzhit-davlenie.md |
| pishevarochnyj-kotel-ne-slivaet-vodu.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-ne-slivaet-vodu.md |
| pishevarochnyj-kotel-abat-kpem.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-abat-kpem.md |
| pishevarochnyj-kotel-zamena-tena.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-zamena-tena.md |
| pishevarochnyj-kotel-remont-slivnogo-krana.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-remont-slivnogo-krana.md |
| pishevarochnyj-kotel-parovodyanaya-rubashka.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-parovodyanaya-rubashka.md |
| pishevarochnyj-kotel-datchik-temperatury.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-datchik-temperatury.md |
| pishevarochnyj-kotel-plata-upravleniya.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-plata-upravleniya.md |
| pishevarochnyj-kotel-manometr.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-manometr.md |
| pishevarochnyj-kotel-abat-e01.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-abat-e01.md |
| pishevarochnyj-kotel-abat-e02.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-abat-e02.md |
| pishevarochnyj-kotel-abat-e04.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-abat-e04.md |
| pishevarochnyj-kotel-abat-h20.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-abat-h20.md |
| pishevarochnyj-kotel-abat-e17.html | service | restaurant | .ai/digest/pages/pishevarochnyj-kotel-abat-e17.md |
| remont-pishevarochnyh-kotlov-abat.html | service | restaurant | .ai/digest/pages/remont-pishevarochnyh-kotlov-abat.md |
| remont-pishevarochnyh-kotlov-kpem.html | service | restaurant | .ai/digest/pages/remont-pishevarochnyh-kotlov-kpem.md |
| remont-pishevarochnyh-kotlov-apach.html | service | restaurant | .ai/digest/pages/remont-pishevarochnyh-kotlov-apach.md |
| remont-pishevarochnyh-kotlov-atesy.html | service | restaurant | .ai/digest/pages/remont-pishevarochnyh-kotlov-atesy.md |
| remont-pishevarochnyh-kotlov-iterma.html | service | restaurant | .ai/digest/pages/remont-pishevarochnyh-kotlov-iterma.md |


## AI editing rules

- Определяй роль и поисковый интент страницы до добавления нового текста или URL.
- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.
- Не дублируй общий технический текст между symptom/error/brand/service страницами.
- После source-правок обнови production output и generated AI layer.

## Mandatory checks

```bash
npm run check:core
npm run check:core
npm run check:ai
```
