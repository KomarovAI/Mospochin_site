import {
  parseArgs,
  normalizePage,
} from './household-authoring-lib.mjs';
import {
  getPublicHouseholdServices,
  getPublicServiceSyncContext,
  loadHouseholdSyncState,
  readPageHtml,
  syncHouseholdServiceHtml,
  writePageHtml,
} from './household-fallback-sync-lib.mjs';

function getTargetPages(args, state) {
  if (args.page || args.slug) {
    return [normalizePage(args)];
  }

  return getPublicHouseholdServices(state.registry).map((entry) => entry.page);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = Boolean(args['dry-run']);
  const state = loadHouseholdSyncState();
  const pages = getTargetPages(args, state);
  const changedPages = [];

  for (const page of pages) {
    const context = getPublicServiceSyncContext(page, state);
    const currentHtml = readPageHtml(page);
    const nextHtml = syncHouseholdServiceHtml(currentHtml, context);

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
      ? `Synced household fallbacks: ${changedPages.join(', ')}`
      : 'Household fallbacks already in sync'
  );
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
