import {
  METADATA_PATH,
  applyJsonWrite,
  ensureRequired,
  getPublicServiceContext,
  parseArgs,
} from './household-authoring-lib.mjs';

function printHelp() {
  console.log(`Usage:
  npm run household:set-metadata -- --page <file.html> [--title "..."] [--description "..."] [--canonical "https://..."] [--og-url "https://..."] [--robots "..."] [--clear-robots]

Options:
  --page / --slug   Public household service page
  --title           Metadata title
  --description     Metadata description
  --canonical       Canonical URL; also updates ogUrl unless --og-url is provided
  --og-url          Explicit og:url override
  --robots          Robots meta value
  --clear-robots    Remove robots field from metadata entry
  --dry-run         Print resulting metadata entry instead of writing
  --help            Show this message`);
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const { page, metadata, pageMeta } = getPublicServiceContext(args);
  const updates = {};

  if (args.title) updates.title = ensureRequired(args.title, 'title');
  if (args.description) updates.description = ensureRequired(args.description, 'description');
  if (args.canonical) updates.canonical = ensureRequired(args.canonical, 'canonical');
  if (args['og-url']) updates.ogUrl = ensureRequired(args['og-url'], 'og-url');
  if (args.robots) updates.robots = ensureRequired(args.robots, 'robots');

  if (!Object.keys(updates).length && !args['clear-robots']) {
    throw new Error('Pass at least one metadata field or --clear-robots');
  }

  Object.assign(pageMeta, updates);

  if (updates.canonical && !updates.ogUrl) {
    pageMeta.ogUrl = updates.canonical;
  }

  if (args['clear-robots']) {
    delete pageMeta.robots;
  }

  applyJsonWrite({
    filePath: METADATA_PATH,
    root: metadata,
    selectorLabel: ['pages', page],
    dryRun: Boolean(args['dry-run']),
  });

  if (!args['dry-run']) {
    console.log(`Updated metadata for ${page}`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
