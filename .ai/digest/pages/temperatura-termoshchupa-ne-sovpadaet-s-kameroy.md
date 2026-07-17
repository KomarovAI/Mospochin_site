# Page Digest — temperatura-termoshchupa-ne-sovpadaet-s-kameroy.html

- Branch: restaurant
- Role: branch
- Title: Температура термощупа не совпадает с камерой шокера | MosPochin
- Description: Почему температура продукта по термощупу отличается от воздуха камеры: тепловая инерция, положение иглы, контакт, калибровка и разные датчики.
- H1: Температура термощупа не совпадает с температурой камеры
- Canonical: https://mospochin.ru/temperatura-termoshchupa-ne-sovpadaet-s-kameroy.html
- Builder model: src/pages/temperatura-termoshchupa-ne-sovpadaet-s-kameroy/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 803

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| breadcrumb | 1 |
| contact-cta | 1 |
| faq | 1 |
| footer-anchor | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Температура термощупа не совпадает с температурой камеры | breadcrumb | 42.9 KB | 743 | no | src/pages/temperatura-termoshchupa-ne-sovpadaet-s-kameroy/sections/002-breadcrumb-temperatura-termoschupa-ne-sovpadaet-s-te.html |
| Частые вопросы | faq | 1.6 KB | 60 | no | src/pages/temperatura-termoshchupa-ne-sovpadaet-s-kameroy/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/temperatura-termoshchupa-ne-sovpadaet-s-kameroy/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/temperatura-termoshchupa-ne-sovpadaet-s-kameroy/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- temperatura-termoshchupa-ne-sovpadaet-s-kameroy.html
- src/site-builder.json
- src/pages/temperatura-termoshchupa-ne-sovpadaet-s-kameroy/page.json
- src/pages/temperatura-termoshchupa-ne-sovpadaet-s-kameroy/sections/

## Checks

- npm run doctor:page -- --page temperatura-termoshchupa-ne-sovpadaet-s-kameroy.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page temperatura-termoshchupa-ne-sovpadaet-s-kameroy.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
