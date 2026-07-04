#!/usr/bin/env bash
set -euo pipefail
SSH_ALIAS="${1:-artikk-local}"
PATTERN="${2:-smoke_v7}"
echo '===== ARTIKK SMOKE TAIL V7 ====='
echo "ssh_alias=$SSH_ALIAS pattern=$PATTERN"
ssh "$SSH_ALIAS" "bash -lc 'set -euo pipefail
  /opt/mosanalytics/bin/mossitesync >/tmp/mossitesync_smoke_v7.out 2>&1 || true
  echo ===== mossitesync tail =====
  tail -n 40 /tmp/mossitesync_smoke_v7.out || true
  echo ===== event matches =====
  grep -F \"$PATTERN\" /var/lib/mosanalytics/raw/events/site_events.jsonl | tail -20 || true
  echo ===== rejects matches =====
  grep -F \"$PATTERN\" /var/lib/mosanalytics/raw/events/site_event_rejects.jsonl | tail -20 || true
'"
