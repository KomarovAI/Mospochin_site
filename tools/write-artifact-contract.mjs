#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createArtifactContract, stableJson } from './artifact-contract-lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

function value(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? fallback : fallback;
}

const artifactType = value('--type', 'source-handoff');
const out = path.resolve(ROOT, value('--out', 'artifact.json'));
const deployable = process.argv.includes('--deployable');
const contract = createArtifactContract({
  artifactType,
  deployable,
  packageVersion: pkg.version,
  contents: {
    description: value('--description', 'MosPochin project artifact'),
  },
  notes: artifactType === 'source-handoff'
    ? ['This archive is a source handoff and must not be deployed directly. Build a public-deploy artifact first.']
    : [],
});
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, stableJson(contract));
console.log(`✅ artifact contract: ${path.relative(ROOT, out) || path.basename(out)} (${artifactType}, deployable=${deployable})`);
