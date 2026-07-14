# Page Improvement Metrics

Этот контур отвечает на операционный вопрос: какую страницу улучшать первой и почему.

## Поток данных

```text
page_view + page_version
  -> cta_view / cta_click / contact_click
  -> form_start / submit_attempt / submit_success|error|blocked
  -> direct_leads
  -> qualified_lead / call_answered / repair_order_created
  -> llm_page_scorecard_YYYY-MM-DD.csv
  -> llm_page_improvement_actions_YYYY-MM-DD.csv
```

Сырые события остаются на стороне сайта и artikk. В LLM-brief попадают только агрегаты без телефона, имени, проблемы, IP и user-agent. `page_version` — короткий content hash страницы; его можно использовать для сравнения до/после правки.

Bot-policy двухуровневая: frontend не отправляет события для `navigator.webdriver`, bot/headless User-Agent; backend повторяет проверку и отвечает `204 X-Mospochin-Metrics: ignored-bot` до записи в `site_events.jsonl`. Такие запросы видны только в redacted reject summary.

Качественные исходы принимает только server-to-server `/api/track-outcome` с `Authorization: Bearer <MOSPOCHIN_OUTCOME_TOKEN>`. Браузерный runtime не имеет доступа к этому токену и не может сам объявить заявку квалифицированной.

На VPS токен задаётся в `/etc/mospochin/telegram.env`; в репозитории хранится только пустой пример переменной.

## Как читать scorecard

- `P0` — есть попытки формы, но заявка не доходит или форма массово блокируется/ошибается. Сначала исправляется технический путь.
- `P1` — страница получает просмотры, но не показывает CTA или не получает действий. Проверяется первый экран, релевантность CTA и разметка.
- `P2` — есть начало воронки, но просадка на форме. Проверяются обязательные поля, подсказки, антиспам и UX.
- `P3` — данных мало либо страница работает приемлемо. Накопить clean-сессии или продолжить наблюдение.

Порог «достаточно данных» задаётся в `data/metrics-scorecard-policy.json`. До этого scorecard не предлагает менять контент только на основании единичного визита.

## Где искать решение

1. `llm_page_improvement_actions_YYYY-MM-DD.csv` — короткая очередь страниц с приоритетом и следующим действием.
2. `llm_page_scorecard_YYYY-MM-DD.csv` — полная воронка по каждой странице, включая `page_intent`, `equipment`, `branch`, `page_version`, clean-сессии и rate-поля.
3. `llm_query_landing_actions_YYYY-MM-DD.csv` и `llm_landing_mismatch_YYYY-MM-DD.csv` — причина входа из Direct и соответствие запроса посадочной странице.

## Регламент изменения страницы

Перед изменением фиксируем строку scorecard и `page_version`. После публикации сравниваем тот же `page_path` и новый `page_version` минимум на сопоставимом объёме clean-сессий. Если трафика мало, решение откладывается, а не делается по шуму.
