#!/usr/bin/env bash
set -euo pipefail
SSH_ALIAS="${1:-artikk-local}"
echo '===== ARTIKK DAILY RUN CHECK V6 ====='
ssh "$SSH_ALIAS" 'bash -lc "
set -euo pipefail
/opt/mosanalytics/bin/mosanalytics-daily-run </dev/null
DAY=\$(date +%F)
ZIP=/var/lib/mosanalytics/reports/mosanalytics_llm_brief_\$DAY.zip

echo ===== ZIP LIST =====
unzip -l \"\$ZIP\" | grep -E \"llm_event_funnel|llm_cta_performance|llm_form_friction|llm_traffic_quality|llm_query_landing_actions|llm_events_manifest\"

echo ===== EVENT FUNNEL =====
unzip -p \"\$ZIP\" \"llm_event_funnel_\$DAY.csv\" || true

echo ===== CTA PERFORMANCE =====
unzip -p \"\$ZIP\" \"llm_cta_performance_\$DAY.csv\" || true

echo ===== FORM FRICTION =====
unzip -p \"\$ZIP\" \"llm_form_friction_\$DAY.csv\" || true

echo ===== REJECTS =====
unzip -p \"\$ZIP\" \"llm_rejected_events_summary_\$DAY.csv\" || true
"'
echo 'PASS artikk daily run check command completed'
