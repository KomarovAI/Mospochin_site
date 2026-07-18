# Cluster Digest — microwaves

Машинная сводка кластера для AI-правок. Registry: `data/cluster-registry.json`. Контракт страниц: `data/microwave-cluster-pages.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | microwaves |
| Pages | 15 |
| Guide | docs/archive/MICROWAVE_CLUSTER_AI_GUIDE.md |
| Screenshot manifest | data/microwave-screenshot-audit.json |
| Guard commands | npm run check:microwave-cluster |


## Pages

| Page | Intent/type | Branch | Digest |
| --- | --- | --- | --- |
| microwaves.html | hub | — | .ai/digest/pages/microwaves.md |
| remont-vstroennyh-mikrovolnovok.html | service | — | .ai/digest/pages/remont-vstroennyh-mikrovolnovok.md |
| diagnostika-mikrovolnovoy-pechi.html | diagnostic | — | .ai/digest/pages/diagnostika-mikrovolnovoy-pechi.md |
| mikrovolnovka-ne-greet.html | symptom | — | .ai/digest/pages/mikrovolnovka-ne-greet.md |
| mikrovolnovka-iskrit-i-treshchit.html | symptom | — | .ai/digest/pages/mikrovolnovka-iskrit-i-treshchit.md |
| mikrovolnovka-ne-vklyuchaetsya.html | symptom | — | .ai/digest/pages/mikrovolnovka-ne-vklyuchaetsya.md |
| mikrovolnovka-ne-zapuskaetsya.html | symptom | — | .ai/digest/pages/mikrovolnovka-ne-zapuskaetsya.md |
| ne-krutitsya-tarelka-v-mikrovolnovke.html | symptom | — | .ai/digest/pages/ne-krutitsya-tarelka-v-mikrovolnovke.md |
| mikrovolnovka-shumit-i-gudit.html | symptom | — | .ai/digest/pages/mikrovolnovka-shumit-i-gudit.md |
| ne-rabotayut-knopki-mikrovolnovki.html | symptom | — | .ai/digest/pages/ne-rabotayut-knopki-mikrovolnovki.md |
| dvertsa-mikrovolnovki-ne-zakryvaetsya.html | symptom | — | .ai/digest/pages/dvertsa-mikrovolnovki-ne-zakryvaetsya.md |
| mikrovolnovka-vybivaet-avtomat.html | symptom | — | .ai/digest/pages/mikrovolnovka-vybivaet-avtomat.md |
| zamena-slyudy-v-mikrovolnovke.html | service | — | .ai/digest/pages/zamena-slyudy-v-mikrovolnovke.md |
| zamena-magnetrona-mikrovolnovki.html | service | — | .ai/digest/pages/zamena-magnetrona-mikrovolnovki.md |
| zamena-dvigatelya-poddona-mikrovolnovki.html | service | — | .ai/digest/pages/zamena-dvigatelya-poddona-mikrovolnovki.md |


## AI editing rules

- Определяй роль и поисковый интент страницы до добавления нового текста или URL.
- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.
- Не дублируй общий технический текст между symptom/error/brand/service страницами.
- После source-правок обнови production output и generated AI layer.

## Mandatory checks

```bash
npm run check:microwave-cluster
npm run check:core
npm run check:ai
```
