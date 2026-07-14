#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const workflowDir = path.join(ROOT, '.github', 'workflows');
const visualWorkflows = fs.readdirSync(workflowDir)
  .filter((name) => /visual/i.test(name) && /\.ya?ml$/i.test(name))
  .sort();
const errors = [];

for (const name of visualWorkflows) {
  const relative = `.github/workflows/${name}`;
  const source = fs.readFileSync(path.join(workflowDir, name), 'utf8');
  const onBlock = source.match(/^on:\s*\n([\s\S]*?)(?=^[A-Za-z_][\w-]*:\s*(?:\n|$))/m)?.[1] || '';
  if (!/^\s{2}workflow_dispatch:\s*$/m.test(onBlock)) {
    errors.push(`${relative}: must declare workflow_dispatch`);
  }
  for (const forbidden of ['push', 'pull_request', 'pull_request_target', 'schedule', 'workflow_call']) {
    if (new RegExp(`^\\s{2}${forbidden}:`, 'm').test(onBlock)) {
      errors.push(`${relative}: automatic trigger is forbidden (${forbidden})`);
    }
  }
}

if (!visualWorkflows.length) errors.push('No visual GitHub workflows found');
if (errors.length) {
  console.error(`❌ visual workflow policy failed: ${errors.length} issue(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`✅ visual workflow policy passed: ${visualWorkflows.length} manual workflow(s), workflow_dispatch only`);
