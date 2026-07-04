# Post-deploy log decision tree — V6

## Green tracking baseline
- `site_events.jsonl` grows after real traffic.
- `site_event_rejects.jsonl` does not grow abnormally.
- `llm_event_funnel_*.csv` remains in the LLM ZIP.
- `llm_cta_performance_*.csv` contains stable `cta_id` values.

## If `form_start > 0` and `form_submit_click = 0`
The user starts typing but does not press submit. Improve UI friction: shorter hero form, clearer button text, stronger WhatsApp fallback, mobile sticky CTA, fewer required fields.

## If `form_submit_click > 0` and `form_validation_error > 0`
The submit button is pressed but validation blocks progress. Check phone mask, consent checkbox, honeypot false positives, required fields and mobile keyboard behavior.

## If `form_submit_attempt > 0` and `form_submit_success = 0`
Frontend lets submit through, but backend/form handler fails. Check `/api/send-telegram`, Telegram handler, rate limit, server logs and lead log permissions.

## If `form_submit_success > 0` and `direct_leads.jsonl = 0`
Frontend success is not reflected in backend lead logs. Check direct_leads write path, attribution payload, redaction/quality filter and logger permissions.

## If `phone_click`/`whatsapp_click` appear but no forms
Do not treat as failure. These are micro-conversions for B2B urgent repair. Keep them separated in Metrika and LLM brief.
