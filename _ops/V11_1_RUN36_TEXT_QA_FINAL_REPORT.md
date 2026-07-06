# MosPochin V11.1 RUN36 Text QA — финальная текстовая проверка

Дата: 2026-07-04
База: RUN35 поверх RUN34 Visual Fix

## Что добито после RUN35

1. Убрана видимая техническая строка `page_url / page_path / UTM / yclid / referrer` — заменена на человеческую формулировку про страницу заявки и источник перехода.
2. Убраны английские подписи `hood-type` и `transport-type` в карточках посудомоечных машин.
3. Сохранены латинские бренды, модели и фирменные линейки оборудования: это коммерческие названия, не транслит.

## Что уже было исправлено в RUN35

- `dark kitchen` → `дарк-кухня` в видимом тексте/metadata/JSON-LD, URL `ventilyatsiya-dark-kitchen.html` не менялся.
- `deploy` → `выкладка` / `после выкладки`.
- Внутренний блок `Как использовать страницу в SEO и рекламе` заменён на клиентский блок `Как понять, что эта страница про вашу ситуацию`.
- Технический текст про рекламную цепочку заменён на текст для клиента: симптом, фото, тип объекта, первичная проверка.

## Gate

```json
{
  "root_html": 115,
  "ventilation_pages_present": 52,
  "sitemap_urls": 110,
  "ventilation_urls_in_sitemap": 52,
  "forms_total": 131,
  "forms_with_tracking": 131,
  "pages_with_data_page_slug": 115,
  "analytics_js_pages": 115,
  "telegram_form_js_pages": 114,
  "json_ld_scripts": 307,
  "invalid_jsonld": 0,
  "missing_non_font_assets": 0,
  "broken_internal_links": 0,
  "broken_anchor_links": 0,
  "font_binaries": 0,
  "source_like_files": 0,
  "visible_translit_slug_hits": 0,
  "visible_internal_technical_hits": 0,
  "visible_bad_english_hits": 0,
  "visible_dark_kitchen_hits": 0,
  "visible_deploy_hits": 0,
  "visible_internal_seo_section_hits": 0
}
```

## Важно

Латинские бренды и модели не русифицировались: Rational, Unox, Electrolux, Bosch, Scotsman, Polair, Carboma, Manitowoc, air-o-steam и похожие названия оставлены как коммерческие наименования.

## Вывод

RUN36 закрывает текстовый слой: видимый slug-транслит, `dark kitchen`, `deploy`, внутренние SEO/аналитические формулировки и технические переменные убраны из пользовательского текста. Архитектура, формы, JSON-LD, sitemap, canonical и NOFONTS не сломаны.


Примечание к валидации: счётчик ventilation pages пересчитан по правильному имени `avtomatika-ventilyatsii-restorana.html`; URL и файл в архиве не менялись.
