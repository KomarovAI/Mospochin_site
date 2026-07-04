# MosPochin V11 Ventilation — postdeploy analytics review

## Что смотреть после выкладки

Минимальный набор таблиц/логов:

```text
llm_query_landing_actions_YYYY-MM-DD.csv
llm_event_funnel_YYYY-MM-DD.csv
llm_cta_performance_YYYY-MM-DD.csv
llm_form_friction_YYYY-MM-DD.csv
llm_rejected_events_summary_YYYY-MM-DD.csv
site_events.jsonl
site_event_rejects.jsonl
```

## Gate по вентиляции

1. Есть показы/клики, но нет `page_view` по ventilation landing: проверить Директ URL/UTM/редиректы.
2. Есть `page_view`, но нет `cta_view`: проверить analytics.js и CTA visibility.
3. Есть `cta_view`, но нет `phone_click|whatsapp_click|form_open`: проверять hero/CTA/мобильную видимость.
4. Есть `form_open|form_start`, но нет `form_submit_click`: форма слишком сложная или пользователь не доходит до кнопки.
5. Есть `form_submit_click` и `form_validation_error`: смотреть телефон/consent/валидацию.
6. Есть `form_submit_attempt`, но нет `form_submit_success`: смотреть backend/Telegram/handler.
7. Есть `form_submit_success`: сверить backend lead, считать CPL/CPA.

## Решение по рекламе

Бюджет вентиляции не повышать и автостратегии не включать до подтверждения clean-action событий и реальных лидов. После подтверждения лида можно тестировать +10–15% только на конкретный high-intent adgroup, а не на весь аккаунт.
