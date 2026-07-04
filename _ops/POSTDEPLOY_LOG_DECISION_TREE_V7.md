# POSTDEPLOY LOG DECISION TREE V7

## Main expected change
Before deploy the observed break was:

```text
form_start > 0
form_submit_attempt = 0
form_submit_success = 0
```

After V7 deploy the logs must show at least one more diagnostic signal:

```text
form_submit_click
form_validation_error
form_submit_attempt
form_submit_success
```

## Interpretations

### A. form_start > 0, form_submit_click = 0
User starts the form but leaves before pressing submit.

Next site fix:
- shorten the first form again;
- move WhatsApp fallback closer;
- add sticky phone/WhatsApp CTA;
- inspect mobile layout.

### B. form_submit_click > 0, form_validation_error > 0
User presses submit but browser/site validation blocks the form.

Next site fix:
- simplify required fields;
- make consent text clearer;
- check phone mask;
- surface validation message above the button.

### C. form_submit_attempt > 0, form_submit_success = 0
Frontend reached submit handler but backend/form delivery failed.

Next backend fix:
- inspect `/api/send-telegram`;
- inspect Telegram/Brevo handler;
- inspect direct_leads.jsonl and site_events payload.

### D. form_submit_success > 0, direct_leads.jsonl = 0
Frontend success is not mirrored in backend/offline lead log.

Next analytics fix:
- inspect lead logger;
- verify attribution persistence;
- verify yclid/utm/referrer fields in submitted lead.
