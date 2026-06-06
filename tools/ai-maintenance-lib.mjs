import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, relative } from 'path';
import { fileURLToPath } from 'url';

export const ROOT_DIR = resolve(fileURLToPath(new URL('..', import.meta.url)));

export function readJson(path) {
  return JSON.parse(readFileSync(join(ROOT_DIR, path), 'utf8'));
}

export function fileExists(path) {
  return existsSync(join(ROOT_DIR, path));
}

export function parseArgs(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      out._.push(token);
      continue;
    }
    const withoutPrefix = token.slice(2);
    if (withoutPrefix.includes('=')) {
      const [key, ...valueParts] = withoutPrefix.split('=');
      out[key] = valueParts.join('=');
      continue;
    }
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      out[withoutPrefix] = next;
      i += 1;
    } else {
      out[withoutPrefix] = true;
    }
  }
  return out;
}

function serviceMapFrom(file, branch) {
  if (!fileExists(file)) return new Map();
  const data = readJson(file);
  return new Map((data.services || []).map((service) => [service.page, { ...service, branch }]));
}

function safePagesFromSlots(file) {
  if (!fileExists(file)) return {};
  const data = readJson(file);
  return data.pages || {};
}

function safeSiteBuilderPages() {
  if (!fileExists('src/site-builder.json')) return new Map();
  try {
    const manifest = readJson('src/site-builder.json');
    return new Map((manifest.pages || []).map((entry) => [entry.page, entry]));
  } catch {
    return new Map();
  }
}


function siteBuilderManifestStatus() {
  if (!fileExists('src/site-builder.json')) return 'absent';
  try {
    return readJson('src/site-builder.json').status || 'unknown';
  } catch {
    return 'invalid';
  }
}

function getPageTitleFromHtml(page) {
  try {
    const html = readFileSync(join(ROOT_DIR, page), 'utf8');
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
      ?.replace(/<[^>]+>/g, ' ')
      ?.replace(/\s+/g, ' ')
      ?.trim();
    return h1 || null;
  } catch {
    return null;
  }
}

function sourceListFor({ branch, role, page, hasSlots }) {
  const sources = [
    'data/page-metadata.json',
    'data/contact-config.json',
    'data/runtime-config.json',
  ];

  if (branch === 'household') {
    sources.push('data/household-branch.json', 'data/household-page-policy.json');
    if (role === 'service') {
      sources.push(
        'data/household-services.json',
        'data/household-taxonomy.json',
        'data/household-proof-layer.json',
      );
    }
    if (hasSlots) sources.push('data/household-page-slots.json');
  } else if (branch === 'restaurant') {
    sources.push('data/restaurant-branch.json', 'data/restaurant-page-policy.json');
    if (role === 'service') {
      sources.push(
        'data/restaurant-services.json',
        'data/restaurant-taxonomy.json',
        'data/restaurant-proof-layer.json',
      );
    }
    if (hasSlots) sources.push('data/restaurant-page-slots.json');
  }

  sources.push(page);
  return [...new Set(sources)].filter(fileExists);
}

function checkListFor({ branch, role, page }) {
  const checks = [
    `npm run doctor:page -- --page ${page}`,
    'npm run validate:site',
  ];
  if (role === 'service' && branch === 'household') {
    checks.unshift(`npm run doctor:household-page -- --page ${page}`);
  }
  if (role === 'service' && branch === 'restaurant') {
    checks.unshift(`npm run doctor:restaurant-page -- --page ${page}`);
  }
  return [...new Set(checks)];
}

