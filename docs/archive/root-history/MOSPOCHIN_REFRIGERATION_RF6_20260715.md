# MosPochin — RF6: symptom-service слой шокеров

**Дата:** 15 июля 2026 года  
**Этап:** RF6  
**Область:** профессиональные шкафы шокового охлаждения и заморозки

## 1. Результат

Опубликованы семь специализированных symptom-service страниц:

1. `shoker-medlenno-okhlazhdaet.html`
2. `shoker-ne-zamorazhivaet-do-minus-18.html`
3. `shoker-ne-vidit-termoshchup.html`
4. `ventilyator-shokera-ne-rabotaet.html`
5. `shoker-ne-zapuskaet-cikl.html`
6. `shoker-ostanavlivaetsya-s-oshibkoy.html`
7. `temperatura-termoshchupa-ne-sovpadaet-s-kameroy.html`

Слой шокеров в refrigeration taxonomy опубликован полностью: **7/7**.

## 2. Техническая модель

Страницы разделены по самостоятельным диагностическим сценариям:

- производительность цикла и загрузка;
- достижение температуры продукта −18 °C;
- канал термощупа и его разъём;
- вентиляторы и воздушный поток;
- запуск программы и защитные условия;
- остановка цикла с сообщением или кодом;
- расхождение температуры продукта и камеры.

Параметры производителей применяются только в model/series scope. Значения Polair CRt20, IRINOX EasyFresh/MultiFresh и Coldline MODI не объявляются универсальными для других шокеров.

## 3. Official evidence

Evidence registry расширен до **40 официальных записей**.

Ключевые источники RF6:

- Polair CRt20/CRt20T — руководство по эксплуатации: циклы охлаждения и замораживания, термощуп, контроллер, вентиляторы и защитные узлы.
- IRINOX EasyFresh Next / MultiFresh Next — официальные продуктовые циклы blast chilling и shock freezing, управление по температуре продукта.
- Coldline MODI Active — официальный технический лист: временные циклы, core probe и регулируемая вентиляция.

## 4. HTML, builder и SEO

Каждая новая страница содержит:

- уникальные `title`, H1 и description;
- self-canonical и sitemap entry;
- `Service`, `BreadcrumbList` и синхронизированный `FAQPage`;
- статические header/footer;
- отдельное диагностическое дерево;
- матрицу вероятных узлов и методов проверки;
- безопасные действия без вскрытия холодильного контура;
- форму с моделью, серийным номером, контроллером, кодом и этапом цикла;
- official evidence IDs;
- релевантную перелинковку refrigeration-кластера.

## 5. Итоговые метрики

| Показатель | Значение |
|---|---:|
| Production HTML | 276 |
| Builder parity | 276/276 |
| Indexable HTML | 262 |
| Noindex HTML | 14 |
| Sitemap URL | 262 |
| Refrigeration manifest | 56 |
| Refrigeration published | 36 |
| Refrigeration planned | 20 |
| Общие симптомы | 16/16 |
| Симптомы шокеров | 7/7 |
| Симптомы льдогенераторов | 1/9 опубликовано |
| Official refrigeration evidence | 40 |
| Controller-scoped codes | 10 |
| Исключённые неоднозначности | 1 |
| FAQ items | 779 |
| Crawl issues | 0 |
| Broken targets | 0 |
| Indexable orphans | 0 |
| Shared/parametric coverage | 50,8% |

## 6. Проверки

Успешно пройдены:

- refrigeration evidence, taxonomy, brand/model и error-code gates;
- refrigeration pages, intent boundaries, link graph и anti-cannibalization;
- builder parity 276/276;
- site crawl — 0 issues;
- FAQ registry;
- HTML head и static shell;
- metrics contract/markup;
- scale policy;
- AI/generated — 5/5;
- assets — 2/2;
- browser lead-smoke — 23/23;
- online `npm audit` — 0 vulnerabilities.

## 7. Visual QA

Созданы:

- 14 canonical first-view PNG штатным visual runtime;
- 28 fast-review PNG: desktop/mobile × first-view/full-page;
- 7 постраничных review-листов.

Все **28 представлений** реально открыты и просмотрены вручную. После первого прогона QA-рендерер был исправлен для локального встраивания Manrope и RemixIcon; повторные review-листы проверены заново.

Не обнаружены:

- горизонтальное переполнение;
- обрезанные заголовки и CTA;
- пустые секции;
- повреждённые формы;
- наложение мобильной контактной панели;
- отсутствующие иконки или шрифты;
- дефекты header/footer.

## 8. Изображения

Сравнение с RF5 выполнено по SHA-256 каждого файла `assets/images`:

- RF5: 348 файлов;
- RF6: 348 файлов;
- добавлено: 0;
- удалено: 0;
- изменено: 0.

## 9. Следующий этап

RF7 — оставшиеся восемь symptom-service страниц льдогенераторов:

- медленно производит лёд;
- не набирает воду;
- не сбрасывает лёд;
- не сливает воду;
- мелкий или пустотелый лёд;
- мутный лёд или запах;
- протечка;
- шум или заклинивание шнека.
