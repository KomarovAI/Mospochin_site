#!/usr/bin/env bash
set -euo pipefail

# Pull only redacted/hash-only site logs and the page context required by the
# scorecard. Credentials and SSH aliases stay outside the archive.
BASE=${MOS_BASE:-/var/lib/mosanalytics}
SITE_SSH_ALIAS=${SITE_SSH_ALIAS:-}
SITE_LOG_ROOT=${SITE_LOG_ROOT:-/var/log/mospochin}
SITE_CONTEXT_DIR=${MOS_SITE_CONTEXT_DIR:-/opt/mosanalytics/site-context}
ALLOW_MISSING=${MOS_ALLOW_MISSING:-1}

if [[ -z "$SITE_SSH_ALIAS" ]]; then
  echo "SITE_SSH_ALIAS is required, for example SITE_SSH_ALIAS=mospochin-site" >&2
  exit 2
fi

mkdir -p "$BASE/raw/events" "$BASE/raw/leads" "$BASE/raw/context"

sync_remote() {
  local remote_path="$1"
  local local_path="$2"
  if rsync -avz --ignore-missing-args \
    "$SITE_SSH_ALIAS:$SITE_LOG_ROOT/$remote_path" \
    "$BASE/$local_path"; then
    return 0
  fi
  if [[ "$ALLOW_MISSING" == "1" ]]; then
    echo "WARN: missing remote log ignored: $remote_path" >&2
    return 0
  fi
  return 1
}

sync_remote site_events.jsonl raw/events/site_events.jsonl
sync_remote site_event_rejects.jsonl raw/events/site_event_rejects.jsonl
sync_remote direct_leads.jsonl raw/leads/direct_leads.jsonl

for name in metrics-page-context.json metrics-scorecard-policy.json; do
  source_path="$SITE_CONTEXT_DIR/$name"
  if [[ -f "$source_path" ]]; then
    install -m 0644 "$source_path" "$BASE/raw/context/$name"
  elif [[ "$ALLOW_MISSING" != "1" ]]; then
    echo "Missing scorecard context: $source_path" >&2
    exit 1
  else
    echo "WARN: scorecard context not found: $source_path" >&2
  fi
done

echo "Metrics sync complete: base=$BASE"
