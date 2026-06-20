# MosPochin metrics archive — final TZ compliance audit

Date: 2026-06-20
Archive basis: `mospochin_metrics_run5_technical_audit_cleanup_20260620.zip`
Result archive: `mospochin_metrics_run6_final_tz_compliance_20260620.zip`

## Verdict

PASS. The final archive matches the implementation TZ for archive-only work:

- production-only analytics guard is present;
- `yclid` / `utm_*` attribution is persisted;
- client session ID exists and backend logs only hashes;
- contact/form/CTA events are implemented;
- `/api/track-event` exists;
- accepted and rejected JSONL logs are defined;
- anti-bot / bad-origin / rate-limit / duplicate-suppression layers are present;
- sensitive contact values are redacted before writing event logs;
- page intent and CTA metadata are present in HTML and source pages;
- artikk aggregation script emits clean LLM decision CSVs;
- generated/build checks pass;
- no safe unused assets were removed because the unused-assets audit reported `safeDelete=0`.

## TZ compliance matrix

| TZ requirement | Status | Evidence in archive |
|---|---:|---|
| Production-only guard | PASS | `analytics.js` defines `MOSPOCHIN_ANALYTICS_ENABLED`, production hosts `mospochin.ru` / `www.mospochin.ru`, and blocks localhost/dev/preview hosts. |
| `yclid` / `utm_*` persistence | PASS | `analytics.js` stores `mospochin_attribution_v1` with `yclid`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_service`, `utm_landing`, `utm_geo`. |
| Session ID without PII | PASS | `analytics.js` stores `mospochin_session_v1`; backend writes `session_id_hash`. |
| Metrika JavaScript goals | PASS | `data/metrics-event-contract.json` and `analytics.js` define snake_case event goals without forbidden symbols. |
| Contact events | PASS | `phone_click`, `whatsapp_click`, `telegram_click`, `email_click` are supported. |
| Form events | PASS | `form_open`, `form_start`, `form_submit_attempt`, `form_submit_success`, `form_submit_error`, `form_validation_error`, `form_submit_blocked` are supported. |
| CTA visibility | PASS | `analytics.js` uses `IntersectionObserver`, 0.5 threshold, 900ms delay, and emits `cta_view`; contact clicks emit `cta_click`. |
| `/api/track-event` backend | PASS | `server/telegram-api.mjs` handles `POST /api/track-event`. |
| Accepted event log | PASS | default path: `/var/log/mospochin/site_events.jsonl`. |
| Rejected event log | PASS | corrected to TZ path: `/var/log/mospochin/site_event_rejects.jsonl`. |
| Lead log | PASS | `/var/log/mospochin/direct_leads.jsonl` remains present. |
| No open phone/name/IP in analytics event logs | PASS | backend writes hashes and redacted contact hints; `audit:metrics-clean` passes. |
| Bot/internal/test filtering | PASS | frontend checks `navigator.webdriver`, automation UA, `event.isTrusted`; backend checks bot-like UA, bad origin, and rate limits. |
| Clean decision quality | PASS | aggregator defaults to `quality=human_candidate` and `is_decision_event=true`. |
| Page intent tags | PASS | 62/62 non-404 root HTML pages have required body context attributes. |
| CTA metadata | PASS | 466 elements have `data-cta-id`; 79 forms are tracked. |
| LLM decision outputs | PASS | aggregator writes `llm_event_funnel`, `llm_query_landing_actions`, `llm_cta_performance`, `llm_form_friction`, `llm_traffic_quality`, `llm_landing_mismatch`, `llm_offline_conversions`, `llm_rejected_events_summary`, and manifest. |
| Direct query linkage | PASS | aggregator supports Direct search-query TSV and query-intent / landing-mismatch outputs. |
| No stale metrics run artifacts | PASS | run1/run2/run3/run4 metric handoff leftovers removed/renamed; only current final audit and stable ops docs remain. |
| No unsafe asset pruning | PASS | `audit-unused-assets` reported `safeDelete=0`; no assets were deleted. |

## Checks executed

```text
node --check analytics.js
node --check telegram-form.js
node --check server/telegram-api.mjs
node --check tools/check-metrics-contract.mjs
node --check tools/check-metrics-markup.mjs
node --check tools/metrics-local-smoke.mjs
node --check tools/audit-metrics-clean.mjs
node --check tools/generate-direct-landings.mjs
python3 -m py_compile ops/mosanalytics/bin/mosanalytics-events-aggregate.py
npm run verify:metrics
npm run verify:fast
npm run lint
npm run predeploy:check
npm audit --audit-level=moderate
unzip -t
```

All checks passed. `npm audit --audit-level=moderate` returned `found 0 vulnerabilities`.

## Important cleanup performed during final TZ audit

1. Rejected-event log naming was aligned with the TZ:
   - before: `site_events_rejected.jsonl`
   - after: `site_event_rejects.jsonl`

2. Old run-specific ops doc was renamed to stable ops documentation:
   - before: `ops/mosanalytics/README_run2_events_aggregates.md`
   - after: `ops/mosanalytics/README_events_aggregates.md`

3. Existing metrics clean audit remains enforced via:

```bash
npm run audit:metrics-clean
npm run verify:metrics
```

## Known non-blocking notes

- `404.html` intentionally does not carry page-intent context and is excluded from page-context compliance counts.
- Asset audit reports files outside the current reference graph, but `audit-unused-assets` says `safeDelete=0`; therefore no assets were deleted.
- Offline conversion CSV in this archive is an internal draft path; sending offline conversions to Yandex still requires real `yclid` / `ClientID` values, not hashes.
