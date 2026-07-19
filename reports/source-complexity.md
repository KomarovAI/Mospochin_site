# Source Complexity Report

Детерминированный отчёт для сжатия исходного смысла проекта. Он не оценивает визуал, а показывает, где AI тратит больше всего контекста.

## Сводка

| Метрика | Значение |
| --- | --- |
| Root HTML pages | 503 |
| Builder pages | 503 |
| src/pages files | 6401 |
| src/pages HTML section files | 5335 |
| Shared component files | 215 |
| Parametric template files | 255 |
| Parametric props files | 189 |
| Total declared sections | 6984 |
| Local sections | 3796 |
| Shared section refs | 349 |
| Parametric section refs | 2839 |
| Compressed refs | 3188 |
| Shared/parametric coverage | 45.6% |
| Average sections/page | 13.9 |
| Average source files/page | 19.2 |
| Root HTML bytes | 23.41 MB |
| src/pages HTML bytes | 17.28 MB |
| Shared HTML bytes | 762.5 KB |
| Estimated duplicate bytes removed by shared components | 560.1 KB |


## Самые сложные страницы по количеству секций

| Page | Sections | Local | Shared refs |
| --- | --- | --- | --- |
| parokonvektomaty.html | 77 | 45 | 10 |
| parokonvektomat-abat.html | 75 | 23 | 15 |
| remont-oborudovaniya-restorana-parokonvektomat.html | 73 | 21 | 14 |
| parokonvektomaty-promo.html | 67 | 20 | 15 |
| parokonvektomat-convotherm.html | 64 | 20 | 7 |
| parokonvektomat-electrolux.html | 64 | 22 | 5 |
| parokonvektomat-lainox.html | 64 | 20 | 7 |
| grili-mangaly.html | 63 | 43 | 2 |
| parokonvektomat-e02-e07-e10.html | 55 | 17 | 6 |
| parokonvektomat-rational-e9.html | 55 | 17 | 6 |
| parokonvektomat-rational.html | 55 | 17 | 6 |
| parokonvektomat-unox-af02-af08.html | 55 | 17 | 6 |


## Самые тяжёлые страницы по локальному source HTML

| Page | Local source | Sections |
| --- | --- | --- |
| parokonvektomaty.html | 138.2 KB | 77 |
| routery.html | 123.7 KB | 50 |
| plity-pechi.html | 105.5 KB | 36 |
| grili-mangaly.html | 104.0 KB | 63 |
| kompyutery.html | 100.0 KB | 53 |
| parokonvektomat-obschuzhivanie.html | 87.7 KB | 32 |
| pishevarochnye-kotly.html | 82.7 KB | 45 |
| water-heaters.html | 78.3 KB | 44 |
| bytovaya-contact.html | 75.8 KB | 16 |
| bytovaya-about.html | 69.5 KB | 46 |
| stiralnye-mashiny.html | 69.4 KB | 28 |
| diagnostika-vodonagrevatelya.html | 67.1 KB | 40 |


## Компоненты по количеству секций

| Component | Total | Local | Shared refs | Parametric refs | Compressed % |
| --- | --- | --- | --- | --- | --- |
| mobile-contact | 1490 | 608 | 0 | 882 | 59% |
| layout-fragment | 938 | 0 | 0 | 938 | 100% |
| section | 742 | 532 | 123 | 87 | 28% |
| proof | 562 | 345 | 14 | 203 | 39% |
| pricing | 483 | 380 | 84 | 19 | 21% |
| faq | 466 | 421 | 38 | 7 | 10% |
| breadcrumb | 437 | 185 | 0 | 252 | 58% |
| lead-form | 373 | 340 | 17 | 16 | 9% |
| contact-cta | 354 | 258 | 0 | 96 | 27% |
| raw | 181 | 107 | 26 | 48 | 41% |
| body-preamble | 172 | 172 | 0 | 0 | 0% |
| footer-anchor | 171 | 3 | 0 | 168 | 98% |
| runtime-partials | 166 | 74 | 0 | 92 | 55% |
| related-links | 150 | 114 | 35 | 1 | 24% |
| hero | 93 | 93 | 0 | 0 | 0% |
| cause-matrix | 22 | 22 | 0 | 0 | 0% |
| decision-tree | 22 | 22 | 0 | 0 | 0% |
| related-symptoms | 22 | 22 | 0 | 0 | 0% |
| repair-scope | 22 | 22 | 0 | 0 | 0% |
| safe-self-check | 22 | 0 | 0 | 22 | 100% |


