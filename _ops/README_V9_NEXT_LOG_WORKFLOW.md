# V9 next-log workflow

V9 does not redesign the site. It turns the next mosanalytics archive into decisions.

1. Deploy with V8/V9 safe deploy controller.
2. Run exact event smoke:

```bash
./_ops/postdeploy_exact_event_smoke_v9.sh https://mospochin.ru
```

3. Run daily collection and local review:

```bash
./_ops/artikk_collect_and_review_v9.sh artikk-local ./postdeploy_review_v9
```

4. Open `postdeploy_review_v9/review_v9.md`.

5. Use `direct_budget_gate_v9.csv` before touching Direct budgets or negatives.

The main question for the next log is not “did traffic arrive?” but:

```text
form_start -> form_submit_click -> form_validation_error/form_submit_attempt -> form_submit_success
```


V10 audit patch: form_submit_success and form_submit_error are bridged to /api/track-event via window.mospochinTrackSiteEvent from telegram-form.js.
