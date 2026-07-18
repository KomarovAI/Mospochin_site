import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
import { installLocalSiteRoutes, analyticsInitScript } from './helpers/site-route.mjs';
import { getChromiumLaunchOptions } from '../tools/visual-local-runtime.mjs';
const manifest=JSON.parse(fs.readFileSync('data/paid-landings.json','utf8'));

test('five paid landings expose quick contact on mobile first screen', {timeout:120000}, async () => {
 const browser=await chromium.launch(getChromiumLaunchOptions());
 try {
  const context=await browser.newContext({viewport:{width:360,height:800}});
  await context.addInitScript(analyticsInitScript); await installLocalSiteRoutes(context);
  for (const entry of manifest) {
    const page=await context.newPage();
    const errors=[]; page.on('pageerror',(e)=>errors.push(e.message));
    await page.goto(`http://127.0.0.1:4173${entry.landing_path}?mospochin_analytics_test=1`,{waitUntil:'domcontentloaded'});
    const result=await page.evaluate(()=>{
      const f=document.querySelector('form[data-paid-phone-only="true"]');
      const phone=document.querySelector('a[href^="tel:"]');
      const wa=document.querySelector('a[href*="wa.me"],a[href*="whatsapp.com"]');
      const r=f?.getBoundingClientRect();
      return {form:Boolean(f),phone:Boolean(phone),wa:Boolean(wa),top:r?.top,bottom:r?.bottom,width:document.documentElement.scrollWidth,viewport:innerWidth};
    });
    assert.equal(result.form,true,entry.landing_path);
    assert.equal(result.phone,true,entry.landing_path);
    assert.equal(result.wa,true,entry.landing_path);
    assert.ok(result.top < 800,`${entry.landing_path} form begins below first viewport: ${result.top}`);
    assert.ok(result.width <= result.viewport+1,`${entry.landing_path} horizontal overflow`);
    assert.deepEqual(errors,[],`${entry.landing_path}: ${errors.join('; ')}`);
    await page.close();
  }
 } finally { await browser.close(); }
});
