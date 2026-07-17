#!/usr/bin/env node
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('data/paid-landings.json','utf8'));
const event = JSON.parse(fs.readFileSync('fixtures/web-event-v3.valid.json','utf8'));
const lead = JSON.parse(fs.readFileSync('fixtures/lead-v3.valid.json','utf8'));
for (const p of ['schemas/paid-landings.schema.json','schemas/web-event-v3.schema.json','schemas/lead-v3.schema.json']) JSON.parse(fs.readFileSync(p,'utf8'));
if (!Array.isArray(manifest) || manifest.length !== 5) throw new Error('paid_manifest_count');
if (new Set(manifest.map(x=>x.landing_path)).size !== manifest.length) throw new Error('paid_manifest_duplicate_path');
for (const x of manifest) {
  for (const k of ['ad_group_id','cluster','landing_path','page_slug','page_intent','equipment','form_variant','ad_eligible']) if (!(k in x)) throw new Error(`manifest_missing_${k}`);
  if (x.ad_eligible !== true) throw new Error('active_manifest_has_hold');
}
if (event.schema_version !== 'mospochin.web.v3' || !event.event_id || !event.session_id) throw new Error('event_fixture_invalid');
if (lead.schema_version !== 'mospochin.lead.v3' || !lead.idempotency_key || !lead.phone || lead.consent !== true) throw new Error('lead_fixture_invalid');
console.log('Paid contract fixtures and JSON schemas parsed successfully.');
