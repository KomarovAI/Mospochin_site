#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const load=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const cluster=load('data/refrigeration-cluster-pages.json');
const direct=load('data/direct-landing-pages.json');
const metadata=load('data/page-metadata.json');
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const rows=cluster.pages.filter((x)=>x.pageType==='direct');
const cfg=new Map(direct.pages.map((x)=>[x.file,x]));
const directSet=new Set(rows.map((x)=>x.page));
const errors=[];const titles=new Set();const h1s=new Set();
const clean=(v)=>String(v||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const esc=(v)=>v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for(const row of rows){
  const page=row.page;const file=path.join(root,page);
  if(row.status!=='published'||row.indexable!==false) errors.push(`${page}: must be published noindex Direct`);
  if(!fs.existsSync(file)){errors.push(`${page}: HTML missing`);continue;}
  const html=fs.readFileSync(file,'utf8');const spec=cfg.get(page);const meta=metadata.pages?.[page];
  if(!spec) errors.push(`${page}: direct manifest entry missing`);
  if(!/<meta\b(?=[^>]*name=["']robots["'])(?=[^>]*content=["'][^"']*noindex[^"']*follow[^"']*["'])[^>]*>/i.test(html)) errors.push(`${page}: noindex,follow missing`);
  if(sitemap.includes(`/${page}`)) errors.push(`${page}: present in sitemap`);
  if(!meta||meta.robots!=='noindex,follow') errors.push(`${page}: metadata robots invalid`);
  if(!html.includes(`rel="canonical" href="https://mospochin.ru/${page}"`)&&!html.includes(`href="https://mospochin.ru/${page}" rel="canonical"`)) errors.push(`${page}: self canonical missing`);
  for(const [attr,value] of Object.entries({'data-page-intent':row.metrics.pageIntent,'data-equipment':row.metrics.equipment,'data-service':'repair','data-commercial-segment':'b2b_kitchen'})) if(!html.includes(`${attr}="${value}"`)) errors.push(`${page}: ${attr}=${value} missing`);
  if(!html.includes('data-direct-ad-ids=')) errors.push(`${page}: Direct attribution missing`);
  for(const field of ['campaign_id','ad_group_id','direct_ad_ids','equipment_model','serial_number','controller','error_code','cycle_stage','cycle_conditions','details']) if(!new RegExp(`name=["']${field}["']`,'i').test(html)) errors.push(`${page}: form field ${field} missing`);
  if(!/href=["']tel:\+79990057172["']/i.test(html)) errors.push(`${page}: phone CTA missing`);
  if(!/href=["']https:\/\/wa\.me\/79990057172/i.test(html)) errors.push(`${page}: WhatsApp CTA missing`);
  if(!/<form\b[^>]*telegram-form/i.test(html)) errors.push(`${page}: lead form missing`);
  for(const type of ['Service','FAQPage','BreadcrumbList']) if(!html.includes(`"@type": "${type}"`)) errors.push(`${page}: ${type} schema missing`);
  const title=clean(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);const h1=clean(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
  if(title!==row.title||titles.has(title)) errors.push(`${page}: title mismatch/duplicate`); else titles.add(title);
  if(h1!==row.h1||h1s.has(h1)) errors.push(`${page}: H1 mismatch/duplicate (${h1} != ${row.h1})`); else h1s.add(h1);
  if(!spec?.campaignId||!spec?.adGroupId||!(spec?.directAdIds?.length)) errors.push(`${page}: campaign/ad group/ad IDs incomplete`);
  if((spec?.relatedLinks?.length||0)<4) errors.push(`${page}: fewer than 4 organic related links`);
  for(const link of spec?.relatedLinks||[]){const target=cluster.pages.find((x)=>x.page===link.href);if(!target||!target.indexable||target.status!=='published') errors.push(`${page}: related link is not published organic (${link.href})`);}
  for(const other of directSet) if(other!==page&&new RegExp(`href=["']/?${esc(other)}["']`).test(html)) errors.push(`${page}: Direct-to-Direct link ${other}`);
  const sourceModel=path.join(root,'src/pages',page.replace(/\.html$/,''),'page.json');if(!fs.existsSync(sourceModel)) errors.push(`${page}: source model missing`);
}
for(const source of cluster.pages.filter((x)=>x.status==='published'&&x.indexable)){
  const html=fs.readFileSync(path.join(root,source.page),'utf8');
  for(const target of directSet) if(new RegExp(`href=["']/?${esc(target)}["']`).test(html)) errors.push(`${source.page}: organic link to Direct ${target}`);
}
if(errors.length){console.error(`❌ Refrigeration Direct pages failed (${errors.length})`);for(const e of errors)console.error(`- ${e}`);process.exit(1);}
console.log(`✅ Refrigeration Direct pages passed: ${rows.length} noindex landings, no organic inbound links`);
