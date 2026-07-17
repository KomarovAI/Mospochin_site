#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { getSystemChromiumLaunchOptions, LOCAL_VISUAL_ORIGIN } from './visual-local-runtime.mjs';

const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const OUT=path.join(ROOT,'.artifacts/screenshots/dishwasher/media-review');
const pages=['posudomoechnye-mashiny.html','diagnostika-promyshlennoy-posudomoechnoy-mashiny.html','posudomoechnaya-mashina-ne-greet-vodu.html','vodopodgotovka-dlya-posudomoechnoy-mashiny.html'];
const viewports={desktop:{width:1440,height:1080},mobile:{width:393,height:852,isMobile:true,hasTouch:true,deviceScaleFactor:2}};
fs.mkdirSync(OUT,{recursive:true});
function type(file){const e=path.extname(file).toLowerCase(); return ({'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'})[e]||'application/octet-stream';}
function resolve(url){const u=new URL(url); if(u.origin!==LOCAL_VISUAL_ORIGIN)return null; const rel=decodeURIComponent(u.pathname).replace(/^\/+/, '')||'index.html'; const p=path.resolve(ROOT,rel); return p.startsWith(ROOT+path.sep)||p===ROOT?p:null;}
const browser=await chromium.launch(getSystemChromiumLaunchOptions());
try{
 for(const [vpId,vp] of Object.entries(viewports)){
  const context=await browser.newContext({viewport:{width:vp.width,height:vp.height},deviceScaleFactor:vp.deviceScaleFactor||1,isMobile:vp.isMobile||false,hasTouch:vp.hasTouch||false});
  for(const pageName of pages){
   const page=await context.newPage();
   await page.route('**/*',async route=>{const p=resolve(route.request().url()); if(!p||!fs.existsSync(p)||!fs.statSync(p).isFile()) return route.abort('blockedbyclient'); let body=fs.readFileSync(p); await route.fulfill({status:200,contentType:type(p),body});});
   let html=fs.readFileSync(path.join(ROOT,pageName),'utf8');
   html=html.replace(/<head(?:\s[^>]*)?>/i,m=>`${m}<base href="${LOCAL_VISUAL_ORIGIN}/">`);
   await page.setContent(html,{waitUntil:'domcontentloaded'});
   await page.waitForTimeout(1200);
   await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'; document.querySelectorAll('.scroll-reveal,.fade-in-section').forEach(e=>{e.style.opacity='1';e.style.transform='none';e.classList.add('is-visible','revealed');});});
   const media=page.locator('.dishwasher-media-section').first();
   await media.scrollIntoViewIfNeeded();
   await page.evaluate(async()=>{
     const images=[...document.querySelectorAll('.dishwasher-media-section img')];
     for(const image of images){
       image.loading='eager';
       image.scrollIntoView({block:'center',inline:'nearest'});
       if(!image.complete || image.naturalWidth===0){
         await new Promise(resolve=>{
           const done=()=>resolve();
           image.addEventListener('load',done,{once:true});
           image.addEventListener('error',done,{once:true});
           setTimeout(done,5000);
         });
       }
       try{await image.decode();}catch{}
     }
   });
   await media.scrollIntoViewIfNeeded();
   await page.waitForTimeout(300);
   const slug=pageName.replace(/\.html$/,'');
   await media.screenshot({path:path.join(OUT,`${slug}.${vpId}.png`),animations:'disabled',timeout:30000});
   await page.close();
  }
  await context.close();
 }
} finally {await browser.close();}
console.log(`✅ Dishwasher media review: ${pages.length*Object.keys(viewports).length} screenshots`);
