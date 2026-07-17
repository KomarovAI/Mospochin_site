#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCK = path.join(ROOT, 'package-lock.json');
const ATTESTATION = path.join(ROOT, 'data', 'npm-audit-attestation.json');
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function isNetworkFailure(output) {
  return /502 Bad Gateway|audit endpoint returned an error|EAI_AGAIN|ENOTFOUND|ECONNRESET|ETIMEDOUT/i.test(output);
}

const result = spawnSync(NPM, ['audit', '--audit-level=moderate'], {
  cwd: ROOT,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
  timeout: 45000,
  killSignal: 'SIGTERM',
});
const processError = result.error ? `${result.error.code || result.error.name || 'ERROR'}: ${result.error.message}\n` : '';
const combined = `${result.stdout || ''}${result.stderr || ''}${processError}`;
process.stdout.write(combined);

if (result.status === 0) {
  console.log('✅ npm audit passed online');
  process.exit(0);
}

if (!isNetworkFailure(combined)) {
  console.error('❌ npm audit failed with a non-network result; attestation fallback is forbidden.');
  process.exit(result.status ?? 1);
}

if (!fs.existsSync(ATTESTATION)) {
  console.error('❌ npm audit network failure and no attestation is available.');
  process.exit(1);
}
const attestation = JSON.parse(fs.readFileSync(ATTESTATION, 'utf8'));
const lockHash = sha256(LOCK);
const ageHours = (Date.now() - Date.parse(attestation.auditedAt)) / 3600000;
const maxAgeHours = Number(attestation.maxAgeHours || 0);

const valid =
  attestation.schemaVersion === 1 &&
  attestation.auditLevel === 'moderate' &&
  Number(attestation.vulnerabilities) === 0 &&
  attestation.packageLockSha256 === lockHash &&
  Number.isFinite(ageHours) && ageHours >= 0 && ageHours <= maxAgeHours;

if (!valid) {
  console.error('❌ npm audit network failure; cached attestation is missing, stale, or does not match package-lock.json.');
  console.error(JSON.stringify({ lockHash, attestationLockHash: attestation.packageLockSha256, ageHours, maxAgeHours }, null, 2));
  process.exit(1);
}

console.warn(`⚠️ npm audit endpoint unavailable; accepted fresh zero-vulnerability attestation for identical package-lock.json (${ageHours.toFixed(1)}h old).`);
console.warn(`   source: ${attestation.source}`);
console.log('✅ npm audit attestation fallback passed');
