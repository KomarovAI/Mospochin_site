# Page Digest — obsluzhivanie-kutterov.html

- Branch: restaurant
- Role: service
- Title: Обслуживание профессиональных куттеров в Москве | MosPochin
- Description: Проверка и обслуживание куттеров: ножи, чаша, крышка, скребок, уплотнения, защитные выключатели, тормоз, двигатель и работа под нагрузкой.
- H1: Обслуживание профессиональных куттеров
- Canonical: https://mospochin.ru/obsluzhivanie-kutterov.html
- Builder model: src/pages/obsluzhivanie-kutterov/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 414

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| faq | 1 |
| footer-anchor | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Обслуживание профессиональных куттеров | breadcrumb | 17.0 KB | 355 | no | src/pages/obsluzhivanie-kutterov/sections/002-breadcrumb-obsluzhivanie-professional-nyh-kutterov.html |
| FAQ — частые вопросы | faq | 1.7 KB | 59 | no | src/pages/obsluzhivanie-kutterov/sections/090-faq.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/obsluzhivanie-kutterov/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- obsluzhivanie-kutterov.html
- src/site-builder.json
- src/pages/obsluzhivanie-kutterov/page.json
- src/pages/obsluzhivanie-kutterov/sections/

## Checks

- npm run doctor:page -- --page obsluzhivanie-kutterov.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page obsluzhivanie-kutterov.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
