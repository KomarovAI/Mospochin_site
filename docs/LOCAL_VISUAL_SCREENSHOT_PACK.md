# MosPochin — локальный screenshot ZIP для проверки нейронкой

Этот workflow нужен для реального цикла:

```text
локально снять screenshots → упаковать отдельный ZIP → загрузить ZIP в ChatGPT → нейронка смотрит PNG глазами → правки → повторный ZIP
```

Скриншоты не входят в production/public pack и не должны выкатываться на сайт. Это review-артефакт.

## Быстрый запуск

```bash
python3 -m venv .venv-visual
source .venv-visual/bin/activate
pip install -r requirements-visual.txt
python -m playwright install chromium

python tools/capture_visual_pack.py --mode smoke --zip
```

На Linux, если не хватает системных библиотек Chromium:

```bash
python -m playwright install --with-deps chromium
```

## Где будет ZIP

Скрипт создаёт папку вида:

```text
reports/visual-ai-review/20260609T012233Z/
```

Внутри будет ZIP:

```text
mospochin-visual-ai-review-pack-20260609T012233Z.zip
```

Его нужно загрузить в ChatGPT и попросить проверить screenshots.

## Режимы

```bash
# Ключевой smoke: главная, услуги, контакты, hub, Rational/Unox, error/symptom
python tools/capture_visual_pack.py --mode smoke --zip

# Весь пароконвектоматный кластер
python tools/capture_visual_pack.py --mode pariki --zip

# Все root HTML-страницы
python tools/capture_visual_pack.py --mode all --zip

# Одна/несколько страниц
python tools/capture_visual_pack.py --mode custom --page parokonvektomaty.html --page parokonvektomat-rational.html --zip
```

## Что внутри ZIP

```text
AI_VISUAL_REVIEW.md
manifest.json
environment.json
pages.json
review-template.json
screenshots/*.png
html-snapshots/*.html
logs/capture.log
logs/errors.json
```

## Viewports

По умолчанию снимаются:

```text
desktop 1440×1080 first screen
mobile 393×852 first screen
mobile 393×852 full page
```

## Что должна проверить нейронка

- Нет служебных слов: `SEO-блок`, `hub`, `repair bridge`, `landing`, `Stage`, `P0/P1`, `generated`, `handoff`.
- Первый экран понятен клиенту.
- Телефон видимый: `8 (999) 005-71-72`.
- Нет `0 ресторанов`, `0 ремонтов`, `0 лет`, `0 выездов`.
- Mobile sticky CTA не перекрывает важный контент.
- CTA человеческие и ведут к звонку/WhatsApp/форме.
- Hub / Rational / Unox / error / symptom страницы различаются.
- Error/symptom страницы выглядят как ремонтный сценарий, а не SEO-дор.
- Desktop 1440 без налезаний, дыр и странной сетки.
- Mobile 393 без каши из chips и перегруза.

## Если порт занят

```bash
python tools/capture_visual_pack.py --mode smoke --port 9999 --zip
```

## Если нужно использовать системный Chromium

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium \
  python tools/capture_visual_pack.py --mode smoke --zip
```

Или явно:

```bash
python tools/capture_visual_pack.py --mode smoke --executable-path /usr/bin/chromium --zip
```

## Dry-run без браузера

Для проверки manifest/структуры без запуска Chromium:

```bash
python tools/capture_visual_pack.py --mode smoke --dry-run --zip
```

Dry-run ZIP не содержит реальных PNG и не годится для визуального анализа, но полезен для проверки установки скрипта.

## Prog16: horizontal overflow guard

`tools/capture_visual_pack.py` теперь собирает browser metrics для каждого screenshot:

- `clientWidth`
- `scrollWidth`
- `overflowCssPx`
- `devicePixelRatio`

Результаты пишутся в ZIP:

```text
logs/visual-metrics.json
logs/visual-warnings.json
```

Для обычного visual pack предупреждения не ломают запуск, чтобы ZIP всё равно можно было отправить на AI-review:

```bash
python tools/capture_visual_pack.py --mode smoke --zip
```

Для строгого smoke, который должен падать при horizontal overflow на mobile:

```bash
python tools/capture_visual_pack.py --mode smoke --zip --fail-on-overflow
# или
npm run visual:local-pack:strict
```

По умолчанию guard ругается, если `scrollWidth` больше `clientWidth` более чем на `16px` CSS:

```bash
python tools/capture_visual_pack.py --mode smoke --zip --fail-on-overflow --overflow-tolerance-css-px 16
```

Нормальный mobile screenshot при viewport `393px` и `deviceScaleFactor=2` должен иметь PNG ширину около `786px`. Если full-page PNG получается сильно шире, например `1180–1280px`, почти всегда есть горизонтальный overflow.
