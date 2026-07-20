# Кластер пароконвектоматов — изменения 2026-07-19

## Выполнено

- Добавлено 16 новых индексируемых посадочных страниц: 12 по симптомам/работам и 4 по дополнительным производителям.
- Главная страница `parokonvektomaty.html` получила полную карту кластера по симптомам и брендам.
- В существующие страницы добавлен блок сквозной контекстной перелинковки.
- Страницы про набор воды и течь получили релевантные технические фотографии.
- Исправлен ошибочный URL `parokonvektomat-obschuzhivanie.html`: создан правильный `parokonvektomat-obsluzhivanie.html`, старый URL оставлен как noindex fallback и добавлен 301 в nginx.
- Обновлены `sitemap.xml`, `data/page-metadata.json`, `data/restaurant-services.json`, `data/restaurant-branch.json` и `.deploy/include-files.txt`.
- На новых страницах добавлены Service и FAQPage JSON-LD, B2B-форма, канонические URL, OG-метаданные и уникальные CTA ID.

## Новые страницы

- `parokonvektomat-vybivaet-avtomat.html` — Пароконвектомат выбивает автомат
- `parokonvektomat-ne-rabotaet-ventilyator.html` — Не работает вентилятор пароконвектомата
- `parokonvektomat-ne-slivaet-vodu.html` — Пароконвектомат не сливает воду
- `parokonvektomat-ne-zakryvaetsya-dver.html` — Не закрывается дверь пароконвектомата
- `uplotnitel-dveri-parokonvektomata.html` — Уплотнитель двери пароконвектомата
- `parokonvektomat-peregrevaetsya.html` — Пароконвектомат перегревается
- `parokonvektomat-ne-rabotaet-displey.html` — Не работает дисплей пароконвектомата
- `dekalcinaciya-parokonvektomata.html` — Декальцинация пароконвектомата
- `zamena-tena-parokonvektomata.html` — Замена ТЭНа пароконвектомата
- `remont-platy-parokonvektomata.html` — Ремонт платы пароконвектомата
- `montazh-parokonvektomata.html` — Монтаж и подключение пароконвектомата
- `gazovyy-parokonvektomat-remont.html` — Ремонт газовых пароконвектоматов
- `parokonvektomat-fagor.html` — Ремонт пароконвектоматов Fagor Professional
- `parokonvektomat-tecnoeka.html` — Ремонт пароконвектоматов Tecnoeka
- `parokonvektomat-retigo.html` — Ремонт пароконвектоматов Retigo
- `parokonvektomat-mkn.html` — Ремонт пароконвектоматов MKN

## Решения по безопасности контента

- Коды ошибок не объявляются универсальными без модели и поколения панели.
- Для газовых аппаратов отдельно указана необходимость квалифицированной проверки газовой части.
- Для силовых неисправностей запрещены обход защит и увеличение номинала автомата.
- Для декальцинации исключены универсальные рецепты и смешивание химии.

## Источники, использованные для архитектуры кластера

- Официальные продуктовые страницы RATIONAL iCombi Pro и iCombi Classic.
- Официальные страницы UNOX CHEFTOP.
- Официальная таблица системных кодов Abat.
- Официальные страницы MKN FlexiCombi, SpaceCombi и WaveClean.
- Официальные страницы Retigo Vision, Tecnoeka, Fagor Professional и Electrolux Professional SkyLine.
- Московская сервисная выдача использована только для проверки коммерческого спроса по узлам: ТЭН, вентилятор, дверь, плата, декальцинация, вода и слив.
