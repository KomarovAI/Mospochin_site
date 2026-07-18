# Cluster Digest — cooking-appliance

Машинная сводка кластера для AI-правок. Registry: `data/cluster-registry.json`. Контракт страниц: `data/cooking-appliance-hub-pages.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | cooking-appliance |
| Pages | 28 |
| Guide | — |
| Screenshot manifest | data/cooking-appliance-screenshot-audit.json |
| Guard commands | npm run check:cooking-appliance-hub |


## Pages

| Page | Intent/type | Branch | Digest |
| --- | --- | --- | --- |
| plity.html | hub | — | .ai/digest/pages/plity.md |
| remont-duhovyh-shkafov.html | hub | — | .ai/digest/pages/remont-duhovyh-shkafov.md |
| remont-elektricheskih-varochnyh-paneley.html | hub | — | .ai/digest/pages/remont-elektricheskih-varochnyh-paneley.md |
| remont-indukcionnyh-varochnyh-paneley.html | hub | — | .ai/digest/pages/remont-indukcionnyh-varochnyh-paneley.md |
| diagnostika-duhovogo-shkafa.html | diagnostic | — | .ai/digest/pages/diagnostika-duhovogo-shkafa.md |
| duhovka-ne-greet.html | symptom | — | .ai/digest/pages/duhovka-ne-greet.md |
| duhovka-neravnomerno-pechet.html | symptom | — | .ai/digest/pages/duhovka-neravnomerno-pechet.md |
| ne-rabotaet-konvekciya-duhovki.html | symptom | — | .ai/digest/pages/ne-rabotaet-konvekciya-duhovki.md |
| ne-rabotaet-gril-duhovki.html | symptom | — | .ai/digest/pages/ne-rabotaet-gril-duhovki.md |
| duhovka-ne-vklyuchaetsya.html | symptom | — | .ai/digest/pages/duhovka-ne-vklyuchaetsya.md |
| duhovka-vybivaet-avtomat.html | symptom | — | .ai/digest/pages/duhovka-vybivaet-avtomat.md |
| duhovka-peregrevaetsya.html | symptom | — | .ai/digest/pages/duhovka-peregrevaetsya.md |
| dver-duhovki-ne-zakryvaetsya.html | symptom | — | .ai/digest/pages/dver-duhovki-ne-zakryvaetsya.md |
| zamena-tena-duhovki.html | service | — | .ai/digest/pages/zamena-tena-duhovki.md |
| remont-ventilyatora-duhovki.html | service | — | .ai/digest/pages/remont-ventilyatora-duhovki.md |
| diagnostika-elektricheskoy-varochnoy-paneli.html | diagnostic | — | .ai/digest/pages/diagnostika-elektricheskoy-varochnoy-paneli.md |
| ne-rabotaet-konforka-elektricheskoy-paneli.html | symptom | — | .ai/digest/pages/ne-rabotaet-konforka-elektricheskoy-paneli.md |
| konforka-postoyanno-greet.html | symptom | — | .ai/digest/pages/konforka-postoyanno-greet.md |
| elektricheskaya-varochnaya-panel-ne-vklyuchaetsya.html | symptom | — | .ai/digest/pages/elektricheskaya-varochnaya-panel-ne-vklyuchaetsya.md |
| ne-rabotaet-sensor-elektricheskoy-paneli.html | symptom | — | .ai/digest/pages/ne-rabotaet-sensor-elektricheskoy-paneli.md |
| elektricheskaya-panel-vybivaet-avtomat.html | symptom | — | .ai/digest/pages/elektricheskaya-panel-vybivaet-avtomat.md |
| tresnula-steklokeramika-varochnoy-paneli.html | symptom | — | .ai/digest/pages/tresnula-steklokeramika-varochnoy-paneli.md |
| diagnostika-indukcionnoy-varochnoy-paneli.html | diagnostic | — | .ai/digest/pages/diagnostika-indukcionnoy-varochnoy-paneli.md |
| indukcionnaya-panel-ne-vidit-posudu.html | symptom | — | .ai/digest/pages/indukcionnaya-panel-ne-vidit-posudu.md |
| ne-rabotaet-odna-zona-indukcionnoy-paneli.html | symptom | — | .ai/digest/pages/ne-rabotaet-odna-zona-indukcionnoy-paneli.md |
| indukcionnaya-panel-vklyuchaetsya-i-vyklyuchaetsya.html | symptom | — | .ai/digest/pages/indukcionnaya-panel-vklyuchaetsya-i-vyklyuchaetsya.md |
| oshibka-na-indukcionnoy-paneli.html | symptom | — | .ai/digest/pages/oshibka-na-indukcionnoy-paneli.md |
| remont-silovogo-modulya-indukcionnoy-paneli.html | service | — | .ai/digest/pages/remont-silovogo-modulya-indukcionnoy-paneli.md |


## AI editing rules

- Определяй роль и поисковый интент страницы до добавления нового текста или URL.
- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.
- Не дублируй общий технический текст между symptom/error/brand/service страницами.
- После source-правок обнови production output и generated AI layer.

## Mandatory checks

```bash
npm run check:cooking-appliance-hub
npm run check:core
npm run check:ai
```
