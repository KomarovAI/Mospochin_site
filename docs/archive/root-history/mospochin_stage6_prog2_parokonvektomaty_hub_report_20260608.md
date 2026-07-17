# MosPochin Stage6 — Прогон 2: дожим hub `parokonvektomaty.html`

Дата: 2026-06-08  
Входная база: `mospochin-site-stage6-prog1-p0-trust-fix-20260608.zip`  
Зона работ: только сайт / source-builder / контент / UX / CRO / SEO hygiene.  
Не трогалось: VPS, nginx, systemd, GitHub Actions, Яндекс Директ, ставки, объявления, боевой деплой.

## 1. Цель прогона

Прогон 2 был сфокусирован на главном hub кластера:

```text
parokonvektomaty.html
```

Задача: сделать страницу не очередным клоном брендовых/error/symptom pages, а главным маршрутизатором кластера:

```text
общий ремонт пароконвектоматов
  → бренд: Rational / Unox / Abat / Convotherm / Electrolux / Lainox
  → симптом: не греет / нет пара
  → код ошибки: общий код / Rational E9 / Unox AF02-AF08
  → ТО / плановое обслуживание
  → заявка / WhatsApp / звонок
```

## 2. Что изменено по смыслу

### 2.1. Первый экран стал короче и понятнее

Было:

```text
- длинный hero lead;
- 3 CTA в первом экране;
- отдельно problem router и brand router, из-за чего первый экран раздувался;
- блок “что прислать мастеру” был ниже и не работал как мгновенная подсказка.
```

Стало:

```text
- hero lead сокращён;
- в первом экране оставлены 2 главные CTA:
  1. Позвонить инженеру;
  2. Отправить модель и фото;
- добавлен компактный блок “Что прислать мастеру сразу”;
- добавлен компактный hub-router: по симптому / по ошибке / по бренду или ТО.
```

Новый ключевой hero lead:

```text
Ремонтируем пароконвектоматы для ресторанов, кафе, столовых и пищеблоков в Москве. Пришлите бренд, модель и фото ошибки — скажем, нужен ли срочный выезд сегодня.
```

### 2.2. Hub стал маршрутизатором, а не справочником

В первом экране и ближайших блоках усилены маршруты:

```text
По симптому:
- Не греет;
- Нет пара.

По ошибке:
- Код ошибки;
- Rational E9;
- Unox AF02/AF08.

По бренду / ТО:
- Rational;
- Unox;
- ТО.
```

### 2.3. Блок “что прислать мастеру” поднят выше

Теперь прямо в hero есть быстрые подсказки:

```text
- бренд и модель;
- фото дисплея / ошибки / шильдика;
- симптом и адрес кухни.
```

Это должно снизить пустые заявки и ускорить первичный контакт.

### 2.4. Lead form уточнён под hub-интент

Обновлён request-overview над формой:

```text
Чтобы сразу понять маршрут ремонта
```

И обновлены chips:

```text
- Фото дисплея и шильдика;
- Бренд, модель и симптом;
- Адрес кухни и срочность.
```

Обновлён пример заявки:

```text
Rational SCC 101, фото ошибки E9, не набирает температуру, ресторан на Павелецкой, простой критичен, нужны документы на юрлицо
```

### 2.5. SEO description обновлён точечно

Описание `parokonvektomaty.html` стало ближе к реальному hub-интенту:

```text
Ремонт пароконвектоматов для ресторанов и столовых в Москве: Rational, Unox, Abat, коды ошибок, нет пара, не греет. Фото дисплея в WhatsApp, выезд инженера.
```

Canonical, URL, indexability и sitemap-логика не менялись.

## 3. Что изменено технически

Правки внесены в source/data/generated слой. Root HTML пересобран через builder.

Ключевые source/data файлы:

```text
src/pages/parokonvektomaty/head.html
src/pages/parokonvektomaty/sections/007-hero-remont-parokonvektomatov-dlya-restoranov.html
src/pages/parokonvektomaty/sections/008-section-restorany-kafe-pekarni-i-dark-kitchen.html
src/pages/parokonvektomaty/sections/010-proof-dokazatel-stva-garantii.html
src/pages/parokonvektomaty/sections/028-section-razobrat-problemu-parokonvektomata-tochnee.html
src/pages/parokonvektomaty/sections/053-lead-form-poluchite-ponyatnyy-scenariy-remonta-parok.html
src/pages/parokonvektomaty/sections/054-proof-dokazatel-stva-garantii.html
src/pages/parokonvektomaty/sections/058-proof-dokazatel-stva-garantii.html
src/pages/parokonvektomaty/sections/stage3-seo-conversion-parokonvektomaty.html
src/pages/parokonvektomaty/sections/stage4-visual-conversion-ui-parokonvektomaty.html
data/page-metadata.json
data/restaurant-page-slots.json
data/restaurant-services.json
```

