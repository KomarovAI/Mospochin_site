import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const METADATA_PATH = path.join(SITE_ROOT, 'data/page-metadata.json');
const DOCTOR_SCRIPT = path.join(SITE_ROOT, 'tools/doctor-page.mjs');

const GLOBAL_PAGE_TRIGGERS = new Set([
  'main.js',
  'styles.css',
  'styles-built.css',
  'telegram-form.js',
  'data/page-metadata.json',
  'data/contact-config.json',
  'data/runtime-config.json',
  'data/site-page-contracts.json',
  'tools/doctor-page.mjs',
  'tools/doctor-household-page.mjs',
  'tools/doctor-restaurant-page.mjs',
]);

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isZeroSha(value) {
  return isNonEmptyString(value) && /^0+$/.test(value.trim());
}

function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: SITE_ROOT,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    const details = result.stderr?.trim() || result.stdout?.trim() || 'git command failed';
    throw new Error(details);
  }

  return result.stdout.trim();
}

function parsePorcelainPaths(output) {
  return output
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map((line) => line.slice(3).trim())
    .map((value) => {
      if (value.includes(' -> ')) {
        return value.split(' -> ').pop()?.trim() ?? null;
      }
      return value;
    })
    .filter(Boolean);
}

function getChangedFiles(baseSha, headSha) {
  if (
    isNonEmptyString(baseSha) &&
    isNonEmptyString(headSha) &&
    !isZeroSha(baseSha) &&
    !isZeroSha(headSha)
  ) {
    return runGit(['diff', '--name-only', '--diff-filter=ACMRD', baseSha, headSha])
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const workingTreeChanges = parsePorcelainPaths(runGit(['status', '--porcelain']));
  if (workingTreeChanges.length > 0) {
    return workingTreeChanges;
  }

  return runGit(['diff', '--name-only', '--diff-filter=ACMRD', 'HEAD~1', 'HEAD'])
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function collectTargetPages(changedFiles, metadata) {
  const targetPages = new Set();
  const allBranchPages = new Set();
  const restaurantPages = new Set();
  const householdPages = new Set();

  for (const [page, pageMeta] of Object.entries(metadata.pages ?? {})) {
    if (!page.endsWith('.html')) continue;
    if (pageMeta?.branch !== 'restaurant' && pageMeta?.branch !== 'household') continue;
    allBranchPages.add(page);
    if (pageMeta.branch === 'restaurant') restaurantPages.add(page);
    if (pageMeta.branch === 'household') householdPages.add(page);
  }

  for (const filePath of changedFiles) {
    if (GLOBAL_PAGE_TRIGGERS.has(filePath)) {
      allBranchPages.forEach((page) => targetPages.add(page));
      continue;
    }

    if (filePath.startsWith('data/restaurant-')) {
      restaurantPages.forEach((page) => targetPages.add(page));
      continue;
    }

    if (filePath.startsWith('data/household-')) {
      householdPages.forEach((page) => targetPages.add(page));
      continue;
    }

    if (filePath.endsWith('.html') && (metadata.pages?.[filePath]?.branch === 'restaurant' || metadata.pages?.[filePath]?.branch === 'household')) {
      targetPages.add(filePath);
    }
  }

  return [...targetPages].sort();
}

function runDoctorForPages(pages) {
  const failures = [];

  for (const page of pages) {
    process.stdout.write(`doctor:page ${page}\n`);
    const result = spawnSync(process.execPath, [DOCTOR_SCRIPT, '--page', page], {
      cwd: SITE_ROOT,
      encoding: 'utf8',
    });

    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.status !== 0) {
      failures.push(page);
    }
  }

  return failures;
}

try {
  const args = parseArgs(process.argv.slice(2));
  const baseSha = args.base && args.base !== true ? String(args.base) : process.env.GITHUB_BASE_SHA;
  const headSha = args.head && args.head !== true ? String(args.head) : process.env.GITHUB_SHA;
  const changedFiles = getChangedFiles(baseSha, headSha);
  const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));
  const pages = collectTargetPages(changedFiles, metadata);

  if (pages.length === 0) {
    console.log('doctor:changed-pages skipped: no relevant page or contract changes');
    process.exit(0);
  }

  console.log(`doctor:changed-pages target count: ${pages.length}`);
  const failures = runDoctorForPages(pages);

  if (failures.length > 0) {
    console.error(`doctor:changed-pages failed for: ${failures.join(', ')}`);
    process.exit(1);
  }

  console.log(`doctor:changed-pages passed (${pages.length} pages)`);
} catch (error) {
  console.error(`doctor:changed-pages error: ${error.message}`);
  process.exit(1);
}
