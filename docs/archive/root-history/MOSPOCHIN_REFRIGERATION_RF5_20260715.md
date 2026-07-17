# MosPochin — Refrigeration RF5

**Дата:** 15 июля 2026 года  
**Этап:** RF5 — завершение общего symptom-service слоя холодильного кластера

## Опубликованные страницы

1. `holodilnoe-oborudovanie-medlenno-nabiraet-temperaturu.html`
2. `holodilnoe-oborudovanie-peremorazhivaet-produkty.html`
3. `kompressor-holodilnogo-oborudovaniya-rabotaet-bez-ostanovki.html`
4. `holodilnoe-oborudovanie-chasto-vklyuchaetsya-i-vyklyuchaetsya.html`
5. `kondensator-holodilnogo-oborudovaniya-peregrevaetsya.html`
6. `holodilnoe-oborudovanie-shumit-i-vibriruet.html`
7. `dver-holodilnogo-shkafa-ne-zakryvaetsya.html`

RF5 содержит семь, а не восемь страниц: вместе с RF2 и RF4 они закрывают полный общий symptom-service слой **16/16**.

## Evidence

Refrigeration evidence registry расширен с 36 до **38 official records**. Добавлены:

- официальный технический бюллетень Copeland AE17-1262 R2 по short cycling;
- официальная страница профессионального шкафа Liebherr FRFCvg 4001 по дверному уплотнению и сигнализации открытой двери.

Остальные утверждения основаны на ранее зарегистрированных руководствах Polair, Danfoss ERC 21X и Copeland. Универсальные давления, количество хладагента и допустимое число пусков не публикуются.

## Текущее состояние

| Показатель | Значение |
|---|---:|
| Production HTML | 269 |
| Builder parity | 269/269 |
| Индексируемые URL | 255 |
| Noindex URL | 14 |
| Refrigeration manifest | 56 |
| Refrigeration published | 29 |
| Refrigeration planned | 27 |
| General symptoms | 16/16 published |
| Refrigeration evidence | 38 |
| Fault scenarios | 32 |
| Controller-scoped codes | 10 |
| FAQ items on site | 758 |
| Crawl issues | 0 |
| Shared/parametric coverage | 50.9% |

## Проверки

- refrigeration evidence/taxonomy/brand/error/page/link/cannibalization gates: passed;
- builder parity: 269/269;
- site crawl: 269 HTML, 255 sitemap URL, 0 issues;
- HTML head: 269/269;
- static shell: 268 pages;
- public copy: 269/269;
- metrics markup: pages=268, contact CTAs=1966, forms=337;
- browser lead smoke: 23/23;
- conversion runtime and conversion UI: passed;
- AI/generated: 5/5 current;
- visual environment/contract/workflow policy: passed;
- assets: passed;
- npm audit endpoint returned 502; fail-closed attestation fallback passed for the identical package-lock.json;
- scale policy: passed, shared/parametric coverage 50.9%.

## Visual QA

Созданы:

- 14 canonical first-view PNG штатным visual runtime;
- 28 fast-review PNG: desktop/mobile × first-view/full-page для семи страниц;
- 7 постраничных review-листов.

Все **28 представлений** fast-review были реально открыты и просмотрены вручную. Не обнаружены горизонтальное переполнение, обрезанные заголовки/CTA, пустые секции, повреждения таблиц, наложение мобильной панели или формы.

## Изображения

Сравнение с RF4 по SHA-256:

- файлов до: 348;
- файлов после: 348;
- добавлено: 0;
- удалено: 0;
- изменено: 0.

RF5 не добавляет и не изменяет изображения.

## Следующий этап

RF6 — семь специализированных symptom-service страниц шокового охлаждения и заморозки.
