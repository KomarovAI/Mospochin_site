# MosPochin Stage6 — Прогон 3: брендовые страницы Rational + Unox

Дата: 2026-06-08  
База: `mospochin-site-stage6-prog2-parokonvektomaty-hub-20260608.zip`  
Результат: `mospochin-site-stage6-prog3-rational-unox-brand-20260608.zip`  
Public pack: `mospochin-public-deploy-prog3-rational-unox-brand-20260608.zip`

## 1. Цель прогона

Прогон 3 закрывал брендовый слой пароконвектоматного кластера:

- `parokonvektomat-rational.html`;
- `parokonvektomat-unox.html`.

Задача была не в редизайне и не в создании новых страниц, а в разведении двух брендовых посадочных внутри уже работающего Stage6-кластера:

- Rational должен читаться как Rational SCC / CMP / SelfCookingCenter / CombiMaster / iCombi;
- Unox должен читаться как Unox ChefTop / BakerTop с акцентом на AF02/AF08, воду, пар, влажность и кухню/пекарню;
- общий hub `parokonvektomaty.html`, error pages, symptom pages, runtime форм, Telegram/analytics и deploy/VPS не трогались как зона задачи.

## 2. Что было сделано по Rational

### 2.1. Hero

Файл:

```text
src/pages/parokonvektomat-rational/sections/007-hero-remont-parokonvektomatov-rational.html
```

Изменения:

- badge первого экрана заменён с общего `РЕСТОРАНЫ, КАФЕ, DARK KITCHEN` на `RATIONAL SCC · CMP · ICOMBI`;
- lead переписан под SCC/CMP/SelfCookingCenter/CombiMaster/iCombi;
- в hero явно добавлены E9, сбой после мойки, отсутствие пара, температура и срыв цикла;
- CTA уточнены:
  - `Позвонить инженеру Rational`;
  - `Отправить фото Rational`;
- KPI-карточки стали брендово-смысловыми:
  - `SCC/CMP`;
  - `E9`;
  - `Мойка`;
- alt изображения уточнён под Rational.

### 2.2. Stage4 visual rail

Файл:

```text
src/pages/parokonvektomat-rational/sections/stage4-visual-conversion-ui-parokonvektomat-rational.html
```

Изменения:

- карточки `Что ускорит диагностику` перестали быть generic;
- вместо общих карточек про бренд/модель/адрес добавлены Rational-специфичные:
  - фото дисплея и E9;
  - серия и шильдик;
  - пар, нагрев, мойка.

### 2.3. Stage3 SEO/CRO блок

Файл:

```text
src/pages/parokonvektomat-rational/sections/stage3-seo-conversion-parokonvektomat-rational.html
```

Изменения:

- текст усилен так, чтобы страница не дублировала общий hub;
- добавлен акцент на серию Rational, код E9/журнал, мойку, пар, нагрев;
- список `Что сообщить мастеру` уточнён:
  - код E9 или фото журнала/дисплея;
  - был ли сбой после мойки или чистки.

### 2.4. Диагностический блок Rational

Файл:

```text
src/pages/parokonvektomat-rational/sections/010-related-links-chto-proveryaem-u-parokonvektomata-rat.html
```

Изменения:

- вводный текст переписан как брендовый repair-bridge, а не справочник;
- усилены карточки:
  - журнал ошибок / E9;
  - нагрев и пар;
  - управление / мойка;
- список `Что отправить по Rational` уточнён под SCC/CMP/iCombi, E9, шильдик, пар, нагрев, сбой после мойки и срочность простоя.

## 3. Что было сделано по Unox

### 3.1. Hero

Файл:

```text
src/pages/parokonvektomat-unox/sections/007-hero-remont-parokonvektomatov-unox.html
```

Изменения:

- badge первого экрана заменён на `UNOX CHEFTOP · BAKERTOP`;
- lead переписан под ChefTop/BakerTop;
- добавлены AF02/AF08, вода, пар, влажность, датчики, нагрев и неравномерная готовка;
- CTA уточнены:
  - `Позвонить инженеру Unox`;
  - `Отправить фото Unox`;
- KPI-карточки стали брендово-смысловыми:
  - `ChefTop`;
  - `BakerTop`;
  - `AF02/08`;
- alt изображения уточнён под Unox.

### 3.2. Stage4 visual rail

Файл:

```text
src/pages/parokonvektomat-unox/sections/stage4-visual-conversion-ui-parokonvektomat-unox.html
```

Изменения:

- карточки `Что ускорит диагностику` стали Unox-специфичными:
  - AF02/AF08;
  - ChefTop или BakerTop;
  - вода, пар, режим.

### 3.3. Stage3 SEO/CRO блок

Файл:

```text
src/pages/parokonvektomat-unox/sections/stage3-seo-conversion-parokonvektomat-unox.html
```

Изменения:

- текст усилен так, чтобы страница не дублировала общий hub;
- добавлены ChefTop/BakerTop, AF02/AF08, вода, пар, влажность, режим;
- список `Что сообщить мастеру` уточнён:
  - код AF02/AF08 или фото панели;
  - кухня/пекарня, загрузка и режим.

### 3.4. Диагностический блок Unox

Файл:

```text
src/pages/parokonvektomat-unox/sections/010-section-chto-proveryaem-u-parokonvektomata-unox.html
```

Изменения:

- вводный текст переписан как брендовый repair-bridge;
- усилены карточки:
  - AF-коды;
  - вода и пар;
  - нагрев и управление;
- список `Что отправить по Unox` уточнён под ChefTop/BakerTop, AF02/AF08, воду, пар, влажность, нагрев и режим.

## 4. Metadata / direct manifest

Обновлены:

