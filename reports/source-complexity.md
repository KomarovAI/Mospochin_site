# Source Complexity Report

Детерминированный отчёт для сжатия исходного смысла проекта. Он не оценивает визуал, а показывает, где AI тратит больше всего контекста.

## Сводка

| Метрика | Значение |
| --- | --- |
| Root HTML pages | 39 |
| Builder pages | 39 |
| src/pages files | 1083 |
| src/pages HTML section files | 1044 |
| Shared component files | 43 |
| Parametric template files | 63 |
| Parametric props files | 14 |
| Total declared sections | 2127 |
| Local sections | 927 |
| Shared section refs | 330 |
| Parametric section refs | 870 |
| Compressed refs | 1200 |
| Shared/parametric coverage | 56.4% |
| Average sections/page | 54.5 |
| Average source files/page | 58.6 |
| Root HTML bytes | 4.59 MB |
| src/pages HTML bytes | 3.03 MB |
| Shared HTML bytes | 180.2 KB |
| Estimated duplicate bytes removed by shared components | 1.28 MB |


## Самые сложные страницы по количеству секций

| Page | Sections | Local | Shared refs |
| --- | --- | --- | --- |
| parokonvektomat-abat.html | 79 | 18 | 20 |
| parokonvektomat-convotherm.html | 79 | 18 | 20 |
| parokonvektomat-electrolux.html | 79 | 20 | 18 |
| parokonvektomat-lainox.html | 79 | 18 | 20 |
| parokonvektomat-e02-e07-e10.html | 77 | 14 | 21 |
| parokonvektomat-kod-oshibki.html | 77 | 14 | 21 |
| parokonvektomat-ne-greet.html | 77 | 14 | 21 |
| parokonvektomat-net-para.html | 77 | 14 | 21 |
| parokonvektomat-rational-e9.html | 77 | 14 | 21 |
| parokonvektomat-rational.html | 77 | 14 | 21 |
| parokonvektomat-unox-af02-af08.html | 77 | 14 | 21 |
| parokonvektomat-unox.html | 77 | 14 | 21 |


## Самые тяжёлые страницы по локальному source HTML

| Page | Local source | Sections |
| --- | --- | --- |
| holodilniki.html | 143.4 KB | 51 |
| routery.html | 142.7 KB | 52 |
| parokonvektomaty.html | 139.0 KB | 74 |
| posudomoyki.html | 133.8 KB | 53 |
| plity.html | 133.5 KB | 48 |
| water-heaters.html | 132.2 KB | 49 |
| holodilnoe-oborudovanie.html | 117.0 KB | 64 |
| kompyutery.html | 113.8 KB | 55 |
| stiralnye-mashiny.html | 107.1 KB | 50 |
| posudomoechnye-mashiny.html | 104.2 KB | 64 |
| ice-machines.html | 101.7 KB | 64 |
| plity-pechi.html | 98.4 KB | 34 |


## Компоненты по количеству секций

| Component | Total | Local | Shared refs | Parametric refs | Compressed % |
| --- | --- | --- | --- | --- | --- |
| layout-fragment | 641 | 0 | 0 | 641 | 100% |
| pricing | 297 | 161 | 136 | 0 | 46% |
| proof | 271 | 211 | 60 | 0 | 22% |
| raw | 177 | 148 | 29 | 0 | 16% |
| mobile-contact | 143 | 63 | 2 | 78 | 56% |
| section | 96 | 83 | 13 | 0 | 14% |
| related-links | 87 | 57 | 30 | 0 | 34% |
| contact-cta | 86 | 54 | 32 | 0 | 37% |
| faq | 76 | 63 | 13 | 0 | 17% |
| breadcrumb | 57 | 20 | 15 | 22 | 65% |
| noscript | 42 | 4 | 0 | 38 | 90% |
| lead-form | 39 | 25 | 0 | 14 | 36% |
| runtime-partials | 39 | 0 | 0 | 39 | 100% |
| footer-anchor | 38 | 0 | 0 | 38 | 100% |
| hero | 37 | 37 | 0 | 0 | 0% |
| body-preamble | 1 | 1 | 0 | 0 | 0% |


## Главные shared components по экономии

| Component file | Refs | Pages | Saved |
| --- | --- | --- | --- |
| src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--49df61a84592b2cf.html | 14 | 14 | 137.4 KB |
| src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--e1cca13f78f777a0.html | 15 | 15 | 124.7 KB |
| src/components/shared/pricing/pricing-remontiruem-vse-tipy-parokonvektomatov--716e30e482bc8a8d.html | 14 | 14 | 96.3 KB |
| src/components/shared/pricing/pricing-ceny-na-remont-parokonvektomatov--d39ef7445dadc813.html | 15 | 15 | 85.8 KB |
| src/components/shared/proof/proof-chto-govoryat-shef-povara-i-upravlyayuschie--e94fa2cfbc1265d5.html | 15 | 15 | 81.7 KB |
| src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--ae5ce7618bf4987d.html | 13 | 13 | 78.9 KB |
| src/components/shared/pricing/pricing-faktory-stoimosti-remonta--c35e37bf08c85b74.html | 15 | 15 | 75.1 KB |
| src/components/shared/proof/proof-pochemu-restorany-vyzyvayut-nas-na-parokonvektomaty--3ba019048a3e736d.html | 15 | 15 | 72.0 KB |
| src/components/shared/pricing/pricing-vyberite-problemu-pokazhem-cenu--5d86ccad444cb9af.html | 15 | 15 | 68.1 KB |
| src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--34bee320032c85f0.html | 11 | 11 | 66.9 KB |
| src/components/shared/proof/proof-kakie-metriki-derzhim-po-zayavke-restorana--3025a8aff64f8385.html | 20 | 20 | 60.1 KB |
| src/components/shared/pricing/pricing-chto-poluchaet-kuhnya-posle-remonta--79a76f427157c5f3.html | 15 | 15 | 55.5 KB |


## Возможности для следующего сжатия смысла

- **high** / componentize-local-sections: proof: 211 локальных секций, shared ratio 22% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: raw: 148 локальных секций, shared ratio 16% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: section: 83 локальных секций, shared ratio 14% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: related-links: 57 локальных секций, shared ratio 34% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: faq: 63 локальных секций, shared ratio 17% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: hero: 37 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / page-blueprint: parokonvektomat-abat.html: 79 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-convotherm.html: 79 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-electrolux.html: 79 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-lainox.html: 79 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-e02-e07-e10.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-kod-oshibki.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-ne-greet.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-net-para.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-rational-e9.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-rational.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **medium** / raw-section-reduction: bytovaya-about.html: 16 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **medium** / raw-section-reduction: kompyutery.html: 15 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **medium** / raw-section-reduction: grili-mangaly.html: 14 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **medium** / raw-section-reduction: ice-machines.html: 14 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.

## Как читать этот отчёт

- Много `local` секций у компонента = кандидат на параметризованный компонент.
- Много секций на странице = кандидат на page blueprint.
- Много `raw` секций = AI хуже понимает смысл блока; стоит переклассифицировать или объединить.
- Shared coverage — не цель сама по себе: важнее отделить смысловые props от HTML-разметки.
