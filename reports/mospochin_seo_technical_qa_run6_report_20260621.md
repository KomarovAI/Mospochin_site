# MosPochin — P6 SEO / technical QA report

Дата: **2026-06-21**  
База: **mospochin_cooking_kettles_run5_production_readiness_pack_20260621.zip**  
Режим: **site-only, Direct read-only, без новых SEO-страниц**

## Итог

P6 — это общий SEO/technical QA прогон после tracking, главной, пароконвектоматов и котлового кластера.

Блокирующих SEO/technical ошибок после классификации intentional noindex страниц: **0**.

## Проверено

```text
Root HTML pages: 63
Indexable HTML pages: 58
Sitemap URLs: 58
Metadata pages: 63
Direct landing pages: 28
Pages with data-page-slug: 63
Total data-cta-id attributes: 1836
Total forms: 79
JSON-LD parse error pages: 0
Target blank bad pages: 0
Broken internal link pages: 0
```

## Intentional noindex / sitemap exclusions

Эти страницы имеют `noindex` и не должны считаться ошибкой отсутствия в sitemap:

```text
404.html
kompyutery.html
parokonvektomaty-promo.html
remont-oborudovaniya-restorana-parokonvektomat.html
routery.html
```

## Data contract sync

```text
HTML without metadata entry: 0
Metadata entries without HTML: 0
Direct landing entries without HTML: 0
```

## JSON-LD type coverage

```json
{
  "Answer": 61,
  "FAQPage": 61,
  "LocalBusiness": 62,
  "PostalAddress": 62,
  "Question": 61,
  "AggregateRating": 10,
  "ContactPoint": 2,
  "City": 5,
  "CollectionPage": 2,
  "GeoCoordinates": 2,
  "ItemList": 2,
  "ListItem": 27,
  "OpeningHoursSpecification": 2,
  "Service": 56,
  "AdministrativeArea": 52,
  "Offer": 54,
  "BreadcrumbList": 25
}
```

## Blocking issues

```json
[]
```

## What was intentionally not done

```text
- No new SEO pages created.
- No Yandex Direct bids/keywords/minus phrases/campaign state changed.
- No production deploy performed.
- No screenshot audit performed in sandbox because Playwright Chromium is not installed here.
```

## Acceptance status

```text
P6 SEO / technical QA: PASS
Ready for next run: P7 internal linking / anchors / user path to form
```
