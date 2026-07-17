#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=process.cwd();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/refrigeration-cluster-pages.json'),'utf8'));
const contextPath=path.join(root,'data/metrics-page-context.json');
const context=JSON.parse(fs.readFileSync(contextPath,'utf8'));
const pages=manifest.pages.filter((x)=>x.status==='published');
const brandModels=JSON.parse(fs.readFileSync(path.join(root,'data/refrigeration-brand-models.json'),'utf8'));
const brandById=new Map((brandModels.brands||[]).map((x)=>[x.brandId,x.brand]));
const esc=(v)=>String(v??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function version(html){return crypto.createHash('sha256').update(html.replace(/\sdata-page-version=["'][^"']*["']/gi,'')).digest('hex').slice(0,16)}
function upsert(tag,name,value){const re=new RegExp(`\\s${name}=["'][^"']*["']`,'i');const a=` ${name}="${esc(value)}"`;return re.test(tag)?tag.replace(re,a):tag.replace(/>$/,`${a}>`)}
for(const p of pages){
 const file=path.join(root,p.page); let html=fs.readFileSync(file,'utf8'); const v=version(html);
 html=html.replace(/<body\b[^>]*>/i,(tag)=>{
  for(const [name,value] of Object.entries({'data-page-slug':p.page.replace(/\.html$/,''),'data-page-intent':p.metrics.pageIntent,'data-equipment':p.metrics.equipment,'data-service':p.metrics.service,'data-commercial-segment':p.metrics.commercialSegment,'data-page-version':v,...(p.pageType==='brand_service'?{'data-brand':brandById.get(p.intent)||p.intent}:{})}))tag=upsert(tag,name,value);
  return tag;
 });
 fs.writeFileSync(file,html);
 context.pages[p.page]={...(context.pages[p.page]||{}),page_slug:p.page.replace(/\.html$/,''),page_intent:p.metrics.pageIntent,equipment:p.metrics.equipment,brand:p.pageType==='brand_service'?(brandById.get(p.intent)||p.intent):'',service:p.metrics.service,commercial_segment:p.metrics.commercialSegment,branch:'restaurant',page_version:v,source:'refrigeration_manifest'};
}
fs.writeFileSync(contextPath,JSON.stringify(context,null,2)+'\n');
console.log(`Refrigeration metrics markup applied: ${pages.length} pages`);
