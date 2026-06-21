# MosPochin visual follow-up fix — 2026-06-20

## Зачем этот patch

После acceptance visual audit `e18271c / 27866583928` основные визуальные P1-проблемы были закрыты:

- header overlap на light kettle pages — PASS;
- counters на `/about.html` mobile — PASS;
- контраст `/contact.html` — PASS.

Оставшийся визуально-смысловой нюанс: на household-страницах, например `/water-heaters.html`, рядом с шапкой была маленькая pill-кнопка `🔧 Ресторанное оборудование`. По смыслу это branch switcher, но визуально она читалась как текущая категория страницы и могла конфликтовать с темой `Бытовая техника` / `Ремонт водонагревателей`.

## Что изменено

Файл:

```text
main.js
```

Правка:

```text
Было на household-pages:
  🔧 Ресторанное оборудование

Стало:
  ↔ Для ресторанов
  title/aria-label: Перейти в раздел ремонта ресторанного оборудования
```

Для restaurant-pages:

```text
Было:
  🏠 Бытовая техника

Стало:
  ↔ Для дома
  title/aria-label: Перейти в раздел ремонта бытовой техники
```

В mobile menu:

```text
Было:
  🔧 Перейти: Ресторанное оборудование
  🏠 Перейти: Бытовая техника

Стало:
  ↔ Перейти в ресторанный раздел
  ↔ Перейти в бытовой раздел
```

## Почему так

Мы не убираем branch switcher: он полезен для перехода между двумя ветками сайта. Но теперь текст не выглядит как текущая категория страницы. Это именно навигационный переключатель, а не смысловой chip страницы.

## Как применить

```bash
cd ~/raskatka_mospoch/Mospochin_site_repo || exit 1
unzip -o ~/Загрузки/mospochin_visual_followup_fix_2026-06-20_patch_only.zip -d .

node --check main.js
npm run check:core
npm run verify:metrics

git status --short
git add main.js
git commit -m "Clarify visual branch switcher labels"
git push origin main
```

## После деплоя проверить картинками

```bash
gh workflow run visual-audit.yml \
  -R KomarovAI/Mospochin_site \
  --ref main \
  -f scope=page \
  -f page="/water-heaters.html" \
  -f viewports=both \
  -f workers=2
```

Ожидаемый визуальный результат:

- на `/water-heaters.html` больше нет неоднозначного chip `Ресторанное оборудование`;
- вместо него виден понятный switch `↔ Для ресторанов`;
- hero, CTA и household subtitle остаются без изменений;
- desktop и mobile header не ломаются.
