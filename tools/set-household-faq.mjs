import {
  SLOTS_PATH,
  applyJsonWrite,
  getPublicServiceContext,
  parseArgs,
  readStructuredValue,
} from './household-authoring-lib.mjs';

function printHelp() {
  console.log(`Usage:
  npm run household:set-faq -- --page <file.html> --faq-json '<json>'
  npm run household:set-faq -- --page <file.html> --faq-file <path>

Options:
  --page / --slug   Public household service page
  --faq-json        JSON array of { question, answer }
  --faq-file        Path to JSON file with FAQ array
  --dry-run         Print resulting FAQ payload instead of writing
  --help            Show this message`);
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const { page, slots } = getPublicServiceContext(args);
  const faq = readStructuredValue(args, 'faq-json', 'faq-file', 'faq items');

  if (!Array.isArray(faq) || faq.length === 0) {
    throw new Error('FAQ must be a non-empty array');
  }

  faq.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`FAQ item ${index} must be an object`);
    }
    if (typeof item.question !== 'string' || typeof item.answer !== 'string') {
      throw new Error(`FAQ item ${index} must define question and answer`);
    }
  });

  if (!slots.pages?.[page] || typeof slots.pages[page] !== 'object') {
    throw new Error(`Slot entry missing for ${page}`);
  }

  slots.pages[page].faq = faq;
  applyJsonWrite({
    filePath: SLOTS_PATH,
    root: slots,
    selectorLabel: ['pages', page, 'faq'],
    dryRun: Boolean(args['dry-run']),
  });

  if (!args['dry-run']) {
    console.log(`Updated FAQ for ${page}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
