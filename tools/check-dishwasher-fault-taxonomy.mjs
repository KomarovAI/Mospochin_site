#!/usr/bin/env node
import {taxonomy,evidenceMap,exists,failIf} from './dishwasher-fault-lib.mjs';
const rows=taxonomy(), ev=evidenceMap(), errors=[], ids=new Set(), slugs=new Set();
for(const x of rows){
 if(!x.symptomId||ids.has(x.symptomId))errors.push(`duplicate/missing symptomId ${x.symptomId}`); ids.add(x.symptomId);
 if(!x.slug||slugs.has(x.slug))errors.push(`duplicate/missing slug ${x.slug}`); slugs.add(x.slug);
 if(!['planned','published'].includes(x.status))errors.push(`${x.symptomId}: invalid status ${x.status}`);
 const expected=x.status==='published'?'published':'evidence_ready'; if(x.publicationState!==expected)errors.push(`${x.symptomId}: publicationState must be ${expected}`);
 if(!(x.equipmentFamilies||[]).length)errors.push(`${x.symptomId}: equipmentFamilies requires >=1`);
 for(const k of ['userSymptoms','safeChecks','stopUseConditions','probableNodes','probableNodeLabels','technicianChecks','relatedSymptoms','sourceEvidenceIds','prohibitedClaims'])if((x[k]||[]).length<2)errors.push(`${x.symptomId}: ${k} requires >=2`);
 if((x.safeChecks||[]).length<3)errors.push(`${x.symptomId}: safeChecks requires >=3`);
 if((x.probableNodes||[]).length!==(x.probableNodeLabels||[]).length)errors.push(`${x.symptomId}: node labels mismatch`);
 for(const id of x.sourceEvidenceIds||[])if(!ev.has(id))errors.push(`${x.symptomId}: unknown evidence ${id}`);
 if(x.status==='published'&&!exists(x.slug))errors.push(`${x.symptomId}: published root missing`);
 if(x.status==='planned'&&exists(x.slug))errors.push(`${x.symptomId}: planned root unexpectedly exists`);
}
const known=new Set(rows.map(x=>x.symptomId)); for(const x of rows)for(const rel of x.relatedSymptoms||[])if(!known.has(rel))errors.push(`${x.symptomId}: unknown related symptom ${rel}`);
if(rows.length!==20)errors.push(`expected 20 symptom records, got ${rows.length}`);
failIf(errors,`Dishwasher fault taxonomy passed: ${rows.filter(x=>x.status==='published').length} published, ${rows.filter(x=>x.status==='planned').length} planned`)
