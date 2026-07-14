#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportsDir = path.join(root, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });
function readText(file) { try { return fs.readFileSync(path.join(root, file), 'utf8'); } catch { return ''; } }
function readJson(file) { try { return JSON.parse(readText(file)); } catch { return null; } }
function exists(file) { return fs.existsSync(path.join(root, file)); }
function size(file) { try { return fs.statSync(path.join(root, file)).size; } catch { return 0; } }
function list(dir, pred = () => true) { try { return fs.readdirSync(path.join(root, dir)).filter(pred).map((f) => `${dir}/${f}`); } catch { return []; } }

const files = {
  projectMap: 'data/project-map.generated.json',
  aiEditingManifest: 'data/ai-editing-manifest.json',
  aiProjectIndex: 'data/ai-project-index.json',
  aiComponentMap: 'data/ai-component-map.json',
  contentMap: '.ai/digest/content-map.json',
  clusterDigestDir: '.ai/digest/clusters',
  pageDigestDir: '.ai/digest/pages',
  aiStartHere: 'docs/AI_START_HERE.md',
  docIndex: 'docs/DOC_INDEX.md',
  fileOwnership: 'data/file-ownership.json',
};

const jsons = Object.fromEntries(Object.entries(files).filter(([k]) => !k.endsWith('Dir') && !['aiStartHere', 'docIndex'].includes(k)).map(([k, f]) => [k, readJson(f)]));
const pageDigests = list(files.pageDigestDir, (f) => f.endsWith('.md'));
const clusterDigests = list(files.clusterDigestDir, (f) => f.endsWith('.md'));

function pagesFromProjectMap(pm) {
  if (!pm) return [];
  if (Array.isArray(pm.pages)) return pm.pages.map((p) => p.slug || p.file || p.rootHtml).filter(Boolean);
  if (pm.pages && typeof pm.pages === 'object') return Object.keys(pm.pages);
  return [];
}
function pagesFromIndex(idx) {
  if (!idx) return [];
  if (Array.isArray(idx.pages)) return idx.pages.map((p) => p.slug || p.file || p.path).filter(Boolean);
  if (idx.pages && typeof idx.pages === 'object') return Object.keys(idx.pages);
  return [];
}
function pageDigestNames() {
  return pageDigests.map((p) => path.basename(p).replace(/\.md$/, '.html'));
}

const projectPages = new Set(pagesFromProjectMap(jsons.projectMap));
const indexPages = new Set(pagesFromIndex(jsons.aiProjectIndex));
const digestPages = new Set(pageDigestNames());
const overlapProjectIndex = [...projectPages].filter((p) => indexPages.has(p)).length;
const overlapProjectDigest = [...projectPages].filter((p) => digestPages.has(p)).length;

const inventory = Object.entries(files).filter(([k]) => !k.endsWith('Dir')).map(([name, file]) => ({ name, file, exists: exists(file), sizeBytes: size(file), role: roleFor(name) }));
function roleFor(name) {
  if (name === 'projectMap') return 'primary machine-readable project map';
  if (name === 'fileOwnership') return 'primary ownership/generated/manual contract';
  if (name === 'aiStartHere') return 'primary human AI entrypoint';
  if (name === 'docIndex') return 'primary docs index';
  if (name === 'aiEditingManifest') return 'compatibility/editing hints; candidate for compaction';
  if (name === 'contentMap') return 'AI digest map; candidate for compaction if it duplicates project-map';
  if (name === 'aiProjectIndex') return 'AI search/index layer; keep generated';
  if (name === 'aiComponentMap') return 'AI component index; keep generated';
  return 'supporting';
}

const findings = [
  {
    id: 'project-map-vs-ai-index-pages',
    severity: 'info',
    summary: `${overlapProjectIndex}/${projectPages.size} project-map pages also appear in ai-project-index`,
    recommendation: 'Keep both for now: project-map routes edits; ai-project-index supports semantic/project context.',
  },
  {
    id: 'project-map-vs-page-digests',
    severity: 'info',
    summary: `${overlapProjectDigest}/${projectPages.size} project-map pages have page digests`,
    recommendation: 'Keep page digests; they provide compact page summaries not present in project-map.',
  },
  {
    id: 'ai-editing-manifest-overlap',
    severity: 'review',
    summary: 'ai-editing-manifest likely overlaps with project-map and file-ownership after the AI navigation pack.',
    recommendation: 'Review unique fields, then reduce to a small compatibility manifest in a future prune step.',
  },
  {
    id: 'content-map-size',
    severity: size(files.contentMap) > 500_000 ? 'review' : 'info',
    summary: `.ai/digest/content-map.json size is ${(size(files.contentMap) / 1024).toFixed(1)} KB`,
    recommendation: 'If still >500 KB, compact long excerpts and duplicated page metadata in a future AI generated compact step.',
  },
];

const summary = {
  generatedAt: new Date().toISOString(),
  pageCounts: {
    projectMap: projectPages.size,
    aiProjectIndex: indexPages.size,
    pageDigests: pageDigests.length,
    clusterDigests: clusterDigests.length,
    overlapProjectIndex,
    overlapProjectDigest,
  },
  totalBytes: inventory.reduce((a, x) => a + x.sizeBytes, 0),
};

const report = { summary, inventory, findings };
fs.writeFileSync(path.join(reportsDir, 'ai-overlap-audit.json'), JSON.stringify(report, null, 2) + '\n');

const md = [];
md.push('# AI overlap audit');
md.push('');
md.push(`Generated: ${summary.generatedAt}`);
md.push('');
md.push('## Summary');
md.push('');
md.push(`- Project-map pages: ${summary.pageCounts.projectMap}`);
md.push(`- AI project-index pages: ${summary.pageCounts.aiProjectIndex}`);
md.push(`- Page digests: ${summary.pageCounts.pageDigests}`);
md.push(`- Cluster digests: ${summary.pageCounts.clusterDigests}`);
md.push(`- Tracked AI/map files size: ${(summary.totalBytes / 1024).toFixed(1)} KB`);
md.push('');
md.push('## Inventory');
md.push('');
md.push('| File | Exists | Size | Role |');
md.push('|---|---:|---:|---|');
for (const i of inventory) md.push(`| \`${i.file}\` | ${i.exists ? 'yes' : 'no'} | ${(i.sizeBytes / 1024).toFixed(1)} KB | ${i.role} |`);
md.push('');
md.push('## Findings');
md.push('');
for (const f of findings) {
  md.push(`### ${f.id}`);
  md.push('');
  md.push(`- Severity: ${f.severity}`);
  md.push(`- Summary: ${f.summary}`);
  md.push(`- Recommendation: ${f.recommendation}`);
  md.push('');
}
md.push('## Recommended future compaction order');
md.push('');
md.push('1. Keep `data/project-map.generated.json`, `data/file-ownership.json`, `docs/AI_START_HERE.md` and page/cluster digests.');
md.push('2. Review and shrink `data/ai-editing-manifest.json` only after confirming unique fields.');
md.push('3. Compact `.ai/digest/content-map.json` if it carries long excerpts already covered by page digests.');
md.push('4. Do not remove `data/ai-project-index.json` or `data/ai-component-map.json` while `ai:check` depends on them.');
fs.writeFileSync(path.join(reportsDir, 'ai-overlap-audit.md'), md.join('\n') + '\n');
console.log(`AI overlap audit complete: ${findings.filter((f) => f.severity === 'review').length} review findings.`);
