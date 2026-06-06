# Parokonvektomat Cluster AI Guide

Этот документ — рабочая карта кластера пароконвектоматов. Его цель: чтобы AI-агент понимал кластер как систему, а не как набор похожих HTML-файлов.

## 1. Роль кластера

Кластер закрывает коммерческие запросы по ремонту пароконвектоматов для ресторанов, кафе, пекарен и dark kitchen. Главный фокус: заявки, звонки, WhatsApp, диагностика на объекте.

Не превращать кластер в справочник. Технические объяснения нужны только в объёме, который помогает клиенту понять проблему и оставить заявку.

## 2. Список страниц

Источник машинного контракта:

```bash
cat data/parokonvektomat-conversion-pages.json
```

| Страница | Роль | Индексация | Ветка |
|---|---|---:|---|
| `parokonvektomaty.html` | hub | index | restaurant |
| `parokonvektomaty-promo.html` | promo | noindex | restaurant |
| `parokonvektomat-rational.html` | brand P0 | index | restaurant |
| `parokonvektomat-rational-e9.html` | error | index | restaurant |
| `parokonvektomat-unox.html` | brand P0 | index | restaurant |
| `parokonvektomat-unox-af02-af08.html` | error | index | restaurant |
| `parokonvektomat-kod-oshibki.html` | error hub | index | restaurant |
| `parokonvektomat-e02-e07-e10.html` | error | index | restaurant |
| `parokonvektomat-ne-greet.html` | symptom | index | restaurant |
| `parokonvektomat-net-para.html` | symptom | index | restaurant |
| `parokonvektomat-abat.html` | brand | index | neutral contract |
| `parokonvektomat-convotherm.html` | brand | index | neutral contract |
| `parokonvektomat-electrolux.html` | brand | index | neutral contract |
| `parokonvektomat-lainox.html` | brand | index | neutral contract |
| `parokonvektomat-obschuzhivanie.html` | service | index | neutral contract |
| `remont-oborudovaniya-restorana-parokonvektomat.html` | promo | noindex | restaurant |

Важно: старые брендовые страницы по смыслу B2B/restaurant, но в текущем контракте проекта часть из них остаётся `neutral`. Не менять `branch` точечно в metadata, пока не сделана полноценная миграция registry/slots.

## 3. P0/P1/P2 стратегия

P0 уже создан и стабилизирован:

- `parokonvektomat-rational.html`;
- `parokonvektomat-unox.html`.

Не создавать P1/P2 без данных Метрики/Директа/Вебмастера.

Запрещено вслепую плодить:

- `parokonvektomat-fagor.html`;
- `parokonvektomat-rational-e6.html`;
- `parokonvektomat-unox-af01.html`;
- `parokonvektomat-techet.html`;
- `parokonvektomat-ten.html`;
- `parokonvektomat-datchik-temperatury.html`;
- `parokonvektomat-vybivaet-avtomat.html`.

Сначала нужны поисковые запросы/конверсии.

## 4. Где править direct-страницы

Direct landing pages управляются через:

```bash
data/direct-landing-pages.json
tools/generate-direct-landings.mjs
```

После правки direct manifest или generator:

```bash
npm run generate:direct-landings
npm run verify:fast
```

Не добавлять блоки только в root HTML direct-страницы: генератор может их стереть.

## 5. Где лежат важные блоки

| Слой | Назначение |
|---|---|
| `data/direct-landing-pages.json` | direct content, related links, fault blocks, brand context для direct P0 |
| `src/pages/<slug>/sections/*` | уникальные source-секции старых страниц |
| `src/components/shared/*` | переиспользуемые секции |
| `content/components/lead-form/*` | тексты/props форм |
| `data/parokonvektomat-conversion-pages.json` | machine-readable контракт кластера |
| `data/parokonvektomat-screenshot-audit.json` | список страниц/viewport для визуального аудита |

## 6. Перелинковка

Текущий целевой стандарт:

- хаб ссылается широко;
- брендовые страницы ссылаются на хаб, симптомы, ошибки, promo и соседние бренды;
- симптомные страницы ссылаются на бренды и коды ошибок;
- error-страницы ссылаются на бренд, error hub, симптомы и promo;
- self-link запрещён;
- 404 запрещён.

Минимум проверяется командой:

```bash
npm run check:conversion-ui
```

Нельзя делать all-to-all без смысла. Лучше 8–12 релевантных ссылок на странице, чем SEO-спам.

## 7. Контентные правила

Писать коммерчески:

- как проявляется поломка;
- что может быть причиной;
- что отправить мастеру;
- когда остановить аппарат;
- как вызвать инженера.

Не писать:

- инструкции самостоятельного ремонта;
- таблицы на 50 кодов;
- точные диагнозы “ошибка X = деталь Y” без диагностики;
- длинные справочные полотна;
- новые страницы без данных.

Оптимальный баланс:

```text
70% коммерческий смысл
20% техническое объяснение
10% SEO-формулировки
```

## 8. Индексация

Indexable страницы должны быть в sitemap и без `noindex`.

Promo/noindex страницы:

- `parokonvektomaty-promo.html`;
- `remont-oborudovaniya-restorana-parokonvektomat.html`.

Они могут иметь `noindex,follow` и отсутствовать в sitemap. Не снимать `noindex` без отдельного стратегического решения.

## 9. Обязательные проверки после правок кластера

```bash
npm run generate:direct-landings   # если трогался direct manifest/generator
npm run build:site -- --write      # если менялись source-секции не через генератор
npm run generate:sitemap           # если менялась индексация/metadata/страницы
npm run sync:generated             # если затронуты AI/deploy/source reports
npm run check:core                 # быстрый обязательный слой
npm run check:conversion-ui        # кластерные формы/CTA/links/index logic
```

Перед handoff использовать единый low-resource профиль:

```bash
npm run check:handoff
```

Перед продом или после визуальных правок:

```bash
npm run check:full
```

## 10. Ручной визуальный контроль

Для визуальной проверки кластера:

```bash
npm run setup:visual
npm run audit:parokonvektomat-screenshots
```

Если Playwright недоступен в среде, указать это в handoff и попросить прогнать на рабочей машине.
