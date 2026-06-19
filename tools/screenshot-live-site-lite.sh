#!/usr/bin/env bash
set -Eeuo pipefail

BASE_URL="${MOSPOCHIN_SCREENSHOT_BASE_URL:-https://mospochin.ru}"
OUT_DIR="${MOSPOCHIN_VISUAL_OUT_DIR:-reports/live-visual-pack}"
RUN_ID="${MOSPOCHIN_SCREENSHOT_RUN_ID:-${GITHUB_RUN_ID:-}}"
RUN_NUMBER="${MOSPOCHIN_SCREENSHOT_RUN_NUMBER:-${GITHUB_RUN_NUMBER:-}}"
COMMIT_SHA="${MOSPOCHIN_SCREENSHOT_COMMIT:-${GITHUB_SHA:-}}"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR/pages" "$OUT_DIR/llm"

LOG="$OUT_DIR/capture.log"
WARN="$OUT_DIR/llm/llm_visual_warnings.csv"
MANIFEST="$OUT_DIR/manifest.csv"
PLAN_CSV="$OUT_DIR/capture-plan.csv"
PLAN_JSON="$OUT_DIR/capture-plan.json"
PAGES_JSONL="$OUT_DIR/llm/llm_visual_pages.jsonl"
BLOCKS_CSV="$OUT_DIR/llm/llm_visual_blocks.csv"
INDEX_MD="$OUT_DIR/llm_visual_index.md"
SUMMARY_MD="$OUT_DIR/run-summary.md"

echo "type,label,message" > "$WARN"
echo "page_id,path,viewport,part,selector,file,status,x,y,w,h,text" > "$MANIFEST"
echo "page_index,page_id,path,url,class,reason,depth,critical,viewports,parts,status" > "$PLAN_CSV"
echo "page_id,path,viewport,block_id,selector,tag,data_block,role,x,y,w,h,text" > "$BLOCKS_CSV"
: > "$PAGES_JSONL"
: > "$LOG"

chrome_bin=""
for bin in google-chrome google-chrome-stable chromium chromium-browser; do
  if command -v "$bin" >/dev/null 2>&1; then
    chrome_bin="$(command -v "$bin")"
    break
  fi
done

csv_escape() {
  python3 - "$1" <<'PY'
import csv, sys
w = csv.writer(sys.stdout)
w.writerow([sys.argv[1]])
PY
}

json_escape() {
  python3 - "$1" <<'PY'
import json, sys
print(json.dumps(sys.argv[1], ensure_ascii=False))
PY
}

page_id() {
  local p="$1"
  if [ "$p" = "/" ]; then
    echo "index"
  else
    echo "$p" | sed 's#^/##; s#\.html$##; s#[^A-Za-z0-9_-]#-#g; s#--*#-#g; s#^-##; s#-$##'
  fi
}

url_join() {
  local p="$1"
  if [ "$p" = "/" ]; then
    echo "$BASE_URL/"
  else
    echo "${BASE_URL%/}$p"
  fi
}

# Лёгкий post-deploy набор: core + новые коммерческие critical pages.
PAGES=(
  "/"
  "/contact.html"
  "/bytovaya-contact.html"
  "/pishevarochnye-kotly.html"
  "/pishevarochnyj-kotel-abat-kpem.html"
  "/pishevarochnyj-kotel-ne-greet.html"
  "/remont-pishevarochnyh-kotlov-abat.html"
)

VIEWPORT_NAMES=("desktop" "mobile")
VIEWPORT_SIZES=("1440,1200" "390,844")

if [ -z "$chrome_bin" ]; then
  echo "warning,no_chrome,No google-chrome/chromium binary found on runner" >> "$WARN"
  cat > "$SUMMARY_MD" <<MD
# Live Visual Pack Lite

- status: skipped
- reason: no Chrome/Chromium binary found
- base_url: $BASE_URL
- run_id: $RUN_ID
- commit: $COMMIT_SHA
MD
  echo "LIVE_VISUAL_PACK_LITE_SKIPPED_NO_CHROME"
  exit 0
fi

echo "Chrome: $chrome_bin" | tee -a "$LOG"
"$chrome_bin" --version | tee -a "$LOG" || true

echo "# MosPochin Live Visual Pack Lite" > "$INDEX_MD"
echo "" >> "$INDEX_MD"
echo "- generated_at: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$INDEX_MD"
echo "- base_url: $BASE_URL" >> "$INDEX_MD"
echo "- run_id: $RUN_ID" >> "$INDEX_MD"
echo "- run_number: $RUN_NUMBER" >> "$INDEX_MD"
echo "- commit: $COMMIT_SHA" >> "$INDEX_MD"
echo "- mode: chrome-headless-cli-lite" >> "$INDEX_MD"
echo "" >> "$INDEX_MD"
echo "## Pages" >> "$INDEX_MD"
echo "" >> "$INDEX_MD"

