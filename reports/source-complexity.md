# Source Complexity Report

Детерминированный отчёт для сжатия исходного смысла проекта. Он не оценивает визуал, а показывает, где AI тратит больше всего контекста.

## Сводка

| Метрика | Значение |
| --- | --- |
| Root HTML pages | 296 |
| Builder pages | 296 |
| src/pages files | 3436 |
| src/pages HTML section files | 3139 |
| Shared component files | 182 |
| Parametric template files | 179 |
| Parametric props files | 14 |
| Total declared sections | 4333 |
| Local sections | 2251 |
| Shared section refs | 297 |
| Parametric section refs | 1785 |
| Compressed refs | 2082 |
| Shared/parametric coverage | 48.0% |
| Average sections/page | 14.6 |
| Average source files/page | 18.5 |
| Root HTML bytes | 17.83 MB |
| src/pages HTML bytes | 13.97 MB |
| Shared HTML bytes | 706.0 KB |
| Estimated duplicate bytes removed by shared components | 777.2 KB |


## Самые сложные страницы по количеству секций

| Page | Sections | Local | Shared refs |
| --- | --- | --- | --- |
| parokonvektomaty.html | 77 | 49 | 10 |
| parokonvektomat-abat.html | 75 | 27 | 15 |
| parokonvektomat-convotherm.html | 75 | 26 | 16 |
| parokonvektomat-electrolux.html | 75 | 28 | 14 |
| parokonvektomat-lainox.html | 75 | 26 | 16 |
| remont-oborudovaniya-restorana-parokonvektomat.html | 73 | 25 | 14 |
| parokonvektomat-e02-e07-e10.html | 67 | 23 | 16 |
| parokonvektomat-rational-e9.html | 67 | 23 | 16 |
| parokonvektomat-rational.html | 67 | 23 | 16 |
| parokonvektomat-unox-af02-af08.html | 67 | 23 | 16 |
| parokonvektomat-unox.html | 67 | 23 | 16 |
| parokonvektomaty-promo.html | 67 | 24 | 15 |


## Самые тяжёлые страницы по локальному source HTML

| Page | Local source | Sections |
| --- | --- | --- |
| parokonvektomaty.html | 146.7 KB | 77 |
| routery.html | 124.6 KB | 50 |
| holodilniki.html | 122.5 KB | 49 |
| posudomoyki.html | 119.8 KB | 51 |
| plity.html | 115.6 KB | 46 |
| water-heaters.html | 111.8 KB | 47 |
| stiralnye-mashiny.html | 110.9 KB | 48 |
| plity-pechi.html | 105.5 KB | 36 |
| grili-mangaly.html | 104.0 KB | 63 |
| kompyutery.html | 100.9 KB | 53 |
| parokonvektomat-obschuzhivanie.html | 88.9 KB | 32 |
| bytovaya-index.html | 86.0 KB | 34 |


## Компоненты по количеству секций

| Component | Total | Local | Shared refs | Parametric refs | Compressed % |
| --- | --- | --- | --- | --- | --- |
| layout-fragment | 903 | 0 | 0 | 903 | 100% |
| mobile-contact | 868 | 344 | 0 | 524 | 60% |
| pricing | 362 | 210 | 152 | 0 | 42% |
| faq | 267 | 247 | 20 | 0 | 7% |
| proof | 240 | 209 | 31 | 0 | 13% |
| breadcrumb | 229 | 211 | 0 | 18 | 8% |
| footer-anchor | 208 | 0 | 0 | 208 | 100% |
| runtime-partials | 206 | 74 | 0 | 132 | 64% |
| lead-form | 167 | 167 | 0 | 0 | 0% |
| body-preamble | 152 | 152 | 0 | 0 | 0% |
| contact-cta | 143 | 143 | 0 | 0 | 0% |
| raw | 129 | 103 | 26 | 0 | 20% |
| section | 119 | 78 | 41 | 0 | 34% |
| related-links | 101 | 86 | 15 | 0 | 15% |
| hero | 56 | 56 | 0 | 0 | 0% |
| cause-matrix | 22 | 22 | 0 | 0 | 0% |
| decision-tree | 22 | 22 | 0 | 0 | 0% |
| related-symptoms | 22 | 22 | 0 | 0 | 0% |
| repair-scope | 22 | 22 | 0 | 0 | 0% |
| safe-self-check | 22 | 22 | 0 | 0 | 0% |


## Главные shared components по экономии

| Component file | Refs | Pages | Saved |
| --- | --- | --- | --- |
| src/components/shared/section/section-chastye-polomki-parokonvektomatov--16d8721c09cebb16.html | 9 | 9 | 67.8 KB |
| src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--179e76b534feb278.html | 9 | 9 | 48.4 KB |
| src/components/shared/section/section-remontiruem-vse-tipy-parokonvektomatov--5ce5c0ec71cc04c7.html | 9 | 9 | 47.4 KB |
| src/components/shared/pricing/pricing-tipovye-obrascheniya-po-parokonvektomatam--2ec348ad8aa1fabf.html | 15 | 15 | 37.9 KB |
| src/components/shared/pricing/pricing-pochemu-restorany-obraschayutsya-v-servis--c90310c18594b2fe.html | 10 | 10 | 37.5 KB |
| src/components/shared/section/section-chastye-polomki-parokonvektomatov--92107a1adc63b709.html | 5 | 5 | 34.4 KB |
| src/components/shared/pricing/pricing-chto-fiksiruem-posle-diagnostiki--83d87cfffd63e29b.html | 15 | 15 | 33.7 KB |
| src/components/shared/pricing/pricing-chto-poluchaet-kuhnya-posle-remonta--87cd09941090b1d8.html | 10 | 10 | 28.5 KB |
| src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--9302e2410efc79af.html | 5 | 5 | 26.3 KB |
| src/components/shared/pricing/pricing-faktory-stoimosti-remonta--7932fac5acba733d.html | 7 | 7 | 26.2 KB |
| src/components/shared/pricing/pricing-kak-prohodit-remont-bez-lishnego-haosa-dlya-kuhni--dde82b4dee62b635.html | 9 | 9 | 25.0 KB |
| src/components/shared/section/section-remontiruem-vse-tipy-parokonvektomatov--66391bf17107a40d.html | 5 | 5 | 24.0 KB |


## Возможности для следующего сжатия смысла

- **high** / componentize-local-sections: faq: 247 локальных секций, shared ratio 7% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: proof: 209 локальных секций, shared ratio 13% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: breadcrumb: 211 локальных секций, shared ratio 8% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: lead-form: 167 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: body-preamble: 152 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: contact-cta: 143 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: raw: 103 локальных секций, shared ratio 20% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: section: 78 локальных секций, shared ratio 34% — кандидат на параметризованный компонент + props.
- **high** / componentize-local-sections: related-links: 86 локальных секций, shared ratio 15% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: hero: 56 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: cause-matrix: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: decision-tree: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: related-symptoms: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: repair-scope: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: safe-self-check: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **medium** / componentize-local-sections: stop-use: 22 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / page-blueprint: parokonvektomaty.html: 77 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-abat.html: 75 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-convotherm.html: 75 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / page-blueprint: parokonvektomat-electrolux.html: 75 секций — кандидат на page blueprint вместо длинного списка sections.

## Как читать этот отчёт

- Много `local` секций у компонента = кандидат на параметризованный компонент.
- Много секций на странице = кандидат на page blueprint.
- Много `raw` секций = AI хуже понимает смысл блока; стоит переклассифицировать или объединить.
- Shared coverage — не цель сама по себе: важнее отделить смысловые props от HTML-разметки.
