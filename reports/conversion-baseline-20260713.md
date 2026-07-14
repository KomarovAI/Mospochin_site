# Conversion baseline — 2026-07-13

## Scope

Первый P0-цикл выполняется на money pages ресторанного направления:

- `index.html`
- `uslugi.html`
- `contact.html`
- `parokonvektomaty.html`
- `plity-pechi.html`
- `holodilnoe-oborudovanie.html`
- `posudomoechnye-mashiny.html`
- `grili-mangaly.html`
- `ice-machines.html`
- `pishevarochnye-kotly.html`

## Structural baseline before P0

- 115 HTML-страниц.
- 183 формы.
- 390 `tel:` ссылок.
- 1 823 упоминания/ссылки WhatsApp в production HTML.
- 1 530 уникальных локальных HTML-ссылок.
- 85 блоков `related-links`.
- 98 FAQ-зон.

Это техническое покрытие, а не фактическая конверсия. Live CTR, завершение форм и качество лидов нельзя выводить из количества элементов, поэтому после rollout сравниваем события по `page_path`, `cta_group`, `block`, `page_intent` и `equipment`.

## P0 hypothesis

Упростить первый выбор пользователя до двух действий:

1. `Позвонить инженеру` — для срочной ситуации.
2. `Отправить фото в WhatsApp` — для модели, ошибки и симптома.

Третьим маршрутом остаются контекстные ссылки по симптомам и оборудованию, но они не должны конкурировать с двумя основными CTA.

## Success checks

- hero содержит телефонный и WhatsApp CTA;
- CTA имеют уникальные `data-cta-id`, `data-cta-group` и `data-block`;
- внутренние symptom-route ссылки используют обычный `<a href>` и descriptive anchor text;
- нет неподтверждённых рейтингов, отзывов, часов работы или обещаний скорости;
- `check:conversion-ui`, `check:handoff`, broken-link audit и visual matrix проходят после сборки.
