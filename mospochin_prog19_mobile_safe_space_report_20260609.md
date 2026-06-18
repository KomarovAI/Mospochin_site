# MosPochin — Prog19 mobile safe-space final pass

Дата: 2026-06-09  
База: `mospochin-site-stage6-prog18-visual-mobile-polish-20260609.zip`  
Назначение: финальный mobile-only visual polish после Prog18 smoke screenshots.

## Цель

Закрыть остаточные визуальные замечания Prog18 без редизайна и без изменения коммерческого контента:

- mobile sticky footer всё ещё местами перекрывал низ первого экрана;
- `contact.html` inline CTA попадал под sticky footer;
- на `parokonvektomaty.html` hero-form начиналась тесно и частично упиралась в sticky;
- `index.html` и `uslugi.html` оставались тяжеловаты по вертикальному ритму на 393px.

## Изменённые файлы

```text
styles-combined.css
mospochin_prog19_mobile_safe_space_report_20260609.md
```

Root HTML и generated-файлы обновлены штатной сборкой.

## Что сделано

### 1. Mobile sticky footer

В `styles-combined.css` добавлен блок:

```text
Prog19 final mobile safe-space pass
```

Изменения:

- увеличен `--mobile-sticky-safe-space` до `8.25rem` / `8.35rem` для parokonvektomat pages;
- ещё чуть уменьшена фактическая высота sticky footer;
- уменьшены padding, radius, font-size и icon-size кнопок footer;
- сохранены 3 действия: `Позвонить`, `WhatsApp`, `Заявка`.

### 2. `contact.html` mobile

Проблема Prog18: дубль CTA `Позвонить и описать проблему` был частично под sticky footer.

Решение:

- уменьшены mobile hero top spacing, H1, lead, KPI spacing;
- inline CTA-row скрыт только на mobile, потому что fixed sticky footer уже даёт те же действия;
- KPI-блок сохранён видимым.

### 3. `parokonvektomaty.html` и весь parokonvektomat cluster

Проблема Prog18: useful form начиналась в зоне fixed footer.

Решение:

- уменьшен hero top padding;
- уменьшены hero badge/title/copy/actions;
- KPI-карточки в hero скрыты на mobile, так как они дублировали trust-смысл и съедали высоту;
- блок `Что прислать мастеру сразу` сделан горизонтальным compact-scroll вместо высокой вертикальной сетки;
- hero-form стала ниже по высоте: меньше padding, input height, submit height;
- увеличен bottom margin формы под sticky footer.

### 4. `index.html` и `uslugi.html` mobile

Изменения:

- уменьшен top padding hero;
- уплотнены badge, H1, lead, KPI-карточки и hero CTA;
- скрыты secondary trust строки/чипы в первом экране на mobile, чтобы основные CTA не залезали под sticky.

Desktop не затрагивался: весь патч внутри `@media (max-width: 640px)`.

## Проверки

Запущено:

```bash
npm run build:site -- --write
npm run sync:generated
npm run check:core
```

Результат:

```text
check-profile:core passed
```

Подтверждено:

- 39 root HTML совпадают с builder output;
- data contracts passed;
- validate-site passed;
- conversion UI check passed для 16 parokonvektomat pages;
- forms=2 / clusterLinks / indexability сохранены;
- conversion runtime guard passed;
- deploy runtime guard passed;
- visible copy guard: bannedHits=0;
- FAQ registry актуален;
- scale policy passed.

## Что нужно сделать локально

В sandbox screenshot capture не выполнялся. Для финального visual подтверждения снять на Linux Mint:

```bash
cd ~/mospochin-prog19/Mospochin_site-main
python3 -m venv .venv-visual
source .venv-visual/bin/activate
pip install -r requirements-visual.txt
python -m playwright install chromium
python -m playwright install-deps chromium
python tools/capture_visual_pack.py --mode smoke --zip --fail-on-overflow
```

Готовый ZIP будет в:

```text
reports/visual-ai-review/<timestamp>/mospochin-visual-ai-review-pack-<timestamp>.zip
```

## Риск

Низкий/средний:

- патч CSS-only;
- desktop untouched;
- формы, analytics, Telegram runtime, canonical, robots, sitemap не менялись;
- `check:core` passed.

Основной риск — визуальный: нужно подтвердить новым smoke screenshot pack, что mobile compacting не стал слишком плотным.
