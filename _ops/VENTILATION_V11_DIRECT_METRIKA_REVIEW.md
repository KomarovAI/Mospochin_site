# MosPochin V11 — Run 11: Direct / Metrika матрица для вентиляции

Дата: 2026-07-04

## Назначение

Прогон 11 не меняет рекламный аккаунт и не делает Direct API write. Он готовит эксплуатационную матрицу для вентиляционного сегмента V11:

- какие страницы можно рассматривать как рекламные посадочные;
- какие страницы держать только как SEO-support;
- какие события должны появляться после клика;
- какие цели проверить в Метрике;
- какие минус-фразы держать только в review-list;
- когда разрешено масштабирование бюджета.

## Итог

```text
Новых ventilation pages:           52
Direct-ready landing pages:        12
Direct-candidate pages:            4
SEO-support-no-direct pages:       12
Direct matrix rows:                16
Minus review rows:                 40
Metrika goal checklist rows:       11
Budget gate cases:                 6
Direct write performed:            no
Budget raise allowed now:          no
Autostrategy allowed now:          no
```

## Direct-ready посадочные

Initial launch candidates are limited to 12 high-intent pages. Direct-candidate pages are held until query/lead evidence appears. SEO-support pages are not paid landing pages at launch.

## Событийный контракт

Для каждой рекламной посадочной ожидается связка:

```text
query -> adgroup -> landing -> page_view/cta_view -> phone_click|whatsapp_click|form_open|form_start -> form_submit_attempt -> form_submit_success -> lead/CPL/CPA
```

## Метрика

Page-specific goals are not created for 52 pages. Existing event goals are reused and segmented by page_slug/equipment/UTM.

Primary conversion: `form_submit_success`.

Important contact actions: `phone_click`, `whatsapp_click`, `telegram_click`.

Diagnostic/friction events: `form_validation_error`, `form_submit_error`.

## Минус-фразы

Минус-фразы are review-only and must not be applied globally without query->landing->action evidence. The first safe level is adgroup-level review, not account-wide rewrite.

## Budget gate

Do not increase budget and do not switch to conversion autostrategy until the V11 ventilation pages pass event smoke and produce clean `form_submit_success` or confirmed offline leads.

## Files written

```text
_ops/direct_ventilation_matrix_v11.csv
_ops/direct_ventilation_minus_review_v11.csv
_ops/metrika_ventilation_goals_v11.csv
_ops/direct_ventilation_budget_gate_v11.csv
_ops/direct_ventilation_reports_fields_v11.json
```

## External rule references

- Yandex Direct negative keywords: https://yandex.ru/support/direct/ru/keywords/negative-keywords
- Yandex Metrica reachGoal: https://yandex.com/support/metrica/en/objects/reachgoal
- Yandex Direct Maximize Conversions: https://yandex.ru/support/direct/ru/strategies/average-cpa
- Yandex Direct API Reports: https://yandex.ru/dev/direct/doc/ru/reports