## Главные shared components по экономии

| Component file | Refs | Pages | Saved |
| --- | --- | --- | --- |
| src/components/shared/related-links/related-links-prodolzhit-diagnostiku-po-sosednemu-scenariy--f2c7ccf9788a9b3e.html | 14 | 14 | 41.5 KB |
| src/components/shared/section/section-bezopasnye-deystviya-do-vyezda--0f25f0b2a5c741ae.html | 14 | 14 | 35.5 KB |
| src/components/shared/section/section-chto-utochnyaem-do-vyezda--b160a4351b7919db.html | 14 | 14 | 35.5 KB |
| src/components/shared/pricing/pricing-ot-chego-zavisit-smeta--dcac3d7a31de3b66.html | 14 | 14 | 33.8 KB |
| src/components/shared/section/section-chto-utochnyaem-do-vyezda--da4d06759e5b2ca7.html | 11 | 11 | 27.7 KB |
| src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--9302e2410efc79af.html | 5 | 5 | 26.3 KB |
| src/components/shared/pricing/pricing-kak-formiruyutsya-stoimost-i-srok-remonta--10b13373c68636ab.html | 13 | 13 | 22.9 KB |
| src/components/shared/faq/faq-chastye-voprosy-po-remontu--f74d3505aafe0fc9.html | 6 | 6 | 17.3 KB |
| src/components/shared/section/section-pochemu-proverki-polzovatelya-ogranicheny-vneshnim--d52a5af6fcd9f74e.html | 15 | 15 | 16.4 KB |
| src/components/shared/proof/proof-ne-prosto-statya-a-stranica-pod-zayavku--ce9c82e757dac360.html | 8 | 8 | 14.9 KB |
| src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--2419627029e3672a.html | 3 | 3 | 13.2 KB |
| src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--d15f88b47a30bdfb.html | 3 | 3 | 13.2 KB |


## Возможности для следующего сжатия смысла

- **high** / componentize-local-sections: section: 532 локальных секций, shared ratio 28% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: pricing: 380 локальных секций, shared ratio 21% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: faq: 421 локальных секций, shared ratio 10% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: lead-form: 340 локальных секций, shared ratio 9% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: contact-cta: 258 локальных секций, shared ratio 27% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: body-preamble: 172 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: related-links: 114 локальных секций, shared ratio 24% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: hero: 93 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: cause-matrix: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: decision-tree: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: related-symptoms: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: repair-scope: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: stop-use: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / page-blueprint: parokonvektomaty.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-abat.html: 75 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: remont-oborudovaniya-restorana-parokonvektomat.html: 73 секций — кандидат на page blueprint вместо длинного списка sections.
- **medium** / raw-section-reduction: bytovaya-about.html: 16 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **medium** / raw-section-reduction: grili-mangaly.html: 13 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **medium** / raw-section-reduction: kompyutery.html: 13 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **medium** / raw-section-reduction: pishevarochnye-kotly.html: 13 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.

## Как читать этот отчёт

- Много `local` секций у компонента = кандидат на параметризованный компонент.
- Много секций на странице = кандидат на page blueprint.
- Много `raw` секций = AI хуже понимает смысл блока; стоит переклассифицировать или объединить.
- Shared coverage — не цель сама по себе: важнее отделить смысловые props от HTML-разметки.
