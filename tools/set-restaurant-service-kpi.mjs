import {
  SLOTS_PATH,
  applyJsonWrite,
  getPublicServiceContext,
  loadRestaurantState,
  parseArgs,
  readStructuredValue,
} from './restaurant-authoring-lib.mjs';

function printHelp() {
  console.log(`Usage:
  npm run restaurant:set-service-kpi -- --defaults --json '<json>'
  npm run restaurant:set-service-kpi -- --page <file.html> --json '<json>'
  npm run restaurant:set-service-kpi -- --slug <slug> --file <path>

Options:
  --defaults            Update shared serviceKpiDefaults
  --page / --slug       Public restaurant service page for per-page override
  --json                Inline JSON payload
  --file                Path to JSON payload
  --dry-run             Print resulting payload instead of writing
  --help                Show this message`);
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const isDefaults = Boolean(args.defaults);
  const hasPageSelector = Boolean(args.page || args.slug);

  if (isDefaults === hasPageSelector) {
    throw new Error('Pass either --defaults or --page/--slug');
  }

  const value = readStructuredValue(args, 'json', 'file', 'service-kpi payload');

  if (isDefaults) {
    const { slots } = loadRestaurantState();
    slots.serviceKpiDefaults = value;

    applyJsonWrite({
      filePath: SLOTS_PATH,
      root: slots,
      selectorLabel: ['serviceKpiDefaults'],
      dryRun: Boolean(args['dry-run']),
    });

    if (!args['dry-run']) {
      console.log('Updated shared restaurant service KPI defaults');
    }
    process.exit(0);
  }

  const { page, slots } = getPublicServiceContext(args);
  if (!slots.pages?.[page] || typeof slots.pages[page] !== 'object') {
    throw new Error(`Slot entry missing for ${page}`);
  }

  slots.pages[page].serviceKpi = value;

  applyJsonWrite({
    filePath: SLOTS_PATH,
    root: slots,
    selectorLabel: ['pages', page, 'serviceKpi'],
    dryRun: Boolean(args['dry-run']),
  });

  if (!args['dry-run']) {
    console.log(`Updated service KPI override for ${page}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
