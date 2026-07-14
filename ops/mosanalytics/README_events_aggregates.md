# MosPochin Metrics Run2 — artikk clean event aggregates

Дата: 2026-06-20  
Контур: `artikk` / локальная аналитика  
Назначение: подключить события сайта из `site_events.jsonl` к текущему LLM-brief без сырого мусора и PII.

## Что добавлено

```text
ops/mosanalytics/bin/mosanalytics-events-aggregate.py
```

Скрипт читает:

```text
/var/lib/mosanalytics/raw/events/site_events.jsonl
/var/lib/mosanalytics/raw/events/site_event_rejects.jsonl
/var/lib/mosanalytics/raw/leads/direct_leads.jsonl
/var/lib/mosanalytics/raw/direct/direct_search_queries_YYYY-MM-DD_YYYY-MM-DD.tsv
/var/lib/mosanalytics/raw/context/metrics-page-context.json
/var/lib/mosanalytics/raw/context/metrics-scorecard-policy.json
```

И пишет clean-файлы:

```text
/var/lib/mosanalytics/llm_brief/events/llm_event_funnel_YYYY-MM-DD.csv
/var/lib/mosanalytics/llm_brief/events/llm_cta_performance_YYYY-MM-DD.csv
/var/lib/mosanalytics/llm_brief/events/llm_internal_link_funnel_YYYY-MM-DD.csv
/var/lib/mosanalytics/llm_brief/events/llm_form_friction_YYYY-MM-DD.csv
/var/lib/mosanalytics/llm_brief/events/llm_traffic_quality_YYYY-MM-DD.csv
/var/lib/mosanalytics/llm_brief/events/llm_rejected_events_summary_YYYY-MM-DD.csv
/var/lib/mosanalytics/llm_brief/events/llm_offline_conversions_YYYY-MM-DD.csv
/var/lib/mosanalytics/llm_brief/events/llm_query_landing_actions_YYYY-MM-DD.csv
/var/lib/mosanalytics/llm_brief/events/llm_landing_mismatch_YYYY-MM-DD.csv
/var/lib/mosanalytics/llm_brief/events/llm_page_scorecard_YYYY-MM-DD.csv
/var/lib/mosanalytics/llm_brief/events/llm_page_improvement_actions_YYYY-MM-DD.csv
/var/lib/mosanalytics/llm_brief/events/llm_events_manifest_YYYY-MM-DD.json
```

## Главное правило

В LLM-brief не попадают сырые события. Только агрегаты:

```text
page → CTA → form/contact → lead
related category link → next page → next contact/form decision
query → intent → landing → action
traffic source → clean/suspicious/rejected quality
form → friction/error reason
page version → page scorecard → prioritized improvement action
lead_created → qualified_lead → call_answered → repair_order_created
```

## Установка на artikk

```bash
sudo install -m 0755 ops/mosanalytics/bin/mosanalytics-events-aggregate.py \
  /opt/mosanalytics/bin/mosanalytics-events-aggregate.py
```

## Добавить sync новых логов

Для единообразного sync используйте версионируемый скрипт:

```bash
SITE_SSH_ALIAS=mospochin-site \
MOS_SITE_CONTEXT_DIR=/opt/mosanalytics/site-context \
/opt/mosanalytics/bin/mospochin-metrics-sync.sh
```

Он копирует с site VPS только три runtime-лога и не переносит сырые nginx-логи:

```text
/var/log/mospochin/site_events.jsonl
/var/log/mospochin/site_event_rejects.jsonl
```

В локальные пути:

```text
/var/lib/mosanalytics/raw/events/site_events.jsonl
/var/lib/mosanalytics/raw/events/site_event_rejects.jsonl
```

Если скрипт не устанавливается, тот же контракт можно добавить в существующий `/opt/mosanalytics/bin/mossitesync`. Пример rsync-блока:

```bash
mkdir -p "$MOS_BASE/raw/events"
rsync -avz --ignore-missing-args \
  "$SITE_SSH_ALIAS:/var/log/mospochin/site_events.jsonl" \
  "$MOS_BASE/raw/events/site_events.jsonl" || true
rsync -avz --ignore-missing-args \
  "$SITE_SSH_ALIAS:/var/log/mospochin/site_event_rejects.jsonl" \
  "$MOS_BASE/raw/events/site_event_rejects.jsonl" || true
rsync -avz --ignore-missing-args \
  "$SITE_SSH_ALIAS:/var/log/mospochin/direct_leads.jsonl" \
  "$MOS_BASE/raw/leads/direct_leads.jsonl" || true
```

## Запуск вручную

```bash
/opt/mosanalytics/bin/mosanalytics-events-aggregate.py --date "$(date +%F)"
```

Для page scorecard на artikk должны быть доступны контекст страниц и политика порогов:

```bash
mkdir -p /var/lib/mosanalytics/raw/context
rsync -av data/metrics-page-context.json data/metrics-scorecard-policy.json \
  artikk:/var/lib/mosanalytics/raw/context/
```

Если файлы не скопированы, агрегатор всё равно создаст scorecard по наблюдаемым событиям, но без полного списка страниц и без надёжного `page_version`.

Для теста на локальных файлах:

