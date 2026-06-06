# Cluster Digest — parokonvektomaty

Машинная сводка для AI-редактирования пароконвектоматного кластера. Полные правила: `docs/PAROKONVEKTOMAT_CLUSTER_AI_GUIDE.md`. Контракт проверок: `data/parokonvektomat-conversion-pages.json`.

## Summary

| Metric | Value |
| --- | --- |
| Cluster | parokonvektomaty |
| Pages | 16 |
| Canonical base | https://mospochin.ru/ |
| Default min forms | 1 |
| Default min cluster links | 8 |
| Requires mobile CTA containers | yes |


## Pages

| Page | Intent | Indexable | Branch | Digest |
| --- | --- | --- | --- | --- |
| parokonvektomaty.html | hub | index | restaurant | .ai/digest/pages/parokonvektomaty.md |
| parokonvektomaty-promo.html | promo | noindex | restaurant | .ai/digest/pages/parokonvektomaty-promo.md |
| parokonvektomat-rational.html | brand | index | restaurant | .ai/digest/pages/parokonvektomat-rational.md |
| parokonvektomat-rational-e9.html | error | index | restaurant | .ai/digest/pages/parokonvektomat-rational-e9.md |
| parokonvektomat-unox.html | brand | index | restaurant | .ai/digest/pages/parokonvektomat-unox.md |
| parokonvektomat-unox-af02-af08.html | error | index | restaurant | .ai/digest/pages/parokonvektomat-unox-af02-af08.md |
| parokonvektomat-kod-oshibki.html | error-hub | index | restaurant | .ai/digest/pages/parokonvektomat-kod-oshibki.md |
| parokonvektomat-e02-e07-e10.html | error | index | restaurant | .ai/digest/pages/parokonvektomat-e02-e07-e10.md |
| parokonvektomat-ne-greet.html | symptom | index | restaurant | .ai/digest/pages/parokonvektomat-ne-greet.md |
| parokonvektomat-net-para.html | symptom | index | restaurant | .ai/digest/pages/parokonvektomat-net-para.md |
| parokonvektomat-abat.html | brand | index | neutral | .ai/digest/pages/parokonvektomat-abat.md |
| parokonvektomat-convotherm.html | brand | index | neutral | .ai/digest/pages/parokonvektomat-convotherm.md |
| parokonvektomat-electrolux.html | brand | index | neutral | .ai/digest/pages/parokonvektomat-electrolux.md |
| parokonvektomat-lainox.html | brand | index | neutral | .ai/digest/pages/parokonvektomat-lainox.md |
| parokonvektomat-obschuzhivanie.html | service | index | neutral | .ai/digest/pages/parokonvektomat-obschuzhivanie.md |
| remont-oborudovaniya-restorana-parokonvektomat.html | promo | noindex | restaurant | .ai/digest/pages/remont-oborudovaniya-restorana-parokonvektomat.md |


## Intent groups

- **brand**: parokonvektomat-rational.html, parokonvektomat-unox.html, parokonvektomat-abat.html, parokonvektomat-convotherm.html, parokonvektomat-electrolux.html, parokonvektomat-lainox.html
- **error**: parokonvektomat-rational-e9.html, parokonvektomat-unox-af02-af08.html, parokonvektomat-e02-e07-e10.html
- **error-hub**: parokonvektomat-kod-oshibki.html
- **hub**: parokonvektomaty.html
- **promo**: parokonvektomaty-promo.html, remont-oborudovaniya-restorana-parokonvektomat.html
- **service**: parokonvektomat-obschuzhivanie.html
- **symptom**: parokonvektomat-ne-greet.html, parokonvektomat-net-para.html

## AI editing rules

- Do not create P1/P2 parokonvektomat pages without traffic/conversion data.
- Do not edit direct landing root HTML without syncing `data/direct-landing-pages.json` / generator output.
- Keep promo/noindex pages out of sitemap unless strategy changes.
- Keep forms, phone, WhatsApp, mobile CTA containers, analytics and Telegram form script intact.
- Keep internal links relevant: no self-link, no 404, no blind all-to-all spam.
- For old brand pages marked `neutral`, do not change branch to restaurant until registry/slots migration is done.

## Mandatory checks

```bash
npm run check:conversion-ui
npm run verify:fast
npm run ai:doctor
```
