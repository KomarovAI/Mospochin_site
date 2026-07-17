# MosPochin — Prog9 cleanup: удаление видимых служебных SEO/AI-формулировок

Дата: 2026-06-08  
База: `mospochin-site-stage6-prog8-final-qa-20260608.zip`  
Назначение: исправить найденный после финального QA долг — на пользовательских страницах остались видимые внутренние формулировки из рабочего ТЗ/разработки.

## Что было найдено

В финальном архиве Prog8 в видимом тексте некоторых страниц действительно оставались служебные формулировки, которые нельзя показывать пользователю:

- `SEO + конверсия / hub`
- `repair bridge`
- `B2B-посадочная`
- `Страница усилена как брендовая B2B-посадочная...`
- `Winner-страница...`
- `neutral-branch`
- `хаб`, `кластер` в маркетинговом/внутреннем смысле
- описания вроде `кликабельные переходы на посадочные`

Это был не баг сборки, а ошибка копирайта: внутренние рабочие термины попали в visible HTML.

## Что исправлено

Служебные формулировки заменены на нормальный пользовательский текст:

| Было | Стало |
|---|---|
| `SEO + конверсия / hub` | `Ремонт и диагностика` |
| `repair bridge` | `Коды ошибок пароконвектомата` / `Ошибка Rational E9` / `Ошибки Unox AF02/AF08` |
| `B2B-посадочная` | `ремонт оборудования ресторана...` / `страница для срочного обращения` |
| `Страница усилена... neutral-branch...` | описание того, какие данные нужны инженеру |
| `Winner-страница...` | описание срочного обращения по ошибке |
| `хаб`, `кластер` в visible copy | `раздел`, `направление`, `связанные разделы`, `быстрые переходы по ремонту` |
| `кликабельные переходы на посадочные` | `быстрые переходы на профильные страницы` |

## Затронутые зоны

Основные страницы:

- `parokonvektomaty.html`
- `parokonvektomaty-promo.html`
- `parokonvektomat-rational.html`
- `parokonvektomat-unox.html`
- `parokonvektomat-kod-oshibki.html`
- `parokonvektomat-rational-e9.html`
- `parokonvektomat-unox-af02-af08.html`
- `parokonvektomat-e02-e07-e10.html`
- `parokonvektomat-ne-greet.html`
- `parokonvektomat-net-para.html`
- `parokonvektomat-abat.html`
- `parokonvektomat-convotherm.html`
- `parokonvektomat-electrolux.html`
- `parokonvektomat-lainox.html`
- `parokonvektomat-obschuzhivanie.html`
- `remont-oborudovaniya-restorana-parokonvektomat.html`
- `uslugi.html`

Технически затронуты source/html/data/generated слои, потому что правки внесены source-first и затем пересобраны через builder.

## Пользовательский visible-text audit

Проверено 39 root HTML-страниц через HTML parser: из текста страниц удалялись `script`, `style`, `noscript`, HTML comments; затем искались служебные термины.

Результат:

```text
checked_html_pages=39
visible_bad_term_hits=0
```

Проверяемые термины:

```text
SEO, сео, repair bridge, B2B-посадоч, посадочная, winner, neutral-branch,
сбор лид, лидов, лиды, лидоген, конверсия / hub, direct, stage3, stage4,
source, builder, runtime, generated, прогон, нейрон, кликабельные переходы,
хаб, Внутри кластера, кластера, кластер, Аварийная посадочная,
Главная страница кластера, error-страниц
```

## Дополнительные контрольные проверки

```text
старый номер +7 (909) 994-61-77: точных совпадений нет
bad_zero_counter_fallback: 0
```

Важно: простой grep по `909` может ловить случайные hash-строки в `page.json`; точная проверка старого телефона делалась по `994-61-77`, `+7 (909)`, `909 994`, `909) 994`.

## Команды, которые прошли

```bash
npm run build:site -- --write
npm run site-builder:extract-shared
npm run sync:generated
npm run check:core
npm run check:handoff
npm run check:images
npm run deploy:pack
npm run check:deploy-runtime
```

Результат:

```text
check:core passed
check:handoff passed
check:images passed
deploy:pack passed
check:deploy-runtime passed
builder output: 39/39 HTML совпадают
conversion-runtime: passed
deploy-runtime: passed
parokonvektomat cluster: 16/16 pages ok, forms/links/index policy сохранены
```

## Что осталось как внешний долг

По коду и архиву критичных долгов после этого cleanup не найдено.

Единственное, что всё равно надо делать после выката: ручная live-проверка production в браузере на desktop 1440 и mobile 390. Это внешний post-deploy smoke, а не долг source-архива.

## Rollback

Если нужно откатить только этот cleanup, откатывать изменённые source/html/data/generated файлы по списку `mospochin_prog9_cleanup_changed_files.txt`. Полный откат проекта не нужен.
