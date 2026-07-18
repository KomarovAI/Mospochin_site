# Microwave cluster MW1

## Scope
Domestic freestanding and built-in microwave ovens in Moscow. The cluster excludes commercial high-power units and keeps full-size combination ovens as an adjacent cooking-equipment intent.

## Source of truth
- `data/microwave-cluster-pages.json`
- `data/microwave-fault-taxonomy.json`
- `data/microwave-fault-evidence.json`
- `data/microwave-link-graph.json`
- `data/microwave-intent-boundaries.json`
- `src/pages/<slug>/page.json`

## Safety contract
Never publish user instructions to remove the casing, discharge the high-voltage capacitor, bypass door interlocks, or run the oven empty. A damaged door, seal, frame, smoke, burning smell, repeated arcing, or breaker trip requires stop-use language.

## Content contract
A symptom is not a confirmed part failure. In particular, no-heat does not automatically mean magnetron failure, arcing does not automatically mean mica failure, and a stopped turntable does not automatically mean motor failure.

## Checks
- `npm run check:microwave-cluster`
- `npm run check:core`
- `npm run audit:microwave-mw1-screenshots`
