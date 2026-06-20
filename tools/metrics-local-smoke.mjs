#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const date = process.env.MOSPOCHIN_SMOKE_DATE || '2026-06-20';
const base = path.join(os.tmpdir(), `mospochin-metrics-smoke-${process.pid}`);
const eventsDir = path.join(base, 'raw', 'events');
const leadsDir = path.join(base, 'raw', 'leads');
const directDir = path.join(base, 'raw', 'direct');
const outDir = path.join(base, 'llm_brief', 'events');

function mkdirp(dir) { fs.mkdirSync(dir, { recursive: true }); }
function writeJsonl(file, rows) { fs.writeFileSync(file, rows.map(row => JSON.stringify(row)).join('\n') + '\n', 'utf8'); }
function hash(value) { return crypto.createHash('sha256').update(`smoke:${value}`).digest('hex').slice(0, 24); }

mkdirp(eventsDir);
mkdirp(leadsDir);
mkdirp(directDir);
mkdirp(outDir);

const sessionA = hash('session-a');
const yclidA = hash('yclid-a');
const sessionB = hash('session-b');

writeJsonl(path.join(eventsDir, 'site_events.jsonl'), [
  {
    ts: `${date}T09:00:01.000Z`,
    event: 'cta_view',
    page_path: '/parokonvektomat-kod-oshibki.html',
    page_intent: 'error_code',
    cta_id: 'error_photo_whatsapp',
    block: 'error_bridge',
    quality: 'human_candidate',
    is_decision_event: true,
    session_id_hash: sessionA,
    yclid_hash: yclidA,
    utm_source: 'yandex',
    utm_campaign: 'parokonvektomaty_premium_b2b',
    utm_content: 'ad_177_group_5749537779',
    utm_term: 'код ошибки пароконвектомата'
  },
  {
    ts: `${date}T09:00:03.000Z`,
    event: 'cta_click',
    page_path: '/parokonvektomat-kod-oshibki.html',
    page_intent: 'error_code',
    cta_id: 'error_photo_whatsapp',
    block: 'error_bridge',
    quality: 'human_candidate',
    is_decision_event: true,
    session_id_hash: sessionA,
    yclid_hash: yclidA,
    utm_source: 'yandex',
    utm_campaign: 'parokonvektomaty_premium_b2b',
    utm_content: 'ad_177_group_5749537779',
    utm_term: 'код ошибки пароконвектомата'
  },
  {
    ts: `${date}T09:00:05.000Z`,
    event: 'whatsapp_click',
    page_path: '/parokonvektomat-kod-oshibki.html',
    page_intent: 'error_code',
    cta_id: 'error_photo_whatsapp',
    block: 'error_bridge',
    quality: 'human_candidate',
    is_decision_event: true,
    session_id_hash: sessionA,
    yclid_hash: yclidA,
    utm_source: 'yandex',
    utm_campaign: 'parokonvektomaty_premium_b2b',
    utm_content: 'ad_177_group_5749537779',
    utm_term: 'код ошибки пароконвектомата'
  },
  {
    ts: `${date}T10:10:00.000Z`,
    event: 'form_start',
    page_path: '/pishevarochnyj-kotel-ne-greet.html',
    page_intent: 'symptom',
    form_id: 'kettles_symptom_form',
    quality: 'human_candidate',
    is_decision_event: true,
    session_id_hash: sessionB,
    utm_source: 'yandex',
    utm_campaign: 'pishevarochnye_kotly_premium_b2b_poisk_500',
    utm_content: 'ad_17756426593_group_5762090801',
    utm_term: 'пищеварочный котел не греет'
  },
  {
    ts: `${date}T10:10:20.000Z`,
    event: 'form_validation_error',
    page_path: '/pishevarochnyj-kotel-ne-greet.html',
    page_intent: 'symptom',
    form_id: 'kettles_symptom_form',
    field: 'phone',
    reason: 'invalid_phone',
    quality: 'human_candidate',
    is_decision_event: true,
    session_id_hash: sessionB,
    utm_source: 'yandex',
    utm_campaign: 'pishevarochnye_kotly_premium_b2b_poisk_500',
    utm_content: 'ad_17756426593_group_5762090801',
    utm_term: 'пищеварочный котел не греет'
  }
]);

