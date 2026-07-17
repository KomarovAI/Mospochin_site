#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const root=process.cwd();
const out=path.join(root,'.artifacts/screenshots/refrigeration/rf9-review-fast');
fs.mkdirSync(out,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/refrigeration-rf9-screenshot-audit.json'),'utf8'));
const pages=manifest.pages.map(item=>item.page).filter(file => !process.env.RF9_PAGE || file === process.env.RF9_PAGE);
const mime=(file)=>file.endsWith('.woff2')?'font/woff2':file.endsWith('.woff')?'font/woff':file.endsWith('.ttf')?'font/ttf':file.endsWith('.svg')?'image/svg+xml':'application/octet-stream';
function embeddedCss(file){
 const abs=path.join(root,file),dir=path.dirname(abs); let css=fs.readFileSync(abs,'utf8');
 return css.replace(/url\((['"]?)([^)'"?#]+)(?:\?[^)'"#]*)?(?:#[^)'" ]*)?\1\)/g,(all,q,rel)=>{
   if (/^(data:|https?:|\/)/i.test(rel)) return all;
   const asset=path.resolve(dir,rel); if(!fs.existsSync(asset)) return all;
   return `url("data:${mime(asset)};base64,${fs.readFileSync(asset).toString('base64')}")`;
 });
}
const css=embeddedCss('assets/fonts/manrope.css')+'\n'+embeddedCss('assets/fonts/remixicon.css')+'\n'+fs.readFileSync(path.join(root,'styles-combined.css'),'utf8')+'\n.mobile-contact-bar,.fixed.bottom-0{display:none!important}';
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage','--disable-background-networking']});
for(const file of pages){
 let html=fs.readFileSync(path.join(root,file),'utf8');
 html=html.replace(/<link\b[^>]*rel=["'](?:preload|stylesheet)["'][^>]*>/gi,'').replace(/<script\b[^>]*src=["'][^"']+["'][^>]*><\/script>/gi,'');
 html=html.replace('</head>',`<style>${css}</style></head>`);
 for(const [id,w,h,mobile] of [['desktop',1440,1080,false],['mobile',393,852,true]].filter(([id]) => !process.env.RF9_DEVICE || id === process.env.RF9_DEVICE)){
  const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:mobile?2:1,isMobile:mobile,hasTouch:mobile});
  const page=await ctx.newPage(); await page.setContent(html,{waitUntil:'domcontentloaded',timeout:60000}); await page.evaluate(()=>document.fonts?.ready);
  const slug=file.replace('.html','');
  const firstPath=path.join(out,`${slug}.${id}.first.png`);
  const fullPath=path.join(out,`${slug}.${id}.full.png`);
  if (!fs.existsSync(firstPath)) await page.screenshot({path:firstPath,fullPage:false,timeout:120000});
  if (!fs.existsSync(fullPath)) await page.screenshot({path:fullPath,fullPage:true,timeout:120000});
  await ctx.close(); console.log(file,id,'first+full');
 }
}
await browser.close();
