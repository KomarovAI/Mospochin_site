#!/usr/bin/env node
import { existsSync } from 'fs';
import { join } from 'path';
import { defaultBuilderPages, extractPageToModel, ROOT_DIR, SITE_BUILDER_MANIFEST, writeBuilderManifest } from './site-builder-lib.mjs';
import { parseArgs } from './ai-maintenance-lib.mjs';

const args = parseArgs();

function splitPages(value) {
  if (!value) return defaultBuilderPages();
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function help() {
  console.log(`\n# Site Builder Bootstrap\n\nСоздаёт sectioned source-модель из текущих production HTML. Без --pages синхронизирует все страницы из data/ai-project-index.json.\n\nИспользование:\n  npm run site-builder:bootstrap\n  npm run site-builder:bootstrap -- --pages index.html,holodilniki.html\n\nВажно: команда синхронизирует src/pages/* с текущими root HTML и перезаписывает manifest полным выбранным набором страниц.\n`);
}

if (args.help) {
  help();
  process.exit(0);
}

const pages = splitPages(args.pages || args.page);
const entries = [];
let errors = 0;

for (const page of pages) {
  if (!existsSync(join(ROOT_DIR, page))) {
    console.error(`❌ ${page}: HTML не найден`);
    errors += 1;
    continue;
  }
  try {
    const entry = extractPageToModel(page);
    entries.push(entry);
    console.log(`✅ ${page}: ${entry.sections} секций → ${entry.model}`);
  } catch (error) {
    console.error(`❌ ${page}: ${error.message}`);
    errors += 1;
  }
}

if (!errors) {
  writeBuilderManifest(entries);
  console.log(`\n✅ Обновлён ${SITE_BUILDER_MANIFEST}`);
  console.log('Дальше: npm run check:site-builder');
}

process.exit(errors ? 1 : 0);
