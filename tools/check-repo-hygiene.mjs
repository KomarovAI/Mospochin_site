#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const policy = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/repo-hygiene-policy.json'), 'utf8'));
const errors = [];

const slash = (p) => p.split(path.sep).join('/');
const exempt = (relative) => (policy.archiveExemptions || []).some((prefix) => relative === prefix || relative.startsWith(`${prefix}/`));

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const rootNotes = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => ['.md', '.txt'].includes(path.extname(name).toLowerCase()) || name.startsWith('.'));

for (const name of rootNotes) {
  if (!policy.allowedRootNotes.includes(name)) {
    errors.push(`${name}: new root note/config is not allowed; use docs/, reports/handoff/ or .artifacts/`);
  }
}

const forbiddenExt = new Set(policy.forbiddenExtensions || []);
const nameRegexes = (policy.forbiddenNamePatterns || []).map((item) => new RegExp(item.source, item.flags || 'u'));
const approvedInstructions = new Set(policy.approvedInstructionFiles || []);
const grandfatheredText = new Set(policy.grandfatheredTextFiles || []);
const dynamicTextRoots = policy.allowedDynamicTextRoots || [];

for (const full of walk(ROOT)) {
  const relative = slash(path.relative(ROOT, full));
  if (exempt(relative)) continue;
  const base = path.posix.basename(relative);
  const ext = path.posix.extname(base).toLowerCase();

  if (forbiddenExt.has(ext)) errors.push(`${relative}: forbidden temporary/archive extension ${ext}`);
  for (const regex of nameRegexes) {
    if (regex.test(base)) errors.push(`${relative}: suspicious backup/copy/temp filename`);
  }

  if (['.md', '.txt'].includes(ext)) {
    const dynamicAllowed = dynamicTextRoots.some((prefix) => relative === prefix || relative.startsWith(`${prefix}/`));
    if (!dynamicAllowed && !grandfatheredText.has(relative)) {
      errors.push(`${relative}: unapproved text file; use an existing canonical doc, exec-plans, docs/archive or reports/handoff`);
    }
  }

  const isInstruction = base === 'AGENTS.md'
    || base === 'CLAUDE.md'
    || base === 'GEMINI.md'
    || base === 'copilot-instructions.md'
    || base.endsWith('.instructions.md');
  if (isInstruction && !approvedInstructions.has(relative)) {
    errors.push(`${relative}: instruction file is not approved`);
  }
}

for (const [dir, allowed] of Object.entries(policy.protectedCleanDirectories || {})) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) continue;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.isDirectory()) continue;
    const ok = allowed.includes(entry.name) || allowed.includes(path.extname(entry.name).toLowerCase());
    if (!ok) errors.push(`${dir}/${entry.name}: unrelated file in protected authoring directory`);
  }
}

if (errors.length) {
  console.error('❌ repository hygiene failed');
  for (const error of [...new Set(errors)]) console.error(`- ${error}`);
  process.exit(1);
}

console.log('✅ repository hygiene: no stray root notes, archives, backups or instruction files');