export function buildAiIndex() {
  const metadata = readJson('data/page-metadata.json');
  const householdServices = serviceMapFrom('data/household-services.json', 'household');
  const restaurantServices = serviceMapFrom('data/restaurant-services.json', 'restaurant');
  const householdSlots = safePagesFromSlots('data/household-page-slots.json');
  const restaurantSlots = safePagesFromSlots('data/restaurant-page-slots.json');
  const siteBuilderPages = safeSiteBuilderPages();

  const pages = {};
  const allPages = Object.keys(metadata.pages || {}).sort((a, b) => a.localeCompare(b));

  for (const page of allPages) {
    const meta = metadata.pages[page];
    const service = householdServices.get(page) || restaurantServices.get(page) || null;
    const branch = service?.branch || meta.branch || 'neutral';
    const hasSlots = Boolean(householdSlots[page] || restaurantSlots[page]);
    const siteBuilderEntry = siteBuilderPages.get(page) || null;
    const role = service ? 'service' : branch === 'neutral' ? 'neutral' : 'branch';
    const title = meta.title || getPageTitleFromHtml(page) || service?.serviceName || page;
    const h1 = getPageTitleFromHtml(page);

    pages[page] = {
      page,
      branch,
      role,
      htmlExists: fileExists(page),
      title,
      h1,
      description: meta.description || null,
      canonical: meta.canonical || null,
      hasForm: Boolean(meta.hasForm),
      service: service ? {
        slug: service.slug || null,
        uiLabel: service.uiLabel || null,
        deviceName: service.deviceName || null,
        serviceName: service.serviceName || null,
        relatedPages: service.relatedPages || [],
        sectionIds: service.sectionIds || [],
      } : null,
      sources: [...new Set([
        ...sourceListFor({ branch, role, page, hasSlots }),
        ...(siteBuilderEntry ? ['src/site-builder.json', siteBuilderEntry.model] : []),
      ])].filter(fileExists),
      siteBuilder: siteBuilderEntry ? {
        status: siteBuilderEntry.status || siteBuilderManifestStatus(),
        model: siteBuilderEntry.model,
        slug: siteBuilderEntry.slug,
        sections: siteBuilderEntry.sections,
        sourceHash: siteBuilderEntry.sourceHash,
        commands: {
          preview: `npm run build:site -- --page ${page}`,
          write: `npm run build:site -- --page ${page} --write`,
          check: 'npm run check:site-builder',
          resyncFromRoot: `npm run site-builder:bootstrap -- --pages ${page}`,
        },
      } : null,
      generatedBy: {
        metadata: 'npm run sync:metadata',
        sitemap: 'npm run generate:sitemap',
        deployManifest: 'npm run generate:deploy-manifest',
        aiIndex: 'npm run generate:ai-index',
      },
      recommendedChecks: [...new Set([
        ...checkListFor({ branch, role, page }),
        ...(siteBuilderEntry ? ['npm run check:site-builder'] : []),
      ])],
    };
  }

  const byBranch = Object.values(pages).reduce((acc, page) => {
    acc[page.branch] = (acc[page.branch] || 0) + 1;
    return acc;
  }, {});

  const byRole = Object.values(pages).reduce((acc, page) => {
    acc[page.role] = (acc[page.role] || 0) + 1;
    return acc;
  }, {});

  return {
    schemaVersion: 1,
    generatedAt: new Date(0).toISOString(),
    note: 'Deterministic AI index. Regenerate with npm run generate:ai-index after page/data structure changes.',
    project: {
      name: 'MosPochin static site',
      primaryContext: 'docs/AI_START_HERE.md',
      ownership: 'data/file-ownership.json',
      projectMap: 'data/project-map.generated.json',
      recipes: 'docs/AI_TASK_RECIPES.md',
    },
    summary: {
      totalPages: allPages.length,
      byBranch,
      byRole,
    },
    sourceOfTruth: {
      metadata: 'data/page-metadata.json',
      contentSnapshot: 'content/site-content.json',
      householdServices: 'data/household-services.json',
      restaurantServices: 'data/restaurant-services.json',
      householdSlots: 'data/household-page-slots.json',
      restaurantSlots: 'data/restaurant-page-slots.json',
      contacts: 'data/contact-config.json',
      staticComponentBuilder: fileExists('src/site-builder.json') ? 'src/site-builder.json' : null,
    },
    pages,
  };
}

export function listHtmlFiles() {
  return readdirSync(ROOT_DIR)
    .filter((file) => file.endsWith('.html'))
    .sort((a, b) => a.localeCompare(b));
}

export function getFileSize(path) {
  return statSync(join(ROOT_DIR, path)).size;
}

export function relativeRoot(path) {
  return relative(ROOT_DIR, path);
}
