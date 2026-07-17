#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const contract=JSON.parse(read('data/metrics-event-contract.json'));
const analytics=read('analytics.js');
const form=read('telegram-form.js');
const server=read('server/telegram-api.mjs');
const pkg=JSON.parse(read('package.json'));
const pageContext=JSON.parse(read('data/metrics-page-context.json'));
const markupApply=read('tools/apply-metrics-page-markup.mjs');
const markupCheck=read('tools/check-metrics-markup.mjs');
const errors=[];
const check=(ok,msg)=>{if(ok)console.log(`PASS: ${msg}`);else errors.push(msg)};
const contains=(text,needles,label)=>{for(const n of needles)check(text.includes(n),`${label} contains ${n}`)};
console.log(`Metrics contract version: ${contract.version}`);
check(contract.version==='2026-07-15-paid-tracking-v3','contract is paid tracking v3');
contains(analytics,[
 'mospochin_attribution_v3','mospochin_visitor_v1','mospochin_session_v3','mospochin_tab_v1',
 'mospochin_metrika_client_v1','/api/track-event','IntersectionObserver','sendBeacon','keepalive',
 'navigator.webdriver','isTrusted','reachGoal','RESERVED_EVENT_FIELDS','EVENT_DEFINITIONS',
 'mospochin.web.v3','2026-07-15','page_view','page_version','event_id','client_event_ts','is_decision_event','form_variant',
 "getStorage('localStorage')","getStorage('sessionStorage')"
],'analytics.js');
for(const event of contract.events||[]) check(analytics.includes(event),`analytics frontend allowlist contains ${event}`);
for(const event of contract.backend_legacy_events||[]) check(!analytics.includes(`'${event}'`) && !analytics.includes(`\"${event}\"`),`analytics does not emit legacy-only event ${event}`);
contains(form,['mospochin.lead.v3','form_submit_attempt','form_submit_success','form_submit_error','form_validation_error','form_submit_blocked','data-telegram-enhanced','15000','idempotency_key','result.ok !== true'],'telegram-form.js');
contains(server,['/api/track-event','site_events.jsonl','site_event_rejects.jsonl','direct_leads.jsonl','ALLOWED_EVENTS','unknown_event','bad_origin','rate_limited','bot_user_agent','event_id','client_event_ts','is_decision_event','idempotency_conflict','payloadFingerprintHash','optionalHash','trace_id'],'server/telegram-api.mjs');
for(const event of [...(contract.events||[]),...(contract.backend_legacy_events||[]),...(contract.backend_events||[])]) check(server.includes(event),`backend accepts ${event}`);
check(!/shortHash\(value\s*\|\|\s*['"]{2}\)/.test(server),'backend does not hash empty identifiers');
check(!/directRow\s*=\s*\{[\s\S]*?phone\s*:/.test(server),'lead log does not expose raw phone');
check(Boolean(pkg.scripts?.['check:metrics']&&pkg.scripts?.['check:metrics-scorecard']&&pkg.scripts?.['smoke:metrics']&&pkg.scripts?.['smoke:metrics-bots']&&pkg.scripts?.['check:metrics-markup']),'package exposes metrics checks');
contains(JSON.stringify(pageContext),['data-page-intent','data-equipment','data-page-version','data-cta-id','parokonvektomat-kod-oshibki.html','pishevarochnye-kotly.html'],'metrics page context');
contains(markupApply,['data-page-intent','data-equipment','data-page-version','data-cta-id','data-cta-group','data-block'],'apply markup tool');
contains(markupCheck,['data-page-intent','data-equipment','data-cta-id','data-contact-form'],'check markup tool');
if(errors.length){errors.forEach(x=>console.error(`FAIL: ${x}`));console.error(`Metrics contract check failed: ${errors.length}`);process.exit(1)}
console.log('Metrics contract check passed.');
