# MosPochin — V11.1 Visual Fix RUN34 Production Readiness

Дата: 2026-07-04  
База: V11.1 RUN33, собранный поверх V11 Ventilation Run19 `FINAL_WITH_RUN19_FORM_DIAG`  
Тип прогона: дополнительный production-readiness слой без изменения URL/canonical/sitemap/API

## Что добавлено в RUN34

1. Добавлен глобальный mobile H1 hardening для всех restaurant-страниц: `body.branch-restaurant h1...` теперь перекрывает старый utility-блок `.text-3xl/.text-4xl/.text-5xl { overflow-wrap:anywhere; }`.
2. Убраны последние остаточные `anywhere`-wrap на mobile H1 старых hub/info страниц: `uslugi.html` и `contact.html`.
3. Для `uslugi.html` и `contact.html` добавлен отдельный mobile `clamp()` по H1, чтобы заголовок не распирал первый экран.
4. Повторно прогнан static gate: HTML/forms/tracking/JSON-LD/links/assets/NOFONTS/translit/sitemap.
5. Подготовлен новый deploy ZIP RUN34.

## Static gate RUN34

```json
{
  "root_html": 115,
  "total_files": 318,
  "forms_total": 131,
  "forms_with_tracking": 131,
  "pages_with_data_page_slug": 115,
  "pages_with_analytics_js": 115,
  "pages_with_telegram_form_js": 114,
  "cta_elements_total": 2867,
  "cta_ids_unique": 2829,
  "cta_duplicate_groups": 5,
  "jsonld_scripts_total": 307,
  "invalid_jsonld_total": 0,
  "broken_internal_links": 0,
  "broken_anchor_links": 0,
  "missing_non_font_assets": 0,
  "font_binaries": 0,
  "visible_translit_hits": 0,
  "css_patch_present": true,
  "sitemap_urls": 110,
  "v11_ventilation_pages_from_metadata": 52,
  "v11_ventilation_urls_in_sitemap": 52
}
```

## CSS guard RUN34

```json
{
  "run": "Run34 production-readiness polish",
  "run34_patch_present": true,
  "run34_patch_after_old_anywhere_rule": true,
  "global_mobile_h1_normal_rule_present": true,
  "uslugi_contact_h1_clamp_present": true,
  "expected_mobile_h1_overflow_wrap_after_cascade": {
    "index.html": "normal",
    "uslugi.html": "normal",
    "ventilyatsiya-restoranov.html": "normal",
    "obsluzhivanie-ventilyatsii-restoranov.html": "normal",
    "chistka-ventilyatsii-restoranov.html": "normal",
    "diagnostika-ventilyatsii-restorana.html": "normal",
    "dym-na-kuhne-restorana.html": "normal",
    "avtomatika-ventilyatsii-restorana.html": "normal",
    "contact.html": "normal"
  },
  "status": "PASS"
}
```

## Важный нюанс по browser smoke

RUN33 уже содержит реальный browser visual smoke со скринами и contact sheet. В RUN34 изменение точечное и CSS-only. Повторный Chromium-прогон в текущем sandbox был заблокирован managed policy `URLBlocklist`, поэтому RUN34 подтверждён статическим CSS-cascade guard + полным static gate. На production после выкладки нужно прогнать внешний browser smoke по тем же 9 страницам.

## Ограничения

- URL не менялись.
- Canonical/OG/sitemap не переписывались.
- JS/forms/API не менялись.
- Tracking attributes не удалялись.
- NOFONTS сохранён.
- Унаследованные 5 duplicate CTA groups не трогались, они остаются review-note старого слоя.

## Итог

RUN34 — самый свежий deploy-кандидат V11.1 Visual Fix: он включает все правки RUN33 и дополнительное укрепление mobile H1 для старых страниц, где browser smoke ещё показывал остаточный `overflow-wrap:anywhere`.
