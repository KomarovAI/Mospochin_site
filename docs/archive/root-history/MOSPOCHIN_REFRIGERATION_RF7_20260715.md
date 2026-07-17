# MosPochin — RF7: symptom-service слой льдогенераторов

**Дата:** 15 июля 2026 года  
**Исходный baseline:** RF6 shocker source  
**Результат:** восемь новых symptom-service страниц, полный ice-machine слой 9/9.

## Опубликованные страницы

- `ldogenerator-medlenno-delaet-led.html`
- `ldogenerator-ne-nabiraet-vodu.html`
- `ldogenerator-ne-sbrasyvaet-led.html`
- `ldogenerator-ne-slivaet-vodu.html`
- `ldogenerator-delaet-melkiy-ili-pustotelyy-led.html`
- `gryaznyy-mutnyy-ili-s-zapahom-led.html`
- `ldogenerator-techet.html`
- `shnek-ldogeneratora-shumit-ili-zaklinil.html`

## Технические принципы

- Водяной контур, freeze cycle, harvest, drainage, форма/качество льда и шнековая механика разведены по отдельным интентам.
- Утверждения из Hoshizaki KML применяются только к указанной KML-серии.
- Утверждения из Hoshizaki IM-500SAA применяются только к этой модели/семейству документа.
- Утверждения Scotsman SCCG30/SCCP30 применяются только к scope официального service manual.
- Настройки времени, температуры, давления и размера кубика не объявляются универсальными.

## Итоговые показатели

| Показатель | Значение |
|---|---:|
| Production HTML | 284 |
| Builder parity | 284/284 |
| Индексируемые URL | 270 |
| Noindex URL | 14 |
| Sitemap URL | 270 |
| Refrigeration manifest | 56 |
| Опубликовано | 44 |
| Planned | 12 |
| Ice-machine symptom pages | 9/9 |
| Official refrigeration evidence | 43 |
| Shared/parametric coverage | 50.7% |
| Crawl issues | 0 |

## Проверки

- Core: 69/69 passed одним непрерывным запуском.
- Builder parity: 284/284.
- Site crawl: 0 issues.
- Browser lead smoke: 23/23.
- AI/generated: 5/5.
- Assets: 2/2.
- Visual environment/contract/workflow: passed.
- Visual smoke: 6/6 страниц завершены через resumable capture.
- npm audit: 0 vulnerabilities, online.

## Visual QA

- Canonical first-view: 16 PNG.
- Fast-review: 32 PNG.
- Review sheets: 8 JPEG.
- Ручной просмотр: 8 страниц, 32/32 представления.
- Обнаруженные визуальные дефекты: 0.
- Первый общий fast-review процесс закрыл Chromium на последней странице; сохранённые 29 кадров не переснимались, недостающие три кадра были досняты отдельным процессом.

## Изображения

| Сравнение с RF6 | Значение |
|---|---:|
| До | 348 |
| После | 348 |
| Добавлено | 0 |
| Удалено | 0 |
| Изменено | 0 |

## Official evidence added in RF7

- Hoshizaki KML-325/500/700M service manual.
- Hoshizaki IM-500SAA service manual.
- Scotsman SCCG30/SCCP30 service manual.

## Следующий этап

RF8 — восемь брендовых страниц: Polair, Abat, HICOLD, Liebherr, IRINOX, Coldline, Hoshizaki и Scotsman.
