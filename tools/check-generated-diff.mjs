#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { renderPageFromModel } from './site-builder-lib.mjs';

const ROOT_DIR = process.cwd();

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(items) {
  return [...new Set(items)];
}

function checkBuilderParityWithoutGit() {
  const manifestPath = path.join(ROOT_DIR, 'src', 'site-builder.json');
  if (!fs.existsSync(manifestPath)) return { checked: 0, mismatches: [] };

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    return { checked: 0, mismatches: [`unable to read src/site-builder.json: ${error.message}`] };
  }

  const mismatches = [];
  let checked = 0;
  for (const entry of manifest.pages || []) {
    try {
      const rootPath = path.join(ROOT_DIR, entry.page);
      const actual = fs.readFileSync(rootPath);
      const rendered = Buffer.from(renderPageFromModel(entry.model).html, 'utf8');
      checked += 1;
      if (!actual.equals(rendered)) mismatches.push(entry.page);
    } catch (error) {
      mismatches.push(`${entry.page}: ${error.message}`);
    }
  }
  return { checked, mismatches };
}

let files;
try {
  const base = process.env.GITHUB_BASE_SHA || process.env.GITHUB_BEFORE || '';
  const head = process.env.GITHUB_SHA || 'HEAD';
  if (base && !/^0+$/.test(base)) files = git(['diff', '--name-only', `${base}...${head}`]);
  else files = unique([...git(['diff', '--name-only']), ...git(['diff', '--cached', '--name-only'])]);
} catch {
  const parity = checkBuilderParityWithoutGit();
  if (parity.mismatches.length) {
    console.error('FAIL: git repository is unavailable and builder parity detected generated drift.');
    console.error(parity.mismatches.join('\n'));
    process.exit(1);
  }
  if (parity.checked) {
    console.log(`Generated diff guard passed without git: builder_parity=${parity.checked}`);
  } else {
    console.log('Generated diff guard limited: git unavailable and no builder pages found.');
  }
  process.exit(0);
}

const generatedPages = files.filter((file) => /^.+\.html$/i.test(file) && !file.startsWith('src/'));
const sourceFiles = files.filter((file) => (
  file.startsWith('src/') ||
  file.startsWith('data/') ||
  file.startsWith('content/') ||
  file.startsWith('tools/') ||
  file.startsWith('server/') ||
  ['main.js', 'telegram-form.js', 'analytics.js', 'styles-combined.css', 'package.json', 'package-lock.json'].includes(file)
));

if (generatedPages.length && !sourceFiles.length) {
  console.error('FAIL: root HTML changed without a source/data/runtime change. Edit src/data/tools first, then rebuild.');
  console.error(generatedPages.join('\n'));
  process.exit(1);
}

console.log(`Generated diff guard passed: root_html=${generatedPages.length} source_changes=${sourceFiles.length}`);