```text
data/page-metadata.json
data/direct-landing-pages.json
src/pages/parokonvektomat-rational/head.html
src/pages/parokonvektomat-unox/head.html
src/pages/parokonvektomat-rational/page.json
src/pages/parokonvektomat-unox/page.json
```

Новые смысловые title:

```text
Ремонт Rational SCC, CMP и iCombi в Москве | MosPochin
Ремонт Unox ChefTop и BakerTop в Москве | MosPochin
```

Descriptions уточнены под реальные брендовые интенты:

- Rational: SCC/CMP/SelfCookingCenter/iCombi, E9, нет пара, не греет, сбой мойки, диагностика и выезд;
- Unox: ChefTop/BakerTop, AF02/AF08, нет пара, вода, датчики, нагрев, кухня/пекарня.

## 5. Что не трогалось

В рамках этого прогона намеренно не трогались:

```text
parokonvektomaty.html
parokonvektomat-rational-e9.html
parokonvektomat-unox-af02-af08.html
parokonvektomat-kod-oshibki.html
parokonvektomat-ne-greet.html
parokonvektomat-net-para.html
old brand pages Abat/Convotherm/Electrolux/Lainox
parokonvektomat-obschuzhivanie.html
telegram-form.js
analytics.js
server/telegram-api.mjs
styles-combined.css
partials/mobile-footer.html
VPS / nginx / systemd / SSH / GitHub Actions
```

## 6. Команды, которые запускались

Маршрутизация:

```bash
npm run ai:route -- --task cluster --page parokonvektomat-rational.html
npm run ai:route -- --task cluster --page parokonvektomat-unox.html
```

Сборка и generated sync:

```bash
npm run generate:direct-landings
npm run build:site -- --write
npm run generate:faq-registry
npm run sync:generated
```

Проверки:

```bash
npm run check:conversion-ui
npm run check:conversion-runtime
npm run check:core
npm run check:handoff
npm run check:images
npm run deploy:pack
npm run check:deploy-runtime
node --check main.js
node --check telegram-form.js
node --check analytics.js
node --check server/telegram-api.mjs
```

## 7. Результаты проверок

```text
check:conversion-ui      passed
check:conversion-runtime passed
check:core               passed
check:handoff            passed
check:images             passed
deploy:pack              passed
check:deploy-runtime     passed
node --check runtime     passed
```

Ключевой контроль:

```text
parokonvektomat-rational.html: forms=2, clusterLinks=13, indexable
parokonvektomat-unox.html: forms=2, clusterLinks=13, indexable
builder output: 39/39 страниц совпадают
FAQ registry актуален
Direct landing manifest актуализирован
старый номер +7 (909) 994-61-77 в data/src/content/partials/root HTML: не найден
```

## 8. Изменённые файлы относительно прогона 2

Содержательный source:

```text
src/pages/parokonvektomat-rational/head.html
src/pages/parokonvektomat-rational/page.json
src/pages/parokonvektomat-rational/sections/007-hero-remont-parokonvektomatov-rational.html
src/pages/parokonvektomat-rational/sections/010-related-links-chto-proveryaem-u-parokonvektomata-rat.html
src/pages/parokonvektomat-rational/sections/stage3-seo-conversion-parokonvektomat-rational.html
src/pages/parokonvektomat-rational/sections/stage4-visual-conversion-ui-parokonvektomat-rational.html
src/pages/parokonvektomat-unox/head.html
src/pages/parokonvektomat-unox/page.json
src/pages/parokonvektomat-unox/sections/007-hero-remont-parokonvektomatov-unox.html
src/pages/parokonvektomat-unox/sections/010-section-chto-proveryaem-u-parokonvektomata-unox.html
src/pages/parokonvektomat-unox/sections/stage3-seo-conversion-parokonvektomat-unox.html
src/pages/parokonvektomat-unox/sections/stage4-visual-conversion-ui-parokonvektomat-unox.html
data/direct-landing-pages.json
data/page-metadata.json
```

Generated/output:

```text
parokonvektomat-rational.html
parokonvektomat-unox.html
content/faq/page-faq-registry.json
content/faq/schema/parokonvektomat-rational.json
content/faq/schema/parokonvektomat-unox.json
data/project-map.generated.json
data/ai-project-index.json
.ai/digest/**
reports/source-complexity.*
reports/unused-assets.*
.deploy/dist/**
```

## 9. Rollback notes

Если нужно откатить только этот прогон, откатывать:

```text
src/pages/parokonvektomat-rational/**
src/pages/parokonvektomat-unox/**
data/direct-landing-pages.json
data/page-metadata.json
content/faq/page-faq-registry.json
content/faq/schema/parokonvektomat-rational.json
content/faq/schema/parokonvektomat-unox.json
root parokonvektomat-rational.html
root parokonvektomat-unox.html
generated maps/digest/reports/deploy pack
```

Не откатывать:

```text
Прогон 1: phone/counters
Прогон 2: parokonvektomaty hub
runtime форм
analytics
server/telegram-api
styles-combined.css
partials/mobile-footer.html
```

## 10. Ограничения

В этом прогоне не делался live-браузерный визуальный аудит production. Проверка была source/build/check/archive по Stage6 ZIP после Прогона 2.

## 11. Следующий логичный этап

Следующий этап по плану:

```text
Прогон 4 — error/symptom pages как repair bridge:
- parokonvektomat-kod-oshibki.html
- parokonvektomat-rational-e9.html
- parokonvektomat-unox-af02-af08.html
- parokonvektomat-e02-e07-e10.html
- parokonvektomat-ne-greet.html
- parokonvektomat-net-para.html
```

Главная задача следующего прогона: сделать страницы ошибок и симптомов мостом к ремонту, а не справочником кодов.
