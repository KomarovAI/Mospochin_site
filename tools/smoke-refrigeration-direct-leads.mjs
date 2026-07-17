#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { getSystemChromiumLaunchOptions, LOCAL_VISUAL_ORIGIN } from './visual-local-runtime.mjs';

const ROOT=process.cwd();
const REPORT_JSON=path.join(ROOT,'reports','refrigeration-direct-lead-smoke.json');
const REPORT_MD=path.join(ROOT,'reports','refrigeration-direct-lead-smoke.md');
const specs=JSON.parse(fs.readFileSync(path.join(ROOT,'data/refrigeration-rf9-page-specs.json'),'utf8')).pages;
const files=Object.keys(specs);
const results=[];
const staticIssues=[];
const assert=(ok,name,detail='')=>results.push({name,passed:Boolean(ok),detail});

function contentType(file){
 const ext=path.extname(file).toLowerCase();
 return ({'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'})[ext]||'application/octet-stream';
}
function injectHarness(html,pageFile){
 const bootstrap=`<script>(()=>{const store=new Map();const storage={getItem:k=>store.has(String(k))?store.get(String(k)):null,setItem:(k,v)=>store.set(String(k),String(v)),removeItem:k=>store.delete(String(k)),clear:()=>store.clear(),key:i=>Array.from(store.keys())[i]??null,get length(){return store.size}};try{Object.defineProperty(window,'localStorage',{configurable:true,value:storage})}catch{}window.__MOSPOCHIN_RUNTIME__={telegramFormEndpoint:'/api/send-telegram',pageFile:${JSON.stringify(pageFile)}};window.mospochinGetAttribution=()=>({last_touch:{utm_source:'yandex',utm_medium:'cpc',utm_campaign:'rf9_smoke',utm_content:'direct_test',utm_term:'service repair',yclid:'yclid-rf9',referrer_host:'yandex.ru',metrika_client_id:'1234567890'}});window.mospochinTrackGoal=()=>{};window.mospochinTrackSiteEvent=()=>{};})();<\/script>`;
 return html.replace(/<head([^>]*)>/i,`<head$1><base href="${LOCAL_VISUAL_ORIGIN}/">${bootstrap}`);
}
function staticCheck(){
 const fields=['phone','equipment_model','serial_number','controller','error_code','cycle_stage','cycle_conditions','details','campaign_id','ad_group_id','direct_ad_ids'];
 for(const file of files){
  const html=fs.readFileSync(path.join(ROOT,file),'utf8');
  if(!/<meta\s+name=["']robots["']\s+content=["']noindex,follow["']/i.test(html)) staticIssues.push(`${file}: noindex,follow missing`);
  if(!/class=["'][^"']*telegram-form/i.test(html)) staticIssues.push(`${file}: telegram form missing`);
  if(!/src=["']telegram-form\.js["']/i.test(html)) staticIssues.push(`${file}: telegram-form.js missing`);
  if(!/href=["']tel:/i.test(html)) staticIssues.push(`${file}: tel fallback missing`);
  if(!/href=["'][^"']*(?:wa\.me|whatsapp)/i.test(html)) staticIssues.push(`${file}: WhatsApp fallback missing`);
  for(const field of fields) if(!new RegExp(`name=["']${field}["']`,'i').test(html)) staticIssues.push(`${file}: field ${field} missing`);
 }
}
async function harness(browser,file,apiMode='success'){
 const page=await browser.newPage({viewport:{width:1280,height:900}}); page.setDefaultTimeout(12000); const requests=[];
 await page.route('**/*',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.hostname!=='mospochin.local'){await route.fulfill({status:204,body:''});return;}
  if(url.pathname==='/api/send-telegram'){
   let body={};try{body=JSON.parse(req.postData()||'{}')}catch{} requests.push(body);
   await route.fulfill({status:apiMode==='error'?500:200,contentType:'application/json',body:apiMode==='error'?'{"ok":false}':'{"ok":true,"mocked":true}'});return;
  }
  const local=path.resolve(ROOT,`.${url.pathname}`),rel=path.relative(ROOT,local);
  if(rel.startsWith('..')||path.isAbsolute(rel)||!fs.existsSync(local)||!fs.statSync(local).isFile()){await route.fulfill({status:404,body:'not found'});return;}
  await route.fulfill({status:200,contentType:contentType(local),body:fs.readFileSync(local)});
 });
 await page.setContent(injectHarness(fs.readFileSync(path.join(ROOT,file),'utf8'),file),{waitUntil:'domcontentloaded'});
 await page.waitForSelector('.telegram-form[data-telegram-enhanced="1"]');
 await page.evaluate(()=>{window.mospochinGetAttribution=()=>({last_touch:{utm_source:'yandex',utm_medium:'cpc',utm_campaign:'rf9_smoke',utm_content:'direct_test',utm_term:'service repair',yclid:'yclid-rf9',referrer_host:'yandex.ru',metrika_client_id:'1234567890'}});window.mospochinTrackGoal=()=>{};window.mospochinTrackSiteEvent=()=>{}});
 return {page,requests};
}
async function fill(page,{phone='+7 999 123-45-67',consent=true}={}){
 const form=page.locator('.telegram-form').first();
 await form.evaluate(node=>{node.dataset.startedAt=String(Date.now()-4000)});
 const values={name:'RF9 smoke',phone,equipment_model:'Тестовая модель',serial_number:'SN-RF9',controller:'Controller RF9',error_code:'E-test',cycle_stage:'Запуск',cycle_conditions:'+8 °C, 20 минут',details:'Проверка формы RF9'};
 for(const [name,value] of Object.entries(values)){const input=form.locator(`[name="${name}"]`);if(await input.count())await input.fill(value)}
 const checkbox=form.locator('[name="consent"]');if(consent&&await checkbox.count())await checkbox.check();
 return form;
}

staticCheck();
const browser=await chromium.launch(getSystemChromiumLaunchOptions());
try{
 for(const file of files){
  console.log(`RF9 lead smoke: success ${file}`);
  const {page,requests}=await harness(browser,file);
  try{
   const form=await fill(page); await form.locator('button[type="submit"]').click();
   await page.waitForFunction(()=>document.querySelector('[data-form-status]')?.textContent?.includes('Заявка принята'));
   const payload=requests[0]||{},spec=specs[file];
   assert(requests.length===1,`${file}: one request`,`requests=${requests.length}`);
   assert(payload.page===file,`${file}: page payload`,payload.page||'');
   assert(payload.attribution?.last_touch?.utm_source==='yandex',`${file}: yandex attribution`);
   assert(payload.extraFields?.campaign_id===spec.campaignId,`${file}: campaign id`,String(payload.extraFields?.campaign_id||''));
   assert(payload.extraFields?.ad_group_id===spec.adGroupId,`${file}: ad group id`,String(payload.extraFields?.ad_group_id||''));
   assert(String(payload.extraFields?.direct_ad_ids||'')===spec.directAdIds.join(','),`${file}: Direct IDs`,String(payload.extraFields?.direct_ad_ids||''));
   for(const field of ['equipment_model','serial_number','controller','error_code','cycle_stage','cycle_conditions','details']) assert(Boolean(payload.extraFields?.[field]),`${file}: payload ${field}`);
   assert(Boolean(payload.idempotencyKey),`${file}: idempotency key`);
  }finally{await page.close()}
 }
 {
  const file=files[0],{page,requests}=await harness(browser,file);
  try{const form=await fill(page,{phone:'123'});await form.locator('button[type="submit"]').click();await page.waitForSelector('[data-form-status]');assert((await form.locator('[data-form-status]').textContent()).includes('корректный номер'),'invalid phone message');assert(requests.length===0,'invalid phone no request')}finally{await page.close()}
 }
 {
  const file=files[1],{page,requests}=await harness(browser,file);
  try{const form=await fill(page,{consent:false});await form.locator('button[type="submit"]').click();await page.waitForSelector('[data-form-status]');assert((await form.locator('[data-form-status]').textContent()).includes('Подтвердите согласие'),'missing consent message');assert(requests.length===0,'missing consent no request')}finally{await page.close()}
 }
 {
  const file=files[2],{page,requests}=await harness(browser,file,'error');
  try{const form=await fill(page);await form.locator('button[type="submit"]').click();await page.waitForFunction(()=>document.querySelector('[data-form-status]')?.textContent?.includes('Не удалось отправить'));const text=await form.locator('[data-form-status]').textContent();assert(requests.length===1,'network fallback one request');assert(text.includes('+79990057172')&&text.includes('wa.me'),'network fallback contacts',text)}finally{await page.close()}
 }
}finally{await browser.close()}
const failed=results.filter(x=>!x.passed);
const report={schemaVersion:1,scope:'refrigeration-rf9-direct-pages',checkedAt:new Date().toISOString(),summary:{pages:files.length,staticIssues:staticIssues.length,browserChecks:results.length,browserPassed:results.length-failed.length,issues:staticIssues.length+failed.length},staticIssues,browserChecks:results};
fs.mkdirSync(path.dirname(REPORT_JSON),{recursive:true});fs.writeFileSync(REPORT_JSON,JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(REPORT_MD,`# Refrigeration RF9 Direct lead smoke\n\n- Pages: **${files.length}**\n- Browser checks: **${report.summary.browserPassed}/${report.summary.browserChecks}**\n- Issues: **${report.summary.issues}**\n\n## Static\n${staticIssues.length?staticIssues.map(x=>`- ❌ ${x}`).join('\n'):'- ✅ Static contracts passed.'}\n\n## Browser\n${results.map(x=>`- ${x.passed?'✅':'❌'} ${x.name}${x.detail?` — ${x.detail}`:''}`).join('\n')}\n`);
console.log(`RF9 Direct lead smoke: ${report.summary.browserPassed}/${report.summary.browserChecks} browser checks, ${report.summary.issues} issues`);
if(report.summary.issues)process.exitCode=1;
