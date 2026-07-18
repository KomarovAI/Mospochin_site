#!/usr/bin/env node
/** Read-only visual contract check. It never launches a browser. */
import fs from 'node:fs';
import path from 'node:path';
import { getAuditContractSummary } from './screenshot-audit-lib.mjs';

const ROOT = process.cwd();
const manifestFiles = fs.readdirSync(path.join(ROOT, 'data'))
  .filter((file) => file.endsWith('screenshot-audit.json') || file === 'visual-smoke-audit.json')
  .map((file) => `data/${file}`)
  .sort();
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/cluster-registry.json'), 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const visualRuntime = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/visual-runtime.json'), 'utf8'));
const errors = [];


if (registry.visualRuntime !== 'data/visual-runtime.json') {
  errors.push('cluster registry: visualRuntime must point to data/visual-runtime.json');
}
if (visualRuntime.primary?.mode !== 'local-native') errors.push('visual runtime: primary.mode must be local-native');
if (visualRuntime.primary?.runner !== 'tools/visual-local-capture.mjs') errors.push('visual runtime: primary.runner must be tools/visual-local-capture.mjs');
if (visualRuntime.primary?.browser !== 'chromium') errors.push('visual runtime: primary.browser must be chromium');
if (visualRuntime.primary?.transport !== 'playwright-local-content') errors.push('visual runtime: primary.transport must be playwright-local-content');
if (visualRuntime.primary?.requiresLocalhost !== false) errors.push('visual runtime: requiresLocalhost must be false');
if (visualRuntime.primary?.requiresBrowserDownload !== false) errors.push('visual runtime: requiresBrowserDownload must be false');
if (visualRuntime.capture?.fullPage?.stitcher !== 'python-pillow') errors.push('visual runtime: mobile full-page stitcher must be python-pillow');
if (visualRuntime.githubFallback?.manualOnly !== true) errors.push('visual runtime: GitHub fallback must be manualOnly');
if (visualRuntime.githubFallback?.trigger !== 'workflow_dispatch') errors.push('visual runtime: GitHub fallback trigger must be workflow_dispatch');
for (const workflow of visualRuntime.githubFallback?.workflows || []) {
  if (!fs.existsSync(path.join(ROOT, workflow))) errors.push(`visual runtime: GitHub fallback workflow is missing (${workflow})`);
}

for (const file of manifestFiles) {
  const summary = getAuditContractSummary(file);
  errors.push(...summary.errors);
  if (summary.manifest?.browser !== 'chromium') errors.push(`${file}: browser must be chromium for the primary local-native path`);
}


for (const requiredFile of [
  'tools/visual-local-runtime.mjs',
  'tools/visual-local-capture.mjs',
  'tools/check-visual-env.mjs',
  'tools/check-visual-workflow-policy.mjs',
]) {
  if (!fs.existsSync(path.join(ROOT, requiredFile))) errors.push(`local visual runtime file is missing: ${requiredFile}`);
}

const scripts = packageJson.scripts || {};
for (const scriptName of ['visual:capture', 'audit:visual-smoke', 'check:visual-env']) {
  const command = String(scripts[scriptName] || '');
  if (!command) errors.push(`package.json: missing ${scriptName}`);
  if (scriptName !== 'check:visual-env' && !command.includes('visual-local-capture.mjs')) {
    errors.push(`package.json: ${scriptName} must use visual-local-capture.mjs`);
  }
  if (/--browser\s+firefox|audit-screenshots\.mjs.*firefox/.test(command)) {
    errors.push(`package.json: ${scriptName} must not use Firefox as the primary local path`);
  }
}

if (!String(scripts['setup:visual:github'] || '').includes('visual-runner.mjs --install')) {
  errors.push('package.json: setup:visual:github must remain the explicit manual CI browser installer');
}

for (const [name, config] of Object.entries(registry.clusters || {})) {
  for (const field of ['manifest', 'guide', 'digest', 'screenshotManifest']) {
    if (config[field] && !fs.existsSync(path.join(ROOT, config[field]))) {
      errors.push(`cluster ${name}: ${field} is missing (${config[field]})`);
    }
  }
  if (!Array.isArray(config.guardCommands) || config.guardCommands.length === 0) {
    errors.push(`cluster ${name}: guardCommands must be non-empty`);
  }
  const visualCommand = String(config.visualCommand || '');
  const scriptMatch = visualCommand.match(/^npm run ([\w:-]+)$/);
  if (!scriptMatch) {
    errors.push(`cluster ${name}: visualCommand must be an npm run command`);
  } else if (!scripts[scriptMatch[1]]) {
    errors.push(`cluster ${name}: visualCommand references missing package script (${scriptMatch[1]})`);
  } else if (!String(scripts[scriptMatch[1]]).includes('visual-local-capture.mjs')) {
    errors.push(`cluster ${name}: visualCommand must use the local-native launcher`);
  }
}

if (errors.length) {
  console.error(`❌ visual contract failed: ${errors.length} issue(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`✅ visual contract passed: manifests=${manifestFiles.length}, clusters=${Object.keys(registry.clusters || {}).length}, runtime=local-native`);
