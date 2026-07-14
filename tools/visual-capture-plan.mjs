#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'tools/visual-capture.config.json');

function parseArgs(argv) {
  const out = {
    scope: 'auto',
    page: '',
    cluster: '',
    depth: '',
    parts: '',
    viewports: '',
    baseUrl: '',
    includeCore: false,
    llm: 'compact',
    failOnCritical: false,
    warnOnSelectorMiss: false
  };

  for (const raw of argv) {
    if (raw === '--include-core') out.includeCore = true;
    else if (raw === '--fail-on-critical') out.failOnCritical = true;
    else if (raw === '--warn-on-selector-miss') out.warnOnSelectorMiss = true;
    else if (raw.startsWith('--scope=')) out.scope = raw.slice('--scope='.length);
    else if (raw.startsWith('--page=')) out.page = raw.slice('--page='.length);
    else if (raw.startsWith('--cluster=')) out.cluster = raw.slice('--cluster='.length);
    else if (raw.startsWith('--depth=')) out.depth = raw.slice('--depth='.length);
    else if (raw.startsWith('--parts=')) out.parts = raw.slice('--parts='.length);
    else if (raw.startsWith('--viewports=')) out.viewports = raw.slice('--viewports='.length);
    else if (raw.startsWith('--base-url=')) out.baseUrl = raw.slice('--base-url='.length);
    else if (raw.startsWith('--llm=')) out.llm = raw.slice('--llm='.length);
    else if (raw.startsWith('--new-depth=')) out.newDepth = raw.slice('--new-depth='.length);
    else if (raw.startsWith('--changed-depth=')) out.changedDepth = raw.slice('--changed-depth='.length);
    else if (raw.startsWith('--affected-depth=')) out.affectedDepth = raw.slice('--affected-depth='.length);
    else if (raw.startsWith('--changed-from=')) out.changedFrom = raw.slice('--changed-from='.length);
    else if (raw.startsWith('--changed-to=')) out.changedTo = raw.slice('--changed-to='.length);
    else if (raw.startsWith('--content-sha=')) out.contentSha = raw.slice('--content-sha='.length);
    else if (raw.startsWith('--run-id=')) out.runId = raw.slice('--run-id='.length);
  }

  return out;
}

function normPath(value) {
  if (!value || value === 'index.html' || value === '/index.html') return '/';
  let s = String(value).trim();
  if (!s.startsWith('/')) s = '/' + s;
  return s;
}

