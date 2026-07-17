# Component Digest — countdown

- Name: Countdown / таймер акции
- Appears in: 17 pages
- Keywords: таймер, countdown, акция, минут, секунд, скидк
- CSS selectors: [data-countdown-min], [data-countdown-sec]
- JS hooks: data-countdown-min, data-countdown-sec, querySelectorAll

## Related files

- main.js

## Risks

- На странице может быть несколько таймеров; обновлять нужно все элементы через querySelectorAll.

## Safe editing notes

- Не возвращай id="cd-min"/"cd-sec" — это ломает несколько таймеров.

## Representative pages

- grili-mangaly.html
- parokonvektomat-abat.html
- parokonvektomat-convotherm.html
- parokonvektomat-e02-e07-e10.html
- parokonvektomat-electrolux.html
- parokonvektomat-kod-oshibki.html
- parokonvektomat-lainox.html
- parokonvektomat-ne-greet.html
- parokonvektomat-net-para.html
- parokonvektomat-rational-e9.html
- parokonvektomat-rational.html
- parokonvektomat-unox-af02-af08.html
- parokonvektomat-unox.html
- parokonvektomaty-promo.html
- parokonvektomaty.html
- remont-oborudovaniya-restorana-parokonvektomat.html
- routery.html
