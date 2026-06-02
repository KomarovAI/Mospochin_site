#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { hashContent, loadBuilderManifest, renderPageFromModel, ROOT_DIR, writeProjectFile } from './site-builder-lib.mjs';
import { parseArgs } from './ai-maintenance-lib.mjs';

const args = parseArgs();
const manifest = loadBuilderManifest();

function help() {
  console.log(`\n# Static Component Builder\n\nСобирает HTML-страницы из src/pages/* section components.\n\nИспользование:\n  npm run build:site\n  npm run build:site -- --page holodilniki.html\n  npm run build:site -- --page holodilniki.html --write\n  npm run check:site-builder\n\nПо умолчанию пишет в build/site-builder. С --write обновляет root HTML для выбранных страниц.\n`);
}

if (args.help || !manifest) {
  if (!manifest) console.error('❌ src/site-builder.json не найден. Сначала: npm run site-builder:bootstrap');
  help();
  process.exit(manifest ? 0 : 1);
}

const selectedPages = args.page
  ? new Set(String(args.page).split(',').map((item) => item.trim()).filter(Boolean))
  : null;
const pages = manifest.pages.filter((page) => !selectedPages || selectedPages.has(page.page));
const outDir = args.out || manifest.defaultOutputDir || 'build/site-builder';
const checkMode = Boolean(args.check);
const writeMode = Boolean(args.write);

if (!pages.length) {
  console.error('❌ Нет страниц для сборки. Проверь --page.');
  process.exit(1);
}

let errors = 0;

function firstDiff(a, b) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 1) if (a[i] !== b[i]) return i;
  return len;
}

for (const pageEntry of pages) {
  try {
    const { html } = renderPageFromModel(pageEntry.model);
    const target = writeMode ? pageEntry.page : join(outDir, pageEntry.page);
    const absTarget = join(ROOT_DIR, target);

    if (checkMode) {
      const currentPath = join(ROOT_DIR, pageEntry.page);
      if (!existsSync(currentPath)) {
        console.error(`❌ ${pageEntry.page}: root HTML отсутствует`);
        errors += 1;
        continue;
      }
      const current = readFileSync(currentPath, 'utf8');
      if (current !== html) {
        const offset = firstDiff(current, html);
        console.error(`❌ ${pageEntry.page}: root HTML расходится с site-builder output`);
        console.error(`   current sha256: ${hashContent(current).slice(0, 16)}`);
        console.error(`   builder sha256: ${hashContent(html).slice(0, 16)}`);
        console.error(`   first diff offset: ${offset}`);
        console.error(`   Если root HTML — источник правды, запусти: npm run site-builder:bootstrap -- --pages ${pageEntry.page}`);
        console.error(`   Если src — источник правды, запусти: npm run build:site -- --page ${pageEntry.page} --write`);
        errors += 1;
      } else {
        console.log(`✅ ${pageEntry.page}: совпадает с builder output (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
      }
      continue;
    }

    mkdirSync(dirname(absTarget), { recursive: true });
    writeFileSync(absTarget, html);
    console.log(`✅ ${pageEntry.page}: собрано → ${relative(ROOT_DIR, absTarget)} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
  } catch (error) {
    console.error(`❌ ${pageEntry.page}: ${error.message}`);
    errors += 1;
  }
}

if (!checkMode && !writeMode) {
  console.log(`\nPreview output: ${outDir}`);
  console.log('Чтобы применить страницу в root: npm run build:site -- --page <page.html> --write');
}

process.exit(errors ? 1 : 0);
