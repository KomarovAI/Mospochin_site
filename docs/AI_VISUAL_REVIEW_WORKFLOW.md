# MosPochin — AI visual review workflow

Этот документ фиксирует обязательный цикл для визуальных правок сайта. `check:core`, `check:visible-copy`, SEO/schema guards и deploy guards не заменяют просмотр скриншотов нейронкой/ревьюером.

## Главный принцип

Правильный цикл:

```bash
npm run build:site -- --write
npm run sync:generated
npm run check:core
npm run setup:visual
npm run visual:ai-pack:smoke
# нейронка открывает screenshots из reports/visual-ai-review/latest/AI_VISUAL_REVIEW.md
# нейронка заполняет reports/visual-ai-review/latest/review.json
# если есть issues — правки, build/sync/check, снова visual:ai-pack:smoke
npm run check:ai-visual-review
```

Для полного пароконвектоматного кластера:

```bash
npm run visual:ai-pack:pariki
# затем AI review + повторный screenshot pass после исправлений
npm run check:ai-visual-review
```

## Что именно смотрит нейронка на скриншотах

- Нет видимых служебных/dev/AI слов: `SEO-блок`, `hub`, `хаб`, `repair bridge`, `landing`, `B2B-посадочная`, `winner`, `Stage`, `P0/P1`, `handoff`, `rollback`, `generated`, `runtime`, `source of truth`, `guardrail`.
- Первый экран понятен обычному клиенту: что сломалось, кто чинит, куда нажать.
- На mobile 390/393 sticky CTA не перекрывает ключевой текст, форму и кнопки.
- Видимый телефон везде `8 (999) 005-71-72`, клики ведут на `tel:+79990057172`.
- Нет визуальных нулей в proof/KPI: `0 ресторанов`, `0 ремонтов`, `0 лет` и похожего.
- CTA звучат человечески, без внутренних ярлыков: `Отправить фото`, `Позвонить инженеру`, `Вызвать мастера`.
- Hub, brand, error и symptom страницы визуально/смыслово различаются, а не выглядят клонами.
- Форма читается, поля не обрезаны, placeholder/label не выглядят техническими.
- На desktop 1440 нет очевидных пустот, налезаний, сломанной сетки или слишком длинного hero.

## Почему нужен review.json

`reports/visual-ai-review/latest/review.json` — это не автотест. Его заполняет AI/human reviewer после просмотра картинок. Команда:

```bash
npm run check:ai-visual-review
```

падает, пока:

- `finalStatus` не равен `pass`;
- каждый screenshot item не имеет `status: "pass"`;
- screenshot-файлы отсутствуют;
- review не был заполнен после фактического просмотра.

Так проект защищается от ситуации, когда технические проверки прошли, но на странице видна служебная фраза или сломан первый экран.

## Если среда не умеет запускать браузер

Если `npm run setup:visual` или screenshot audit падают из-за браузера, DNS, apt, system dependencies или browser policy, это нужно честно писать в отчёте. В таком случае архив нельзя считать прошедшим browser visual review. Нужно запускать visual workflow в локальной среде, VPS/CI или Playwright Docker, где Chromium реально снимает screenshots.

## Что не хранить в git/archive как зависимость

Не нужно класть в проект:

- `node_modules/`;
- скачанные браузерные бинарники Playwright;
- `ms-playwright/`;
- старые screenshots как единственный source of truth.

Хранить нужно скрипты, manifests, docs и итоговый review report для конкретного прогона.

## Жёсткая финальная команда

Перед финальным архивом после визуальных/контентных правок можно использовать:

```bash
npm run check:final-visual-review
```

Она намеренно не является частью `check:core`, потому что требует реального браузера и заполненного AI review. Если команда падает на `check:visual-env` или screenshot capture, значит среда не подходит для визуального ревью. Если падает на `check:ai-visual-review`, значит screenshots есть, но нейронка ещё не посмотрела изображения и не подтвердила результат.
