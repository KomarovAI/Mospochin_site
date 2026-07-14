# Source Complexity Report

Детерминированный отчёт для сжатия исходного смысла проекта. Он не оценивает визуал, а показывает, где AI тратит больше всего контекста.

## Сводка

| Метрика | Значение |
| --- | --- |
| Root HTML pages | 136 |
| Builder pages | 136 |
| src/pages files | 2281 |
| src/pages HTML section files | 2145 |
| Shared component files | 128 |
| Parametric template files | 123 |
| Parametric props files | 14 |
| Total declared sections | 3331 |
| Local sections | 1737 |
| Shared section refs | 269 |
| Parametric section refs | 1325 |
| Compressed refs | 1594 |
| Shared/parametric coverage | 47.9% |
| Average sections/page | 24.5 |
| Average source files/page | 28.4 |
| Root HTML bytes | 9.51 MB |
| src/pages HTML bytes | 8.38 MB |
| Shared HTML bytes | 532.1 KB |
| Estimated duplicate bytes removed by shared components | 906.2 KB |


## Самые сложные страницы по количеству секций

| Page | Sections | Local | Shared refs |
| --- | --- | --- | --- |
| parokonvektomaty.html | 78 | 48 | 9 |
| parokonvektomat-abat.html | 76 | 51 | 15 |
| parokonvektomat-convotherm.html | 76 | 23 | 15 |
| parokonvektomat-electrolux.html | 76 | 25 | 13 |
| parokonvektomat-lainox.html | 76 | 23 | 15 |
| remont-oborudovaniya-restorana-parokonvektomat.html | 74 | 21 | 14 |
| parokonvektomat-e02-e07-e10.html | 68 | 20 | 16 |
| parokonvektomat-kod-oshibki.html | 68 | 20 | 16 |
| parokonvektomat-ne-greet.html | 68 | 20 | 16 |
| parokonvektomat-net-para.html | 68 | 20 | 16 |
| parokonvektomat-rational-e9.html | 68 | 20 | 16 |
| parokonvektomat-rational.html | 68 | 20 | 16 |


## Самые тяжёлые страницы по локальному source HTML

| Page | Local source | Sections |
| --- | --- | --- |
| holodilniki.html | 147.0 KB | 50 |
| routery.html | 145.5 KB | 51 |
| posudomoyki.html | 142.5 KB | 52 |
| parokonvektomaty.html | 138.2 KB | 78 |
| plity.html | 135.9 KB | 47 |
| water-heaters.html | 135.2 KB | 48 |
| holodilnoe-oborudovanie.html | 122.9 KB | 66 |
| kompyutery.html | 117.4 KB | 54 |
| stiralnye-mashiny.html | 110.4 KB | 49 |
| posudomoechnye-mashiny.html | 110.1 KB | 66 |
| plity-pechi.html | 105.5 KB | 36 |
| grili-mangaly.html | 104.0 KB | 63 |


## Компоненты по количеству секций

| Component | Total | Local | Shared refs | Parametric refs | Compressed % |
| --- | --- | --- | --- | --- | --- |
| layout-fragment | 934 | 0 | 0 | 934 | 100% |
| pricing | 404 | 260 | 144 | 0 | 36% |
| mobile-contact | 384 | 197 | 0 | 187 | 49% |
| proof | 308 | 259 | 49 | 0 | 16% |
| raw | 220 | 191 | 29 | 0 | 13% |
| lead-form | 137 | 137 | 0 | 0 | 0% |
| footer-anchor | 135 | 0 | 0 | 135 | 100% |
| body-preamble | 134 | 134 | 0 | 0 | 0% |
| runtime-partials | 133 | 86 | 0 | 47 | 35% |
| faq | 121 | 101 | 20 | 0 | 17% |
| breadcrumb | 109 | 87 | 0 | 22 | 20% |
| related-links | 108 | 93 | 15 | 0 | 14% |
| section | 91 | 79 | 12 | 0 | 13% |
| contact-cta | 72 | 72 | 0 | 0 | 0% |
| hero | 37 | 37 | 0 | 0 | 0% |
| noscript | 4 | 4 | 0 | 0 | 0% |


## Главные shared components по экономии

| Component file | Refs | Pages | Saved |
| --- | --- | --- | --- |
| src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--e1e987fb23638159.html | 9 | 9 | 64.9 KB |
| src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--7f0901fe41d1f650.html | 10 | 10 | 55.5 KB |
| src/components/shared/pricing/pricing-ceny-na-remont-parokonvektomatov--2ddd594597731b92.html | 10 | 10 | 51.3 KB |
| src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--179e76b534feb278.html | 9 | 9 | 48.4 KB |
| src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--3ca79656ae34529a.html | 8 | 8 | 46.7 KB |
| src/components/shared/pricing/pricing-remontiruem-vse-tipy-parokonvektomatov--08947d2913b4455f.html | 9 | 9 | 46.3 KB |
| src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--49df61a84592b2cf.html | 5 | 5 | 42.3 KB |
| src/components/shared/pricing/pricing-faktory-stoimosti-remonta--23728a1672b68db7.html | 10 | 10 | 38.2 KB |
| src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--d9c65198c0224dfe.html | 5 | 5 | 35.8 KB |
| src/components/shared/proof/proof-pochemu-restorany-vybrali-nas--44796b428fda904d.html | 10 | 10 | 35.4 KB |
| src/components/shared/pricing/pricing-chto-fiksiruem-posle-diagnostiki--83d87cfffd63e29b.html | 15 | 15 | 33.7 KB |
| src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot--8c35885ce8c1edec.html | 12 | 12 | 30.9 KB |


## Возможности для следующего сжатия смысла

- **high** / componentize-local-sections: proof: 259 локальных секций, shared ratio 16% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: raw: 191 локальных секций, shared ratio 13% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: lead-form: 137 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: body-preamble: 134 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: faq: 101 локальных секций, shared ratio 17% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: breadcrumb: 87 локальных секций, shared ratio 20% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: related-links: 93 локальных секций, shared ratio 14% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: section: 79 локальных секций, shared ratio 13% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: contact-cta: 72 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: hero: 37 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / page-blueprint: parokonvektomaty.html: 78 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-abat.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-convotherm.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-electrolux.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-lainox.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: remont-oborudovaniya-restorana-parokonvektomat.html: 74 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / raw-section-reduction: parokonvektomat-abat.html: 30 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **high** / raw-section-reduction: ice-machines.html: 22 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **medium** / raw-section-reduction: bytovaya-about.html: 15 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.
- **medium** / raw-section-reduction: kompyutery.html: 14 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.

## Как читать этот отчёт

- Много `local` секций у компонента = кандидат на параметризованный компонент.
- Много секций на странице = кандидат на page blueprint.
- Много `raw` секций = AI хуже понимает смысл блока; стоит переклассифицировать или объединить.
- Shared coverage — не цель сама по себе: важнее отделить смысловые props от HTML-разметки.
