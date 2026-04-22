import {
  SLOTS_PATH,
  applyJsonWrite,
  ensureRequired,
  getPublicServiceContext,
  parseArgs,
  pipeToArray,
} from './restaurant-authoring-lib.mjs';

function printHelp() {
  console.log(`Usage:
  npm run restaurant:set-form-hints -- --page <file.html> --chips "a|b|c" --type-placeholder "..." --problem-placeholder "..."

Options:
  --page / --slug         Public restaurant service page
  --chips                 Pipe-separated hint chips
  --type-placeholder      Placeholder for type/model input
  --problem-placeholder   Placeholder for problem input
  --dry-run               Print resulting formHints payload instead of writing
  --help                  Show this message`);
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const { page, slots } = getPublicServiceContext(args);
  const chips = pipeToArray(args.chips);
  const typePlaceholder = ensureRequired(args['type-placeholder'], 'type-placeholder');
  const problemPlaceholder = ensureRequired(args['problem-placeholder'], 'problem-placeholder');

  if (!chips.length) {
    throw new Error('Pass at least one chip in --chips using pipe separators');
  }

  if (!slots.pages?.[page] || typeof slots.pages[page] !== 'object') {
    throw new Error(`Slot entry missing for ${page}`);
  }

  slots.pages[page].formHints = {
    chips,
    typePlaceholder,
    problemPlaceholder,
  };

  applyJsonWrite({
    filePath: SLOTS_PATH,
    root: slots,
    selectorLabel: ['pages', page, 'formHints'],
    dryRun: Boolean(args['dry-run']),
  });

  if (!args['dry-run']) {
    console.log(`Updated form hints for ${page}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
