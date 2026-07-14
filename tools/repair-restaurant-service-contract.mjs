#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  getPublicRestaurantServices,
  loadRestaurantSyncState,
  readPageHtml,
  writePageHtml,
} from './restaurant-fallback-sync-lib.mjs';

const root = process.cwd();
const checkMode = process.argv.includes('--check');
const state = loadRestaurantSyncState();
const pages = getPublicRestaurantServices(state.registry).map((entry) => entry.page);

function marker(zone) {
  return {
    start: `<!-- sync:${zone}:start owner="tools/restaurant-sync-fallbacks.mjs" source="data/restaurant-page-slots.json,data/restaurant-proof-layer.json,data/restaurant-services.json" -->`,
    end: `<!-- sync:${zone}:end -->`,
  };
}

function emptyZone(zone) {
  const { start, end } = marker(zone);
  return `\n${start}\n<div data-sync-zone="${zone}"></div>\n${end}\n`;
}

function addBodyClasses(html, classes) {
  const body = html.match(/<body\b[^>]*>/i)?.[0];
  if (!body) throw new Error('body tag missing');
  const current = body.match(/\bclass="([^"]*)"/i)?.[1] || '';
  const merged = [...new Set(`${current} ${classes.join(' ')}`.split(/\s+/).filter(Boolean))].join(' ');
  const nextBody = /\bclass="[^"]*"/i.test(body)
    ? body.replace(/\bclass="[^"]*"/i, `class="${merged}"`)
    : body.replace(/>$/, ` class="${merged}">`);
  return html.replace(body, nextBody);
}

function addSchemaSlot(html) {
  if (/data-slot="service-schema"/i.test(html)) return html;
  const block = '\n<script type="application/ld+json" data-slot="service-schema">\n{}\n</script>\n';
  if (!/<\/head>/i.test(html)) throw new Error('head close tag missing');
  return html.replace(/\s*<\/head>/i, `${block}</head>`);
}

function addRequestContract(html, slug) {
  if (/<form\b[^>]*data-slot="request-form"/i.test(html) && /<section\b[^>]*id="request"/i.test(html)) return html;
  const form = `
<section id="request" data-architecture-contract="restaurant-service-v1" class="py-16 lg:py-20 bg-slate-50">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <form action="/api/send-telegram" method="post" data-slot="request-form" data-contact-form="true" data-form-id="${slug}_legacy_service_form" data-form-context="${slug}_legacy_service" data-cta-id="${slug}_legacy_form" data-cta-group="lead_form" data-block="lead_form" class="telegram-form bg-white p-5 sm:p-6 lg:p-10 rounded-2xl shadow-lg border border-slate-200 scroll-reveal">
      <input type="text" name="name" id="${slug}-name" placeholder="Ваше имя">
      <input type="tel" name="phone" id="${slug}-phone" placeholder="Телефон">
      <input type="text" name="type" id="${slug}-type" placeholder="Тип оборудования">
      <input type="text" name="problem" id="${slug}-problem" placeholder="Коротко опишите проблему">
      <input type="hidden" name="consent" value="true">
      <button type="submit" data-cta-id="${slug}_legacy_form_submit" data-cta-group="form_submit" data-block="lead_form">Оставить заявку</button>
    </form>
  </div>
</section>
`;
  if (/<\/main>/i.test(html)) return html.replace(/\s*<\/main>/i, `${form}</main>`);
  return html.replace(/\s*<\/body>/i, `${form}</body>`);
}

function repairPage(page) {
  const slug = page.replace(/\.html$/i, '');
  const before = readPageHtml(page);
  let html = before;
  html = addBodyClasses(html, ['branch-restaurant', 'page-restaurant-service', `page-${slug}`]);
  html = addSchemaSlot(html);
  html = addRequestContract(html, slug);
  for (const zone of ['service-kpi', 'request-overview', 'faq-items', 'service-proof', 'related-links']) {
    const { start, end } = marker(zone);
    if (!html.includes(start) || !html.includes(end)) {
      html = html.replace(/\s*<\/main>/i, `${emptyZone(zone)}</main>`);
    }
  }
  if (!checkMode && html !== before) writePageHtml(page, html);
  return html !== before;
}

let changed = 0;
for (const page of pages) {
  if (repairPage(page)) changed += 1;
}

console.log(`Restaurant service contract ${checkMode ? 'check' : 'repair'}: pages=${pages.length} changed=${changed}`);
if (checkMode && changed) process.exit(1);
