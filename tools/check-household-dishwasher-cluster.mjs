#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
const ROOT=process.cwd(); const read=(p)=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const manifest=read('data/household-dishwasher-cluster-pages.json'); const meta=read('data/page-metadata.json').pages;
const graph=read('data/household-dishwasher-link-graph.json'); const evidence=read('data/household-dishwasher-fault-evidence.json');
const boundaries=read('data/household-dishwasher-intent-boundaries.json'); let errors=[];
if(manifest.release!=='DW2'||manifest.pageCount!==29||manifest.pages.length!==29) errors.push(`DW2 must contain 29 pages, got ${manifest.pages.length}`);
const industrial=/куполь|конвейер|кассет|winterhalter|hobart|meiko|electrolux professional/i;
const falseClaims=[/не сливает[^.]{0,80}(точно|обязательно)[^.]{0,50}насос/i,/плохо моет[^.]{0,80}(точно|обязательно)[^.]{0,50}циркуляц/i,/не сушит[^.]{0,80}(точно|обязательно)[^.]{0,50}(тэн|нагрев)/i,/таблетк[^.]{0,80}(точно|обязательно)[^.]{0,50}дозатор/i,/бел(ый|ого) нал[её]т[^.]{0,80}(точно|обязательно)/i,/шумит[^.]{0,80}(точно|обязательно)[^.]{0,50}насос/i,/ошибк[^.]{0,80}(точно|обязательно)[^.]{0,50}плат/i];
for(const item of manifest.pages){const p=item.page, f=path.join(ROOT,p); if(!fs.existsSync(f)){errors.push(`${p}: missing`);continue;} const html=fs.readFileSync(f,'utf8'); if(meta[p]?.branch!=='household')errors.push(`${p}: metadata branch is not household`); if(industrial.test(html))errors.push(`${p}: industrial intent leaked`); for(const re of falseClaims)if(re.test(html))errors.push(`${p}: prohibited deterministic diagnosis`); if(!html.includes('data-equipment="posudomoechnaya_mashina"'))errors.push(`${p}: metrics equipment missing`); if(!html.includes('data-sync-zone="faq-items"'))errors.push(`${p}: FAQ zone missing`);}
if(graph.links.length<100)errors.push(`link graph too small: ${graph.links.length}`); if(evidence.sources.length<24)errors.push(`evidence registry too small: ${evidence.sources.length}`);
const d=boundaries.directDuplicate; if(meta[d.page]?.robots!=='noindex,follow')errors.push('Direct duplicate must be noindex,follow'); if(!String(meta[d.page]?.canonical||'').endsWith(d.canonical))errors.push('Direct duplicate canonical mismatch');
for(const p of ['posudomoechnaya-mashina-postoyanno-slivaet-vodu.html','srabotal-aquastop-posudomoechnoy-mashiny.html']){const html=fs.readFileSync(path.join(ROOT,p),'utf8'); if(/обойти\s+(AquaStop|защит)/i.test(html))errors.push(`${p}: protection bypass language`);}
if(errors.length){console.error('❌ Household dishwasher cluster errors'); errors.forEach(x=>console.error('- '+x)); process.exit(1);} console.log(`✅ Household dishwasher DW2: ${manifest.pages.length} pages, ${graph.links.length} links, ${evidence.sources.length} sources`);