function pageIdFromPath(pagePath) {
  const clean = pagePath === '/' ? 'index' : pagePath.replace(/^\//, '').replace(/\.html$/, '');
  return clean
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'index';
}

function csvEscape(value) {
  const s = value == null ? '' : String(value);
  return /[",\n;]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function listPublicHtml() {
  const names = await fs.readdir(ROOT);
  return names
    .filter((name) => name.endsWith('.html'))
    .map((name) => name === 'index.html' ? '/' : '/' + name)
    .sort();
}

async function fileHashForPage(pagePath) {
  const filename = pagePath === '/' ? 'index.html' : pagePath.replace(/^\//, '');
  try {
    const buf = await fs.readFile(path.join(ROOT, filename));
    return crypto.createHash('sha256').update(buf).digest('hex');
  } catch {
    return '';
  }
}

async function buildCurrentInventory(allPages) {
  const pages = [];
  for (const p of allPages) {
    pages.push({
      path: p,
      html_sha256: await fileHashForPage(p)
    });
  }
  return {
    generated_at: new Date().toISOString(),
    pages
  };
}

function inventoryMap(inv) {
  const m = new Map();
  for (const p of inv?.pages || []) m.set(normPath(p.path), p);
  return m;
}

function defaultPartsForDepth(depth) {
  if (depth === 'atomic') return ['full', 'top', 'header', 'menu', 'footer', 'forms', 'contacts', 'blocks', 'elements', 'aria', 'numbered-map'];
  if (depth === 'deep') return ['full', 'top', 'header', 'menu', 'footer', 'forms', 'contacts', 'blocks', 'aria', 'numbered-map'];
  if (depth === 'medium') return ['full', 'top', 'header', 'menu', 'footer', 'forms', 'contacts', 'blocks'];
  if (depth === 'blocks') return ['full', 'top', 'header', 'menu', 'footer', 'forms', 'blocks'];
  if (depth === 'layout' || depth === 'layout-deep') return ['full', 'top', 'header', 'menu', 'footer', 'forms', 'contacts', 'blocks'];
  return ['full', 'top', 'header', 'footer'];
}

function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

export async function buildCapturePlan(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const config = await readJson(CONFIG_PATH, {});
  const baseUrl = args.baseUrl || process.env.MOSPOCHIN_SCREENSHOT_BASE_URL || config.baseUrl || 'https://mospochin.ru';

  const outputDir = config.outputDir || 'reports/live-visual-pack';
  const inventoryDir = config.inventoryDir || 'reports/visual-inventory';
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(inventoryDir, { recursive: true });

  const allPages = await listPublicHtml();
  const previousInventoryPath = path.join(ROOT, inventoryDir, 'previous.json');
  const currentInventoryPath = path.join(ROOT, inventoryDir, 'current.json');

  const previous = await readJson(previousInventoryPath, { pages: [] });
  const current = await buildCurrentInventory(allPages);
  const prevMap = inventoryMap(previous);
  const currMap = inventoryMap(current);

  const viewports = (args.viewports ? args.viewports.split(',') : ['desktop', 'mobile'])
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((name) => config.viewports?.[name]);

  const explicitParts = args.parts
    ? args.parts.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  let targetPages = [];

  if (args.scope === 'page') {
    targetPages = [normPath(args.page || '/')];
  } else if (args.scope === 'cluster') {
    const clusterPages = config.clusters?.[args.cluster] || [];
    targetPages = uniq([...(args.includeCore ? config.core?.always || [] : []), ...clusterPages].map(normPath));
  } else if (args.scope === 'core') {
    targetPages = (config.core?.always || []).map(normPath);
  } else if (args.scope === 'all') {
    targetPages = allPages;
  } else {
    const changedOrNew = [];
    for (const [p, cur] of currMap.entries()) {
      const old = prevMap.get(p);
      if (!old) changedOrNew.push(p);
      else if (old.html_sha256 && cur.html_sha256 && old.html_sha256 !== cur.html_sha256) changedOrNew.push(p);
    }
    targetPages = uniq([...(config.core?.always || []), ...changedOrNew].map(normPath));
  }

  const rows = [];
  let index = 0;
  const corePaths = (config.core?.always || []).map(normPath);
  const criticalPaths = (config.critical || []).map(normPath);

  for (const pagePath of targetPages) {
    const old = prevMap.get(pagePath);
    const cur = currMap.get(pagePath);
    const isCore = corePaths.includes(pagePath);
    const isCritical = criticalPaths.includes(pagePath);

    let klass = 'UNCHANGED';
    let reason = 'selected';
    let depth = args.depth || 'layout';

    if (args.scope === 'page') {
      klass = 'MANUAL_ATOMIC';
      reason = 'manual_page';
      depth = args.depth || config.depths?.manualPage || 'atomic';
    } else if (args.scope === 'cluster') {
      klass = isCore ? 'CORE_ALWAYS' : 'CLUSTER_AFFECTED';
      reason = isCore ? 'core_always' : `cluster_${args.cluster || 'selected'}`;
      depth = isCore ? (config.depths?.core || 'layout-deep') : (args.affectedDepth || config.depths?.clusterAffected || 'blocks');
    } else if (args.scope === 'all') {
      klass = isCore ? 'CORE_ALWAYS' : 'MANUAL_ALL';
      reason = isCore ? 'core_always' : 'manual_all';
      depth = args.depth || 'sections';
    } else if (isCore) {
      klass = 'CORE_ALWAYS';
      reason = 'core_always';
      depth = config.depths?.core || 'layout-deep';
    } else if (!old && cur) {
      klass = 'NEW';
      reason = 'new_url_or_missing_previous_inventory';
      depth = args.newDepth || config.depths?.new || 'deep';
    } else if (old && cur && old.html_sha256 !== cur.html_sha256) {
      klass = 'CHANGED';
      reason = 'html_sha256_changed';
      depth = args.changedDepth || config.depths?.changed || 'medium';
    }

    const parts = explicitParts.length ? explicitParts : defaultPartsForDepth(depth);

    rows.push({
      page_index: index++,
      page_id: pageIdFromPath(pagePath),
      path: pagePath,
      url: new URL(pagePath, baseUrl).toString(),
      class: klass,
      reason,
      depth,
      critical: isCritical,
      viewports,
      parts,
      status: 'planned'
    });
  }

  const plan = {
    generated_at: new Date().toISOString(),
    base_url: baseUrl,
    scope: args.scope,
    run_id: args.runId || process.env.MOSPOCHIN_SCREENSHOT_RUN_ID || '',
    commit: process.env.MOSPOCHIN_SCREENSHOT_COMMIT || '',
    content_sha: args.contentSha || process.env.MOSPOCHIN_SCREENSHOT_CONTENT_HASH || '',
    pages_total_in_repo: allPages.length,
    pages_planned: rows.length,
    viewports,
    rows
  };

  await fs.writeFile(path.join(ROOT, outputDir, 'capture-plan.json'), JSON.stringify(plan, null, 2));
  await fs.writeFile(path.join(ROOT, outputDir, 'capture-plan.csv'), [
    ['page_index', 'page_id', 'path', 'url', 'class', 'reason', 'depth', 'critical', 'viewports', 'parts', 'status'].join(','),
    ...rows.map((r) => [
      r.page_index,
      r.page_id,
      r.path,
      r.url,
      r.class,
      r.reason,
      r.depth,
      r.critical ? 'yes' : 'no',
      r.viewports.join('|'),
      r.parts.join('|'),
      r.status
    ].map(csvEscape).join(','))
  ].join('\n') + '\n');

  await fs.writeFile(currentInventoryPath, JSON.stringify(current, null, 2));

  return { config, args, plan };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildCapturePlan()
    .then(({ plan }) => {
      console.log(`VISUAL_CAPTURE_PLAN_OK pages=${plan.pages_planned} base=${plan.base_url}`);
    })
    .catch((err) => {
      console.error('VISUAL_CAPTURE_PLAN_FAIL');
      console.error(err);
      process.exit(1);
    });
}
