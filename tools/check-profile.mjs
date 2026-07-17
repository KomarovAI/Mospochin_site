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
    cmd(NODE, ['tools/check-instruction-hygiene.mjs']),
    cmd(NODE, ['tools/check-repo-hygiene.mjs']),
    cmd(NODE, ['tools/validate-data.mjs']),
    cmd(NODE, ['tools/check-html-head.mjs']),
    cmd(NODE, ['tools/check-static-shell.mjs']),
    cmd(NODE, ['tools/check-public-copy.mjs']),
    cmd(NODE, ['tools/test-scale-policy-fixtures.mjs']),
    cmd(NODE, ['tools/check-sous-vide-evidence.mjs']),
    cmd(NODE, ['tools/check-sous-vide-fault-taxonomy.mjs']),
    cmd(NODE, ['tools/check-sous-vide-error-codes.mjs']),
    cmd(NODE, ['tools/check-kutter-evidence.mjs']),
    cmd(NODE, ['tools/check-kutter-fault-taxonomy.mjs']),
    cmd(NODE, ['tools/check-kutter-brand-models.mjs']),
    cmd(NODE, ['tools/check-kutter-brand-pages.mjs']),
    cmd(NODE, ['tools/check-kutter-direct-pages.mjs']),
    cmd(NODE, ['tools/check-kutter-error-codes.mjs']),
    cmd(NODE, ['tools/check-kutter-pages.mjs']),
    cmd(NODE, ['tools/check-kutter-images.mjs']),
    cmd(NODE, ['tools/check-dishwasher-evidence.mjs']),
    cmd(NODE, ['tools/check-dishwasher-fault-taxonomy.mjs']),
    cmd(NODE, ['tools/check-dishwasher-brand-models.mjs']),
    cmd(NODE, ['tools/check-dishwasher-brand-pages.mjs']),
    cmd(NODE, ['tools/check-dishwasher-direct-pages.mjs']),
    cmd(NODE, ['tools/check-dishwasher-error-codes.mjs']),
    cmd(NODE, ['tools/check-dishwasher-pages.mjs']),
    cmd(NODE, ['tools/check-dishwasher-images.mjs']),
    cmd(NODE, ['tools/check-dishwasher-intent-boundaries.mjs']),
    cmd(NODE, ['tools/check-dishwasher-link-graph.mjs']),
    cmd(NODE, ['tools/check-dishwasher-cannibalization.mjs']),
    cmd(NODE, ['tools/check-refrigeration-evidence.mjs']),
    cmd(NODE, ['tools/check-refrigeration-fault-taxonomy.mjs']),
    cmd(NODE, ['tools/check-refrigeration-brand-models.mjs']),
    cmd(NODE, ['tools/check-refrigeration-error-codes.mjs']),
    cmd(NODE, ['tools/check-refrigeration-pages.mjs']),
    cmd(NODE, ['tools/check-refrigeration-images.mjs']),
    cmd(NODE, ['tools/check-refrigeration-intent-boundaries.mjs']),
    cmd(NODE, ['tools/check-refrigeration-link-graph.mjs']),
    cmd(NODE, ['tools/check-refrigeration-cannibalization.mjs']),
    cmd(NODE, ['tools/generate-kutter-link-graph.mjs', '--check']),
    cmd(NODE, ['tools/check-kutter-link-graph.mjs']),
    cmd(NODE, ['tools/generate-kutter-seo-report.mjs', '--check']),
    cmd(NODE, ['tools/check-kutter-seo-content.mjs']),
    cmd(NODE, ['tools/check-kutter-cannibalization.mjs']),
    cmd(NODE, ['tools/repair-canonical-duplicates.mjs', '--check']),
    cmd(NODE, ['tools/crawl-site.mjs', '--check']),
    cmd(NODE, ['tools/smoke-kutter-leads.mjs', '--check']),
    cmd(NODE, ['tools/check-symptom-service-pages.mjs']),
    cmd(NODE, ['tools/check-symptom-cannibalization.mjs']),
    cmd(NODE, ['tools/generate-sous-vide-seo-layer.mjs', '--check']),
    cmd(NODE, ['tools/check-sous-vide-seo-content.mjs']),
    cmd(NODE, ['tools/check-sous-vide-link-graph.mjs']),
    cmd(NODE, ['tools/generate-sous-vide-seo-report.mjs', '--check']),
    cmd(NODE, ['tools/sync-site-builder-manifest.mjs', '--check']),
    cmd(NODE, ['tools/check-architecture.mjs']),
    cmd(NODE, ['tools/check-generated-diff.mjs']),
    cmd(NODE, ['tools/validate-site.mjs']),
    cmd(NODE, ['tools/check-conversion-ui.mjs']),
    cmd(NODE, ['tools/check-sous-vide-run5.mjs']),
    cmd(NODE, ['tools/check-metrics-contract.mjs']),
    cmd(NODE, ['tools/check-metrics-scorecard.mjs']),
    cmd(NODE, ['tools/check-metrics-markup.mjs']),
    cmd(NODE, ['tools/metrics-local-smoke.mjs']),
    cmd(NODE, ['tools/metrics-bot-smoke.mjs']),
    cmd(NODE, ['tools/check-conversion-runtime.mjs']),
    cmd(NODE, ['tools/audit-metrics-clean.mjs']),
    cmd(NODE, ['tools/strip-legacy-metrika-noscript.mjs', '--check']),
    cmd(NODE, ['tools/check-ownership.mjs']),
    cmd(NODE, ['tools/build-site.mjs', '--check']),
    cmd(NODE, ['tools/site-builder-extract-shared.mjs', '--check']),
    cmd(NODE, ['tools/site-builder-parameterize-core.mjs', '--check']),
    cmd(NODE, ['tools/generate-faq-registry.mjs', '--check']),
    cmd(NODE, ['tools/check-scale-policy.mjs']),
  ],
  ai: [
    cmd(NODE, ['tools/check-instruction-hygiene.mjs']),
    cmd(NODE, ['tools/check-repo-hygiene.mjs']),
    cmd(NODE, ['tools/generate-ai-current-state.mjs', '--check']),
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
    cmd(NODE, ['tools/check-visual-env.mjs']),
    cmd(NODE, ['tools/check-visual-contract.mjs']),
    cmd(NODE, ['tools/check-visual-workflow-policy.mjs']),
    cmd(NODE, ['tools/visual-local-capture.mjs', '--manifest', 'data/visual-smoke-audit.json', '--mode', 'first-view', '--output', '.artifacts/screenshots/visual-smoke/native-first-view']),
  ],
  visualContract: [
    cmd(NODE, ['tools/check-visual-contract.mjs']),
    cmd(NODE, ['tools/check-visual-workflow-policy.mjs']),
  ],
  npmAudit: [
    cmd(NODE, ['tools/check-npm-audit.mjs']),
  ],
};

const profiles = {
  core: [...commandSets.core],
  ai: [...commandSets.ai],
  assets: [...commandSets.assets],
  doctor: [...commandSets.doctor],
  images: [...commandSets.images],
  visual: [...commandSets.visual],
  visualContract: [...commandSets.visualContract],
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
