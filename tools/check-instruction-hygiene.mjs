#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const policyPath = path.join(ROOT, 'data/ai-instruction-policy.json');
const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
const errors = [];

function rel(full) {
  return path.relative(ROOT, full).split(path.sep).join('/');
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.artifacts'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const relative = rel(full);
    if (relative.startsWith('docs/archive/')) continue;
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function isInstructionFile(relative) {
  const name = path.posix.basename(relative);
  return name === 'AGENTS.md'
    || name === 'CLAUDE.md'
    || name === 'GEMINI.md'
    || name === 'copilot-instructions.md'
    || name.endsWith('.instructions.md');
}

const approved = new Set(Object.keys(policy.approvedFiles));
const discovered = walk(ROOT).map(rel).filter(isInstructionFile).sort();

for (const relative of discovered) {
  if (!approved.has(relative)) {
    errors.push(`${relative}: unapproved instruction file; add rules to an existing scoped file instead`);
  }
}
for (const relative of approved) {
  if (!fs.existsSync(path.join(ROOT, relative))) errors.push(`${relative}: approved instruction file is missing`);
}

for (const [relative, rules] of Object.entries(policy.approvedFiles)) {
  const full = path.join(ROOT, relative);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, 'utf8');
  const bytes = Buffer.byteLength(text, 'utf8');
  const lines = text.replace(/\n$/, '').split('\n');

  if (!text.startsWith(`${policy.marker}\n`)) errors.push(`${relative}: missing instruction marker on the first line`);
  if (lines.length > rules.maxLines) errors.push(`${relative}: ${lines.length} lines exceeds ${rules.maxLines}`);
  if (bytes > rules.maxBytes) errors.push(`${relative}: ${bytes} bytes exceeds ${rules.maxBytes}`);

  const headings = lines.filter((line) => /^#{1,6}\s+\S/.test(line));
  if (JSON.stringify(headings) !== JSON.stringify(rules.headings)) {
    errors.push(`${relative}: headings differ from the approved policy`);
    errors.push(`  expected: ${rules.headings.join(' | ')}`);
    errors.push(`  actual:   ${headings.join(' | ')}`);
  }
  if (new Set(headings).size !== headings.length) errors.push(`${relative}: duplicate heading detected`);

  for (const item of policy.forbiddenPatterns || []) {
    const regex = new RegExp(item.source, item.flags || 'u');
    if (regex.test(text)) errors.push(`${relative}: forbidden instruction content (${item.name})`);
  }

  const fenceMatches = [...text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)];
  for (const match of fenceMatches) {
    const count = match[1].replace(/\n$/, '').split('\n').length;
    if (count > policy.maxCodeFenceLines) {
      errors.push(`${relative}: code fence has ${count} lines; max is ${policy.maxCodeFenceLines}`);
    }
  }
}

if (errors.length) {
  console.error('❌ instruction hygiene failed');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`✅ instruction hygiene: ${approved.size} approved files, no stray instruction files`);
