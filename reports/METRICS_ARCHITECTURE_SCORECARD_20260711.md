# Metrics Architecture / Page Improvement Scorecard

Дата: 2026-07-11  
Контур: архив MosPochin, сайт + Telegram API + artikk clean aggregates

## Итог

Контур метрик встроен в единую архитектуру сайта. Теперь каждая production-страница имеет:

- `data-page-*` контекст: intent, equipment, service, commercial segment;
- стабильный `data-page-version`, рассчитанный как content hash без самого поля версии;
- единый `page_view` в backend event stream;
- CTA/form identity (`data-cta-id`, `data-cta-group`, `data-block`);
- связь с `direct_leads` и Direct query → landing mismatch.

Историческая проблема из переданного ТЗ была не в отсутствии логирования как такового, а в отсутствии decision layer: при `cta_view` без действий нельзя было сравнить страницы и получить следующий шаг. Теперь это делает scorecard.

## Новая цепочка

```text
production page
  -> analytics.js /api/track-event
  -> redacted site_events.jsonl
  -> artikk sync: events + rejects + direct_leads + page context
  -> clean aggregator
  -> page scorecard + improvement actions
```

В LLM-слой не переносятся сырые события, nginx-логи, телефон, имя, проблема, IP или полный user-agent.

## Файлы решения

- `data/metrics-event-contract.json` — имена событий, поля, privacy и ожидаемые выходы;
- `data/metrics-page-context.json` — карта всех 114 рабочих HTML-страниц;
- `data/metrics-scorecard-policy.json` — пороги и P0/P1/P2/P3 policy;
- `ops/mosanalytics/bin/mosanalytics-events-aggregate.py` — clean aggregation;
- `ops/mosanalytics/bin/mospochin-metrics-sync.sh` — единый sync runtime-логов и контекста;
- `llm_page_scorecard_YYYY-MM-DD.csv` — полный срез по страницам;
- `llm_page_improvement_actions_YYYY-MM-DD.csv` — очередь конкретных улучшений.

## Логика приоритета

| Приоритет | Сигнал | Действие |
| --- | --- | --- |
| P0 | Есть попытки формы, но нет успеха/доставка ломается | Проверить форму, API, Telegram и `direct_leads` |
| P1 | Есть просмотры, но CTA не виден или не даёт действий | Улучшить первый экран, CTA, релевантность и trust |
| P2 | Есть старт формы, но просадка внутри UX | Проверить поля, ошибки, блокировки и подсказки |
| P3 | Мало clean-сессий либо всё работает | Не делать вывод по шуму; наблюдать |

Порог по умолчанию: 5 clean-сессий для actionable-решения и 30 для высокой confidence. Настройки вынесены из кода в policy JSON.

## Проверки

- архитектура: 115 root HTML = 115 source models = 115 builder pages, pending 0;
- metrics markup: 114 страниц, 652 CTA, 183 формы;
- `page_view` API smoke: PASS, row содержит `page_version`, `page_path`, page intent и только hash/redacted идентификаторы;
- local metrics smoke: все 11 агрегатных файлов создаются, scorecard поднимает тестовую страницу в P1;
- handoff: PASS;
- doctor: 109/109 страниц PASS;
- npm audit: 0 vulnerabilities.

## Что сделать на production

1. Выложить архив и перезапустить backend только в рамках обычного deploy процесса, потому что изменён `server/telegram-api.mjs`.
2. Установить `mospochin-metrics-sync.sh` на artikk и задать `SITE_SSH_ALIAS` вне архива.
3. Перед daily aggregate синхронизировать `metrics-page-context.json` и `metrics-scorecard-policy.json`.
4. После накопления данных смотреть сначала `llm_page_improvement_actions_YYYY-MM-DD.csv`, а затем подтверждать решение полной строкой scorecard.

Production deployment из этой рабочей сессии не выполнялся.

## Следующий архитектурный транш, уже включённый в пакет

- `page:create`, `page:edit`, `page:check` — единый lifecycle для AI/operator работы;
- `check:generated-diff` — CI guard против изменения root HTML без source/data/runtime-слоя;
- `/api/track-outcome` — token-protected server-to-server приём `qualified_lead`, `call_answered`, `repair_order_created`;
- scorecard теперь выводит `qualified_leads`, `calls_answered`, `repair_orders`, `qualified_lead_rate` и `repair_order_rate`;
- doctor/inspect теперь показывают `src/pages/<slug>` как основной edit surface.
- bot-filtering блокирует Googlebot/headless/webdriver до записи accepted event; это закреплено отдельным `smoke:metrics-bots`.

Остаточный долг: 15 ресторанных lead-form вариантов пока остаются локальными из-за отличий состава полей и copy. Общий runtime-контракт формы уже единый; их вынос в variant-based parametric component — следующий отдельный транш, чтобы не потерять intent-specific поля.
