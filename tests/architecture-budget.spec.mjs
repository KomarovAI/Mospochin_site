import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateArchitectureBudget } from '../tools/architecture-budget-lib.mjs';

test('architecture budget supports exact, minimum and maximum checks', () => {
  const config = {
    checks: [
      { metric: 'pages.exact', operator: 'exact', value: 500 },
      { metric: 'coverage.min', operator: 'min', value: 0.4 },
      { metric: 'files.max', operator: 'max', value: 20 },
    ],
  };
  const state = { pages: { exact: 500 }, coverage: { min: 0.5 }, files: { max: 19 } };
  assert.deepEqual(evaluateArchitectureBudget(config, state).errors, []);
});

test('architecture budget reports regressions without rounding them away', () => {
  const config = { checks: [{ metric: 'coverage', operator: 'min', value: 0.429 }] };
  const result = evaluateArchitectureBudget(config, { coverage: 0.428999 });
  assert.equal(result.errors.length, 1);
});
