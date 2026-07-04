# MosPochin V8 — шаблон разбора логов после выкладки

Дата выкладки: ________  
ZIP: mospochin_site_REBASED_V8_static_deploy_NOFONTS_2026-07-04.zip  
Окно анализа: первые 24–72 часа после deploy

## 1. Технический PASS

- [ ] `analytics.js` HTTP 200
- [ ] `analytics.js` содержит `/api/track-event`
- [ ] `analytics.js` содержит `reachGoal`
- [ ] `/api/track-event` отвечает `{"ok":true}` на smoke
- [ ] `site_events.jsonl` растёт
- [ ] `site_event_rejects.jsonl` не растёт аномально
- [ ] LLM ZIP содержит `llm_event_funnel`, `llm_cta_performance`, `llm_form_friction`

## 2. Главная таблица принятия решений

| Условие | Вывод | Следующий фикс |
|---|---|---|
| `cta_view > 0`, `cta_click = 0` | CTA видят, но не нажимают | переписать CTA/первый экран/контраст кнопок |
| `cta_click > 0`, `form_open = 0` | кликают не в форму или не работает open | проверить form-open UI и sticky CTA |
| `form_open > 0`, `form_start = 0` | форму открывают, но не начинают | укоротить форму, убрать лишние поля |
| `form_start > 0`, `form_submit_click = 0` | бросают до кнопки | сделать короткий телефон-only form + WhatsApp fallback |
| `form_submit_click > 0`, `form_validation_error > 0` | validation блокирует | исправить phone/consent/error текст |
| `form_submit_attempt > 0`, `form_submit_success = 0` | submit дошёл, но lead не создан | backend/Telegram/direct_leads check |
| `phone_click/whatsapp_click > 0` | есть микроконверсии | не отключать landing, даже если форм нет |

## 3. По страницам

Отдельно смотреть:

```text
/
/parokonvektomaty.html
/uslugi.html
/pishevarochnye-kotly.html
/microwaves.html
```

## 4. По Директу

Не применять минус-фразы автоматом. По каждому query смотреть:

```text
query -> landing -> cta_view -> cta_click -> form_open -> form_start -> submit/action
```

Если запрос информационный и не даёт action, сначала в список гипотез, потом ручная проверка.
