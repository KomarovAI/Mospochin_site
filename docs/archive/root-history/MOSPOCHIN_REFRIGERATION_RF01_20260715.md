# MosPochin — холодильное оборудование, RF0–RF1 foundation

**Дата:** 15 июля 2026 года  
**Базовый source:** `mospochin-dishwasher-images-integrated-20260715.zip`  
**Стадия:** research, boundaries, data contracts и автоматические gates  
**Публикация новых страниц:** не выполнялась

## 1. Результат

RF0–RF1 сформировали machine-readable фундамент нового ресторанного кластера холодильного оборудования без изменения production HTML.

Закреплены существующие страницы:

- `holodilnoe-oborudovanie.html` — umbrella-хаб профессионального холодильного оборудования;
- `ice-machines.html` — подхаб льдогенераторов.

Исключены из registry:

- `holodilniki.html` — бытовая ветка;
- `sous-vide-i-shokovoe-okhlazhdenie.html` — внешний смежный материал;
- `ventilyatsiya-i-holodilnoe-oborudovanie.html` — внешний смежный материал.

## 2. Целевой manifest

| Слой | URL |
|---|---:|
| Foundation и типы оборудования | 12 |
| Общие symptom-service | 16 |
| Шоковое охлаждение и заморозка | 7 |
| Льдогенераторы | 9 |
| Брендовые страницы | 8 |
| Direct/noindex | 4 |
| **Всего** | **56** |

Текущее состояние:

- опубликовано в cluster manifest: **2**;
- planned: **54**;
- новых production HTML: **0**.

## 3. Data contracts

Добавлены:

- `data/refrigeration-cluster-pages.json`;
- `data/refrigeration-fault-taxonomy.json`;
- `data/refrigeration-fault-evidence.json`;
- `data/refrigeration-error-codes.json`;
- `data/refrigeration-brand-models.json`;
- `data/refrigeration-symptom-pages.json`;
- `data/refrigeration-link-graph.json`;
- `data/refrigeration-screenshot-audit.json`;
- `data/refrigeration-conversion-pages.json`;
- `data/refrigeration-intent-boundaries.json`.

Контракты содержат:

| Контракт | Результат |
|---|---:|
| Official evidence | 29 записей |
| Fault taxonomy | 32 сценария |
| Общие симптомы | 16 |
| Симптомы шокеров | 7 |
| Симптомы льдогенераторов | 9 |
| Бренды | 8 |
| Группы серий | 26 |
| Controller-scoped error codes | 10 |
| Исключённые неоднозначности | 1 |
| Planned link-graph nodes | 56 |

## 4. Evidence и коды

Evidence registry основан на официальной документации производителей оборудования и компонентов: Polair, Abat, HICOLD, Liebherr, IRINOX, Coldline, Hoshizaki, Scotsman, Danfoss и Copeland.

Коды ошибок опубликованы в registry только для конкретного семейства контроллеров Danfoss ERC 211/213/214:

- `E29`, `E27`, `E30`;
- `A01`, `A02`, `A61`, `A80`, `A04`, `A99`, `AA1`.

Общий индикатор `Err` сохранён как исключённая неоднозначность и не публикуется как самостоятельный универсальный код.

Запрещено:

- переносить коды между контроллерами и моделями;
- публиковать универсальные рабочие давления;
- считать дозаправку хладагента универсальным решением;
- смешивать обычное хранение, шоковое охлаждение и производство льда;
- переносить шнековые неисправности на кубиковые льдогенераторы;
- определять марку или модель только по фотографии.

## 5. Брендовый registry

Первая волна зафиксирована для:

- Polair;
- Abat;
- HICOLD;
- Liebherr;
- IRINOX;
- Coldline;
- Hoshizaki;
- Scotsman.

Брендовая страница сможет перейти в published только при наличии official series scope, evidence, serial-number field, независимого сервисного disclaimer и уникальной диагностической матрицы.

## 6. Автоматические проверки

Добавлены команды:

```bash
npm run check:refrigeration-evidence
npm run check:refrigeration-fault-taxonomy
npm run check:refrigeration-brand-models
npm run check:refrigeration-error-codes
npm run check:refrigeration-pages
npm run check:refrigeration-intent-boundaries
npm run check:refrigeration-link-graph
npm run check:refrigeration-cannibalization
npm run audit:refrigeration-foundation
npm run audit:refrigeration-screenshots
```

Восемь foundation-gates включены в основной core-профиль.

## 7. Итоговые проверки

| Проверка | Результат |
|---|---:|
| Refrigeration foundation | 8/8 passed |
| Builder parity | 242/242 |
| Site crawl | 242 HTML, 228 sitemap URL, 0 issues |
| AI/generated | 5/5 passed |
| Visual contract | passed, 17 manifests / 7 clusters |
| Visual workflow policy | passed |
| Assets | 2/2 passed |
| npm audit | 0 vulnerabilities, online |
| Shared/parametric coverage | 42.9% |
| Root production HTML changed | 0 |
| `assets/images` changed/added/removed | 0/0/0 |

Основной core-профиль расширен до 69 шагов. Один агрегированный verbose-запуск остановился по временному лимиту среды; все его составляющие проверки, включая browser lead smoke 23/23 и scale-gate, были завершены успешными отдельными запусками. Это не выдаётся за один непрерывный `check:core` run.

## 8. Новые инструменты и документация

Инструменты:

- `tools/refrigeration-fault-lib.mjs`;
- восемь `check-refrigeration-*.mjs` validators.

Документация:

- `docs/REFRIGERATION_CLUSTER_AI_GUIDE.md`;
- `docs/REFRIGERATION_EVIDENCE_GUIDE.md`;
- `docs/REFRIGERATION_SEO_LINKING_GUIDE.md`;
- `docs/REFRIGERATION_VISUAL_GUIDE.md`.

Generated layer синхронизирован с новым cluster registry.

## 9. Следующая волна RF2

Пилот рассчитан на восемь страниц:

1. переработанный `holodilnoe-oborudovanie.html`;
2. переработанный `ice-machines.html`;
3. обслуживание холодильного оборудования;
4. диагностика холодильного оборудования;
5. холодильные камеры;
6. шкафы шокового охлаждения и заморозки;
7. оборудование не холодит;
8. льдогенератор не производит лёд.

Две существующие страницы будут обновлены через source-builder, шесть новых URL будут опубликованы только после прохождения evidence, intent, link-graph, builder, crawl и visual gates.
