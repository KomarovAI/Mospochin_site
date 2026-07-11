#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const policy = JSON.parse(fs.readFileSync(path.join(root, 'data', 'metrics-scorecard-policy.json'), 'utf8'));
const contract = JSON.parse(fs.readFileSync(path.join(root, 'data', 'metrics-event-contract.json'), 'utf8'));
const aggregate = fs.readFileSync(path.join(root, 'ops', 'mosanalytics', 'bin', 'mosanalytics-events-aggregate.py'), 'utf8');
const server = fs.readFileSync(path.join(root, 'server', 'telegram-api.mjs'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const errors = [];
const requiredActions = ['instrumentation_gap', 'cta_dead', 'form_friction', 'backend_delivery', 'collect_more_data', 'keep_monitoring'];
const requiredAggregateMarkers = [
  'page_view',
  'page_version',
  'build_page_scorecard',
  'llm_page_scorecard_',
  'llm_page_improvement_actions_',
  '--page-context',
  '--policy',
  'qualified_lead',
  'repair_order_created'
];

function check(condition, message) {
  if (!condition) errors.push(message);
  else console.log(`PASS: ${message}`);
}

check(policy.schemaVersion === 1, 'scorecard policy schemaVersion=1');
check(Number(policy.minSessionsForActionable) > 0, 'scorecard policy has actionable session threshold');
check(Number(policy.minSessionsForConfidence) >= Number(policy.minSessionsForActionable), 'confidence threshold is not below actionable threshold');
check(policy.priorityOrder?.join(',') === 'P0,P1,P2,P3', 'scorecard priority order is P0/P1/P2/P3');
for (const action of requiredActions) check(typeof policy.actions?.[action] === 'string', `scorecard policy action ${action}`);
for (const marker of requiredAggregateMarkers) check(aggregate.includes(marker), `aggregator contains ${marker}`);
check(server.includes('/api/track-outcome') && server.includes('MOSPOCHIN_OUTCOME_TOKEN'), 'server contains secured outcome endpoint');
check(server.includes('ignored-bot') && server.includes('isBotLikeRequest'), 'server rejects bot events before accepted log');
for (const output of ['llm_page_scorecard_YYYY-MM-DD.csv', 'llm_page_improvement_actions_YYYY-MM-DD.csv']) {
  check((contract.llm_outputs || []).includes(output), `contract output ${output}`);
}
check(pkg.scripts?.['check:metrics-scorecard'] === 'node tools/check-metrics-scorecard.mjs', 'package exposes scorecard contract check');

if (errors.length) {
  console.error(`Metrics scorecard contract failed: ${errors.length} error(s)`);
  process.exit(1);
}
console.log('Metrics scorecard contract passed.');
