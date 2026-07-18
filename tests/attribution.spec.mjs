import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { installLocalSiteRoutes, analyticsInitScript } from './helpers/site-route.mjs';
import { getChromiumLaunchOptions } from '../tools/visual-local-runtime.mjs';

test('attribution v3 and cross-tab identity', {timeout:60000}, async () => {
  const browser=await chromium.launch(getChromiumLaunchOptions());
  try {
    const context=await browser.newContext();
    await context.addInitScript(analyticsInitScript);
    await installLocalSiteRoutes(context);
    const p1=await context.newPage();
    await p1.goto('http://127.0.0.1:4173/parokonvektomat-ne-greet.html?utm_source=yandex&utm_medium=cpc&utm_campaign=first&yclid=YCLID_FIRST&mospochin_analytics_test=1',{waitUntil:'domcontentloaded'});
    await p1.waitForFunction(()=>window.mospochinGetAttribution && window.mospochinGetIdentity);
    const a1=await p1.evaluate(()=>window.mospochinGetAttribution());
    const i1=await p1.evaluate(()=>window.mospochinGetIdentity());
    assert.equal(a1.first_touch.landing_path,'/parokonvektomat-ne-greet.html');
    assert.equal(a1.first_touch.yclid,'YCLID_FIRST');
    assert.equal(a1.last_touch.yclid,'YCLID_FIRST');
    assert.match(i1.visitor_id,/^[0-9a-f-]{36}$/i);
    assert.match(i1.session_id,/^[0-9a-f-]{36}$/i);
    assert.match(i1.tab_id,/^[0-9a-f-]{36}$/i);
    assert.notEqual(i1.session_id,'YCLID_FIRST');

    await p1.goto('http://127.0.0.1:4173/about.html?mospochin_analytics_test=1',{waitUntil:'domcontentloaded'});
    const a2=await p1.evaluate(()=>window.mospochinGetAttribution());
    assert.equal(a2.first_touch.yclid,'YCLID_FIRST');
    assert.equal(a2.last_touch.yclid,'YCLID_FIRST');
    assert.equal(a2.first_touch.landing_path,'/parokonvektomat-ne-greet.html');

    await p1.goto('http://127.0.0.1:4173/parokonvektomat-net-para.html?utm_source=yandex&utm_medium=cpc&utm_campaign=second&yclid=YCLID_LAST&mospochin_analytics_test=1',{waitUntil:'domcontentloaded'});
    const lead=await p1.evaluate(()=>window.mospochinGetLeadContext());
    assert.equal(lead.first_touch_yclid,'YCLID_FIRST');
    assert.equal(lead.last_touch_yclid,'YCLID_LAST');
    assert.equal(lead.yclid_for_offline,'YCLID_LAST');
    assert.equal(lead.yclid_source,'last_touch');
    assert.equal(lead.landing_path,'/parokonvektomat-ne-greet.html');
    assert.equal(lead.page_path,'/parokonvektomat-net-para.html');
    assert.equal(lead.metrika_client_id,'metrica-test-001');

    const p2=await context.newPage();
    await p2.goto('http://127.0.0.1:4173/parokonvektomat-kod-oshibki.html?mospochin_analytics_test=1',{waitUntil:'domcontentloaded'});
    const i2=await p2.evaluate(()=>window.mospochinGetIdentity());
    assert.equal(i2.visitor_id,i1.visitor_id);
    assert.equal(i2.session_id,i1.session_id);
    assert.notEqual(i2.tab_id,i1.tab_id);
  } finally { await browser.close(); }
});
