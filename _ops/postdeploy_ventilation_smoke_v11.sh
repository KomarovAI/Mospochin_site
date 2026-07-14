#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://mospochin.ru}"
TIMEOUT="${TIMEOUT:-15}"
FAIL=0

PAGES=('/ventilyatsiya-restoranov.html' '/remont-ventilyatsii-restoranov.html' '/obsluzhivanie-ventilyatsii-restoranov.html' '/chistka-ventilyatsii-restoranov.html' '/remont-vytyazhki-restorana.html' '/remont-pritochnoj-ventilyatsii-restorana.html' '/diagnostika-ventilyatsii-restorana.html' '/ventilyatsiya-restorana-ne-tyanet.html' '/vytyazhka-restorana-ne-rabotaet.html' '/dym-na-kuhne-restorana.html' '/zapah-iz-kuhni-v-zal.html' '/shumit-vytyazhka-restorana.html' '/vibriruet-ventilyator-vytyazhki.html' '/avtomatika-ventilyatsii-restorana.html' '/remont-ventilyatora-vytyazhki-restorana.html' '/ventilyator-vytyazhki-ne-vklyuchaetsya.html' '/ventilyator-vytyazhki-vybivaet-avtomat.html')

printf 'BASE_URL=%s
' "$BASE_URL"
printf 'pages=%s
' "${#PAGES[@]}"

echo 'page,http_code,has_canonical,has_h1,has_form,has_cta,has_analytics,has_telegram,status'
for PAGE in "${PAGES[@]}"; do
  URL="$BASE_URL$PAGE"
  BODY="$(mktemp)"
  CODE="$(curl -L -sS --max-time "$TIMEOUT" -o "$BODY" -w '%{http_code}' "$URL" || true)"
  HAS_CANONICAL=0; grep -qi 'rel=["'"'"']canonical["'"'"']' "$BODY" && HAS_CANONICAL=1 || true
  HAS_H1=0; grep -qi '<h1' "$BODY" && HAS_H1=1 || true
  HAS_FORM=0; grep -qi 'data-contact-form' "$BODY" && HAS_FORM=1 || true
  HAS_CTA=0; grep -qi 'data-cta-id' "$BODY" && HAS_CTA=1 || true
  HAS_ANALYTICS=0; grep -qi 'analytics.js' "$BODY" && HAS_ANALYTICS=1 || true
  HAS_TELEGRAM=0; grep -qi 'telegram-form.js' "$BODY" && HAS_TELEGRAM=1 || true
  STATUS=OK
  if [ "$CODE" != "200" ] || [ "$HAS_CANONICAL" != "1" ] || [ "$HAS_H1" != "1" ] || [ "$HAS_FORM" != "1" ] || [ "$HAS_CTA" != "1" ] || [ "$HAS_ANALYTICS" != "1" ] || [ "$HAS_TELEGRAM" != "1" ]; then
    STATUS=FAIL
    FAIL=1
  fi
  printf '%s,%s,%s,%s,%s,%s,%s,%s,%s
' "$PAGE" "$CODE" "$HAS_CANONICAL" "$HAS_H1" "$HAS_FORM" "$HAS_CTA" "$HAS_ANALYTICS" "$HAS_TELEGRAM" "$STATUS"
  rm -f "$BODY"
done

exit "$FAIL"
