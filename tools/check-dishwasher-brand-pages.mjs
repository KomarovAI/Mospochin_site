#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const load=(p)=>JSON.parse(fs.readFileSync(path.join(root,'data',p),'utf8'));
const manifest=load('dishwasher-cluster-pages.json');
const registry=load('dishwasher-brand-models.json');
const byId=new Map((registry.brands||[]).map((x)=>[x.brandId,x]));
const pages=manifest.pages.filter((x)=>x.pageType==='brand_service');
const errors=[];
if(pages.length!==6) errors.push(`expected 6 brand pages, got ${pages.length}`);
for(const p of pages){
  if(p.status!=='published') { errors.push(`${p.page}: must be published in DW6`); continue; }
  const brand=byId.get(p.intent);
  if(!brand){ errors.push(`${p.page}: brand registry entry missing`); continue; }
  const file=path.join(root,p.page);
  if(!fs.existsSync(file)){ errors.push(`${p.page}: root HTML missing`); continue; }
  const html=fs.readFileSync(file,'utf8');
  const text=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
  if(!html.includes(`data-brand="${brand.brand}"`)) errors.push(`${p.page}: data-brand mismatch`);
  if(!new RegExp(`name=["']manufacturer["'][^>]*value=["']${brand.brand.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`,'i').test(html)) errors.push(`${p.page}: hidden manufacturer mismatch`);
  if(!/независим/i.test(text)) errors.push(`${p.page}: independent-service disclaimer missing`);
  if(/официальный сервис|авторизованный сервисный центр/i.test(text) && !/не (?:является|заявляет|использует)[^.]{0,100}(?:официальн|авторизован)/i.test(text)) errors.push(`${p.page}: possible official-service claim`);
  if(!/name=["']serial_number["']/.test(html)) errors.push(`${p.page}: serial number field missing`);
  const series=(brand.series||[]).map((x)=>x.name);
  if(!series.some((name)=>text.includes(name))) errors.push(`${p.page}: no registered series visible`);
  for(const id of p.evidenceIds||[]) if(!html.includes(`data-evidence-id="${id}"`)) errors.push(`${p.page}: evidence ${id} missing`);
}
if(errors.length){ console.error(errors.map((x)=>`❌ ${x}`).join('\n')); process.exit(1); }
console.log(`✅ Dishwasher brand pages passed: ${pages.length} independent service pages`);
