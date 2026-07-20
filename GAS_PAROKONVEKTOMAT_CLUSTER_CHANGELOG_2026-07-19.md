# Газовый подкластер пароконвектоматов — изменения 2026-07-19

## Реализовано

- Переработан хаб `gazovyy-parokonvektomat-remont.html`.
- Добавлены шесть индексируемых страниц по отдельным интентам:
  - `gazovyy-parokonvektomat-ne-zazhigaetsya.html`;
  - `gazovyy-parokonvektomat-gasnet-plamya.html`;
  - `oshibka-rozzhiga-parokonvektomata.html`;
  - `gazovyy-parokonvektomat-ne-greet.html`;
  - `ventilyatsiya-gazovogo-parokonvektomata.html`;
  - `trebovaniya-k-ustanovke-gazovogo-parokonvektomata.html`.
- На всех газовых страницах добавлены аварийное предупреждение, диагностический маршрутизатор, граница между ремонтом аппарата и работами по газовой сети, FAQPage/Service/BreadcrumbList и специализированная B2B-форма.
- Добавлена перелинковка с основным кластером, страницами нагрева, кодов ошибок, вентиляции, монтажа и брендами RATIONAL, UNOX, Electrolux Professional.
- Обновлены `sitemap.xml`, `data/page-metadata.json`, `data/restaurant-services.json` и `.deploy/include-files.txt`.
- В аналитику добавлены события `gas_oven_page_view`, `gas_symptom_select`, `gas_nameplate_upload`, `gas_safety_warning_view`, `gas_lead_submit`, `gas_whatsapp_click`, `gas_call_click`.

## Безопасностная редактура

- Не публикуются процедуры регулировки газового клапана, обхода защит, сервисные пароли, универсальные давления и инструкции по переводу на другой тип газа.
- При запахе газа обычная форма не позиционируется как аварийная служба.
- Значения зазоров, давления, схема отвода продуктов сгорания и порядок пуска привязаны к документации конкретной модели и требованиям объекта.

## Медиа

Использованы существующие фотографии сервисного доступа и вентиляции. Они подписаны как общие иллюстрации; газовые узлы на них не выдаются за конкретную модель. Для следующего этапа нужен отдельный медиапак: шильдик газовой модели, горелочный вентилятор, электроды, блок розжига, газовый клапан, выход продуктов сгорания и анализатор.
