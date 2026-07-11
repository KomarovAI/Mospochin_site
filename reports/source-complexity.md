# Source Complexity Report

Детерминированный отчёт для сжатия исходного смысла проекта. Он не оценивает визуал, а показывает, где AI тратит больше всего контекста.

## Сводка

| Метрика | Значение |
| --- | --- |
| Root HTML pages | 115 |
| Builder pages | 115 |
| src/pages files | 2003 |
| src/pages HTML section files | 1888 |
| Shared component files | 67 |
| Parametric template files | 113 |
| Parametric props files | 14 |
| Total declared sections | 3133 |
| Local sections | 1543 |
| Shared section refs | 271 |
| Parametric section refs | 1319 |
| Compressed refs | 1590 |
| Shared/parametric coverage | 50.8% |
| Average sections/page | 27.2 |
| Average source files/page | 31.1 |
| Root HTML bytes | 8.94 MB |
| src/pages HTML bytes | 7.75 MB |
| Shared HTML bytes | 276.4 KB |
| Estimated duplicate bytes removed by shared components | 955.1 KB |


## Самые сложные страницы по количеству секций

| Page | Sections | Local | Shared refs |
| --- | --- | --- | --- |
| parokonvektomaty.html | 78 | 43 | 10 |
| parokonvektomat-abat.html | 76 | 23 | 15 |
| parokonvektomat-convotherm.html | 76 | 23 | 15 |
| parokonvektomat-electrolux.html | 76 | 25 | 13 |
| parokonvektomat-lainox.html | 76 | 23 | 15 |
| remont-oborudovaniya-restorana-parokonvektomat.html | 74 | 19 | 16 |
| parokonvektomat-e02-e07-e10.html | 68 | 20 | 16 |
| parokonvektomat-kod-oshibki.html | 68 | 20 | 16 |
| parokonvektomat-ne-greet.html | 68 | 20 | 16 |
| parokonvektomat-net-para.html | 68 | 20 | 16 |
| parokonvektomat-rational-e9.html | 68 | 20 | 16 |
| parokonvektomat-rational.html | 68 | 20 | 16 |


## Самые тяжёлые страницы по локальному source HTML

| Page | Local source | Sections |
| --- | --- | --- |
| holodilniki.html | 146.4 KB | 50 |
| routery.html | 145.1 KB | 51 |
| posudomoyki.html | 141.9 KB | 52 |
| plity.html | 135.4 KB | 47 |
| water-heaters.html | 134.5 KB | 48 |
| holodilnoe-oborudovanie.html | 122.3 KB | 66 |
| parokonvektomaty.html | 122.1 KB | 78 |
| kompyutery.html | 116.9 KB | 54 |
| stiralnye-mashiny.html | 109.9 KB | 49 |
| posudomoechnye-mashiny.html | 109.6 KB | 66 |
| plity-pechi.html | 104.3 KB | 36 |
| grili-mangaly.html | 103.0 KB | 63 |


## Компоненты по количеству секций

| Component | Total | Local | Shared refs | Parametric refs | Compressed % |
| --- | --- | --- | --- | --- | --- |
| layout-fragment | 969 | 0 | 0 | 969 | 100% |
| pricing | 383 | 262 | 121 | 0 | 32% |
| mobile-contact | 345 | 163 | 0 | 182 | 53% |
| proof | 309 | 235 | 74 | 0 | 24% |
| raw | 166 | 137 | 29 | 0 | 17% |
| lead-form | 116 | 116 | 0 | 0 | 0% |
| runtime-partials | 115 | 83 | 0 | 32 | 28% |
| footer-anchor | 114 | 0 | 0 | 114 | 100% |
| body-preamble | 113 | 113 | 0 | 0 | 0% |
| breadcrumb | 109 | 87 | 0 | 22 | 20% |
| faq | 100 | 81 | 19 | 0 | 19% |
| related-links | 96 | 81 | 15 | 0 | 16% |
| section | 86 | 73 | 13 | 0 | 15% |
| contact-cta | 71 | 71 | 0 | 0 | 0% |
| hero | 37 | 37 | 0 | 0 | 0% |
| noscript | 4 | 4 | 0 | 0 | 0% |


## Главные shared components по экономии

| Component file | Refs | Pages | Saved |
| --- | --- | --- | --- |
| src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--e1e987fb23638159.html | 9 | 9 | 64.9 KB |
| src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--62d3f46592fe7f31.html | 10 | 10 | 55.0 KB |
| src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--fb6a73cb37e83a71.html | 9 | 9 | 51.6 KB |
| src/components/shared/proof/proof-kakie-metriki-derzhim-po-zayavke-restorana--49039622d5ec9ff8.html | 17 | 17 | 50.3 KB |
| src/components/shared/pricing/pricing-ceny-na-remont-parokonvektomatov--3a69442686b01514.html | 10 | 10 | 49.3 KB |
| src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--a2e0d663c0e0055d.html | 9 | 9 | 48.1 KB |
| src/components/shared/pricing/pricing-remontiruem-vse-tipy-parokonvektomatov--08947d2913b4455f.html | 9 | 9 | 46.3 KB |
| src/components/shared/proof/proof-chto-govoryat-shef-povara-i-upravlyayuschie--b14cacd80dc785e1.html | 10 | 10 | 43.6 KB |
| src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--49df61a84592b2cf.html | 5 | 5 | 42.3 KB |
| src/components/shared/pricing/pricing-faktory-stoimosti-remonta--2a8b4f5691d4f4d6.html | 10 | 10 | 38.1 KB |
| src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--e1cca13f78f777a0.html | 5 | 5 | 35.6 KB |
| src/components/shared/proof/proof-pochemu-500-restoranov-vybrali-nas--6d9f63d75b72c994.html | 10 | 10 | 34.2 KB |


## Возможности для следующего сжатия смысла

- **high** / componentize-local-sections: pricing: 262 локальных секций, shared ratio 32% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: proof: 235 локальных секций, shared ratio 24% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: raw: 137 локальных секций, shared ratio 17% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: lead-form: 116 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: runtime-partials: 83 локальных секций, shared ratio 28% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: body-preamble: 113 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: breadcrumb: 87 локальных секций, shared ratio 20% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: faq: 81 локальных секций, shared ratio 19% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: related-links: 81 локальных секций, shared ratio 16% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: section: 73 локальных секций, shared ratio 15% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: contact-cta: 71 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: hero: 37 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / page-blueprint: parokonvektomaty.html: 78 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-abat.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-convotherm.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-electrolux.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-lainox.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: remont-oborudovaniya-restorana-parokonvektomat.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **medium** / raw-section-reduction: bytovaya-about.html: 15 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **medium** / raw-section-reduction: kompyutery.html: 14 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.

## Как читать этот отчёт

- Много `local` секций у компонента = кандидат на параметризованный компонент.
- Много секций на странице = кандидат на page blueprint.
- Много `raw` секций = AI хуже понимает смысл блока; стоит переклассифицировать или объединить.
- Shared coverage — не цель сама по себе: важнее отделить смысловые props от HTML-разметки.
