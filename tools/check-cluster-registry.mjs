#!/usr/bin/env node
import { loadClusterContracts, validateClusterContracts } from './cluster-contract-lib.mjs';

const contracts = loadClusterContracts();
const errors = validateClusterContracts(contracts);

if (errors.length) {
  console.error(`❌ Cluster contract failed: ${errors.length} issue(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`✅ Cluster contracts: ${contracts.length}/${contracts.length} normalized and valid`);
