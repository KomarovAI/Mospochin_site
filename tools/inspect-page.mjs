#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const REPO_ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const PAGE_METADATA_PATH = path.join(REPO_ROOT, 'data/page-metadata.json');
const OPERATOR_RECIPES_PATH = path.join(REPO_ROOT, 'data/operator-recipes.json');
const REPRESENTATIVE_AUDIT_PATH = path.join(REPO_ROOT, 'data/screenshot-audit.json');
const RESTAURANT_AUDIT_PATH = path.join(REPO_ROOT, 'data/restaurant-screenshot-audit.json');

function exitWithError(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    exitWithError(`failed to read ${label}: ${error.message}`);
  }
}

function parseArgs(argv) {
  const args = {
    page: null,
    slug: null,
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--json') {
      args.json = true;
      continue;
    }

    if (token === '--page' || token === '--slug') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        exitWithError(`missing value for ${token}`);
      }

      if (token === '--page') args.page = value;
      if (token === '--slug') args.slug = value;
      index += 1;
      continue;
    }

    exitWithError(`unknown argument: ${token}`);
  }

  if (!args.page && !args.slug) {
    exitWithError('pass --page <file.html> or --slug <slug>');
  }

  return args;
}

function normalizePage(args) {
  const rawPage = args.page ?? `${args.slug}.html`;
  return rawPage.replace(/\\/g, '/').replace(/^\.\//, '');
}

function runDoctor(page) {
  const result = spawnSync('node', ['tools/doctor-page.mjs', '--page', page, '--json'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    const message = result.stderr?.trim() || result.stdout?.trim() || 'doctor:page failed';
    exitWithError(message);
  }

  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    exitWithError(`doctor:page returned invalid JSON: ${error.message}`);
  }
}

function normalizePageKind(doctorSummary) {
  if (doctorSummary.pageType === 'branch-card-page' || doctorSummary.pageType === 'restaurant-branch-page') {
    return 'branch-page';
  }

  if (doctorSummary.pageType === 'service-page' || doctorSummary.pageType === 'restaurant-service-page') {
    return 'service-page';
  }

  return doctorSummary.pageType ?? 'unknown';
}

function getBranchCommands(branch, page, pageKind, doctorSummary) {
  const commands = {
    doctor: `npm run doctor:page -- --page ${page}`,
    branchDoctor:
      branch === 'household'
        ? `npm run doctor:household-page -- --page ${page}`
        : branch === 'restaurant'
          ? `npm run doctor:restaurant-page -- --page ${page}`
          : null,
    validate: 'npm run validate:site',
  };

  const isPublicServicePage = pageKind === 'service-page' && !doctorSummary.registry?.isShadow;
  if (isPublicServicePage && branch === 'household') {
    commands.sync = `npm run household:sync-fallbacks -- --page ${page}`;
  }
  if (isPublicServicePage && branch === 'restaurant') {
    commands.sync = `npm run restaurant:sync-fallbacks -- --page ${page}`;
  }

  return commands;
}

function getSourceFiles(branch, pageKind, doctorSummary) {
  const shared = ['data/page-metadata.json', 'data/contact-config.json', 'data/schema-profile.json'];

  if (branch === 'household') {
    const files = [...shared, 'data/household-page-slots.json', 'data/household-proof-layer.json'];
    if (pageKind === 'service-page') {
      files.push('data/household-services.json', 'data/household-taxonomy.json');
      if (doctorSummary.registry?.isShadow) files.push('HTML narrative only for shadow-page unique copy');
    } else {
      files.push('data/household-branch.json');
    }
    return files;
  }

  if (branch === 'restaurant') {
    const files = [...shared, 'data/restaurant-page-slots.json', 'data/restaurant-proof-layer.json'];
    if (pageKind === 'service-page') {
      files.push('data/restaurant-services.json', 'data/restaurant-taxonomy.json');
    } else {
      files.push('data/restaurant-branch.json');
    }
    return files;
  }

  return [...shared, `${doctorSummary.page} for unique HTML only`];
}

function getBuilderSource(page) {
  const slug = page.replace(/\.html$/, '');
  const modelPath = path.join(REPO_ROOT, 'src', 'pages', slug, 'page.json');
  if (!fs.existsSync(modelPath)) return [];
  return [
    `src/pages/${slug}/page.json`,
    `src/pages/${slug}/sections/*.html`,
    'src/components/shared/* or src/components/parametric/*',
  ];
}

function getAuditCoverage(page) {
  const representative = readJson(REPRESENTATIVE_AUDIT_PATH, 'data/screenshot-audit.json');
  const restaurant = readJson(RESTAURANT_AUDIT_PATH, 'data/restaurant-screenshot-audit.json');

  const representativeEntry = (representative.pages ?? []).find((entry) => entry.page === page) ?? null;
  const restaurantEntry = (restaurant.pages ?? []).find((entry) => entry.page === page) ?? null;

  return {
    representative: representativeEntry
      ? { command: 'npm run audit:representative-pages', pageType: representativeEntry.pageType }
      : null,
    restaurantBranch: restaurantEntry
      ? { command: 'npm run audit:restaurant-branch', pageType: restaurantEntry.pageType }
      : null,
    note:
      representativeEntry || restaurantEntry
        ? 'Use screenshot audit only for visual/layout stabilization review.'
        : 'No manifest coverage; use a targeted browser smoke only if this is a visual/layout change.',
  };
}

function getRecipes(branch, pageKind) {
  const recipeData = readJson(OPERATOR_RECIPES_PATH, 'data/operator-recipes.json');
  return (recipeData.recipes ?? [])
    .filter((recipe) => recipe.branch === branch && recipe.pageKind === pageKind)
    .filter((recipe) => !recipe.id.includes('audit'))
    .map((recipe) => ({
      id: recipe.id,
      preferredEditSurface: recipe.preferredEditSurface,
      requiresSync: Boolean(recipe.requiresSync),
    }));
}

function buildInspection(page) {
  const metadata = readJson(PAGE_METADATA_PATH, 'data/page-metadata.json');
  const pageMeta = metadata.pages?.[page] ?? null;
  const doctor = runDoctor(page);
  const branch = pageMeta?.branch ?? doctor.metadata?.branch ?? null;
  const pageKind = normalizePageKind(doctor);
  const builderSource = getBuilderSource(page);

  return {
    page,
    branch,
    pageKind,
    doctorPageType: doctor.pageType,
    htmlExists: Boolean(doctor.htmlExists),
    metadata: pageMeta
      ? {
          canonical: pageMeta.canonical ?? null,
          robots: pageMeta.robots ?? null,
          hasForm: Boolean(pageMeta.hasForm),
        }
      : null,
    issues: doctor.issues ?? [],
    editSurfaces: doctor.recommendedEditSurface ?? null,
    sourceFiles: [...builderSource, ...getSourceFiles(branch, pageKind, doctor)],
    commands: getBranchCommands(branch, page, pageKind, doctor),
    recipes: getRecipes(branch, pageKind),
    screenshotAudit: getAuditCoverage(page),
  };
}

function printList(items, prefix = '  - ') {
  if (!items.length) {
    console.log(`${prefix}none`);
    return;
  }

  items.forEach((item) => console.log(`${prefix}${item}`));
}

function printInspection(inspection) {
  console.log(`Page preflight: ${inspection.page}`);
  console.log(`- branch: ${inspection.branch ?? 'unknown'}`);
  console.log(`- page kind: ${inspection.pageKind}`);
  console.log(`- doctor page type: ${inspection.doctorPageType}`);
  console.log(`- html: ${inspection.htmlExists ? 'ok' : 'missing'}`);
  console.log(
    `- metadata: ${
      inspection.metadata
        ? `ok (canonical=${inspection.metadata.canonical ?? 'missing'}, hasForm=${inspection.metadata.hasForm ? 'yes' : 'no'})`
        : 'missing'
    }`,
  );

  console.log('- source files:');
  printList(inspection.sourceFiles);

  if (inspection.editSurfaces) {
    console.log('- edit surfaces:');
    Object.entries(inspection.editSurfaces).forEach(([label, value]) => {
      console.log(`  - ${label}: ${value}`);
    });
  }

  console.log('- commands:');
  Object.entries(inspection.commands).forEach(([label, value]) => {
    if (value) console.log(`  - ${label}: ${value}`);
  });

  console.log('- matching recipes:');
  if (inspection.recipes.length) {
    inspection.recipes.forEach((recipe) => {
      const sync = recipe.requiresSync ? ', sync required' : '';
      console.log(`  - ${recipe.id}: ${recipe.preferredEditSurface}${sync}`);
    });
  } else {
    console.log('  - none');
  }

  console.log('- screenshot audit:');
  if (inspection.screenshotAudit.representative) {
    console.log(`  - representative: ${inspection.screenshotAudit.representative.command}`);
  }
  if (inspection.screenshotAudit.restaurantBranch) {
    console.log(`  - restaurant branch: ${inspection.screenshotAudit.restaurantBranch.command}`);
  }
  if (!inspection.screenshotAudit.representative && !inspection.screenshotAudit.restaurantBranch) {
    console.log('  - no manifest coverage');
  }
  console.log(`  - note: ${inspection.screenshotAudit.note}`);

  if (inspection.issues.length) {
    console.log('- doctor issues:');
    inspection.issues.forEach((issue) => console.log(`  - ${issue}`));
  } else {
    console.log('- doctor issues: none');
  }
}

const args = parseArgs(process.argv.slice(2));
const inspection = buildInspection(normalizePage(args));

if (args.json) {
  console.log(JSON.stringify(inspection, null, 2));
} else {
  printInspection(inspection);
}
