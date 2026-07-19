# Cluster Digest — water-heaters

Машинная сводка кластера для AI-правок. Registry: `data/cluster-registry.json`. Контракт страниц: `data/water-heater-cluster-pages.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | water-heaters |
| Pages | 34 |
| Guide | — |
| Screenshot manifest | data/water-heater-screenshot-audit.json |
| Guard commands | npm run check:water-heater-cluster |


## Pages

| Page | Intent/type | Branch | Digest |
| --- | --- | --- | --- |
| water-heaters.html | hub | — | .ai/digest/pages/water-heaters.md |
| remont-nakopitelnyh-vodonagrevateley.html | type | — | .ai/digest/pages/remont-nakopitelnyh-vodonagrevateley.md |
| remont-protochnyh-vodonagrevateley.html | type | — | .ai/digest/pages/remont-protochnyh-vodonagrevateley.md |
| diagnostika-vodonagrevatelya.html | diagnostic | — | .ai/digest/pages/diagnostika-vodonagrevatelya.md |
| vodonagrevatel-ne-greet-vodu.html | symptom | — | .ai/digest/pages/vodonagrevatel-ne-greet-vodu.md |
| vodonagrevatel-techet.html | symptom | — | .ai/digest/pages/vodonagrevatel-techet.md |
| vodonagrevatel-vybivaet-avtomat.html | symptom | — | .ai/digest/pages/vodonagrevatel-vybivaet-avtomat.md |
| vodonagrevatel-ne-vklyuchaetsya.html | symptom | — | .ai/digest/pages/vodonagrevatel-ne-vklyuchaetsya.md |
| vodonagrevatel-medlenno-greet-vodu.html | symptom | — | .ai/digest/pages/vodonagrevatel-medlenno-greet-vodu.md |
| zamena-tena-vodonagrevatelya.html | service | — | .ai/digest/pages/zamena-tena-vodonagrevatelya.md |
| chistka-vodonagrevatelya-ot-nakipi.html | service | — | .ai/digest/pages/chistka-vodonagrevatelya-ot-nakipi.md |
| podklyuchenie-i-obvyazka-vodonagrevatelya.html | adjacent_service | — | .ai/digest/pages/podklyuchenie-i-obvyazka-vodonagrevatelya.md |
| zamena-predohranitelnogo-klapana-vodonagrevatelya.html | service | — | .ai/digest/pages/zamena-predohranitelnogo-klapana-vodonagrevatelya.md |
| ustanovka-slivnogo-krana-vodonagrevatelya.html | service | — | .ai/digest/pages/ustanovka-slivnogo-krana-vodonagrevatelya.md |
| zamena-zapornogo-krana-vodonagrevatelya.html | service | — | .ai/digest/pages/zamena-zapornogo-krana-vodonagrevatelya.md |
| ustanovka-reduktora-davleniya-dlya-vodonagrevatelya.html | service | — | .ai/digest/pages/ustanovka-reduktora-davleniya-dlya-vodonagrevatelya.md |
| ustanovka-mehanicheskogo-filtra-pered-vodonagrevatelem.html | service | — | .ai/digest/pages/ustanovka-mehanicheskogo-filtra-pered-vodonagrevatelem.md |
| umyagchenie-vody-dlya-vodonagrevatelya.html | advisory_service | — | .ai/digest/pages/umyagchenie-vody-dlya-vodonagrevatelya.md |
| podklyuchenie-vodonagrevatelya-polipropilenom.html | service | — | .ai/digest/pages/podklyuchenie-vodonagrevatelya-polipropilenom.md |
| remont-trehfaznyh-vodonagrevateley-380-400v.html | type_advanced | — | .ai/digest/pages/remont-trehfaznyh-vodonagrevateley-380-400v.md |
| zamena-flantsa-i-prokladki-vodonagrevatelya.html | service | — | .ai/digest/pages/zamena-flantsa-i-prokladki-vodonagrevatelya.md |
| remont-platy-i-elektroniki-vodonagrevatelya.html | service | — | .ai/digest/pages/remont-platy-i-elektroniki-vodonagrevatelya.md |
| zamena-termostata-i-datchika-temperatury-vodonagrevatelya.html | service | — | .ai/digest/pages/zamena-termostata-i-datchika-temperatury-vodonagrevatelya.md |
| ustanovka-rasshiritelnogo-baka-dlya-vodonagrevatelya.html | adjacent_service | — | .ai/digest/pages/ustanovka-rasshiritelnogo-baka-dlya-vodonagrevatelya.md |
| remont-ploskih-dvuhbakovyh-vodonagrevateley.html | type | — | .ai/digest/pages/remont-ploskih-dvuhbakovyh-vodonagrevateley.md |
| korroziya-baka-vodonagrevatelya.html | diagnostic | — | .ai/digest/pages/korroziya-baka-vodonagrevatelya.md |
| case-chistka-boylera-s-silnoy-nakipyu.html | case_study | — | .ai/digest/pages/case-chistka-boylera-s-silnoy-nakipyu.md |
| case-remont-dvuhbakovogo-vodonagrevatelya.html | case_study | — | .ai/digest/pages/case-remont-dvuhbakovogo-vodonagrevatelya.md |
| case-remont-boylera-v-tesnoy-nishe.html | case_study | — | .ai/digest/pages/case-remont-boylera-v-tesnoy-nishe.md |
| case-trehfaznaya-sistema-gvs-chastnogo-doma.html | case_study | — | .ai/digest/pages/case-trehfaznaya-sistema-gvs-chastnogo-doma.md |
| fotografii-remonta-vodonagrevateley.html | visual_hub | — | .ai/digest/pages/fotografii-remonta-vodonagrevateley.md |
| zamena-magnievogo-anoda-vodonagrevatelya.html | service | — | .ai/digest/pages/zamena-magnievogo-anoda-vodonagrevatelya.md |
| vodonagrevatel-shumit-pri-nagreve.html | symptom | — | .ai/digest/pages/vodonagrevatel-shumit-pri-nagreve.md |
| ustanovka-elektricheskogo-vodonagrevatelya.html | installation | — | .ai/digest/pages/ustanovka-elektricheskogo-vodonagrevatelya.md |


## AI editing rules

- Определяй роль и поисковый интент страницы до добавления нового текста или URL.
- Новые страницы должны быть представлены в cluster registry/manifest и иметь релевантную перелинковку.
- Не дублируй общий технический текст между symptom/error/brand/service страницами.
- После source-правок обнови production output и generated AI layer.

## Mandatory checks

```bash
npm run check:water-heater-cluster
npm run check:core
npm run check:ai
```