Generated/output обновлены командами:

```text
parokonvektomaty.html
data/project-map.generated.json
data/ai-project-index.json
data/ai-component-map.json
.ai/digest/**
reports/source-complexity.*
reports/unused-assets.*
.deploy/dist/**
```

## 4. Важный технический нюанс, который был пойман в процессе

В проекте есть fallback sync zones, которые проверяются `validate-site`:

```text
service-kpi
request-overview
faq-items
service-proof
related-links
service-schema
form placeholders
```

Команда `restaurant:sync-fallbacks` обновляет root HTML, но source-builder затем снова собирает root из `src/pages/**`. Поэтому для этого прогона синхронизация была дожата именно в source-секциях `parokonvektomaty`, иначе `check:core` ловил бы drift.

Итог: source и root HTML снова совпадают через builder output.

## 5. Проверки

Baseline до правок:

```text
npm run check:core — passed
```

После правок:

```text
npm run ai:route -- --task cluster --page parokonvektomaty.html — passed
npm run build:site -- --write — passed
npm run sync:generated — passed
npm run check:conversion-ui — passed
npm run check:core — passed
npm run check:handoff — passed
npm run check:images — passed
npm run deploy:pack — passed
npm run check:deploy-runtime — passed
```

`check:conversion-ui` по кластеру:

```text
parokonvektomaty.html: forms=2, clusterLinks=15, indexable
весь parokonvektomat cluster: 16 pages passed
```

`check:core`:

```text
Validated 39 pages successfully.
Conversion runtime guard passed.
Deploy runtime guard passed.
Builder output совпадает для 39 root HTML.
Shared components актуальны.
FAQ registry актуален.
Scale policy passed.
```

`check:handoff`:

```text
passed
```

`check:images`:

```text
passed
```

`deploy:pack`:

```text
public deploy pack ready
FILES: 185
```

## 6. Контрольные grep / smoke

```text
старый номер +7 (909) 994-61-77: 0 точных совпадений
bad zero counters: 0
parokonvektomaty.html telegram forms: 2
parokonvektomaty.html clusterLinks по check:conversion-ui: 15
```

Новые маркеры в `parokonvektomaty.html`:

```text
Пришлите бренд, модель и фото ошибки
Отправить модель и фото
Что прислать мастеру сразу
Выберите маршрут
Чтобы сразу понять маршрут ремонта
```

## 7. Что НЕ делалось

```text
- не трогались VPS/nginx/systemd/GitHub Actions;
- не менялись noindex/index правила;
- не добавлялись новые страницы;
- не менялись URL;
- не трогались Яндекс Директ кампании;
- не менялись runtime-файлы analytics.js / telegram-form.js / server/telegram-api.mjs;
- не делался live production visual audit в браузере;
- не делался Playwright screenshot audit, так как в этом прогоне достаточно было source/build/check/archive маршрута.
```

## 8. Rollback notes

Откатывать этот прогон точечно:

```text
data/page-metadata.json
data/restaurant-page-slots.json
data/restaurant-services.json
src/pages/parokonvektomaty/head.html
src/pages/parokonvektomaty/sections/007-hero-remont-parokonvektomatov-dlya-restoranov.html
src/pages/parokonvektomaty/sections/008-section-restorany-kafe-pekarni-i-dark-kitchen.html
src/pages/parokonvektomaty/sections/010-proof-dokazatel-stva-garantii.html
src/pages/parokonvektomaty/sections/028-section-razobrat-problemu-parokonvektomata-tochnee.html
src/pages/parokonvektomaty/sections/053-lead-form-poluchite-ponyatnyy-scenariy-remonta-parok.html
src/pages/parokonvektomaty/sections/054-proof-dokazatel-stva-garantii.html
src/pages/parokonvektomaty/sections/058-proof-dokazatel-stva-garantii.html
src/pages/parokonvektomaty/sections/stage3-seo-conversion-parokonvektomaty.html
src/pages/parokonvektomaty/sections/stage4-visual-conversion-ui-parokonvektomaty.html
```

После rollback обязательно:

```bash
npm run build:site -- --write
npm run sync:generated
npm run check:core
```

## 9. Следующий логичный прогон

Следующий этап:

```text
Прогон 3 — брендовые страницы Rational + Unox
```

Цель следующего этапа:

```text
- сделать Rational и Unox отличимыми от hub и друг от друга;
- усилить брендовый первый экран;
- связать Rational с E9;
- связать Unox с AF02/AF08;
- сохранить forms=2, canonical, indexability, cluster links и Telegram/analytics runtime.
```
