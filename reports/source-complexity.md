# Source Complexity Report

Детерминированный отчёт для сжатия исходного смысла проекта. Он не оценивает визуал, а показывает, где AI тратит больше всего контекста.

## Сводка

| Метрика | Значение |
| --- | --- |
| Root HTML pages | 37 |
| Builder pages | 37 |
| src/pages files | 1576 |
| src/pages HTML section files | 1539 |
| Shared component files | 32 |
| Parametric template files | 14 |
| Parametric props files | 12 |
| Total declared sections | 1930 |
| Local sections | 1428 |
| Shared section refs | 289 |
| Parametric section refs | 213 |
| Compressed refs | 502 |
| Shared/parametric coverage | 26.0% |
| Average sections/page | 52.2 |
| Average source files/page | 56.5 |
| Root HTML bytes | 4.11 MB |
| src/pages HTML bytes | 2.78 MB |
| Shared HTML bytes | 139.0 KB |
| Estimated duplicate bytes removed by shared components | 1.09 MB |


## Самые сложные страницы по количеству секций

| Page | Sections | Local | Shared refs |
| --- | --- | --- | --- |
| remont-oborudovaniya-restorana-parokonvektomat.html | 77 | 47 | 23 |
| parokonvektomat-e02-e07-e10.html | 76 | 49 | 20 |
| parokonvektomat-kod-oshibki.html | 76 | 49 | 20 |
| parokonvektomat-ne-greet.html | 76 | 48 | 21 |
| parokonvektomat-net-para.html | 76 | 48 | 21 |
| parokonvektomat-abat.html | 74 | 47 | 20 |
| parokonvektomat-convotherm.html | 74 | 47 | 20 |
| parokonvektomat-electrolux.html | 74 | 49 | 18 |
| parokonvektomat-lainox.html | 74 | 47 | 20 |
| parokonvektomat-rational-e9.html | 74 | 47 | 20 |
| parokonvektomat-unox-af02-af08.html | 74 | 47 | 20 |
| parokonvektomaty-promo.html | 74 | 46 | 21 |


## Самые тяжёлые страницы по локальному source HTML

| Page | Local source | Sections |
| --- | --- | --- |
| holodilniki.html | 143.9 KB | 51 |
| routery.html | 142.7 KB | 52 |
| posudomoyki.html | 134.4 KB | 53 |
| plity.html | 133.8 KB | 48 |
| water-heaters.html | 132.6 KB | 49 |
| holodilnoe-oborudovanie.html | 118.1 KB | 64 |
| kompyutery.html | 113.9 KB | 55 |
| stiralnye-mashiny.html | 107.2 KB | 50 |
| posudomoechnye-mashiny.html | 104.9 KB | 64 |
| ice-machines.html | 102.3 KB | 64 |
| plity-pechi.html | 98.4 KB | 34 |
| grili-mangaly.html | 97.8 KB | 61 |


## Компоненты по количеству секций

| Component | Total | Local | Shared refs | Parametric refs | Compressed % |
| --- | --- | --- | --- | --- | --- |
| raw | 732 | 708 | 24 | 0 | 3% |
| pricing | 280 | 164 | 116 | 0 | 41% |
| proof | 256 | 202 | 54 | 0 | 21% |
| mobile-contact | 139 | 65 | 2 | 72 | 53% |
| section | 78 | 63 | 15 | 0 | 19% |
| faq | 72 | 61 | 11 | 0 | 15% |
| related-links | 68 | 42 | 26 | 0 | 38% |
| contact-cta | 66 | 38 | 28 | 0 | 42% |
| breadcrumb | 53 | 20 | 13 | 20 | 62% |
| noscript | 40 | 4 | 0 | 36 | 90% |
| lead-form | 37 | 25 | 0 | 12 | 32% |
| runtime-partials | 37 | 0 | 0 | 37 | 100% |
| footer-anchor | 36 | 0 | 0 | 36 | 100% |
| hero | 35 | 35 | 0 | 0 | 0% |
| body-preamble | 1 | 1 | 0 | 0 | 0% |


## Главные shared components по экономии

| Component file | Refs | Pages | Saved |
| --- | --- | --- | --- |
| src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--49df61a84592b2cf.html | 12 | 12 | 116.3 KB |
| src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--e1cca13f78f777a0.html | 13 | 13 | 106.9 KB |
| src/components/shared/pricing/pricing-remontiruem-vse-tipy-parokonvektomatov--716e30e482bc8a8d.html | 12 | 12 | 81.5 KB |
| src/components/shared/pricing/pricing-ceny-na-remont-parokonvektomatov--d39ef7445dadc813.html | 13 | 13 | 73.5 KB |
| src/components/shared/proof/proof-chto-govoryat-shef-povara-i-upravlyayuschie--e94fa2cfbc1265d5.html | 13 | 13 | 70.1 KB |
| src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--8a089715e4395424.html | 11 | 11 | 67.0 KB |
| src/components/shared/pricing/pricing-faktory-stoimosti-remonta--c35e37bf08c85b74.html | 13 | 13 | 64.4 KB |
| src/components/shared/proof/proof-pochemu-500-restoranov-vybrali-nas--16061bbc70a958f9.html | 13 | 13 | 59.8 KB |
| src/components/shared/pricing/pricing-vyberite-problemu-pokazhem-cenu--5d86ccad444cb9af.html | 13 | 13 | 58.4 KB |
| src/components/shared/proof/proof-kakie-metriki-derzhim-po-zayavke-restorana--49039622d5ec9ff8.html | 18 | 18 | 53.5 KB |
| src/components/shared/pricing/pricing-chto-poluchaet-kuhnya-posle-remonta--28e81f493d341dd3.html | 13 | 13 | 47.3 KB |
| src/components/shared/pricing/pricing-kak-prohodit-remont-bez-lishnego-haosa-dlya-kuhni--7df4ed8c17f2f042.html | 12 | 12 | 39.4 KB |


## Возможности для следующего сжатия смысла

- **high** / componentize-local-sections: raw: 708 локальных секций, shared ratio 3% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: proof: 202 локальных секций, shared ratio 21% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: section: 63 локальных секций, shared ratio 19% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: faq: 61 локальных секций, shared ratio 15% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: lead-form: 25 локальных секций, shared ratio 32% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: hero: 35 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / page-blueprint: remont-oborudovaniya-restorana-parokonvektomat.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-e02-e07-e10.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-kod-oshibki.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-ne-greet.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-net-para.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-abat.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-convotherm.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-electrolux.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-lainox.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-rational-e9.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / raw-section-reduction: parokonvektomat-e02-e07-e10.html: 37 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **high** / raw-section-reduction: parokonvektomat-kod-oshibki.html: 37 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **high** / raw-section-reduction: parokonvektomat-ne-greet.html: 37 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **high** / raw-section-reduction: parokonvektomat-abat.html: 36 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.

## Как читать этот отчёт

- Много `local` секций у компонента = кандидат на параметризованный компонент.
- Много секций на странице = кандидат на page blueprint.
- Много `raw` секций = AI хуже понимает смысл блока; стоит переклассифицировать или объединить.
- Shared coverage — не цель сама по себе: важнее отделить смысловые props от HTML-разметки.
