#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportsDir = path.join(root, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });
const SKIP_DIRS = new Set(['.git', 'node_modules', '.cache', 'dist', 'reports']);
const TEXT_EXT = new Set(['.json', '.mjs', '.js', '.md', '.yml', '.yaml', '.sh', '.txt']);

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
function rel(file) { return path.relative(root, file).replaceAll(path.sep, '/'); }
function read(file) { try { return fs.readFileSync(file, 'utf8'); } catch { return ''; } }
function uniq(xs) { return [...new Set(xs)].sort(); }

const pkg = JSON.parse(read(path.join(root, 'package.json')) || '{}');
const scriptEntries = [];
for (const [name, cmd] of Object.entries(pkg.scripts || {})) {
  for (const match of String(cmd).matchAll(/tools\/[A-Za-z0-9._-]+\.mjs/g)) {
    scriptEntries.push({ script: name, tool: match[0] });
  }
}

const tools = walk(path.join(root, 'tools')).filter((f) => f.endsWith('.mjs')).map(rel).sort();
const toolSet = new Set(tools);
const imports = new Map(tools.map((t) => [t, []]));
const importedBy = new Map(tools.map((t) => [t, []]));

for (const t of tools) {
  const text = read(path.join(root, t));
  const dir = path.dirname(t);
  const refs = [];
  for (const m of text.matchAll(/(?:from\s+['"]|import\(['"]|require\(['"])(\.\.?\/[^'"]+\.mjs)['"]/g)) {
    const target = path.normalize(path.join(dir, m[1])).replaceAll(path.sep, '/');
    if (toolSet.has(target)) refs.push(target);
  }
  imports.set(t, uniq(refs));
  for (const target of refs) importedBy.get(target)?.push(t);
}

const deploySearchDirs = ['deploy', '.github', 'server'];
const searchable = walk(root).filter((f) => TEXT_EXT.has(path.extname(f))).map((f) => ({ file: rel(f), text: read(f) }));

const results = tools.map((tool) => {
  const scriptNames = scriptEntries.filter((e) => e.tool === tool).map((e) => e.script);
  const importers = uniq(importedBy.get(tool) || []);
  const textRefs = [];
  for (const item of searchable) {
    if (item.file === tool) continue;
    if (item.text.includes(tool) || item.text.includes(path.basename(tool))) textRefs.push(item.file);
  }
  const deployUsed = textRefs.some((f) => deploySearchDirs.some((d) => f === d || f.startsWith(`${d}/`)));
  const sizeBytes = fs.statSync(path.join(root, tool)).size;
  let category = 'manualUtility';
  let action = 'keep';
  let reason = 'Tool is retained as a manual utility or project helper.';

  if (scriptNames.length) {
    category = 'npmScriptEntry';
    reason = `Called by npm scripts: ${scriptNames.join(', ')}`;
  } else if (importers.length) {
    category = 'importedByTool';
    reason = `Imported by: ${importers.slice(0, 5).join(', ')}`;
  } else if (deployUsed) {
    category = 'deployUsed';
    reason = 'Referenced by deploy/server/workflow files.';
  } else if (/^(tools\/(set-|doctor-|scaffold-|.*legacy|.*old|.*unused))/i.test(tool)) {
    category = 'legacyCandidate';
    action = 'reviewForPrune';
    reason = 'Not a script entry/import/deploy reference and name suggests old branch-specific utility.';
  } else if (!textRefs.length) {
    category = 'orphanCandidate';
    action = 'reviewForPrune';
    reason = 'No project text references found outside the tool itself.';
  }

  return { file: tool, category, action, reason, sizeBytes, scripts: scriptNames, importedBy: importers, imports: imports.get(tool), textReferences: uniq(textRefs).slice(0, 20) };
});

const summary = results.reduce((acc, r) => {
  acc.totalTools += 1;
  acc.totalBytes += r.sizeBytes;
  acc.byCategory[r.category] = (acc.byCategory[r.category] || 0) + 1;
  acc.byAction[r.action] = (acc.byAction[r.action] || 0) + 1;
  return acc;
}, { generatedAt: new Date().toISOString(), totalTools: 0, totalBytes: 0, byCategory: {}, byAction: {} });

const report = { summary, tools: results };
fs.writeFileSync(path.join(reportsDir, 'tools-audit.json'), JSON.stringify(report, null, 2) + '\n');

const candidates = results.filter((r) => r.action === 'reviewForPrune');
const md = [];
md.push('# Tools audit');
md.push('');
md.push(`Generated: ${summary.generatedAt}`);
md.push('');
md.push('## Summary');
md.push('');
md.push(`- Tools scanned: ${summary.totalTools}`);
md.push(`- Total tools size: ${(summary.totalBytes / 1024).toFixed(1)} KB`);
md.push(`- Categories: ${Object.entries(summary.byCategory).map(([k, v]) => `${k}=${v}`).join(', ')}`);
md.push(`- Actions: ${Object.entries(summary.byAction).map(([k, v]) => `${k}=${v}`).join(', ')}`);
md.push('');
md.push('## Review-for-prune candidates');
md.push('');
if (!candidates.length) md.push('No tools currently marked as review-for-prune.');
else {
  md.push('| Tool | Category | Size | Why |');
  md.push('|---|---:|---:|---|');
  for (const r of candidates) md.push(`| \`${r.file}\` | ${r.category} | ${(r.sizeBytes / 1024).toFixed(1)} KB | ${r.reason.replaceAll('|', '\\|')} |`);
}
md.push('');
md.push('## Keep policy');
md.push('');
md.push('- Keep npm script entries, imported helpers, deploy/workflow references and safety guards.');
md.push('- Do not delete branch-specific tools until a replacement generic branch tool exists and checks pass.');
md.push('- Prefer consolidation over blind deletion for `set-*`, `doctor-*` and `scaffold-*` utilities.');
fs.writeFileSync(path.join(reportsDir, 'tools-audit.md'), md.join('\n') + '\n');
console.log(`Tools audit complete: ${summary.totalTools} tools, ${candidates.length} review candidates.`);
