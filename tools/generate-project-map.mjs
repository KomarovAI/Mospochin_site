#!/usr/bin/env node
/**
 * Generate a compact machine-readable project map for AI/navigation.
 * It does not replace source files; it aggregates existing contracts so an
 * agent can quickly determine where a page lives, what owns it, and which
 * checks are relevant.
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = path.resolve(path.dirname(__filename), '..');
const OUT_PATH = path.join(ROOT_DIR, 'data', 'project-map.generated.json');

function readJson(rel, fallback = null) {
  const full = path.join(ROOT_DIR, rel);
  if (!existsSync(full)) return fallback;
  return JSON.parse(readFileSync(full, 'utf8'));
}

function readText(rel, fallback = '') {
  const full = path.join(ROOT_DIR, rel);
  if (!existsSync(full)) return fallback;
  return readFileSync(full, 'utf8');
}

function parseArgs(argv = process.argv.slice(2)) {
  return { check: argv.includes('--check') };
}

function slugFromPage(page) {
  return page.replace(/\.html$/i, '');
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function buildSitemapSet() {
  const xml = readText('sitemap.xml');
  const pages = new Set();
  const re = /<loc>[^<]*\/([^/<>]+\.html)<\/loc>/g;
  let match;
  while ((match = re.exec(xml))) pages.add(match[1]);
  // Home can be listed without index.html.
  if (/<loc>https?:\/\/[^<\/]+\/?<\/loc>/.test(xml)) pages.add('index.html');
  return pages;
}

function directPageMap() {
  const direct = readJson('data/direct-landing-pages.json', { pages: [] });
  const map = new Map();
  for (const page of direct.pages || []) {
    if (page?.file) map.set(page.file, page);
  }
  return map;
}

function clusterMap() {
  const registry = readJson('data/cluster-registry.json', { clusters: {} });
  const clusters = {};
  for (const [name, config] of Object.entries(registry.clusters || {})) {
    const manifest = readJson(config.manifest, null);
    const pages = Array.isArray(manifest?.pages) ? manifest.pages : [];
    clusters[name] = {
      manifest: config.manifest,
      guide: config.guide || null,
      digest: config.digest || null,
      screenshotManifest: config.screenshotManifest || null,
      guardCommands: config.guardCommands || [],
      pages: pages.filter((page) => page?.page).map((page) => ({
        page: page.page,
        intent: page.intent || page.pageType || null,
        indexable: page.indexable,
        branch: page.branch || null,
      })),
    };
  }
  return clusters;
}

function pageClusters(clusters) {
  const map = new Map();
  for (const [clusterName, cluster] of Object.entries(clusters)) {
    for (const page of cluster.pages || []) {
      map.set(typeof page === 'string' ? page : page.page, clusterName);
    }
  }
  return map;
}

function requiredChecksFor({ page, clusterInfo, direct, indexable }) {
  const checks = ['npm run check:core'];
  if (clusterInfo?.guardCommands?.length) checks.push(...clusterInfo.guardCommands);
  if (direct) checks.push('npm run generate:direct-landings');
  if (indexable !== undefined) checks.push('npm run generate:sitemap');
  checks.push('npm run sync:generated');
  checks.push('npm run check:handoff');
  return uniqueSorted(checks);
}

function buildProjectMap() {
  const siteBuilder = readJson('src/site-builder.json', { pages: [] });
  const metadata = readJson('data/page-metadata.json', { pages: {} }).pages || {};
  const sitemapPages = buildSitemapSet();
  const directPages = directPageMap();
  const clusters = clusterMap();
  const pageToCluster = pageClusters(clusters);
  const ownership = readJson('data/file-ownership.json', null);

  const pages = {};
  for (const entry of siteBuilder.pages || []) {
    const page = entry.page;
    const slug = entry.slug || slugFromPage(page);
    const meta = metadata[page] || {};
    const direct = directPages.get(page) || null;
    const cluster = pageToCluster.get(page) || null;
    const clusterInfo = cluster ? clusters[cluster] : null;
    const robots = direct?.robots || meta.robots || null;
    const indexable = robots ? !/noindex/i.test(robots) : sitemapPages.has(page);

    pages[page] = {
      slug,
      rootHtml: page,
      rootExists: existsSync(path.join(ROOT_DIR, page)),
      source: {
        model: entry.model || `src/pages/${slug}/page.json`,
        sectionsDir: `src/pages/${slug}/sections`,
        sourceHash: entry.sourceHash || null,
        sections: entry.sections ?? null,
      },
      metadata: {
        title: meta.title || direct?.title || null,
        description: meta.description || direct?.description || null,
        canonical: meta.canonical || null,
        robots,
        branch: meta.branch || direct?.branch || null,
        hasForm: meta.hasForm ?? null,
      },
      cluster,
      directLanding: Boolean(direct),
      indexable,
      inSitemap: sitemapPages.has(page),
      requiredChecks: requiredChecksFor({ page, clusterInfo, direct, indexable }),
    };
  }

  const branchCounts = Object.values(pages).reduce((acc, page) => {
    const branch = page.metadata.branch || 'unknown';
    acc[branch] = (acc[branch] || 0) + 1;
    return acc;
  }, {});

  return {
    schemaVersion: 1,
    generatedBy: 'tools/generate-project-map.mjs',
    generatedAt: 'deterministic',
    purpose: 'Single generated navigation map for AI agents: pages, ownership, generated files, clusters and check commands.',
    sourceOfTruth: {
      pageBuilder: 'src/site-builder.json',
      pageModels: 'src/pages/<slug>/page.json',
      pageSections: 'src/pages/<slug>/sections/*.html',
      sharedComponents: 'src/components/shared/*',
      parametricTemplates: 'src/components/parametric/*/*.template.html',
      parametricProps: 'content/components/*/*.json',
      metadata: 'data/page-metadata.json',
      directLandings: 'data/direct-landing-pages.json',
      faq: 'content/faq/*',
      clusterRegistry: 'data/cluster-registry.json',
    },
    commands: {
      afterSmallEdit: 'npm run check:core',
      afterGeneratedSourceEdit: 'npm run sync:generated && npm run check:handoff',
      beforeHandoff: 'npm run check:handoff',
      beforeProduction: 'npm run check:full',
      routeTask: 'npm run ai:route -- --task <type> --page <file.html>',
      packageHandoff: 'npm run handoff:pack',
    },
    ownership: ownership
      ? {
          manifest: 'data/file-ownership.json',
          manualPatterns: ownership.manual?.length ?? 0,
          generatedPatterns: ownership.generated?.length ?? 0,
          dangerZonePatterns: ownership.dangerZones?.length ?? 0,
          check: 'npm run check:ownership',
        }
      : null,
    summary: {
      pages: Object.keys(pages).length,
      branches: branchCounts,
      sitemapPages: sitemapPages.size,
      clusters: Object.keys(clusters).length,
      directLandingPages: directPages.size,
    },
    clusters,
    pages,
  };
}

const args = parseArgs();
const next = JSON.stringify(buildProjectMap(), null, 2) + '\n';

if (args.check) {
  if (!existsSync(OUT_PATH)) {
    console.error('❌ data/project-map.generated.json отсутствует. Запусти npm run generate:project-map');
    process.exit(1);
  }
  const current = readFileSync(OUT_PATH, 'utf8');
  if (current !== next) {
    console.error('❌ data/project-map.generated.json устарел. Запусти npm run generate:project-map');
    process.exit(1);
  }
  console.log('✅ project-map.generated.json актуален');
  process.exit(0);
}

writeFileSync(OUT_PATH, next);
console.log('✅ data/project-map.generated.json обновлён');
