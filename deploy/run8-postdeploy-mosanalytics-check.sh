#!/usr/bin/env bash
set -euo pipefail

BASE=${BASE:-/var/lib/mosanalytics}
DAY=${DAY:-$(date +%F)}
ZIP="$BASE/reports/mosanalytics_llm_brief_$DAY.zip"

if [ ! -f "$ZIP" ]; then
  echo "Report ZIP not found: $ZIP" >&2
  exit 1
fi

for name in   "llm_funnel_$DAY.csv"   "llm_event_funnel_$DAY.csv"   "llm_cta_performance_$DAY.csv"   "llm_form_friction_$DAY.csv"   "llm_traffic_quality_$DAY.csv"   "llm_page_scorecard_$DAY.csv"   "llm_page_improvement_actions_$DAY.csv"; do
  echo "===== $name ====="
  unzip -p "$ZIP" "$name" || true
  echo
  echo
 done
