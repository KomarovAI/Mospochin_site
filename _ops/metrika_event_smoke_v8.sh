#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-https://mospochin.ru}"

echo "===== ANALYTICS JS GOAL/EVENT CHECK ====="
curl -fsS "$BASE/analytics.js" | grep -E "reachGoal|/api/track-event|form_submit_click|form_validation_error|form_submit_attempt|phone_click|whatsapp_click" >/tmp/mospochin_analytics_goal_check.out
cat /tmp/mospochin_analytics_goal_check.out | sed -n '1,80p'

echo "===== EVENT ENDPOINT SMOKE ====="
SID="smoke_v8_$(date +%s)"
curl -fsS -X POST "$BASE/api/track-event"   -A 'Mozilla/5.0 smoke-test-v8'   -H "Origin: $BASE"   -H "Referer: $BASE/"   -H 'Content-Type: application/json'   --data "{"event":"form_submit_click","page_path":"/index.html","session_id":"$SID","cta_id":"smoke_v8_submit","page_intent":"hub","equipment":"site"}"

echo
echo "SMOKE_SESSION=$SID"
