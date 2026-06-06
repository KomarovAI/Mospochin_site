#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { ROOT_DIR } from './ai-maintenance-lib.mjs';

function runGitStatus() {
  if (!existsSync(join(ROOT_DIR, '.git'))) return null;
  try {
    const output = execSync('git status --short', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
    return output ? output.split('\n') : [];
  } catch {
    return null;
  }
}

function normalize(statusLine) {
  return statusLine.replace(/^..\s+/, '').replace(/^\?\?\s+/, '').trim();
}

function suggestionsFor(file) {
  const suggestions = new Set();
  if (file === 'data/page-metadata.json') suggestions.add('npm run sync:metadata');
  if (file === 'data/page-metadata.json' || file.endsWith('.html')) suggestions.add('npm run generate:sitemap');
  if (file.startsWith('data/') || file.endsWith('.html')) suggestions.add('npm run generate:ai-index');
  if (file.startsWith('assets/images/')) {
    suggestions.add('npm run generate:responsive-images');
    suggestions.add('npm run generate:webp-sidecars');
  }
  if (file.startsWith('assets/') || file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.svg')) {
    suggestions.add('npm run generate:deploy-manifest');
  }
  if (file.endsWith('.js') || file.endsWith('.mjs')) suggestions.add(`node --check ${file}`);
  if (file.startsWith('deploy/') || file.startsWith('.github/')) suggestions.add('ручной review deploy/CI изменений');
  if (file === 'package.json') suggestions.add('npm run ai:check');
  return [...suggestions];
}

const status = runGitStatus();

console.log('\n# AI changed files report\n');

if (status === null) {
  console.log('Git metadata не найдена или git недоступен. В архиве это нормально.');
  console.log('\nПосле внесения изменений в рабочем репозитории используй:');
  console.log('- git status --short');
  console.log('- npm run ai:changed');
  console.log('- npm run ai:check');
  process.exit(0);
}

if (status.length === 0) {
  console.log('Изменённых файлов нет.');
  process.exit(0);
}

const byCommand = new Map();
for (const line of status) {
  const file = normalize(line);
  console.log(`- ${line}`);
  for (const suggestion of suggestionsFor(file)) {
    if (!byCommand.has(suggestion)) byCommand.set(suggestion, []);
    byCommand.get(suggestion).push(file);
  }
}

if (byCommand.size) {
  console.log('\n## Рекомендуемые действия');
  for (const [cmd, files] of byCommand.entries()) {
    console.log(`- ${cmd}`);
    console.log(`  из-за: ${files.join(', ')}`);
  }
}

console.log('\n## Финальная проверка');
console.log('- npm run ai:check');
