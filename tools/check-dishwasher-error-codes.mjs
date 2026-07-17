#!/usr/bin/env node
import {load,evidenceMap,failIf} from './dishwasher-fault-lib.mjs';
const data=load('dishwasher-error-codes.json'), ev=evidenceMap(), errors=[], keys=new Set();
if(data.policy?.universalCodesForbidden!==true)errors.push('universalCodesForbidden must be true');
for(const x of data.codes||[]){
 for(const k of ['manufacturer','modelScope','code','officialMeaning','sourceEvidenceId'])if(!x[k])errors.push(`error code missing ${k}`);
 const key=`${x.manufacturer}|${x.modelScope}|${x.code}`; if(keys.has(key))errors.push(`duplicate ${key}`); keys.add(key);
 if(x.modelScope==='universal')errors.push(`${key}: universal scope forbidden`);
 if(x.sourceEvidenceId&&!ev.has(x.sourceEvidenceId))errors.push(`${key}: unknown evidence`);
 if((x.safeChecks||[]).length<2||(x.serviceOnlyChecks||[]).length<2)errors.push(`${key}: safe/service checks required`);
}
for(const x of data.excludedAmbiguities||[]){if(!x.reason||!x.sourceEvidenceId)errors.push('excluded ambiguity requires reason and evidence');if(!ev.has(x.sourceEvidenceId))errors.push(`${x.code}: ambiguity references unknown evidence`)}
if(!(data.excludedAmbiguities||[]).some(x=>x.code==='Er-002'))errors.push('known ambiguous Er-002 row must remain explicitly excluded');
failIf(errors,`Dishwasher error-code registry passed: ${(data.codes||[]).length} model-scoped codes, ${(data.excludedAmbiguities||[]).length} ambiguity excluded`)
