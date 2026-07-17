import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
test('paid landing static commercial audit passes', () => {
  const r=spawnSync(process.execPath,['scripts/audit-commercial-pages.mjs'],{cwd:process.cwd(),encoding:'utf8'});
  assert.equal(r.status,0,r.stdout+'\n'+r.stderr);
});
test('schemas and fixtures parse', () => {
  const r=spawnSync(process.execPath,['scripts/validate-paid-contracts.mjs'],{cwd:process.cwd(),encoding:'utf8'});
  assert.equal(r.status,0,r.stdout+'\n'+r.stderr);
});