```bash
/opt/mosanalytics/bin/mosanalytics-events-aggregate.py \
  --date 2026-06-20 \
  --base /tmp/mosanalytics-test \
  --out /tmp/mosanalytics-test/llm_brief/events
```

## Подключение к daily pipeline

В `/opt/mosanalytics/bin/mosanalytics-daily-run` после Direct search query report и до сборки LLM brief добавить:

```bash
echo "== EVENTS CLEAN AGGREGATES =="
/opt/mosanalytics/bin/mospochin-metrics-sync.sh
/opt/mosanalytics/bin/mosanalytics-events-aggregate.py --date "$(date +%F)"
```

Дальше `/opt/mosanalytics/bin/mosanalytics-llm-brief.py` должен положить файлы `llm_*` из:

```text
/var/lib/mosanalytics/llm_brief/events/
```

в итоговый:

```text
/var/lib/mosanalytics/reports/mosanalytics_llm_brief_YYYY-MM-DD.zip
```

## Что означают файлы

### `llm_event_funnel_YYYY-MM-DD.csv`

Воронка по страницам:

```csv
date,page_path,page_intent,sessions,cta_view,cta_click,phone_click,whatsapp_click,telegram_click,email_click,form_open,form_start,form_submit_attempt,form_submit_success,form_submit_error,form_validation_error,form_submit_blocked
```

Решения:

```text
низкий cta_view → CTA ниже экрана
высокий cta_view + низкий cta_click → плохой оффер / текст кнопки / доверие
высокий form_start + низкий form_submit_success → проблема формы
```

### `llm_cta_performance_YYYY-MM-DD.csv`

CTR конкретных CTA:

```csv
date,page_path,cta_id,block,views,clicks,ctr,lead_success_after_click
```

### `llm_form_friction_YYYY-MM-DD.csv`

Диагностика формы:

```csv
date,page_path,form_id,opens,starts,attempts,success,errors,blocked,top_error_reason
```

### `llm_traffic_quality_YYYY-MM-DD.csv`

Качество источников:

```csv
date,source,medium,campaign,total_events,clean_events,suspicious_events,unique_clean_sessions,rejected_events
```

### `llm_rejected_events_summary_YYYY-MM-DD.csv`

Почему события отброшены:

```csv
date,reject_reason,count
```

### `llm_query_landing_actions_YYYY-MM-DD.csv`

Связка Direct/search-query и сайта. Если Direct TSV ещё не скопирован, файл всё равно создаётся как event-only fallback.

```csv
date,campaign_id,adgroup_id,query,detected_intent,landing_path,landing_intent,mismatch,clicks,cost,sessions,clean_sessions,cta_view,cta_click,phone_click,whatsapp_click,form_start,form_submit_success,qualified_leads
```

### `llm_landing_mismatch_YYYY-MM-DD.csv`

Факты для ручного review:

```csv
date,query,detected_intent,landing_path,landing_intent,mismatch,clicks,cost,events,leads
```

Скрипт не делает apply в Директе и не меняет сайт. Он только готовит факты.

### `llm_page_scorecard_YYYY-MM-DD.csv`

Единая строка по каждой странице: `page_path`, `page_intent`, `equipment`, `branch`, `page_version`, просмотры, clean-сессии, CTA, форма, лиды, rates, confidence, priority и recommendation.

Дополнительные outcome-поля: `qualified_leads`, `calls_answered`, `repair_orders`, `qualified_lead_rate`, `repair_order_rate`. Они появляются после server-to-server отправки статусов через `/api/track-outcome`.

### `llm_internal_link_funnel_YYYY-MM-DD.csv`

Отдельный срез для перекрёстных ссылок из блока `related_categories`. Для каждой пары «страница-источник → CTA» показывает просмотры, клики, следующий page path и same-session контакт/старт формы в течение 30 минут. Поле `confidence` использует тот же практический порог: `low` до 5 clean-сессий, `medium` от 5, `high` от 30.

### `llm_page_improvement_actions_YYYY-MM-DD.csv`

Короткая очередь страниц с `P0/P1/P2`. Это рабочий список улучшений: сначала технические сбои формы, затем проблемы CTA/релевантности, затем UX формы. Страницы с малым объёмом данных остаются `P3` и не попадают в очередь.

## Важное ограничение по offline conversions

`llm_offline_conversions_YYYY-MM-DD.csv` содержит только хэши и статус `not_sent_hash_only`. Это безопасный internal-файл для LLM/CRM-review.

Для реальной загрузки offline-конверсий в Яндекс.Метрику нужен отдельный защищённый контур с raw `yclid` или `ClientID`, потому что Метрика не сможет связать конверсию по хэшу.

## Проверка после подключения

```bash
sudo -u artikk /opt/mosanalytics/bin/mosanalytics-events-aggregate.py --date "$(date +%F)"
ls -lh /var/lib/mosanalytics/llm_brief/events/
sed -n '1,20p' /var/lib/mosanalytics/llm_brief/events/llm_event_funnel_$(date +%F).csv
```

Критерий PASS:

```text
site_events.jsonl синкается
site_event_rejects.jsonl синкается
llm_event_funnel создаётся
llm_cta_performance создаётся
llm_internal_link_funnel создаётся
llm_form_friction создаётся
llm_traffic_quality создаётся
сырые события не попадают в LLM zip
PII не появляется в CSV
```
