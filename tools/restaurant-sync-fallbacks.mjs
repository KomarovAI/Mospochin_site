import { parseArgs, normalizePage } from './restaurant-authoring-lib.mjs';
import {
  getPublicRestaurantServices,
  getPublicRestaurantServiceSyncContext,
  loadRestaurantSyncState,
  readPageHtml,
  syncRestaurantServiceHtml,
  writePageHtml,
} from './restaurant-fallback-sync-lib.mjs';

function getTargetPages(args, state) {
  if (args.page || args.slug) {
    return [normalizePage(args)];
  }

  return getPublicRestaurantServices(state.registry).map((entry) => entry.page);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = Boolean(args['dry-run']);
  const state = loadRestaurantSyncState();
  const pages = getTargetPages(args, state);
  const changedPages = [];

  for (const page of pages) {
    const context = getPublicRestaurantServiceSyncContext(page, state);
    const currentHtml = readPageHtml(page);
    const nextHtml = syncRestaurantServiceHtml(currentHtml, context);

    if (nextHtml !== currentHtml) {
      changedPages.push(page);
      if (!dryRun) {
        writePageHtml(page, nextHtml);
      }
    }
  }

  if (dryRun) {
    console.log(changedPages.length ? changedPages.join('\n') : 'No fallback sync changes');
    return;
  }

  console.log(
    changedPages.length
      ? `Synced restaurant fallbacks: ${changedPages.join(', ')}`
      : 'Restaurant fallbacks already in sync'
  );
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
