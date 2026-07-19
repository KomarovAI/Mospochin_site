# Water-heater content and architecture P4

## Outcome

- The electric water-heater cluster now contains 34 indexable pages with 198 contextual internal links.
- Three previously uncovered intents are published as unique pages:
  - `zamena-magnievogo-anoda-vodonagrevatelya.html`;
  - `vodonagrevatel-shumit-pri-nagreve.html`;
  - `ustanovka-elektricheskogo-vodonagrevatelya.html`.
- Each new page contains one H1, one canonical, analytics/form runtime and roughly 980–1,030 visible words.
- The household menu remains deliberately compact: 10 categories in three groups. The new pages are reached from the water-heater hub and related diagnostic/service scenarios instead of being added to the global menu.

## Content depth

- Expanded the diagnostic logic for control boards, thermostats and temperature sensors, flat double-tank models and tank corrosion.
- Reworked the leak route into four distinguishable scenarios: safety-valve discharge during heating, flange leakage, local connection leakage and probable inner-tank leakage.
- Connected cleaning, heating-element and corrosion pages to magnesium-anode maintenance without presenting the anode as a repair for an already perforated tank.
- Added context and evidentiary limits to four photographic cases: heavy scale, a double-tank heater, a heater in a tight niche and a three-phase DHW installation.
- Added a symptom taxonomy for noise during heating and explicit stop-use conditions for leakage near electrical parts, burning smell and protection trips.

## Evidence and service boundaries

- The cluster remains limited to electric water heaters, appliance-level diagnostics, mounting and local piping. Gas appliances, whole-building plumbing and boiler-room design remain excluded.
- Manufacturer-scoped safety statements were checked against an official Thermex installation/maintenance manual: fill before energising, allow service access, do not block safety-valve discharge and inspect the magnesium anode during maintenance.
- Content avoids universal error-code tables, fixed maintenance intervals for every model and unsupported DIY electrical instructions.

References:

- Thermex official installation and maintenance manual: https://thermex.ru/upload/iblock/24b/zc62s29j98mu3u0ejeh5yc9kwze0x05t.pdf
- Google Search guidance on people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## Architecture fixes

- Restored a unified source-of-truth: 503 root HTML pages, 503 source models, 503 builder-registered pages, zero pending and zero legacy pages.
- Fixed metadata synchronization so `description`, `og:url` and `robots` work regardless of HTML attribute order and duplicate tags are removed deterministically.
- Fixed staged-source architecture analysis so it counts source models instead of only currently registered pages.
- Restored metrics from source body attributes and added cutter-manifest support, removing accidental heuristic context drift.
- Updated architecture and SEO budgets from 500/482 to the intentional 503/485 page totals.

## Verification

- `npm run ai:verify -- --files ...` — passed.
- `npm run check:architecture` — passed; all 12 architecture-budget checks passed.
- Water-heater builder parity — 34/34 pages passed.
- `npm run check:water-heater-cluster` — passed: 34 pages, 117 photos, eight local-piping pages, 198 contextual links and 18 evidence sources.
- `npm run check:html-head` — 503/503 valid.
- Site crawl — 503 HTML pages, 485 sitemap URLs, zero issues.
- Household integrity — 219 pages, 217 indexable, zero organic orphans and zero exact title/H1/description duplicates.
- SEO content quality — zero duplicate H1 groups, zero low-unique pages, zero invalid JSON-LD blocks and zero placeholder Offer prices.

## Source-handoff limitation

The supplied project is a `source-handoff-lite` package and intentionally excludes `src/media-source`. Consequently, the full `check:core` and `ai:release` profiles reach `check-kutter-images` and stop because four cutter PNG masters are absent:

- `kutter-industrial-overview.png`;
- `kutter-corroded-drive-coupling.png`;
- `kutter-corroded-drive-assembly.png`;
- `kutter-blade-assembly-bowl.png`.

Generated public image variants remain present. The water-heater change does not modify or depend on those missing cutter masters.
