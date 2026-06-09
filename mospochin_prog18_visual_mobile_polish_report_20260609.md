# MosPochin — Prog18 visual mobile polish

Дата: 2026-06-09
База: `mospochin-site-stage6-prog17-visual-v2-mobile-hero-compact-20260609.zip`

## Что сделано

1. Добавлен CSS-патч `Prog18 visual audit pass` в `styles-combined.css`:
   - уменьшена фактическая высота mobile sticky footer;
   - уменьшены вертикальные padding-и sticky CTA;
   - сохранены три действия: звонок / WhatsApp / заявка;
   - добавлен стабильный mobile safe-space через `--mobile-sticky-safe-space`;
   - уплотнён mobile hero/form слой на страницах пароконвектоматного кластера;
   - улучшена читаемость KPI-карточек в mobile hero страницы `contact.html`;
   - чуть компактнее сделан первый экран `contact.html` на mobile.

2. Исправлен stale source label на странице плит:
   - было: `Почему 0 клиентов выбрали нас`;
   - стало: `Почему 500+ клиентов выбрали нас`;
   - переименован source-файл секции:
     `src/pages/plity/sections/022-proof-pochemu-500-klientov-vybrali-nas.html`.

3. Пересобран site-builder output:
   - `npm run build:site -- --write`;
   - `npm run sync:generated`.

## Проверки

Команда:

```bash
npm run check:core
```

Результат: `passed`.

Подтверждено:

- 39 root HTML совпадают с builder output;
- data contracts passed;
- conversion UI check passed: 16 parokonvektomat pages;
- conversion runtime guard passed;
- visible copy guard: bannedHits = 0;
- deploy runtime guard passed;
- FAQ registry актуален;
- scale policy passed.

Дополнительные grep-проверки:

```bash
grep -RIn "994-61-77\|\\+7 (909)" src content data *.html
grep -RIn "Почему 0 клиентов" src content data *.html
```

Критичных совпадений не найдено.

## Важное ограничение проверки

Локальный screenshot capture в этой sandbox-среде не удалось выполнить: системный Chromium через Playwright возвращал `net::ERR_BLOCKED_BY_ADMINISTRATOR` для `127.0.0.1` и `file://` URL. Это ограничение текущей среды, не проекта.

На локальном ПК владельца проекта нужно повторить:

```bash
python3 tools/capture_visual_pack.py --mode smoke --zip --fail-on-overflow
```

или на Windows:

```bat
python tools\capture_visual_pack.py --mode smoke --zip --fail-on-overflow
```

## Что осталось на следующий визуальный прогон

- Снять новый visual ZIP локально после Prog18.
- Сравнить mobile first screen по `/contact.html`, `/parokonvektomaty.html`, `parokonvektomat-kod-oshibki.html`.
- Если footer всё ещё давит форму на 393px — уменьшать уже не hero, а сам состав sticky footer или переводить третью кнопку `Заявка` в compact icon-only режим.
- Отдельный P1: визуально развести Rational / Unox / error / symptom страницы сильнее не только текстом, но и first-screen rhythm.
