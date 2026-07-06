# MosPochin V11.1 RUN35 Text QA / Copy polish

Дата: 2026-07-04
База: V11.1 RUN34 Visual Fix

## Что исправлено

1. Видимое `dark kitchen` заменено на `дарк-кухня` в HTML/metadata/JSON-LD, без смены URL `ventilyatsiya-dark-kitchen.html`.
2. Видимое внутреннее слово `deploy` заменено на пользовательскую формулировку `выкладка` / `после выкладки`.
3. Блок `Как использовать страницу в SEO и рекламе` заменён на пользовательский блок `Как понять, что эта страница про вашу ситуацию`.
4. Внутренний рекламно-аналитический текст про цепочку `запрос → посадочная → действие → форма` заменён на клиентский текст про симптом, фото и первичную проверку.
5. Поправлен неровный title на `about.html`: `О компании MosPochin — ремонт техники в Москве с 2010 года`.

## Сохранённые ограничения

- URL/href не менялись.
- Canonical/sitemap не переписывались.
- Формы и tracking не удалялись.
- NOFONTS сохранён.
- Бренды и модели латиницей не русифицировались, чтобы не портить коммерческие названия оборудования.

## Gate

```json
{
  "root_html": 115,
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
  "sitemap_urls": 110,
  "ventilation_urls_in_sitemap": 41,
  "visible_dark_kitchen_hits": 0,
  "visible_deploy_hits": 0,
  "visible_internal_seo_section_hits": 0,
  "visible_slug_like_or_internal_issues": 9
}
```

## Вывод

RUN35 закрывает текстовый слой после визуального RUN34: явный видимый транслит и внутренние технические слова в новых вентиляционных шаблонах убраны, пользовательский текст стал ровнее, технические gates сохранены.
