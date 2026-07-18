#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const load=p=>JSON.parse(fs.readFileSync(path.join(root,'data',p),'utf8'));
const manifest=load('refrigeration-cluster-pages.json');
const brands=load('refrigeration-brand-models.json').brands||[];
const specs=load('refrigeration-rf8-page-specs.json').pages||{};
const evidence=new Set((load('refrigeration-fault-evidence.json').records||[]).map(x=>x.id));
const entries=new Map(manifest.pages.map(x=>[x.page,x]));
const errors=[];
const clean=s=>(s||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
for(const brand of brands){
 const entry=entries.get(brand.page);if(!entry){errors.push(`${brand.page}: manifest entry missing`);continue}
 if(entry.status!=='published')errors.push(`${brand.page}: must be published in RF8`);
 if(entry.pageType!=='brand_service')errors.push(`${brand.page}: pageType must be brand_service`);
 if(entry.indexable!==true)errors.push(`${brand.page}: brand page must be indexable`);
 const file=path.join(root,brand.page);if(!fs.existsSync(file)){errors.push(`${brand.page}: root HTML missing`);continue}
 const html=fs.readFileSync(file,'utf8');
 const title=clean(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
 const h1=clean(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
 if(title!==entry.title)errors.push(`${brand.page}: title mismatch`);
 if(h1!==entry.h1)errors.push(`${brand.page}: H1 mismatch`);
 if(!html.includes(`<link rel="canonical" href="https://mospochin.ru/${brand.page}">`))errors.push(`${brand.page}: self canonical missing`);
 if(/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html))errors.push(`${brand.page}: unexpected noindex`);
 for(const token of ['branch-restaurant','page-refrigeration-brand','data-brand-disclaimer="independent-service"','name="equipment_model"','name="serial_number"','name="controller_model"','name="error_code"','name="manufacturer"','data-contact-form="primary"','telegram-form.js','analytics.js','"@type": "Service"','"@type": "BreadcrumbList"'])if(!html.includes(token))errors.push(`${brand.page}: missing ${token}`);
 if(/"@type"\s*:\s*"FAQPage"/.test(html))errors.push(`${brand.page}: retired FAQPage schema must be absent`);
 if((html.match(/<details\b/gi)||[]).length<2)errors.push(`${brand.page}: at least two visible FAQ items required`);
 if(!html.includes(`не является авторизованным сервисным центром ${brand.brand}`))errors.push(`${brand.page}: independent-service disclaimer missing`);
 const spec=specs[brand.page];if(!spec)errors.push(`${brand.page}: RF8 spec missing`);for(const series of spec?.series||[]){const label=series[0];if(!html.toLowerCase().includes(label.toLowerCase()))errors.push(`${brand.page}: rendered series missing: ${label}`);}
 for(const id of entry.evidenceIds||[]){if(!evidence.has(id))errors.push(`${brand.page}: unknown evidence ${id}`);if(!html.includes(`data-evidence-id="${id}"`))errors.push(`${brand.page}: evidence not rendered ${id}`)}
 const model=`src/pages/${path.basename(brand.page,'.html')}/page.json`;if(!fs.existsSync(path.join(root,model)))errors.push(`${brand.page}: source model missing`);
}
if(brands.length!==8)errors.push(`expected 8 brand pages, got ${brands.length}`);
if(errors.length){console.error(errors.map(x=>`❌ ${x}`).join('\n'));process.exit(1)}
console.log(`Refrigeration RF8 brand pages passed: ${brands.length} published pages.`);
