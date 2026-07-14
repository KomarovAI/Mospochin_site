#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportsDir = path.join(root, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });

const DOC_EXTENSIONS = new Set(['.md', '.json', '.mjs', '.js', '.html', '.css', '.yml', '.yaml', '.sh', '.txt']);
const SKIP_DIRS = new Set(['.git', 'node_modules', '.cache', 'dist']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, '/');
}

function read(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return ''; }
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let idx = 0;
  while ((idx = haystack.indexOf(needle, idx)) !== -1) {
    count += 1;
    idx += needle.length;
  }
  return count;
}

const rootDocs = ['AGENTS.md', 'AI-CONTEXT.md', 'CHANGELOG_AI.md'].filter((p) => fs.existsSync(path.join(root, p)));
const docs = [...walk(path.join(root, 'docs')).filter((f) => f.endsWith('.md')).map(rel), ...rootDocs].sort();
const searchable = walk(root).filter((f) => DOC_EXTENSIONS.has(path.extname(f)) && !rel(f).startsWith('reports/'));
const searchableContent = searchable.map((f) => ({ file: rel(f), text: read(f) }));

const activeAllow = new Set([
  'AGENTS.md',
  'AI-CONTEXT.md',
  'CHANGELOG_AI.md',
  'docs/AI_START_HERE.md',
  'docs/DOC_INDEX.md',
  'docs/AI_PROJECT_OPERATING_GUIDE.md',
  'docs/AI_CHANGE_CHECKLIST.md',
  'docs/AI_TASK_RECIPES.md',
  'docs/PAROKONVEKTOMAT_CLUSTER_AI_GUIDE.md',
  'docs/PROJECT_DECISIONS.md',
  'docs/SCALE_POLICY.md',
  'docs/DATA_CONTRACTS.md',
  'docs/CLEANUP_POLICY.md',
]);

const knownLegacyOrDuplicate = new Set([
  'docs/AI_PROJECT_KNOWLEDGE.md',
  'docs/PROJECT_MAP.md',
  'docs/DOC_STATUS.md',
  'docs/STABILIZATION_BACKLOG.md',
  'docs/STATIC_BUILDER_MIGRATION_PLAN.md',
  'docs/SOURCE_COMPRESSION_PLAN.md',
]);

const referencePrefixes = [
  'docs/HOUSEHOLD_',
  'docs/RESTAURANT_',
  'docs/STATIC_',
  'docs/PARAMETERIZED_',
  'docs/DECLARATIVE_',
  'docs/FAQ_',
  'docs/BRANDS_',
  'docs/OPERATOR_',
  'docs/SITE_',
];

const results = docs.map((doc) => {
  const base = path.basename(doc);
  const text = read(path.join(root, doc));
  const refs = [];
  for (const item of searchableContent) {
    if (item.file === doc) continue;
    const direct = countOccurrences(item.text, doc);
    const baseRefs = countOccurrences(item.text, base);
    if (direct || baseRefs) refs.push({ file: item.file, count: direct + baseRefs });
  }
  const sizeBytes = Buffer.byteLength(text, 'utf8');
  const headings = [...text.matchAll(/^#{1,3}\s+(.+)$/gm)].map((m) => m[1]).slice(0, 8);
  const looksDeprecated = /\b(legacy|deprecated|obsolete|устар|архив|old route|compatibility stub)\b/i.test(text);

  let category = 'reference';
  let action = 'keep';
  let reason = 'Referenced or useful reference documentation.';

  if (activeAllow.has(doc)) {
    category = 'active';
    action = 'keep';
    reason = 'Current AI/project operating path or active contract.';
  } else if (knownLegacyOrDuplicate.has(doc)) {
    category = refs.length <= 2 || looksDeprecated ? 'legacyCandidate' : 'duplicateCandidate';
    action = 'reviewForPrune';
    reason = 'Known old planning/map/status document likely overlapped by AI_START_HERE, DOC_INDEX or project-map.';
  } else if (referencePrefixes.some((p) => doc.startsWith(p))) {
    category = 'reference';
    action = 'keep';
    reason = 'Domain/branch/component reference documentation.';
  } else if (refs.length === 0) {
    category = 'orphanCandidate';
    action = 'reviewForPrune';
    reason = 'No references found in project text graph.';
  } else if (looksDeprecated) {
    category = 'legacyCandidate';
    action = 'reviewForPrune';
    reason = 'Contains legacy/deprecated markers.';
  }

  return { file: doc, category, action, reason, sizeBytes, references: refs.slice(0, 15), referenceCount: refs.reduce((a, r) => a + r.count, 0), headings };
});

const summary = results.reduce((acc, r) => {
  acc.totalDocs += 1;
  acc.totalBytes += r.sizeBytes;
  acc.byCategory[r.category] = (acc.byCategory[r.category] || 0) + 1;
  acc.byAction[r.action] = (acc.byAction[r.action] || 0) + 1;
  return acc;
}, { generatedAt: new Date().toISOString(), totalDocs: 0, totalBytes: 0, byCategory: {}, byAction: {} });

const report = { summary, docs: results };
fs.writeFileSync(path.join(reportsDir, 'docs-audit.json'), JSON.stringify(report, null, 2) + '\n');

const pruneCandidates = results.filter((r) => r.action === 'reviewForPrune');
const md = [];
md.push('# Docs audit');
md.push('');
md.push(`Generated: ${summary.generatedAt}`);
md.push('');
md.push('## Summary');
md.push('');
md.push(`- Docs scanned: ${summary.totalDocs}`);
md.push(`- Total docs size: ${(summary.totalBytes / 1024).toFixed(1)} KB`);
md.push(`- Categories: ${Object.entries(summary.byCategory).map(([k, v]) => `${k}=${v}`).join(', ')}`);
md.push(`- Actions: ${Object.entries(summary.byAction).map(([k, v]) => `${k}=${v}`).join(', ')}`);
md.push('');
md.push('## Review-for-prune candidates');
md.push('');
if (!pruneCandidates.length) md.push('No docs currently marked as review-for-prune.');
else {
  md.push('| File | Category | Size | Refs | Why |');
  md.push('|---|---:|---:|---:|---|');
  for (const r of pruneCandidates) {
    md.push(`| \`${r.file}\` | ${r.category} | ${(r.sizeBytes / 1024).toFixed(1)} KB | ${r.referenceCount} | ${r.reason.replaceAll('|', '\\|')} |`);
  }
}
md.push('');
md.push('## Active docs');
md.push('');
for (const r of results.filter((r) => r.category === 'active')) {
  md.push(`- \`${r.file}\` — ${r.reason}`);
}
md.push('');
md.push('## Notes');
md.push('');
md.push('- This report is audit-only. It does not delete documents.');
md.push('- Review candidates should be pruned only after useful decisions are moved to `docs/PROJECT_DECISIONS.md`, `docs/DOC_INDEX.md`, or `CHANGELOG_AI.md`.');
md.push('- Machine-readable ownership now lives in `data/file-ownership.json`; docs should not duplicate that contract.');

fs.writeFileSync(path.join(reportsDir, 'docs-audit.md'), md.join('\n') + '\n');
console.log(`Docs audit complete: ${summary.totalDocs} docs, ${pruneCandidates.length} review candidates.`);