writeJsonl(path.join(eventsDir, 'site_event_rejects.jsonl'), [
  { ts: `${date}T11:00:00.000Z`, reject_reason: 'bad_origin', event: 'phone_click' },
  { ts: `${date}T11:05:00.000Z`, reject_reason: 'bot_user_agent', event: 'cta_view' }
]);

writeJsonl(path.join(leadsDir, 'direct_leads.jsonl'), [
  {
    ts: `${date}T09:01:00.000Z`,
    page_path: '/parokonvektomat-kod-oshibki.html',
    yclid_hash: yclidA,
    lead_id_hash: hash('lead-a'),
    lead_status: 'lead_created',
    quality: 'human_candidate',
    utm_campaign: 'parokonvektomaty_premium_b2b',
    utm_content: 'ad_177_group_5749537779'
  }
]);

fs.writeFileSync(
  path.join(directDir, `direct_search_queries_${date}_${date}.tsv`),
  [
    ['Date', 'CampaignId', 'CampaignName', 'AdGroupId', 'AdGroupName', 'Query', 'Impressions', 'Clicks', 'Cost', 'Ctr', 'AvgCpc'].join('\t'),
    [date, '709783132', 'MosPochin | Пароконвектоматы Premium B2B | Geo A', '5749537779', 'Пароконвектоматы / ремонт Geo A', 'ошибка у пароконвектомата унокс af01', '5', '1', '101.52', '20', '101.52'].join('\t'),
    [date, '710038564', 'MosPochin | Пищеварочные котлы Premium B2B | Поиск | 500', '5762090801', 'Котлы Run4 / не греет и долгий нагрев', 'пищеварочный котел не греет', '3', '1', '60.00', '33.33', '60.00'].join('\t')
  ].join('\n') + '\n',
  'utf8'
);

const script = path.join(root, 'ops', 'mosanalytics', 'bin', 'mosanalytics-events-aggregate.py');
const result = spawnSync('python3', [script, '--date', date, '--base', base, '--out', outDir], {
  cwd: root,
  encoding: 'utf8'
});

if (result.status !== 0) {
  console.error(result.stdout);
  console.error(result.stderr);
  throw new Error(`aggregate script failed with status ${result.status}`);
}

const requiredFiles = [
  `llm_event_funnel_${date}.csv`,
  `llm_cta_performance_${date}.csv`,
  `llm_form_friction_${date}.csv`,
  `llm_traffic_quality_${date}.csv`,
  `llm_rejected_events_summary_${date}.csv`,
  `llm_offline_conversions_${date}.csv`,
  `llm_query_landing_actions_${date}.csv`,
  `llm_landing_mismatch_${date}.csv`,
  `llm_events_manifest_${date}.json`
];

for (const name of requiredFiles) {
  const file = path.join(outDir, name);
  if (!fs.existsSync(file)) throw new Error(`missing aggregate output ${name}`);
  const stat = fs.statSync(file);
  if (stat.size <= 0) throw new Error(`empty aggregate output ${name}`);
  console.log(`PASS: ${name} (${stat.size} bytes)`);
}

const funnel = fs.readFileSync(path.join(outDir, `llm_event_funnel_${date}.csv`), 'utf8');
if (!funnel.includes('/parokonvektomat-kod-oshibki.html') || !funnel.includes('/pishevarochnyj-kotel-ne-greet.html')) {
  throw new Error('funnel output does not contain expected sample pages');
}

const mismatch = fs.readFileSync(path.join(outDir, `llm_landing_mismatch_${date}.csv`), 'utf8');
if (!mismatch.includes('ошибка у пароконвектомата унокс af01')) {
  throw new Error('mismatch output does not contain expected Direct query');
}

console.log(`Metrics local smoke passed. Temporary output: ${outDir}`);
