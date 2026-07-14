#!/usr/bin/env node
/**
 * Safe unused-assets audit/pruner for MosPochin.
 *
 * A file is pruned only when it is not referenced by project text files, not in
 * .deploy/include-files.txt, not an original source for a referenced/deployed
 * responsive derivative, and not a generated responsive derivative that the
 * responsive-image check would recreate.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'reports');
const REPORT_JSON = path.join(REPORT_DIR, 'unused-assets.json');
const REPORT_MD = path.join(REPORT_DIR, 'unused-assets.md');
const DEPLOY_MANIFEST = path.join(ROOT, '.deploy/include-files.txt');
const ASSET_ROOT = 'assets';
const TEXT_EXTENSIONS = new Set(['.html', '.css', '.js', '.mjs', '.json', '.md', '.svg', '.txt', '.xml', '.yml', '.yaml']);
const ASSET_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.gif', '.ico', '.css', '.woff', '.woff2', '.ttf', '.otf']);
const RESPONSIVE_RE = /^assets\/images\/responsive\/(.+)-(\d+)w(\.[a-z0-9]+)(?:\.webp)?$/i;

function parseArgs(argv) {
  const args = new Set(argv);
  return { prune: args.has('--prune'), jsonOnly: args.has('--json') };
}
function toPosix(filePath) { return filePath.split(path.sep).join('/'); }
function formatMb(bytes) { return `${(bytes / (1024 * 1024)).toFixed(2)} MB`; }
function exists(relativePath) { return fs.existsSync(path.join(ROOT, relativePath)); }
function getBytes(relativePath) { return fs.statSync(path.join(ROOT, relativePath)).size; }

function walk(relativeDir, predicate = () => true) {
  const absolute = path.join(ROOT, relativeDir);
  if (!fs.existsSync(absolute)) return [];
  const out = [];
  const stack = [relativeDir];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const relativePath = toPosix(path.join(dir, entry.name));
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        stack.push(relativePath);
      } else if (entry.isFile() && predicate(relativePath)) {
        out.push(relativePath);
      }
    }
  }
  return out.sort();
}
function readText(relativePath) {
  try { return fs.readFileSync(path.join(ROOT, relativePath), 'utf8'); }
  catch { return ''; }
}
function normalizeReference(raw, fromFile) {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/^['"]|['"]$/g, '');
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('@') || trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:') || trimmed.startsWith('tg://') || trimmed.startsWith('//') || trimmed.includes('${')) return null;
  const withoutQuery = trimmed.split(/[?#]/, 1)[0];
  if (!withoutQuery) return null;
  const resolved = withoutQuery.startsWith('/') ? withoutQuery.slice(1) : toPosix(path.normalize(path.join(path.dirname(fromFile), withoutQuery)));
  if (resolved.startsWith('../')) return null;
  return resolved;
}
function collectAssets() {
  return walk(ASSET_ROOT, (relativePath) => ASSET_EXTENSIONS.has(path.extname(relativePath).toLowerCase()));
}
function collectTextFiles() {
  const roots = ['.', 'src', 'content', 'data', 'partials', 'docs', 'tools', 'server', '.deploy', '.github', 'deploy'];
  const seen = new Set();
  const files = [];
  for (const root of roots) {
    const entries = root === '.'
      ? fs.readdirSync(ROOT, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name)
      : walk(root, (relativePath) => TEXT_EXTENSIONS.has(path.extname(relativePath).toLowerCase()));
    for (const file of entries) {
      if (seen.has(file)) continue;
      if (!TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;
      seen.add(file);
      files.push(file);
    }
  }
  return files.sort();
}
function collectReferences(textFiles, assetSet) {
  const references = new Map();
  const missing = new Map();
  function add(assetPath, fromFile, kind) {
    if (!assetPath || !assetPath.startsWith('assets/')) return;
    const normalized = toPosix(path.normalize(assetPath));
    if (assetSet.has(normalized)) {
      const item = references.get(normalized) ?? { files: new Set(), kinds: new Set() };
      item.files.add(fromFile);
      item.kinds.add(kind);
      references.set(normalized, item);
      return;
    }
    const ext = path.extname(normalized).toLowerCase();
    const looksConcrete = ASSET_EXTENSIONS.has(ext) && !/[\*{}|]/.test(normalized);
    if (!looksConcrete) return;
    const item = missing.get(normalized) ?? { files: new Set(), kinds: new Set() };
    item.files.add(fromFile);
    item.kinds.add(kind);
    missing.set(normalized, item);
  }
  for (const file of textFiles) {
    const content = readText(file);
    if (!content) continue;
    for (const match of content.matchAll(/\b(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi)) add(normalizeReference(match[1], file), file, 'attr');
    for (const match of content.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
      for (const candidate of match[1].split(',')) add(normalizeReference(candidate.trim().split(/\s+/)[0], file), file, 'srcset');
    }
    for (const match of content.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)) add(normalizeReference(match[2], file), file, 'url');
    for (const match of content.matchAll(/(?:^|["'(\s])((?:\/)?assets\/[^"'()\s<>`,;]+)/g)) add(match[1].startsWith('/') ? match[1].slice(1) : match[1], file, 'literal');
  }
  return { references, missing };
}
function readDeployManifest() {
  if (!fs.existsSync(DEPLOY_MANIFEST)) return new Set();
  return new Set(fs.readFileSync(DEPLOY_MANIFEST, 'utf8').split('\n').map((line) => line.trim()).filter((line) => line.startsWith('assets/')));
}
function sourceCandidatesForResponsive(relativePath) {
  const match = relativePath.match(RESPONSIVE_RE);
  if (!match) return [];
  const [, base, , ext] = match;
  const e = ext.toLowerCase();
  return [`assets/images/${base}${e}`, e === '.jpg' ? `assets/images/${base}.jpeg` : null, e === '.jpeg' ? `assets/images/${base}.jpg` : null].filter(Boolean).filter(exists);
}
function responsiveBaseForSource(sourcePath) {
  const parsed = path.parse(sourcePath);
  const safeBase = parsed.name.replace(/[^a-z0-9_-]+/gi, '-').replace(/-+/g, '-').toLowerCase();
  const ext = parsed.ext.toLowerCase() === '.jpg' ? '.jpg' : parsed.ext.toLowerCase();
  return { safeBase, ext };
}
function isGeneratedResponsiveForKeptSource(assetPath, sourcePaths) {
  if (!assetPath.startsWith('assets/images/responsive/') || assetPath.endsWith('.webp')) return null;
  for (const sourcePath of sourcePaths) {
    const { safeBase, ext } = responsiveBaseForSource(sourcePath);
    const escapedExt = ext.replace('.', '\\.');
    const pattern = new RegExp(`^assets/images/responsive/${safeBase}-\\d+w${escapedExt}$`, 'i');
    if (pattern.test(assetPath)) return sourcePath;
  }
  return null;
}
function makeEntry(asset, references, keepSource, generatedFor) {
  return {
    path: asset,
    bytes: getBytes(asset),
    mb: Number((getBytes(asset) / (1024 * 1024)).toFixed(3)),
    referencedBy: references.has(asset) ? [...references.get(asset).files].sort().slice(0, 20) : [],
    sourceFor: keepSource.has(asset) ? [...keepSource.get(asset).requiredBy].sort().slice(0, 20) : [],
    generatedFor: generatedFor || null,
  };
}
function buildReport() {
  const assets = collectAssets();
  const assetSet = new Set(assets);
  const textFiles = collectTextFiles();
  const deploy = readDeployManifest();
  const { references, missing } = collectReferences(textFiles, assetSet);
  const keepSource = new Map();
  for (const asset of assets) {
    if (!references.has(asset) && !deploy.has(asset)) continue;
    for (const source of sourceCandidatesForResponsive(asset)) {
      const item = keepSource.get(source) ?? { requiredBy: new Set() };
      item.requiredBy.add(asset);
      keepSource.set(source, item);
    }
  }
  const keepSourcePaths = [...keepSource.keys()].sort();
  const groups = { keepRuntime: [], keepDeploy: [], keepSource: [], keepGenerated: [], safeDelete: [] };
  for (const asset of assets) {
    const generatedFor = isGeneratedResponsiveForKeptSource(asset, keepSourcePaths);
    const entry = makeEntry(asset, references, keepSource, generatedFor);
    if (references.has(asset)) groups.keepRuntime.push(entry);
    else if (deploy.has(asset)) groups.keepDeploy.push(entry);
    else if (keepSource.has(asset)) groups.keepSource.push(entry);
    else if (generatedFor) groups.keepGenerated.push(entry);
    else groups.safeDelete.push(entry);
  }
  for (const list of Object.values(groups)) list.sort((a, b) => b.bytes - a.bytes || a.path.localeCompare(b.path));
  const totals = {};
  for (const [key, list] of Object.entries(groups)) {
    const bytes = list.reduce((sum, item) => sum + item.bytes, 0);
    totals[key] = { count: list.length, bytes, mb: Number((bytes / (1024 * 1024)).toFixed(3)) };
  }
  const assetBytes = assets.reduce((sum, file) => sum + getBytes(file), 0);
  const missingList = [...missing.entries()].map(([filePath, item]) => ({ path: filePath, referencedBy: [...item.files].sort().slice(0, 20), kinds: [...item.kinds].sort() })).sort((a, b) => a.path.localeCompare(b.path));
  return {
    generatedAt: new Date().toISOString(),
    policy: {
      safeDelete: 'not referenced, not in deploy manifest, not a responsive source original, and not a generated responsive derivative for a kept source',
      keepSource: 'original asset required to regenerate a referenced/deployed responsive derivative',
      keepGenerated: 'generated responsive derivative kept so check:responsive-images remains deterministic',
    },
    totals: { allAssets: { count: assets.length, bytes: assetBytes, mb: Number((assetBytes / (1024 * 1024)).toFixed(3)) }, ...totals, missingReferences: { count: missingList.length } },
    groups,
    missingReferences: missingList,
  };
}
function writeReport(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`);
  const lines = [];
  lines.push('# Unused assets audit', '', `Generated: ${report.generatedAt}`, '', '## Totals', '', '| Group | Files | Size |', '|---|---:|---:|');
  for (const key of ['allAssets', 'keepRuntime', 'keepDeploy', 'keepSource', 'keepGenerated', 'safeDelete']) {
    const item = report.totals[key];
    lines.push(`| ${key} | ${item.count} | ${formatMb(item.bytes)} |`);
  }
  lines.push(`| missingReferences | ${report.totals.missingReferences.count} | - |`, '', '## Safe delete candidates', '');
  if (!report.groups.safeDelete.length) lines.push('- none');
  else {
    for (const item of report.groups.safeDelete.slice(0, 100)) lines.push(`- ${item.path} — ${formatMb(item.bytes)}`);
    if (report.groups.safeDelete.length > 100) lines.push(`- ... ${report.groups.safeDelete.length - 100} more`);
  }
  lines.push('', '## Kept source originals', '');
  if (!report.groups.keepSource.length) lines.push('- none');
  else {
    for (const item of report.groups.keepSource.slice(0, 50)) lines.push(`- ${item.path} — source for ${item.sourceFor.slice(0, 3).join(', ')}`);
    if (report.groups.keepSource.length > 50) lines.push(`- ... ${report.groups.keepSource.length - 50} more`);
  }
  lines.push('', '## Missing references', '');
  if (!report.missingReferences.length) lines.push('- none');
  else {
    for (const item of report.missingReferences.slice(0, 50)) lines.push(`- ${item.path} — ${item.referencedBy.join(', ')}`);
    if (report.missingReferences.length > 50) lines.push(`- ... ${report.missingReferences.length - 50} more`);
  }
  fs.writeFileSync(REPORT_MD, `${lines.join('\n')}\n`);
}
function pruneSafe(report) {
  const removed = [];
  for (const item of report.groups.safeDelete) {
    const absolutePath = path.join(ROOT, item.path);
    if (!fs.existsSync(absolutePath)) continue;
    fs.rmSync(absolutePath, { force: true });
    removed.push(item);
  }
  return removed;
}
function main() {
  const args = parseArgs(process.argv.slice(2));
  const before = buildReport();
  let removed = [];
  if (args.prune) removed = pruneSafe(before);
  const report = args.prune ? buildReport() : before;
  if (args.prune) {
    const removedBytes = removed.reduce((sum, item) => sum + item.bytes, 0);
    report.prune = { removedCount: removed.length, removedBytes, removedMb: Number((removedBytes / (1024 * 1024)).toFixed(3)), removedFiles: removed.map((item) => item.path) };
  }
  writeReport(report);
  if (!args.jsonOnly) {
    console.log('Unused assets audit written: reports/unused-assets.json and reports/unused-assets.md');
    console.log(`allAssets=${report.totals.allAssets.count} (${formatMb(report.totals.allAssets.bytes)})`);
    console.log(`keepRuntime=${report.totals.keepRuntime.count} (${formatMb(report.totals.keepRuntime.bytes)})`);
    console.log(`keepDeploy=${report.totals.keepDeploy.count} (${formatMb(report.totals.keepDeploy.bytes)})`);
    console.log(`keepSource=${report.totals.keepSource.count} (${formatMb(report.totals.keepSource.bytes)})`);
    console.log(`keepGenerated=${report.totals.keepGenerated.count} (${formatMb(report.totals.keepGenerated.bytes)})`);
    console.log(`safeDelete=${before.totals.safeDelete.count} (${formatMb(before.totals.safeDelete.bytes)})`);
    if (args.prune) console.log(`removed=${removed.length} (${formatMb(removed.reduce((sum, item) => sum + item.bytes, 0))})`);
    if (report.missingReferences.length) {
      console.error(`missingReferences=${report.missingReferences.length}; inspect report before deleting more.`);
      process.exitCode = 1;
    }
  }
}

main();
