#!/usr/bin/env node
import fs from 'node:fs';
const root=process.cwd();
const cluster=JSON.parse(fs.readFileSync('data/kutter-cluster-pages.json','utf8'));
const direct=JSON.parse(fs.readFileSync('data/direct-landing-pages.json','utf8'));
const metadata=JSON.parse(fs.readFileSync('data/page-metadata.json','utf8'));
const sitemap=fs.readFileSync('sitemap.xml','utf8');
const targets=(cluster.families?.direct||[]);
const manifest=new Map((direct.pages||[]).map(x=>[x.file,x]));
const errors=[];const titles=new Set(),h1s=new Set();
for(const page of targets){
 const c=(cluster.pages||[]).find(x=>x.page===page); if(!c||c.status!=='published'||c.indexable!==false)errors.push(`${page}: cluster status/indexable invalid`);
 if(!fs.existsSync(page)){errors.push(`${page}: HTML missing`);continue}
 const html=fs.readFileSync(page,'utf8'), cfg=manifest.get(page), meta=metadata.pages?.[page];
 if(!cfg)errors.push(`${page}: direct manifest entry missing`);
 if(!/<meta\b(?=[^>]*name=["']robots["'])(?=[^>]*content=["'][^"']*noindex[^"']*follow[^"']*["'])[^>]*>/i.test(html))errors.push(`${page}: noindex,follow missing`);
 if(sitemap.includes(`/${page}`))errors.push(`${page}: present in sitemap`);
 if(!meta||meta.robots!=='noindex,follow')errors.push(`${page}: metadata robots invalid`);
 if(!html.includes(`data-equipment="professional_cutter"`))errors.push(`${page}: equipment context missing`);
 if(!html.includes('data-page-intent="promo"'))errors.push(`${page}: promo intent missing`);
 if(!html.includes('data-direct-ad-ids='))errors.push(`${page}: direct attribution missing`);
 for(const field of ['campaign_id','ad_group_id','direct_ad_ids'])if(!new RegExp(`name=["']${field}["']`,'i').test(html))errors.push(`${page}: hidden ${field} missing`);
 if(!/href=["']tel:\+79990057172["']/i.test(html))errors.push(`${page}: phone CTA missing`);
 if(!/href=["']https:\/\/wa\.me\/79990057172/i.test(html))errors.push(`${page}: WhatsApp CTA missing`);
 if(!/<form\b[^>]*telegram-form/i.test(html))errors.push(`${page}: lead form missing`);
 for(const type of ['Service','BreadcrumbList'])if(!html.includes(`"@type": "${type}"`))errors.push(`${page}: ${type} schema missing`);
 if(/"@type"\s*:\s*"FAQPage"/.test(html))errors.push(`${page}: retired FAQPage schema must be absent`);
 if((html.match(/<details\b/gi)||[]).length<2)errors.push(`${page}: at least two visible FAQ items required`);
 const title=(html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]?.trim(); const h1=(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]?.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
 if(!title||titles.has(title))errors.push(`${page}: title missing/duplicate`); else titles.add(title);
 if(!h1||h1s.has(h1))errors.push(`${page}: h1 missing/duplicate`); else h1s.add(h1);
 if(!cfg?.campaignId||!cfg?.adGroupId||!(cfg?.directAdIds?.length))errors.push(`${page}: campaign/ad group/ad IDs incomplete`);
 if((cfg?.relatedLinks?.length||0)<4)errors.push(`${page}: fewer than 4 organic related links`);
 for(const other of targets)if(other!==page&&html.includes(`href="${other}"`))errors.push(`${page}: direct-to-direct link ${other}`);
}
for(const source of (cluster.pages||[]).filter(x=>x.status==='published'&&x.indexable)){
 const html=fs.readFileSync(source.page,'utf8');for(const target of targets)if(html.includes(`href="${target}"`)||html.includes(`href='${target}'`))errors.push(`${source.page}: organic link to Direct ${target}`)
}
if(errors.length){console.error(`❌ Kutter Direct pages failed (${errors.length})`);for(const e of errors)console.error(`- ${e}`);process.exit(1)}
console.log(`✅ Kutter Direct pages passed: ${targets.length} noindex landings, no organic inbound links`);
