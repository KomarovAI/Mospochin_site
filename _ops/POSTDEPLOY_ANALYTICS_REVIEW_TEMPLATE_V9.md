# Post-deploy analytics review V9

Date:
Deploy artifact:
Reviewer:

## 1. Technical PASS

- [ ] analytics.js HTTP 200
- [ ] /api/track-event returns {"ok":true}
- [ ] site_events.jsonl grows after smoke
- [ ] site_event_rejects.jsonl not growing abnormally
- [ ] LLM ZIP contains event aggregate files

## 2. Core numbers

| Metric | Value |
|---|---:|
| sessions_total | |
| sessions_yandex | |
| yandex_hits | |
| direct_clicks_total | |
| direct_cost_total | |
| events_total | |
| human_decision_events | |
| rejects_total | |
| leads_total | |

## 3. Form break diagnosis

| Event | Count | Meaning |
|---|---:|---|
| form_open | | User opened form |
| form_start | | User started typing |
| form_submit_click | | User clicked submit |
| form_validation_error | | Browser/site validation blocked submit |
| form_submit_attempt | | Submit reached handler |
| form_submit_success | | Online lead |

Decision:

- form_start > 0 and submit_click = 0 → user drops before button.
- submit_click > 0 and validation_error > 0 → fix form fields/consent/phone.
- submit_attempt > 0 and success = 0 → debug backend/Telegram.
- success > 0 → compute CPL/CPA.

## 4. Direct query review

| Query | Campaign | Landing | Action | Decision |
|---|---|---|---|---|
| | | | | |

## 5. Site changes for next iteration

1.
2.
3.


V10 audit patch: form_submit_success and form_submit_error are bridged to /api/track-event via window.mospochinTrackSiteEvent from telegram-form.js.
