# MosPochin — Прогон 5: old brand / neutral pages + ТО

Дата: 2026-06-08  
База: `mospochin-site-stage6-prog4-error-symptom-repair-bridge-20260608.zip`  
Выход: `mospochin-site-stage6-prog5-old-brand-to-20260608.zip`

## 1. Цель прогона

Прогон 5 закрывает блок старых брендовых страниц пароконвектоматного кластера и страницу технического обслуживания:

- `parokonvektomat-abat.html`
- `parokonvektomat-convotherm.html`
- `parokonvektomat-electrolux.html`
- `parokonvektomat-lainox.html`
- `parokonvektomat-obschuzhivanie.html`

Главное ограничение: **не менять branch metadata-хаком**. Эти страницы остаются `branch=neutral`, `role=neutral`, indexable и в sitemap. Правки внесены в source-слой, после чего root HTML пересобран через builder.

## 2. Что сделано

### 2.1. Abat

Усилена страница под реальный B2B-сценарий для ПКА/КПЭ:

- акцент на `ПКА / КПЭ`;
- ошибки `E02 / E07 / E10`;
- не греет, нет пара, вода, защита;
- что прислать инженеру: шильдик, фото ошибки, режим, адрес, окно доступа;
- безопасная формулировка: не обещаем точный диагноз по одному коду без осмотра;
- обновлены CTA и WhatsApp-текст;
- обновлена форма заявки.

### 2.2. Convotherm

Страница разведена от общего hub и получила отдельный сценарий:

- `C4 / C6 / mini / combiPro`;
- пар, мойка, вентилятор, датчики, нагрев;
- связь сбоя с программой/мойкой/паром;
- акцент на премиум-кухне, минимальном простое и документах;
- обновлены hero, intake-блок, repair bridge, stage3/stage4, форма и meta description.

### 2.3. Electrolux Professional

Страница усилена под профессиональные линейки:

- `air-o-steam`, `air-o-convect`, `SkyLine`, `thermaline`;
- влажность, пар, нагрев, мойка, датчики;
- режим/температура/панель как обязательные входные данные;
- акцент на ресторанный формат, акт, гарантию, рекомендации по ТО;
- обновлены CTA, lead-form placeholders и metadata.

### 2.4. Lainox

Страница получила конкретику по сериям:

- `Naboo / Krea / Junior`;
- влажность, программа, пар, нагрев, мойка;
- что отправить инженеру: серия, фото панели, режим, адрес, последнее ТО;
- обновлена логика “бренд → симптом → выезд”, без превращения страницы в справочник.

### 2.5. Техническое обслуживание

Страница ТО переведена из общего “профилактика” в коммерческий B2B-сценарий договора:

- график обслуживания под загрузку кухни;
- декальцинация, вода, парогенератор, уплотнения, датчики, мойка;
- обслуживание нескольких аппаратов и брендов;
- договор, счёт, акт, рекомендации после визита;
- обновлены hero, stage3, stage4, форма заявки и meta/service description;
- WhatsApp теперь просит список оборудования, а не “фото ошибки”.

## 3. Изменённые source-зоны

Основные source-зоны:

```text
src/pages/parokonvektomat-abat/**
src/pages/parokonvektomat-convotherm/**
src/pages/parokonvektomat-electrolux/**
src/pages/parokonvektomat-lainox/**
src/pages/parokonvektomat-obschuzhivanie/**
content/components/lead-form/parokonvektomat-abat.json
content/components/lead-form/parokonvektomat-convotherm.json
content/components/lead-form/parokonvektomat-electrolux.json
content/components/lead-form/parokonvektomat-lainox.json
data/page-metadata.json
```

Generated/output обновлены командами:

```text
root *.html для 5 целевых страниц
.deploy/include-files.txt
data/project-map.generated.json
data/ai-project-index.json
data/ai-component-map.json
.ai/digest/**
reports/source-complexity.*
reports/unused-assets.*
.deploy/dist/**
```

## 4. Что специально не трогалось

```text
branch/role для neutral страниц;
index/noindex;
canonical URL;
sitemap policy;
runtime форм;
analytics.js;
telegram-form.js;
server/telegram-api.mjs;
общий hub parokonvektomaty.html;
Rational/Unox страницы из Прогона 3;
error/symptom страницы из Прогона 4;
VPS/nginx/systemd/GitHub Actions/деплой.
```

## 5. Проверки

Выполнены команды:

```bash
npm run ai:route -- --task cluster --page parokonvektomat-abat.html
npm run ai:route -- --task cluster --page parokonvektomat-obschuzhivanie.html
npm run build:site -- --write
npm run sync:generated
npm run check:conversion-ui
npm run check:conversion-runtime
npm run check:parameterized-components
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

Результат:

```text
check:conversion-ui        passed
check:conversion-runtime   passed
check:parameterized-components passed
check:core                 passed
check:handoff              passed
check:images               passed
deploy:pack                passed
check:deploy-runtime       passed
node --check runtime       passed
```

Контроль по страницам:

```text
parokonvektomat-abat.html: forms=2, clusterLinks=14, indexable
parokonvektomat-convotherm.html: forms=2, clusterLinks=14, indexable
parokonvektomat-electrolux.html: forms=2, clusterLinks=14, indexable
parokonvektomat-lainox.html: forms=2, clusterLinks=14, indexable
parokonvektomat-obschuzhivanie.html: forms=2, clusterLinks=15, indexable
```

Контроль P0 из прошлых прогонов:

```text
+7 (909) 994-61-77: точных совпадений нет
994-61-77: точных совпадений нет
bad zero counter fallback: 0
builder output: 39/39 страниц совпадают с source-builder
```

## 6. Технический нюанс

После изменения parametric lead-form JSON для old brand pages пересчитаны `bytes/hash` в соответствующих `page.json`, иначе `check:parameterized-components` мог бы ловить render mismatch. Сейчас parametric guard проходит:

```text
Parameterized components OK: total=870, lead-form=14, mobile-contact=78
```

## 7. Rollback

Откат Прогона 5 делать точечно:

```text
src/pages/parokonvektomat-abat/**
src/pages/parokonvektomat-convotherm/**
src/pages/parokonvektomat-electrolux/**
src/pages/parokonvektomat-lainox/**
src/pages/parokonvektomat-obschuzhivanie/**
content/components/lead-form/parokonvektomat-abat.json
content/components/lead-form/parokonvektomat-convotherm.json
content/components/lead-form/parokonvektomat-electrolux.json
content/components/lead-form/parokonvektomat-lainox.json
data/page-metadata.json
root HTML для этих 5 страниц
generated слой после sync
```

Не откатывать весь проект, чтобы не потерять Прогоны 1–4.

## 8. Следующий логичный этап

Следующий этап: **Прогон 6 — SEO hygiene / schema / sitemap / canonical**.

Цель следующего этапа — не переписывать контент, а проверить после всех изменений:

```text
title / description / H1;
canonical;
robots;
sitemap;
FAQ schema;
Service schema;
cluster links;
index/noindex protect pages.
```
