# Пищеварочные котлы — итоговый changelog и rollout handoff

**Проект:** MosPochin / `KomarovAI/Mospochin_site`
**Дата:** 20 июля 2026 года
**Базовый подтверждённый production SHA исходного handoff:** `173081dc6723eedae8707337e1c8bdfde608ba8f`
**Статус до выполнения launcher:** `READY_FOR_ROLLOUT` — production ещё не подтверждён.

## Итог кластера

- 39 индексируемых страниц пищеварочных котлов;
- 27 существующих страниц пересобраны;
- 12 новых страниц добавлены;
- один пересекающийся Abat/КПЭМ URL переведён на постоянный 301;
- 9 функциональных систем: нагрев, рубашка/уровень, давление/безопасность, температура, мешалка, опрокидывание, залив/слив, электроника, охлаждение;
- 5 доказательных карточек ошибок Abat КПЭМ: E01, E02, E04, H20/H2O, E17;
- центральный поиск по коду, алиасам, модели, системе и влиянию на эксплуатацию;
- 618 внутренних переходов, 0 индексируемых сирот, минимум 4 уникальных донора;
- 14 страниц Call, 23 Photo, 2 Reference;
- 37 унифицированных форм и 37 мобильных панелей;
- 17 событий аналитики без дублирующих отправок;
- медиасистема на всех 39 страницах: 3 размещения реального сервисного фото и 36 размещений технических SVG;
- runtime-данные поиска опубликованы корневым asset `kettle-error-search-data.js` и не зависят от `/data/*.json` в браузере.

## Проверки до rollout

- статическая регрессия: 39/39 PASS;
- browser smoke: 78/78 desktop/mobile PASS;
- формы и аналитика: 6/6 сценариев PASS;
- поиск: 5/5 запросов PASS;
- битые локальные ссылки: 0;
- horizontal overflow: 0;
- ручной visual review: PASS;
- Nginx syntax: PASS;
- ZIP и внутренние SHA-256: PASS.

## Что обязан доказать production rollout

Статус `VERIFIED_OK` разрешён только если одновременно подтверждены:

1. patch применён к свежему `origin/main` без конфликтов;
2. native `npm run check:deploy` и `npm run check:ai` успешны;
3. новый commit отправлен fast-forward в `main`;
4. exact GitHub Actions runs `Validate Site` и `Deploy to VPS` для release SHA завершились `success`;
5. `/version.json` содержит этот release SHA в `source.githubSha`;
6. все 39 страниц и ключевые runtime assets отвечают HTTP 200;
7. старый `/pishevarochnyj-kotel-abat-kpem.html` отвечает постоянным редиректом на `/remont-pishevarochnyh-kotlov-kpem.html`.

До выполнения всех семи условий patch или source archive не является production-релизом.
