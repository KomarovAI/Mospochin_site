import fs from 'node:fs';
import path from 'node:path';
const MIME = {
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
  '.webp':'image/webp','.woff2':'font/woff2','.ico':'image/x-icon'
};
export function installLocalSiteRoutes(context, root=process.cwd()) {
  return context.route('**/*', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.pathname === '/api/track-event') {
      await route.fulfill({status:202,contentType:'application/json',body:'{"ok":true,"accepted":true}'}); return;
    }
    if (url.pathname === '/api/send-telegram') {
      await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"lead_id":"lead_test","request_id":"request_test","status":"lead_created","deduplicated":false}'}); return;
    }
    if (!['127.0.0.1','localhost','mospochin.test','www.mospochin.test'].includes(url.hostname)) {
      await route.abort(); return;
    }
    let rel = decodeURIComponent(url.pathname.replace(/^\//,''));
    if (!rel) rel = 'index.html';
    const file = path.resolve(root, rel);
    if (!file.startsWith(path.resolve(root)+path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      await route.fulfill({status:404,contentType:'text/plain',body:'not found'}); return;
    }
    const ext=path.extname(file).toLowerCase();
    await route.fulfill({status:200,contentType:MIME[ext]||'application/octet-stream',body:fs.readFileSync(file)});
  });
}
export function analyticsInitScript() {
  window.__MOSPOCHIN_ANALYTICS_TEST__ = true;
  window.MOSPOCHIN_METRICA_COUNTER_ID = '109138661';
  window.ym = function (_id, method, callback) {
    if (method === 'getClientID' && typeof callback === 'function') callback('metrica-test-001');
  };
}
