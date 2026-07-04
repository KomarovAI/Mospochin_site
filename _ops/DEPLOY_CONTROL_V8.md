# MosPochin V8 — deploy control pack

## Использовать

```bash
unzip mospochin_site_REBASED_V8_static_deploy_NOFONTS_2026-07-04.zip -d site
cd site
./_ops/deploy_control_v8.sh . mospochin-site-vps /var/www/mospochin.ru https://mospochin.ru
```

## Почему V8 лучше V7

V7 уже защищал NOFONTS от удаления шрифтов. V8 добавляет слой контроля целей и принятия решений:

- `metrika_goal_map_v8.csv/json` — какие события должны быть отдельными целями.
- `metrika_event_smoke_v8.sh` — проверяет `analytics.js` и отправляет smoke `form_submit_click`.
- `smoke_matrix_v8.csv` — что считать PASS/FAIL на каждом этапе.
- `postdeploy_analytics_review_v8.md` — шаблон разбора логов за 24–72 часа.
- `direct_query_review_matrix_v8.csv` — стартовая матрица запросов из текущего лога.

## Главный критерий после deploy

В следующем LLM ZIP должны появиться события, которые объясняют обрыв после `form_start`:

```text
form_submit_click
form_validation_error
form_submit_attempt
form_submit_success
```

Если они не появляются — проблема в UI/JS или в том, что пользователи бросают форму до кнопки.
