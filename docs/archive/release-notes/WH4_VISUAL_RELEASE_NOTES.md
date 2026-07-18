# WH4-VISUAL-FULL — полный фотоархив водонагревателей

Дата релиза: 2026-07-18

## Объём

- 117 из 117 исходных фотографий получили владельца и роль.
- 25 страниц фактически используют изображения.
- Водонагревательный кластер содержит 31 страницу.
- Добавлено 11 страниц: 6 сервисных, 4 фотокейса и фотохаб.
- Карта перелинковки содержит 176 контекстных переходов.
- Evidence-реестр содержит 17 официальных источников.

## Новые сервисные страницы

- `zamena-flantsa-i-prokladki-vodonagrevatelya.html`
- `remont-platy-i-elektroniki-vodonagrevatelya.html`
- `zamena-termostata-i-datchika-temperatury-vodonagrevatelya.html`
- `ustanovka-rasshiritelnogo-baka-dlya-vodonagrevatelya.html`
- `remont-ploskih-dvuhbakovyh-vodonagrevateley.html`
- `korroziya-baka-vodonagrevatelya.html`

## Фотокейсы и хаб

- `case-chistka-boylera-s-silnoy-nakipyu.html`
- `case-remont-dvuhbakovogo-vodonagrevatelya.html`
- `case-remont-boylera-v-tesnoy-nishe.html`
- `case-trehfaznaya-sistema-gvs-chastnogo-doma.html`
- `fotografii-remonta-vodonagrevateley.html`

## Форматы изображений

113 новых фотографий подготовлены в JPEG и WebP на ширинах 480, 768 и до 1200 px. Четыре ранее интегрированных трёхфазных кадра дополнительно сохраняют AVIF-варианты. У изображений заданы `srcset`, `sizes`, ширина и высота. Hero-изображения загружаются без lazy-loading; галереи ниже первого экрана используют `loading="lazy"`.

## Происхождение и подписи

До отдельного документального подтверждения авторства фотографии используются как нейтральные технические иллюстрации. Подписи не заявляют «наша работа» и не подменяют фактическую диагностику.

## Архитектура

- `data/water-heater-photo-library.json` — полный реестр 117 кадров.
- `data/water-heater-visual-pages.json` — страницы визуальной волны.
- `tools/generate-water-heater-visual-wh4.mjs` — генерация страниц и раскладки.
- `tools/parameterize-water-heater-wh4.py` — параметризация фотосекций.
- `check:water-heater-cluster` проверяет владельца каждого кадра и существование responsive-вариантов.

## Проверки

- Builder parity: 500/500.
- Shared/parametric coverage: 42.9%.
- WH4: 31 страница, 117 фотографий.
- Crawl: 500 HTML, 482 URL sitemap, 0 ошибок.
- HTML head: 500/500.
- FAQ: 419 страниц, 1591 вопрос.
- Visual: 12 first-view PNG и полноэкранный контроль фотохаба/кейса.
