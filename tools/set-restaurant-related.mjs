import {
  REGISTRY_PATH,
  applyJsonWrite,
  csvToArray,
  ensureRequired,
  getPublicServiceContext,
  parseArgs,
} from './restaurant-authoring-lib.mjs';

function printHelp() {
  console.log(`Usage:
  npm run restaurant:set-related -- --page <file.html> [--related "a.html,b.html"] [--symptoms "x,y"] [--brands "A,B"] [--form-example "..."]

Options:
  --page / --slug   Public restaurant service page
  --related         Comma-separated public restaurant service pages
  --symptoms        Comma-separated literal symptoms
  --brands          Comma-separated representative brands
  --form-example    Example request copy for registry
  --dry-run         Print resulting registry entry instead of writing
  --help            Show this message`);
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const { page, registry, registryEntry } = getPublicServiceContext(args);
  const related = args.related ? csvToArray(args.related) : null;
  const symptoms = args.symptoms ? csvToArray(args.symptoms) : null;
  const brands = args.brands ? csvToArray(args.brands) : null;
  const formExample = args['form-example'] ? ensureRequired(args['form-example'], 'form-example') : null;

  if (!related && !symptoms && !brands && !formExample) {
    throw new Error('Pass at least one of --related, --symptoms, --brands, or --form-example');
  }

  const publicPages = new Set(
    (registry.services ?? []).filter((entry) => !entry.isShadow).map((entry) => entry.page)
  );

  if (related) {
    related.forEach((target) => {
      if (!publicPages.has(target)) {
        throw new Error(`Related target must be a public restaurant service page: ${target}`);
      }
      if (target === page) {
        throw new Error('Related targets must not point to the same page');
      }
    });
  }

  if (symptoms && !symptoms.length) {
    throw new Error('Pass at least one symptom when using --symptoms');
  }

  if (brands && !brands.length) {
    throw new Error('Pass at least one brand when using --brands');
  }

  if (related) registryEntry.relatedPages = related;
  if (symptoms) registryEntry.primarySymptoms = symptoms;
  if (brands) registryEntry.brandCluster = brands;
  if (formExample) registryEntry.formExample = formExample;

  applyJsonWrite({
    filePath: REGISTRY_PATH,
    root: registry,
    selectorLabel: ['services', (registry.services ?? []).findIndex((entry) => entry.page === page)],
    dryRun: Boolean(args['dry-run']),
  });

  if (!args['dry-run']) {
    console.log(`Updated registry targeting for ${page}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
