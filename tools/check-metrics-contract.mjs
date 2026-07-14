#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contractPath = path.join(root, 'data', 'metrics-event-contract.json');
const analyticsPath = path.join(root, 'analytics.js');
const formPath = path.join(root, 'telegram-form.js');
const serverPath = path.join(root, 'server', 'telegram-api.mjs');
const pkgPath = path.join(root, 'package.json');
const pageContextPath = path.join(root, 'data', 'metrics-page-context.json');
const markupApplyPath = path.join(root, 'tools', 'apply-metrics-page-markup.mjs');
const markupCheckPath = path.join(root, 'tools', 'check-metrics-markup.mjs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function containsAll(label, haystack, needles) {
  for (const needle of needles) {
    if (!haystack.includes(needle)) {
      fail(`${label} missing ${needle}`);
    } else {
      pass(`${label} contains ${needle}`);
    }
  }
}

function assertNoForbiddenPlaintextLogFields(server) {
  const dangerousPatterns = [
    /directRow\s*=\s*\{[\s\S]*?phone\s*:/m,
    /directRow\s*=\s*\{[\s\S]*?name\s*:/m,
    /eventRow\s*=\s*\{[\s\S]*?ip\s*:/m,
    /eventRow\s*=\s*\{[\s\S]*?user_agent\s*:/m
  ];
  for (const pattern of dangerousPatterns) {
    if (pattern.test(server)) {
      fail(`server appears to write forbidden plaintext field: ${pattern}`);
    }
  }
  pass('server does not expose obvious plaintext phone/name/ip/user_agent fields in event/lead rows');
}

const contract = JSON.parse(read(contractPath));
const analytics = read(analyticsPath);
const form = read(formPath);
const server = read(serverPath);
const pkg = JSON.parse(read(pkgPath));
const pageContext = JSON.parse(read(pageContextPath));
const markupApply = read(markupApplyPath);
const markupCheck = read(markupCheckPath);

console.log(`Metrics contract version: ${contract.version}`);

containsAll('analytics.js', analytics, [
  'MOSPOCHIN_ANALYTICS_ENABLED',
  'mospochin_attribution_v1',
  'mospochin_session_v1',
  '/api/track-event',
  'IntersectionObserver',
  'sendBeacon',
  'keepalive',
  'navigator.webdriver',
  'bot\\b',
  'isTrusted',
  'reachGoal',
  'dataset?.pageIntent',
  'dataset?.equipment',
  'dataset?.brand',
  'dataset?.commercialSegment',
  'page_view',
  'pageVersion',
  'event_id',
  'client_event_ts',
  'is_decision_event',
  'form_variant'
]);

containsAll('analytics.js goals', analytics, contract.metrika.goals);
containsAll('analytics.js backend events', analytics, contract.events || []);
containsAll('telegram-form.js goals', form, [
  'form_submit_attempt',
  'form_submit_success',
  'form_submit_error',
  'form_validation_error',
  'form_submit_blocked'
]);
containsAll('server/telegram-api.mjs', server, [
  '/api/track-event',
  'site_events.jsonl',
  'site_event_rejects.jsonl',
  'direct_leads.jsonl',
  'ALLOWED_EVENTS',
  'unknown_event',
  'bad_origin',
  'rate_limited',
  'shortHash',
  'bot_user_agent',
  'event_id',
  'client_event_ts',
  'is_decision_event',
  'service_contract_created',
  'idempotency_key_hash'
]);
containsAll('server goals', server, contract.metrika.goals);
containsAll('server backend events', server, [...(contract.events || []), ...(contract.backend_events || [])]);
assertNoForbiddenPlaintextLogFields(server);

if (!pkg.scripts?.['check:metrics'] || !pkg.scripts?.['check:metrics-scorecard'] || !pkg.scripts?.['smoke:metrics'] || !pkg.scripts?.['smoke:metrics-bots'] || !pkg.scripts?.['check:metrics-markup'] || !pkg.scripts?.['apply:metrics-markup']) {
  fail('package.json missing metrics check/smoke/markup scripts');
} else {
  pass('package.json exposes metrics check, smoke and markup scripts');
}

containsAll('metrics page context', JSON.stringify(pageContext), [
  'data-page-intent',
  'data-equipment',
  'data-page-version',
  'data-cta-id',
  'parokonvektomat-kod-oshibki.html',
  'pishevarochnye-kotly.html'
]);
containsAll('apply markup tool', markupApply, [
  'data-page-intent',
  'data-equipment',
  'data-page-version',
  'data-cta-id',
  'data-cta-group',
  'data-block'
]);
containsAll('check markup tool', markupCheck, [
  'data-page-intent',
  'data-equipment',
  'data-cta-id',
  'data-contact-form'
]);

if (process.exitCode) {
  console.error('Metrics contract check failed.');
  process.exit(process.exitCode);
}
console.log('Metrics contract check passed.');
