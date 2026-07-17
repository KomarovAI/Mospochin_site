#!/usr/bin/env node
import fs from 'node:fs'; import { evidenceMap,taxonomy,failIf } from './sous-vide-fault-lib.mjs';
const ev=evidenceMap(), rows=taxonomy(), errors=[], ids=new Set(), slugs=new Set();
for(const x of rows){
  if(!x.symptomId||ids.has(x.symptomId))errors.push(`duplicate/missing symptomId ${x.symptomId}`);ids.add(x.symptomId);
  if(!x.slug||slugs.has(x.slug))errors.push(`duplicate/missing slug ${x.slug}`);slugs.add(x.slug);
  if(!['ready','planned'].includes(x.status))errors.push(`${x.symptomId}: unsupported status ${x.status}`);
  if(x.status==='ready'){
    for(const k of ['userSymptoms','safeChecks','stopUseConditions','probableNodes','technicianChecks','sourceEvidenceIds'])if((x[k]||[]).length<2)errors.push(`${x.symptomId}: ${k} requires >=2`);
    for(const id of x.sourceEvidenceIds||[])if(!ev.has(id))errors.push(`${x.symptomId}: unknown evidence ${id}`);
  } else {
    if(x.evidenceState!=='open_backlog_research')errors.push(`${x.symptomId}: planned item missing open backlog state`);
    if(fs.existsSync(`${x.slug}.html`))errors.push(`${x.symptomId}: planned page exists in root without publication contract`);
  }
}
failIf(errors,`Fault taxonomy passed: ${rows.length} symptoms (${rows.filter(x=>x.status==='ready').length} ready, ${rows.filter(x=>x.status==='planned').length} planned/open)`)
