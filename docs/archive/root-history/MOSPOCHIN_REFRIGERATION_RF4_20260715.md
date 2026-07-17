# MosPochin — Refrigeration RF4

**Дата:** 15 июля 2026 года  
**Этап:** RF4 — восемь общих P0 symptom-service страниц холодильного кластера

## Опубликованные страницы

1. `kompressor-holodilnogo-oborudovaniya-ne-zapuskaetsya.html`
2. `vysokaya-temperatura-v-holodilnoy-kamere.html`
3. `isparitel-holodilnogo-oborudovaniya-pokryvaetsya-ldom.html`
4. `ne-rabotaet-ottaika-holodilnogo-oborudovaniya.html`
5. `ventilyator-holodilnogo-oborudovaniya-ne-rabotaet.html`
6. `holodilnoe-oborudovanie-vybivaet-avtomat.html`
7. `techet-voda-iz-holodilnogo-oborudovaniya.html`
8. `kody-oshibok-holodilnogo-oborudovaniya.html`

## Evidence

Refrigeration evidence registry расширен до **36 official records**. Для RF4 добавлены model/series-scoped официальные руководства Polair по моноблокам, холодильным шкафам и потолочным моноблокам. Диагностика контроллеров основана на официальной документации Danfoss ERC 211/213/214; электрическая безопасность компрессора — на материалах Copeland.

На странице кодов опубликованы только **10 controller-scoped** кодов Danfoss ERC 211/213/214. Универсальные коды холодильного оборудования запрещены; неоднозначный общий индикатор `Err` исключён.

## Текущее состояние

| Показатель | Значение |
|---|---:|
| Production HTML | 262 |
| Builder parity | 262/262 |
| Индексируемые URL | 248 |
| Noindex URL | 14 |
| Refrigeration manifest | 56 |
| Refrigeration published | 22 |
| Refrigeration planned | 34 |
| Refrigeration evidence | 36 |
| Fault scenarios | 32 |
| Controller-scoped codes | 10 |
| FAQ items на сайте | 737 |
| Crawl issues | 0 |
| Shared/parametric coverage | 51.0% |

## Архитектурное улучшение

RF3–RF4 source-модели содержали эквивалентные mobile/runtime mount-фрагменты с различиями только в начальном пробеле и порядке HTML-атрибутов. Core parameterizer переведён на нормализованное распознавание:

- mobile mount points определяются после `trim()`;
- `partials-injector.js` распознаётся независимо от порядка `src`/`defer` и формы boolean-атрибута;
- после миграции пересчитываются bytes/hash параметрических секций.

Результат: parametric refs выросли с 1499 до 1887, coverage — с 41.8% до 51.0%. Scale gate пройден без снижения порога.

## Проверки

- Refrigeration foundation audit: passed;
- builder parity: 262/262;
- site crawl: 262 HTML, 248 sitemap URL, 0 issues;
- HTML head: 262/262;
- static shell: 261 страниц;
- public copy: 262/262;
- browser lead smoke: 23/23;
- conversion UI: passed;
- visual profile: 4/4;
- AI profile: 5/5;
- assets profile: 2/2;
- npm audit: 0 vulnerabilities online;
- scale policy: passed, 51.0% coverage.

Единый `check:core` был остановлен внешним лимитом времени после 45-го шага. Все оставшиеся шаги профиля выполнены отдельно и прошли. Поэтому результат фиксируется как **69 составляющих core-проверок passed**, но не как один непрерывный агрегированный запуск.

## Visual QA

Созданы 32 представления:

- 8 desktop first-view;
- 8 mobile first-view;
- 8 desktop full-page;
- 8 mobile full-page.

Все 32 представления вручную открыты и просмотрены через восемь постраничных review-листов. Не обнаружены горизонтальное переполнение, обрезанные заголовки/CTA, пустые секции, повреждения header/footer, наложение мобильной панели или формы.

Для этого review использован быстрый локальный Chromium renderer с production HTML и CSS. Общий visual runtime проекта отдельно прошёл контрактный smoke.

## Изображения

Сравнение с RF3 по SHA-256:

- файлов до: 348;
- файлов после: 348;
- добавлено: 0;
- удалено: 0;
- изменено: 0.

RF4 не добавляет и не изменяет изображения.

## Следующий этап

RF5: оставшиеся восемь общих symptom-service страниц — медленный набор температуры, перемораживание, непрерывная работа компрессора, частые пуски, перегрев конденсатора, шум/вибрация, дверь шкафа и дополнительный общий диагностический сценарий согласно manifest.
