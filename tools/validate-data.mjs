#!/usr/bin/env node
/**
 * Data Contracts Validator
 *
 * Проверяет JSON-синтаксис, наличие schema-файлов и прикладные контракты
 * для data/*.json. Не требует внешних npm-зависимостей.
 */
import { parseArgs } from './ai-maintenance-lib.mjs';
import { validateDataContracts } from './data-contract-lib.mjs';

const args = parseArgs();
const page = args.page || null;
const quiet = Boolean(args.quiet);
const result = validateDataContracts({ page });

if (!quiet) {
  console.log('\n# Data Contracts — MosPochin\n');
  if (page) console.log(`Scope: page ${page}`);
  console.log(`JSON files checked: ${result.stats.jsonFiles}`);
  console.log(`Contract files checked: ${result.stats.checkedFiles}`);

  if (result.errors.length) {
    console.log('\n## Errors');
    for (const item of result.errors) console.log(`- [${item.file}] ${item.message}`);
  }
  if (result.warnings.length) {
    console.log('\n## Warnings');
    for (const item of result.warnings) console.log(`- [${item.file}] ${item.message}`);
  }
  if (!result.errors.length && !result.warnings.length) console.log('\n✅ Data contracts passed without warnings.');
  else console.log(`\nИтог: ${result.errors.length} errors, ${result.warnings.length} warnings`);
}

process.exit(result.errors.length ? 1 : 0);
