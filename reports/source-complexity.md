# Source Complexity Report

Детерминированный отчёт для сжатия исходного смысла проекта. Он не оценивает визуал, а показывает, где AI тратит больше всего контекста.

## Сводка

| Метрика | Значение |
| --- | --- |
| Root HTML pages | 63 |
| Builder pages | 63 |
| src/pages files | 1487 |
| src/pages HTML section files | 1424 |
| Shared component files | 48 |
| Parametric template files | 83 |
| Parametric props files | 14 |
| Total declared sections | 2686 |
| Local sections | 1161 |
| Shared section refs | 388 |
| Parametric section refs | 1137 |
| Compressed refs | 1525 |
| Shared/parametric coverage | 56.8% |
| Average sections/page | 42.6 |
| Average source files/page | 46.7 |
| Root HTML bytes | 5.59 MB |
| src/pages HTML bytes | 4.04 MB |
| Shared HTML bytes | 203.9 KB |
| Estimated duplicate bytes removed by shared components | 1.51 MB |


## Самые сложные страницы по количеству секций

| Page | Sections | Local | Shared refs |
| --- | --- | --- | --- |
| parokonvektomat-abat.html | 77 | 16 | 20 |
| parokonvektomat-convotherm.html | 77 | 16 | 20 |
| parokonvektomat-electrolux.html | 77 | 18 | 18 |
| parokonvektomat-lainox.html | 77 | 16 | 20 |
| parokonvektomat-e02-e07-e10.html | 75 | 12 | 21 |
| parokonvektomat-kod-oshibki.html | 75 | 12 | 21 |
| parokonvektomat-ne-greet.html | 75 | 12 | 21 |
| parokonvektomat-net-para.html | 75 | 12 | 21 |
| parokonvektomat-rational-e9.html | 75 | 12 | 21 |
| parokonvektomat-rational.html | 75 | 12 | 21 |
| parokonvektomat-unox-af02-af08.html | 75 | 12 | 21 |
| parokonvektomat-unox.html | 75 | 12 | 21 |


## Самые тяжёлые страницы по локальному source HTML

| Page | Local source | Sections |
| --- | --- | --- |
| holodilniki.html | 143.4 KB | 51 |
| routery.html | 142.7 KB | 52 |
| posudomoyki.html | 133.8 KB | 53 |
| plity.html | 133.5 KB | 48 |
| water-heaters.html | 132.2 KB | 49 |
| holodilnoe-oborudovanie.html | 117.0 KB | 64 |
| kompyutery.html | 113.8 KB | 55 |
| parokonvektomaty.html | 110.9 KB | 75 |
| stiralnye-mashiny.html | 107.1 KB | 50 |
| posudomoechnye-mashiny.html | 104.2 KB | 64 |
| ice-machines.html | 101.7 KB | 64 |
| plity-pechi.html | 98.4 KB | 34 |


## Компоненты по количеству секций

| Component | Total | Local | Shared refs | Parametric refs | Compressed % |
| --- | --- | --- | --- | --- | --- |
| layout-fragment | 878 | 0 | 0 | 878 | 100% |
| pricing | 383 | 209 | 174 | 0 | 45% |
| proof | 309 | 235 | 74 | 0 | 24% |
| mobile-contact | 239 | 159 | 2 | 78 | 33% |
| raw | 180 | 151 | 29 | 0 | 16% |
| faq | 100 | 81 | 19 | 0 | 19% |
| related-links | 96 | 66 | 30 | 0 | 31% |
| section | 80 | 67 | 13 | 0 | 16% |
| contact-cta | 70 | 38 | 32 | 0 | 46% |
| lead-form | 65 | 51 | 0 | 14 | 22% |
| runtime-partials | 63 | 18 | 0 | 45 | 71% |
| footer-anchor | 62 | 0 | 0 | 62 | 100% |
| breadcrumb | 57 | 20 | 15 | 22 | 65% |
| noscript | 42 | 4 | 0 | 38 | 90% |
| hero | 37 | 37 | 0 | 0 | 0% |
| body-preamble | 25 | 25 | 0 | 0 | 0% |


## Главные shared components по экономии

| Component file | Refs | Pages | Saved |
| --- | --- | --- | --- |
| src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--49df61a84592b2cf.html | 14 | 14 | 137.4 KB |
| src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--e1cca13f78f777a0.html | 15 | 15 | 124.7 KB |
| src/components/shared/pricing/pricing-otdelnye-posadochnye-pod-abat-kpem-apach-atesy-i-i--6501b772607fe7ea.html | 20 | 20 | 101.7 KB |
| src/components/shared/pricing/pricing-remontiruem-vse-tipy-parokonvektomatov--716e30e482bc8a8d.html | 14 | 14 | 96.3 KB |
| src/components/shared/pricing/pricing-ceny-na-remont-parokonvektomatov--d39ef7445dadc813.html | 15 | 15 | 85.8 KB |
| src/components/shared/proof/proof-chto-govoryat-shef-povara-i-upravlyayuschie--e94fa2cfbc1265d5.html | 15 | 15 | 81.7 KB |
| src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--8a089715e4395424.html | 13 | 13 | 80.4 KB |
| src/components/shared/proof/proof-kakie-metriki-derzhim-po-zayavke-restorana--49039622d5ec9ff8.html | 26 | 26 | 78.7 KB |
| src/components/shared/pricing/pricing-faktory-stoimosti-remonta--c35e37bf08c85b74.html | 15 | 15 | 75.1 KB |
| src/components/shared/proof/proof-pochemu-500-restoranov-vybrali-nas--16061bbc70a958f9.html | 15 | 15 | 69.8 KB |
| src/components/shared/pricing/pricing-vyberite-problemu-pokazhem-cenu--5d86ccad444cb9af.html | 15 | 15 | 68.1 KB |
| src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--34bee320032c85f0.html | 11 | 11 | 66.9 KB |


## Возможности для следующего сжатия смысла

- **high** / componentize-local-sections: proof: 235 локальных секций, shared ratio 24% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: mobile-contact: 159 локальных секций, shared ratio 33% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: raw: 151 локальных секций, shared ratio 16% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: faq: 81 локальных секций, shared ratio 19% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: related-links: 66 локальных секций, shared ratio 31% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: section: 67 локальных секций, shared ratio 16% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: lead-form: 51 локальных секций, shared ratio 22% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: hero: 37 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: body-preamble: 25 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / page-blueprint: parokonvektomat-abat.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-convotherm.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-electrolux.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-lainox.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-e02-e07-e10.html: 75 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-kod-oshibki.html: 75 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-ne-greet.html: 75 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-net-para.html: 75 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-rational-e9.html: 75 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-rational.html: 75 секций — кандидат на page blueprint вместо длинного списка sections.
- **medium** / raw-section-reduction: bytovaya-about.html: 16 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.

## Как читать этот отчёт

- Много `local` секций у компонента = кандидат на параметризованный компонент.
- Много секций на странице = кандидат на page blueprint.
- Много `raw` секций = AI хуже понимает смысл блока; стоит переклассифицировать или объединить.
- Shared coverage — не цель сама по себе: важнее отделить смысловые props от HTML-разметки.
