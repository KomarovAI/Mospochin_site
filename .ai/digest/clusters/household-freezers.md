# Cluster Digest — household-freezers

Машинная сводка кластера для AI-правок. Registry: `data/cluster-registry.json`. Контракт страниц: `data/freezer-cluster-pages.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | household-freezers |
| Pages | 15 |
| Guide | — |
| Screenshot manifest | data/freezer-screenshot-audit.json |
| Guard commands | npm run check:freezer-cluster |


## Pages

| Page | Intent/type | Branch | Digest |
| --- | --- | --- | --- |
| morozilniki.html | hub | — | .ai/digest/pages/morozilniki.md |
| remont-morozilnyh-larey.html | service | — | .ai/digest/pages/remont-morozilnyh-larey.md |
| diagnostika-morozilnika.html | service | — | .ai/digest/pages/diagnostika-morozilnika.md |
| morozilka-ne-morozit.html | symptom | — | .ai/digest/pages/morozilka-ne-morozit.md |
| morozilnik-slabo-morozit.html | symptom | — | .ai/digest/pages/morozilnik-slabo-morozit.md |
| morozilnik-rabotaet-bez-ostanovki.html | symptom | — | .ai/digest/pages/morozilnik-rabotaet-bez-ostanovki.md |
| morozilnik-namerzaet-led.html | symptom | — | .ai/digest/pages/morozilnik-namerzaet-led.md |
| techet-voda-iz-morozilnika.html | symptom | — | .ai/digest/pages/techet-voda-iz-morozilnika.md |
| morozilnik-shumit-i-gudit.html | symptom | — | .ai/digest/pages/morozilnik-shumit-i-gudit.md |
| morozilnik-ne-vklyuchaetsya.html | symptom | — | .ai/digest/pages/morozilnik-ne-vklyuchaetsya.md |
| morozilnik-peremorazhivaet.html | symptom | — | .ai/digest/pages/morozilnik-peremorazhivaet.md |
| dver-morozilnika-ne-zakryvaetsya.html | symptom | — | .ai/digest/pages/dver-morozilnika-ne-zakryvaetsya.md |
| remont-sistemy-ottaiki-morozilnika.html | service | — | .ai/digest/pages/remont-sistemy-ottaiki-morozilnika.md |
| zamena-kompressora-morozilnika.html | service | — | .ai/digest/pages/zamena-kompressora-morozilnika.md |
| poisk-utechki-i-zapravka-morozilnika.html | service | — | .ai/digest/pages/poisk-utechki-i-zapravka-morozilnika.md |


## AI editing rules

- Определяй роль и поисковый интент страницы до добавления нового текста или URL.
- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.
- Не дублируй общий технический текст между symptom/error/brand/service страницами.
- После source-правок обнови production output и generated AI layer.

## Mandatory checks

```bash
npm run check:freezer-cluster
npm run check:core
npm run check:ai
```