manifest_count=0
warning_count=0
page_index=0

json_rows="[]"

for p in "${PAGES[@]}"; do
  pid="$(page_id "$p")"
  url="$(url_join "$p")"
  class="CORE_ALWAYS"
  reason="lite_core_postdeploy"
  depth="lite"
  parts="viewport"
  critical="yes"
  status="planned"

  echo "$page_index,$pid,$p,$url,$class,$reason,$depth,$critical,desktop|mobile,$parts,$status" >> "$PLAN_CSV"
  echo "{\"page_id\":\"$pid\",\"path\":\"$p\",\"url\":\"$url\",\"class\":\"$class\",\"reason\":\"$reason\",\"depth\":\"$depth\",\"viewports\":[\"desktop\",\"mobile\"],\"parts\":[\"viewport\"]}" >> "$PAGES_JSONL"

  page_dir="$OUT_DIR/pages/$(printf "%03d" "$page_index")__${pid}"
  mkdir -p "$page_dir"

  page_md="$page_dir/page.md"
  {
    echo "# $p"
    echo ""
    echo "- url: $url"
    echo "- class: $class"
    echo "- reason: $reason"
    echo "- depth: $depth"
    echo "- mode: chrome-headless-cli-lite"
    echo ""
  } > "$page_md"

  http_code="$(curl -L -s -o /dev/null -w '%{http_code}' "$url" || echo "000")"

  vi=0
  for vp in "${VIEWPORT_NAMES[@]}"; do
    size="${VIEWPORT_SIZES[$vi]}"
    vp_dir="$page_dir/$vp"
    mkdir -p "$vp_dir"
    shot="$vp_dir/viewport.png"
    rel="${shot#$OUT_DIR/}"

    echo "== capture $p $vp $size ==" | tee -a "$LOG"

    set +e
    timeout 25s "$chrome_bin" \
      --headless=new \
      --disable-gpu \
      --no-sandbox \
      --hide-scrollbars \
      --disable-dev-shm-usage \
      --window-size="$size" \
      --virtual-time-budget=2500 \
      --screenshot="$shot" \
      "$url" >> "$LOG" 2>&1
    rc=$?
    set -e

    if [ "$rc" -eq 0 ] && [ -s "$shot" ]; then
      echo "$pid,$p,$vp,viewport,chrome-headless,$rel,ok,0,0,${size%,*},${size#*,},http_$http_code" >> "$MANIFEST"
      manifest_count=$((manifest_count + 1))
      echo "- $vp: $rel" >> "$page_md"
    else
      echo "capture_fail,$p:$vp,chrome rc=$rc http=$http_code" >> "$WARN"
      warning_count=$((warning_count + 1))
      echo "- $vp: capture failed rc=$rc http=$http_code" >> "$page_md"
    fi

    vi=$((vi + 1))
  done

  echo "- $p — $class / $reason / pages/$(printf "%03d" "$page_index")__${pid}/page.md" >> "$INDEX_MD"

  page_index=$((page_index + 1))
done

python3 - <<PY > "$PLAN_JSON"
import json, pathlib, os
rows = []
csv_path = pathlib.Path("$PLAN_CSV")
for line in csv_path.read_text().splitlines()[1:]:
    parts = line.split(",", 10)
    if len(parts) < 11:
        continue
    rows.append({
        "page_index": int(parts[0]),
        "page_id": parts[1],
        "path": parts[2],
        "url": parts[3],
        "class": parts[4],
        "reason": parts[5],
        "depth": parts[6],
        "critical": parts[7] == "yes",
        "viewports": parts[8].split("|"),
        "parts": parts[9].split("|"),
        "status": parts[10]
    })
print(json.dumps({
    "generated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "base_url": "$BASE_URL",
    "mode": "chrome-headless-cli-lite",
    "run_id": "$RUN_ID",
    "run_number": "$RUN_NUMBER",
    "commit": "$COMMIT_SHA",
    "pages_planned": len(rows),
    "rows": rows
}, ensure_ascii=False, indent=2))
PY

cat > "$SUMMARY_MD" <<MD
# Live Visual Pack Lite Run Summary

- generated_at: $(date -u +%Y-%m-%dT%H:%M:%SZ)
- base_url: $BASE_URL
- mode: chrome-headless-cli-lite
- chrome: $chrome_bin
- pages_planned: $page_index
- manifest_rows: $manifest_count
- warnings: $warning_count
- run_id: $RUN_ID
- run_number: $RUN_NUMBER
- commit: $COMMIT_SHA

## Output

- capture-plan.json
- capture-plan.csv
- manifest.csv
- llm_visual_index.md
- llm/llm_visual_pages.jsonl
- llm/llm_visual_blocks.csv
- llm/llm_visual_warnings.csv
- pages/*/*/viewport.png
MD

echo "LIVE_VISUAL_PACK_LITE_OK pages=$page_index manifest=$manifest_count warnings=$warning_count"
