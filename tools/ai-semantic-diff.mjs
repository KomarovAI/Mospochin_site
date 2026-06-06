#!/usr/bin/env node
import { parseArgs } from './ai-maintenance-lib.mjs';
import { compareSemantics, getGitChangedFiles, getPageSemantic, hasGit, printSemanticSnapshot } from './ai-semantic-lib.mjs';

const args = parseArgs();

function parseFiles() {
  const raw = [];
  if (args.files) raw.push(...String(args.files).split(/[\s,]+/));
  raw.push(...(args._ || []));
  return raw.map((f) => f.trim()).filter(Boolean).filter((f) => f.endsWith('.html'));
}

function printHelp() {
  console.log(`\n# AI Semantic Diff\n\nПоказывает смысловые изменения HTML: SEO, формы, images, schema, scripts, links.\n\nИспользование:\n  npm run ai:semantic-diff -- --page holodilniki.html\n  npm run ai:semantic-diff -- --files index.html,holodilniki.html\n\nЕсли есть git, сравнивает working tree с HEAD. В архиве без git выводит текущий семантический снимок.\n`);
}

let pages = [];
if (args.page) pages.push(args.page);
pages.push(...parseFiles());
if (!pages.length && hasGit()) pages = (getGitChangedFiles() || []).filter((f) => f.endsWith('.html'));
pages = [...new Set(pages)];

if (!pages.length) {
  printHelp();
  process.exit(0);
}

console.log('\n# AI Semantic Diff\n');
const gitAvailable = hasGit();
if (!gitAvailable) console.log('Git metadata не найдена: показываю текущие семантические снимки без сравнения с HEAD.\n');

let warnings = 0;
for (const page of pages) {
  console.log(`## ${page}`);
  const after = getPageSemantic(page);
  if (!after) {
    console.log('❌ Страница не найдена или недоступна.\n');
    warnings += 1;
    continue;
  }

  if (!gitAvailable) {
    printSemanticSnapshot(after);
    console.log('');
    continue;
  }

  const before = getPageSemantic(page, { ref: 'HEAD' });
  const changes = compareSemantics(before, after);
  if (!changes.length) {
    console.log('OK: смысловых изменений не найдено.');
  } else {
    for (const change of changes) {
      if (change.level === 'warn') warnings += 1;
      const icon = change.level === 'warn' ? '⚠️ ' : 'ℹ️ ';
      console.log(`${icon}[${change.area}] ${change.message}`);
    }
  }
  console.log('\nТекущий снимок:');
  printSemanticSnapshot(after);
  console.log('');
}

if (warnings) {
  console.log(`Итог: ${warnings} semantic warnings. Проверь предупреждения выше.`);
} else {
  console.log('Итог: semantic warnings нет.');
}
