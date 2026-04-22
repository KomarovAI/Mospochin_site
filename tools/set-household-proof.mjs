import {
  PROOF_LAYER_PATH,
  applyJsonWrite,
  getPublicServiceContext,
  parseArgs,
  readStructuredValue,
} from './household-authoring-lib.mjs';

const ALLOWED_SECTIONS = new Set(['slaStrip', 'priceClarity', 'proofCards', 'objectionCards']);

function printHelp() {
  console.log(`Usage:
  npm run household:set-proof -- --page <file.html> --section <slaStrip|priceClarity|proofCards|objectionCards> --json '<json>'
  npm run household:set-proof -- --page <file.html> --section <...> --file <path>

Options:
  --page / --slug   Public household service page
  --section         Shared serviceDefaults section to replace
  --json            JSON object for the selected section
  --file            Path to JSON file for the selected section
  --dry-run         Print resulting proof section instead of writing
  --help            Show this message`);
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  getPublicServiceContext(args);
  const section = String(args.section || '').trim();
  if (!ALLOWED_SECTIONS.has(section)) {
    throw new Error(`--section must be one of: ${Array.from(ALLOWED_SECTIONS).join(', ')}`);
  }

  const value = readStructuredValue(args, 'json', 'file', 'proof section');
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Proof section must be a JSON object');
  }

  const { proofLayer } = getPublicServiceContext(args);
  proofLayer.serviceDefaults[section] = value;

  applyJsonWrite({
    filePath: PROOF_LAYER_PATH,
    root: proofLayer,
    selectorLabel: ['serviceDefaults', section],
    dryRun: Boolean(args['dry-run']),
  });

  if (!args['dry-run']) {
    console.log(`Updated shared service proof section ${section}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
