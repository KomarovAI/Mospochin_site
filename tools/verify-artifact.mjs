#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { validateArtifactContract } from './artifact-contract-lib.mjs';

function argValue(name, fallback = null) {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] ?? fallback : fallback;
}

const targetArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!targetArg) {
  console.error('Usage: node tools/verify-artifact.mjs <zip-or-directory> [--expect-type public-deploy] [--deployable|--not-deployable]');
  process.exit(2);
}

const target = path.resolve(targetArg);
const expectType = argValue('--expect-type');
const requireDeployable = process.argv.includes('--deployable')
  ? true
  : process.argv.includes('--not-deployable')
    ? false
    : null;

function fail(lines) {
  console.error('❌ artifact verification failed');
  for (const line of lines) console.error(`- ${line}`);
  process.exit(1);
}

function listZip(file) {
  const result = spawnSync('unzip', ['-Z1', file], { encoding: 'utf8' });
  if (result.status !== 0) fail([`cannot list ZIP: ${result.stderr.trim() || file}`]);
  return result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function readZipEntry(file, entry) {
  const result = spawnSync('unzip', ['-p', file, entry], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.status !== 0) fail([`cannot read ${entry} from ZIP`]);
  return result.stdout;
}

let entries = [];
let contractText = '';
let contractEntry = 'artifact.json';

if (!fs.existsSync(target)) fail([`target does not exist: ${target}`]);
if (fs.statSync(target).isDirectory()) {
  const file = path.join(target, 'artifact.json');
  if (!fs.existsSync(file)) fail(['artifact.json is missing']);
  contractText = fs.readFileSync(file, 'utf8');
  entries = fs.readdirSync(target, { recursive: true }).map(String).map((x) => x.replaceAll('\\', '/'));
} else {
  entries = listZip(target);
  const unsafe = entries.filter((entry) => entry.startsWith('/') || entry.split('/').includes('..'));
  if (unsafe.length) fail([`unsafe ZIP paths: ${unsafe.slice(0, 5).join(', ')}`]);
  const contracts = entries.filter((entry) => /(^|\/)artifact\.json$/.test(entry));
  if (contracts.length !== 1) fail([`expected exactly one artifact.json, found ${contracts.length}`]);
  [contractEntry] = contracts;
  contractText = readZipEntry(target, contractEntry);
}

let contract;
try {
  contract = JSON.parse(contractText);
} catch (error) {
  fail([`invalid artifact.json: ${error.message}`]);
}

const errors = validateArtifactContract(contract, { expectType, requireDeployable });
const rootPrefix = contractEntry === 'artifact.json' ? '' : contractEntry.slice(0, -'artifact.json'.length);
const relativeEntries = entries
  .filter((entry) => entry.startsWith(rootPrefix))
  .map((entry) => entry.slice(rootPrefix.length));

if (contract.artifactType === 'public-deploy') {
  const required = ['artifact.json', 'version.json', 'index.html', 'styles-combined.css', 'telegram-form.js'];
  for (const file of required) if (!relativeEntries.includes(file)) errors.push(`public-deploy missing ${file}`);
  const forbidden = ['.git/', 'node_modules/', 'src/', 'docs/', 'reports/', '.ai/', '.artifacts/', 'build/'];
  for (const prefix of forbidden) {
    if (relativeEntries.some((entry) => entry.startsWith(prefix))) errors.push(`public-deploy contains forbidden path ${prefix}`);
  }
}

if (errors.length) fail(errors);
console.log('✅ artifact contract verified');
console.log(`TYPE: ${contract.artifactType}`);
console.log(`DEPLOYABLE: ${contract.deployable}`);
console.log(`PROJECT: ${contract.project}`);
console.log(`CONTRACT: ${contractEntry}`);
