# MosPochin — V11.1 Visual Fix Report + Run33 Browser Smoke

Дата: 2026-07-04  
База: V11 Ventilation Run19 `FINAL_WITH_RUN19_FORM_DIAG`  
Тип прогона: точечный visual polish без изменения URL/canonical/sitemap/API

## Что исправлено

1. Mobile H1 на главной: добавлен CSS override, который убирает агрессивные переносы у крупных H1 и переводит заголовки в нормальный режим (`overflow-wrap: normal`, `word-break: normal`, `text-wrap: balance`, `clamp()` для размера).
2. Mobile hero на ventilation-страницах: добавлен воздух сверху, выровнен rhythm бейджа, H1, текста и CTA.
3. Видимый транслит во внутренних карточках/ссылках: заменён на русские labels без изменения `href`.
4. Hero glass-panel на ventilation-страницах: усилен контраст подложки и текста.
5. CTA на mobile в первом экране ventilation-страниц: усилен размер клика и ширина кнопок.

## Изменённые файлы

- `styles-combined.css`
- HTML-файлы с заменой видимых labels: 60
- Всего заменённых label-span: 328

Подробный список: `_ops/visual_fix_label_changes_v11_1.csv`.  
Карта задач: `_ops/visual_fix_issue_map_v11_1.csv`.  
Список изменённых файлов: `_ops/visual_fix_changed_files_v11_1.txt`.

## Run33 browser visual smoke

Chromium в sandbox сначала блокировал `localhost` из-за managed policy `URLBlocklist: ["*"]`; для локального screenshot pass этот блок был временно снят и после проверки возвращён.

Итог Run33:

```json
{
  "run": "Run33 browser visual smoke",
  "screenshots_png": 21,
  "viewport_screenshots": 18,
  "full_page_screenshots": 3,
  "pages_checked": 9,
  "mobile_pages_checked": 9,
  "desktop_pages_checked": 9,
  "mobile_h1_line_counts": {
    "index.html": 6,
    "uslugi.html": 4,
    "ventilyatsiya-restoranov.html": 5,
    "obsluzhivanie-ventilyatsii-restoranov.html": 3,
    "chistka-ventilyatsii-restoranov.html": 2,
    "diagnostika-ventilyatsii-restorana.html": 4,
    "dym-na-kuhne-restorana.html": 2,
    "avtomatika-ventilyatsii-restorana.html": 3,
    "contact.html": 5
  },
  "status": "PASS"
}
```

Проверенные страницы:

```text
index.html
uslugi.html
ventilyatsiya-restoranov.html
obsluzhivanie-ventilyatsii-restoranov.html
chistka-ventilyatsii-restoranov.html
diagnostika-ventilyatsii-restorana.html
dym-na-kuhne-restorana.html
avtomatika-ventilyatsii-restorana.html
contact.html
```

Mobile overflow result: `0` страниц с `scrollWidth > viewportWidth`.

## Gate после правок

```json
{
  "root_html": 115,
  "total_files": 317,
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

## Важные ограничения

- URL не менялись.
- Canonical/OG/sitemap не переписывались.
- Формы `/api/send-telegram` не менялись.
- Tracking attributes не удалялись.
- NOFONTS сохранён: font binaries = 0.
- Унаследованные 5 duplicate CTA groups остались как review-note старого слоя, новый визуальный проход их не трогал.

## Итог

V11.1 Visual Fix готов как точечный deploy-кандидат поверх Run19: визуальные правки внесены, видимый транслит очищен, CSS-полировка добавлена, статические gates сохранены, browser visual smoke Run33 прошёл.
