#!/usr/bin/env node
/**
 * Low-resource check profiles for MosPochin.
 *
 * Goal: keep daily checks fast and deterministic by avoiding deeply nested
 * `npm run ... && npm run ...` chains. Heavy image/visual/page-doctor checks
 * are available, but not part of the default handoff path.
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const NODE = process.execPath;
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function cmd(command, args = []) {
  return { command, args };
}

const commandSets = {
  core: [
    cmd(NODE, ['tools/validate-data.mjs']),
    cmd(NODE, ['tools/validate-site.mjs']),
    cmd(NODE, ['tools/check-conversion-ui.mjs']),
    cmd(NODE, ['tools/check-ownership.mjs']),
    cmd(NODE, ['tools/build-site.mjs', '--check']),
    cmd(NODE, ['tools/site-builder-extract-shared.mjs', '--check']),
    cmd(NODE, ['tools/site-builder-parameterize-core.mjs', '--check']),
    cmd(NODE, ['tools/generate-faq-registry.mjs', '--check']),
    cmd(NODE, ['tools/check-scale-policy.mjs']),
  ],
  ai: [
    cmd(NODE, ['tools/generate-project-map.mjs', '--check']),
    cmd(NODE, ['tools/generate-ai-index.mjs', '--check']),
    cmd(NODE, ['tools/generate-ai-digest.mjs', '--check']),
    cmd(NODE, ['tools/generate-ai-component-map.mjs', '--check']),
    cmd(NODE, ['tools/analyze-source-complexity.mjs', '--check']),
  ],
  assets: [
    cmd(NODE, ['tools/audit-assets.mjs']),
    cmd(NODE, ['tools/audit-unused-assets.mjs']),
  ],
  doctor: [
    cmd(NODE, ['tools/doctor-changed-pages.mjs', '--quiet']),
  ],
  images: [
    cmd(NODE, ['tools/generate-responsive-images.mjs', '--check']),
    cmd(NODE, ['tools/generate-webp-sidecars.mjs', '--check']),
    cmd(NODE, ['tools/check-image-budget.mjs']),
  ],
  visual: [
    cmd(NODE, ['tools/audit-screenshots.mjs', '--manifest', 'data/parokonvektomat-screenshot-audit.json']),
  ],
  npmAudit: [
    cmd(NPM, ['audit', '--audit-level=moderate']),
  ],
};

const profiles = {
  core: [...commandSets.core],
  ai: [...commandSets.ai],
  assets: [...commandSets.assets],
  doctor: [...commandSets.doctor],
  images: [...commandSets.images],
  visual: [...commandSets.visual],
  handoff: [
    ...commandSets.core,
    ...commandSets.ai,
    ...commandSets.assets,
    ...commandSets.npmAudit,
  ],
  full: [
    ...commandSets.core,
    ...commandSets.ai,
    ...commandSets.assets,
    ...commandSets.npmAudit,
    ...commandSets.doctor,
    ...commandSets.images,
    ...commandSets.visual,
  ],
};

const profile = process.argv[2] || 'core';
if (!Object.hasOwn(profiles, profile)) {
  console.error(`Unknown check profile: ${profile}`);
  console.error(`Available profiles: ${Object.keys(profiles).join(', ')}`);
  process.exit(2);
}

console.log(`\n# check-profile: ${profile}`);
console.log(`Steps: ${profiles[profile].length}\n`);

const started = Date.now();
for (const step of profiles[profile]) {
  const printable = [step.command === NODE ? 'node' : step.command, ...step.args].join(' ');
  console.log(`\n$ ${printable}`);
  const result = spawnSync(step.command, step.args, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    console.error(`\n❌ check-profile:${profile} failed at: ${printable}`);
    process.exit(result.status ?? 1);
  }
}

const elapsedSeconds = ((Date.now() - started) / 1000).toFixed(1);
console.log(`\n✅ check-profile:${profile} passed in ${elapsedSeconds}s`);
