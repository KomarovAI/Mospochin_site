#!/usr/bin/env node
import { collectArchitectureState, evaluateArchitectureBudget, loadArchitectureBudget } from './architecture-budget-lib.mjs';

const config = loadArchitectureBudget();
const state = collectArchitectureState(config);
const { errors, results } = evaluateArchitectureBudget(config, state);

for (const result of results) {
  const marker = result.passed ? '✅' : '❌';
  console.log(`${marker} ${result.metric}: ${result.actual} (${result.operator} ${result.value})`);
}

if (errors.length) {
  console.error(`Architecture budget failed: ${errors.length} regression(s)`);
  process.exit(1);
}

console.log(`✅ Architecture budget passed: ${results.length} checks`);
