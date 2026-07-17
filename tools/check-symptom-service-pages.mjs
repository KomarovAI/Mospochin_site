#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
import { taxonomy,pageRegistry,evidenceMap,failIf } from './sous-vide-fault-lib.mjs';
const root=process.cwd(), tax=new Map(taxonomy().map(x=>[x.symptomId,x])), ev=evidenceMap(), reg=pageRegistry(), errors=[];
const ready=reg.pages.filter(x=>x.status==='published');
for(const p of ready){const t=tax.get(p.symptomId);if(!t){errors.push(`${p.page}: taxonomy missing`);continue}const slug=p.page.replace(/\.html$/,'');const mp=path.join(root,'src/pages',slug,'page.json');if(!fs.existsSync(mp)){errors.push(`${p.page}: source model missing`);continue}const model=JSON.parse(fs.readFileSync(mp,'utf8'));const comps=new Set((model.sections||[]).map(s=>s.component));for(const c of reg.requiredBlocks||[])if(!comps.has(c))errors.push(`${p.page}: component ${c} missing`);const html=fs.readFileSync(path.join(root,p.page),'utf8');
if(t.wave==='P1'){
  const labels=t.probableNodeLabels||[];
  if(labels.length!==(t.probableNodes||[]).length) errors.push(`${p.page}: probableNodeLabels must match probableNodes`);
  for(let i=0;i<labels.length;i+=1){
    const label=String(labels[i]||'').trim();
    if(!/[А-Яа-яЁё]/.test(label)) errors.push(`${p.page}: probable node label ${i+1} must be Russian`);
    if(label && !html.includes(label)) errors.push(`${p.page}: probable node label is not visible: ${label}`);
    const internal=String(t.probableNodes[i]||'').replace(/_and_/g,' и ').replace(/_or_/g,' или ').replace(/_/g,' ');
    if(internal && html.includes(internal)) errors.push(`${p.page}: internal probable-node id leaked into visible HTML: ${internal}`);
  }
}if((html.match(/<h1\b/gi)||[]).length!==1)errors.push(`${p.page}: exactly one H1 required`);if(!/data-page-intent="symptom_service"/.test(html))errors.push(`${p.page}: data-page-intent missing`);if(!/"@type"\s*:\s*"Service"/.test(html))errors.push(`${p.page}: Service schema missing`);if(!/"@type"\s*:\s*"WebPage"/.test(html))errors.push(`${p.page}: WebPage schema missing`);if(!/data-generated="faq-registry"/.test(html))errors.push(`${p.page}: FAQ registry schema missing`);for(const f of ['equipment_model','error_code','problem','phone'])if(!new RegExp(`name=["']${f}["']`).test(html))errors.push(`${p.page}: field ${f} missing`);if((html.match(/data-cta-group="internal_link"/g)||[]).length<5)errors.push(`${p.page}: <5 tracked internal links`);for(const id of t.sourceEvidenceIds||[]){if(!ev.has(id))errors.push(`${p.page}: unknown evidence ${id}`);if(!html.includes(`data-evidence-id="${id}"`))errors.push(`${p.page}: evidence ${id} not visible`)}}
failIf(errors,`Symptom-service pages passed: ${ready.length} published pages`)
