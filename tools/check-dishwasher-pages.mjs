#!/usr/bin/env node
import path from 'node:path';
import {manifest,evidenceMap,exists,read,failIf} from './dishwasher-fault-lib.mjs';

const rows=manifest(), ev=evidenceMap(), errors=[], pages=new Set(), titles=new Set(), h1s=new Set();
const published=rows.filter(x=>x.status==='published');
const publishedSet=new Set(published.map(x=>x.page));
const hrefs=(html)=>[...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1].split('#')[0].split('?')[0].replace(/^\//,''));
const visible=(html)=>html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const attr=(html,name)=>html.match(new RegExp(`<body\\b[^>]*\\s${name}=["']([^"']+)["']`,'i'))?.[1]||'';

if(rows.length!==40)errors.push(`expected 40 cluster pages, got ${rows.length}`);
if(published.length!==40)errors.push(`DW7 completed cluster must contain 40 published pages, got ${published.length}`);
const organicPublished=published.filter(x=>x.indexable); const organicSet=new Set(organicPublished.map(x=>x.page));

for(const p of rows){
 if(!p.page||pages.has(p.page))errors.push(`duplicate/missing page ${p.page}`); pages.add(p.page);
 if(p.page==='posudomoyki.html')errors.push('household posudomoyki.html must not be a cluster member');
 if(!p.title||titles.has(p.title.toLowerCase()))errors.push(`${p.page}: duplicate/missing title`); titles.add((p.title||'').toLowerCase());
 if(!p.h1||h1s.has(p.h1.toLowerCase()))errors.push(`${p.page}: duplicate/missing h1`); h1s.add((p.h1||'').toLowerCase());
 if(!['planned','published'].includes(p.status))errors.push(`${p.page}: invalid status`);
 if(p.pageType==='direct'&&p.indexable!==false)errors.push(`${p.page}: Direct must be noindex`);
 if(p.pageType!=='direct'&&p.indexable!==true)errors.push(`${p.page}: organic page must be indexable`);
 for(const id of p.evidenceIds||[])if(!ev.has(id))errors.push(`${p.page}: unknown evidence ${id}`);
 for(const k of ['pageIntent','equipment','service','commercialSegment'])if(!p.metrics?.[k])errors.push(`${p.page}: metrics.${k} required`);
 if(p.status==='published'){
   if(!exists(p.page)){errors.push(`${p.page}: published root missing`);continue;}
   const model=`src/pages/${path.basename(p.page,'.html')}/page.json`; if(!exists(model))errors.push(`${p.page}: source page model missing`);
   const html=read(p.page), text=visible(html);
   const h1=[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>visible(m[1]));
   if(h1.length!==1)errors.push(`${p.page}: expected one H1, got ${h1.length}`);
   else if(h1[0]!==p.h1)errors.push(`${p.page}: H1 mismatch (${h1[0]} != ${p.h1})`);
   if((html.match(/<title\b/gi)||[]).length!==1)errors.push(`${p.page}: one title required`);
   if(!html.includes(`rel="canonical" href="https://mospochin.ru/${p.page}"`)&&!html.includes(`href="https://mospochin.ru/${p.page}" rel="canonical"`))errors.push(`${p.page}: canonical missing/mismatch`);
   if(attr(html,'data-page-intent')!==p.metrics.pageIntent)errors.push(`${p.page}: body page intent mismatch`);
   if(attr(html,'data-equipment')!=='commercial_dishwasher')errors.push(`${p.page}: commercial_dishwasher body context required`);
   if(attr(html,'data-service')!==p.metrics.service)errors.push(`${p.page}: body service mismatch`);
   if(!/"@type"\s*:\s*"BreadcrumbList"/.test(html))errors.push(`${p.page}: BreadcrumbList schema missing`);
   const expectedSchema=p.pageType==='informational_article'?'Article':'Service';
   if(!new RegExp(`"@type"\\s*:\\s*"${expectedSchema}"`).test(html))errors.push(`${p.page}: ${expectedSchema} schema missing`);
   if(/"@type"\s*:\s*"FAQPage"/.test(html))errors.push(`${p.page}: retired FAQPage schema must be absent`);
   if((html.match(/<details\b/gi)||[]).length<3)errors.push(`${p.page}: at least 3 visible FAQ items required`);
   if(!/<form\b[^>]*telegram-form/.test(html))errors.push(`${p.page}: telegram lead form missing`);
   if(p.pageType==='brand_service'&&!/name=["']manufacturer["']/.test(html))errors.push(`${p.page}: brand manufacturer field missing`);
   for(const field of ['problem','phone','equipment_model','error_code','wash_stage','serial_number'])if(!new RegExp(`name=["']${field}["']`).test(html))errors.push(`${p.page}: form field ${field} missing`);
   for(const id of p.evidenceIds||[])if(!html.includes(`data-evidence-id="${id}"`))errors.push(`${p.page}: evidence ${id} not visible`);
   const links=[...new Set(hrefs(html).filter(x=>publishedSet.has(x)&&x!==p.page))];
   if(p.pageType==='direct'){
     const organicLinks=links.filter(x=>organicSet.has(x));
     if(organicLinks.length<4)errors.push(`${p.page}: Direct page needs at least 4 organic links, got ${organicLinks.length}`);
     if(text.split(/\s+/).length<180)errors.push(`${p.page}: thin Direct content (${text.split(/\s+/).length} words)`);
   }else{
     const organicLinks=links.filter(x=>organicSet.has(x));
     if(organicLinks.length<organicPublished.length-1)errors.push(`${p.page}: expected links to ${organicPublished.length-1} other organic pages, got ${organicLinks.length}`);
     if(text.split(/\s+/).length<450)errors.push(`${p.page}: thin visible content (${text.split(/\s+/).length} words)`);
   }
 } else if(exists(p.page)) errors.push(`${p.page}: planned root unexpectedly exists`);
}
const hubs=rows.filter(x=>x.pageType==='hub'); if(hubs.length!==1||hubs[0].page!=='posudomoechnye-mashiny.html'||hubs[0].status!=='published')errors.push('one published existing hub is required');
const direct=rows.filter(x=>x.pageType==='direct'); if(direct.length!==3)errors.push(`expected 3 Direct pages, got ${direct.length}`);
failIf(errors,`Dishwasher DW7 pages passed: ${rows.length} manifest pages, ${published.length} published pages`);
