# WH3-THREE-PHASE — release notes

Date: 2026-07-17

## Scope

Added one dedicated page inside the electric water-heater cluster:

- `remont-trehfaznyh-vodonagrevateley-380-400v.html`

The page covers high-power instantaneous domestic-hot-water heaters and large storage DHW systems with three-phase or model-specific 380/400 V power arrangements, primarily in private-house technical rooms.

Explicitly outside scope:

- electric space-heating boilers;
- radiator and underfloor-heating circuits;
- full boiler-room automation;
- complete switchboard reconstruction;
- utility connection-capacity increases.

## Technical contract

- Never infer neutral conductor requirements from voltage alone.
- Accept model-specific arrangements such as `3/PE`, `3/N/PE`, or another manufacturer-documented 380/400 V connection.
- Never prescribe one universal cable cross-section, breaker, RCD, or jumper arrangement.
- User self-checks stop before opening covers or measuring phase voltage.
- Repeated breaker operation, burning smell, darkened terminals, or water near electrical components are stop-use conditions.

## Photo integration

Four images from the supplied archive were integrated with responsive AVIF/WebP/JPEG variants:

- `PHOTO_061` — private-house DHW system hero;
- `PHOTO_031` — L1/L2/L3 terminal block;
- `PHOTO_058` — piping and controls;
- `PHOTO_062` — service area.

## Architecture

- Water-heater cluster release updated to `WH3-THREE-PHASE`.
- Cluster size: 20 pages.
- Contextual links: 109.
- Evidence sources: 14.
- New page connected from the water-heater hub, diagnostics, storage, instantaneous, breaker-trip, and piping pages.
- Responsive image assets generated at 480, 768, and 1200 px.
- FAQ, sitemap, metrics context, household taxonomy, page policy, screenshot contract, and builder registry updated.

## Verification

- Builder parity: 489/489 pages.
- Site crawl: 489 HTML, 471 sitemap URLs, 0 issues.
- Water-heater guard: 20 pages, 8 piping pages, 109 links, 14 evidence sources.
- FAQ registry: 408 pages, 1558 questions.
- Metrics markup: 488 pages, 4786 contact CTAs, 507 forms.
- Shared components: 61 files, 424 references.
- Visual contract: 34 manifests, 16 clusters.
- Desktop and mobile first screens manually reviewed.
