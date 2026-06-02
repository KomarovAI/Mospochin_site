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
  'styles-combined.css',
  'telegram-form.js',
  'data/page-metadata.json',
  'data/contact-config.json',
  'data/schema-profile.json',
  'data/runtime-config.json',
  'data/site-page-contracts.json',
  'tools/doctor-page.mjs',
  'tools/doctor-household-page.mjs',
  'tools/doctor-restaurant-page.mjs',
  'tools/site-builder-lib.mjs',
  'tools/build-site.mjs',
  'tools/site-builder-parameterize-core.mjs',
  'src/site-builder.json',
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

function isGitRepo() {
  const result = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], {
    cwd: SITE_ROOT,
    encoding: 'utf8',
  });

  return result.status === 0 && result.stdout.trim() === 'true';
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
  if (!isGitRepo()) return null;

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

function collectAllBranchPages(metadata) {
  return Object.entries(metadata.pages ?? {})
    .filter(([page, pageMeta]) => page.endsWith('.html') && (pageMeta?.branch === 'restaurant' || pageMeta?.branch === 'household'))
    .map(([page]) => page)
    .sort();
}

function slugFromPage(page) {
  return page === 'index.html' ? 'index' : page.replace(/\.html$/i, '');
}

function pageFromBuilderPath(filePath, metadata) {
  if (!filePath.startsWith('src/pages/')) return null;
  const slug = filePath.split('/')[2];
  if (!slug) return null;
  return Object.keys(metadata.pages ?? {}).find((page) => page.endsWith('.html') && slugFromPage(page) === slug) || null;
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
    if (GLOBAL_PAGE_TRIGGERS.has(filePath) || filePath.startsWith('src/components/shared/') || filePath.startsWith('src/components/parametric/') || filePath.startsWith('content/components/')) {
      allBranchPages.forEach((page) => targetPages.add(page));
      continue;
    }

    const builderPage = pageFromBuilderPath(filePath, metadata);
    if (builderPage && (restaurantPages.has(builderPage) || householdPages.has(builderPage))) {
      targetPages.add(builderPage);
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

function runDoctorForPages(pages, options = {}) {
  const failures = [];
  const quiet = Boolean(options.quiet);

  for (const page of pages) {
    if (!quiet) process.stdout.write(`doctor:page ${page}\n`);
    const result = spawnSync(process.execPath, [DOCTOR_SCRIPT, '--page', page], {
      cwd: SITE_ROOT,
      encoding: 'utf8',
    });

    if (!quiet || result.status !== 0) {
      if (result.stdout) process.stdout.write(result.stdout);
      if (result.stderr) process.stderr.write(result.stderr);
    }
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
  const quiet = Boolean(args.quiet || args.summary);
  const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));
  const changedFiles = getChangedFiles(baseSha, headSha);
  const pages = changedFiles === null
    ? collectAllBranchPages(metadata)
    : collectTargetPages(changedFiles, metadata);

  if (changedFiles === null) {
    console.log('doctor:changed-pages: git repository not found, checking all branch pages');
  }

  if (pages.length === 0) {
    console.log('doctor:changed-pages skipped: no relevant page or contract changes');
    process.exit(0);
  }

  console.log(`doctor:changed-pages target count: ${pages.length}`);
  const failures = runDoctorForPages(pages, { quiet });

  if (failures.length > 0) {
    console.error(`doctor:changed-pages failed for: ${failures.join(', ')}`);
    process.exit(1);
  }

  console.log(`doctor:changed-pages passed (${pages.length} pages)`);
} catch (error) {
  console.error(`doctor:changed-pages error: ${error.message}`);
  process.exit(1);
}
