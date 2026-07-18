import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadClusterContracts, normalizeClusterContract, validateClusterContracts } from '../tools/cluster-contract-lib.mjs';

test('all registry entries normalize to the common contract', () => {
  const contracts = loadClusterContracts();
  assert.equal(contracts.length, 16);
  assert.deepEqual(validateClusterContracts(contracts), []);
});

test('legacy registry fields are exposed through stable normalized names', () => {
  const contract = normalizeClusterContract('example', {
    manifest: 'data/example-pages.json',
    conversionManifest: 'data/example-conversion.json',
    screenshotManifest: 'data/example-visual.json',
    guardCommands: ['npm run check:core'],
    visualCommand: 'npm run check:visual',
    status: 'pilot',
  });

  assert.equal(contract.id, 'example');
  assert.equal(contract.pages, 'data/example-pages.json');
  assert.equal(contract.ownerData, 'data/example-conversion.json');
  assert.equal(contract.visualManifest, 'data/example-visual.json');
  assert.equal(contract.claimsScope, 'data/example-conversion.json');
  assert.equal(contract.releaseTier, 'pilot');
});
