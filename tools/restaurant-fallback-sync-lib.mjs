import fs from 'fs';
import path from 'path';
import {
  SITE_ROOT,
  METADATA_PATH,
  REGISTRY_PATH,
  SLOTS_PATH,
  PROOF_LAYER_PATH,
  readJson,
} from './restaurant-authoring-lib.mjs';

export const POLICY_PATH = path.join(SITE_ROOT, 'data/restaurant-page-policy.json');
export const RESTAURANT_SYNC_ZONES = ['faq-items'];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function markerStart(zone) {
  return `<!-- sync:${zone}:start -->`;
}

function markerEnd(zone) {
  return `<!-- sync:${zone}:end -->`;
}

function hasSyncZoneMarker(html, zone) {
  return html.includes(markerStart(zone)) && html.includes(markerEnd(zone));
}

function extractSyncZoneContent(html, zone) {
  const start = markerStart(zone);
  const end = markerEnd(zone);
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) return null;
  return html.slice(startIndex + start.length, endIndex).trim();
}

function replaceSyncZoneContent(html, zone, content) {
  const start = markerStart(zone);
  const end = markerEnd(zone);
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error(`Missing sync markers for ${zone}`);
  }
  return `${html.slice(0, startIndex)}${start}\n${content}\n${end}${html.slice(endIndex + end.length)}`;
}

function buildFaqMarkup(faq) {
  return faq
    .map(
      (item, index) => `                <details class="faq-item bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border-2 border-slate-100 cursor-pointer scroll-reveal" data-delay="${index + 1}"><summary class="font-bold text-brand-blue text-base sm:text-lg flex items-center justify-between"><span>${escapeHtml(item.question)}</span><span class="text-brand-orange transition-transform duration-300">+</span></summary><p class="mt-4 text-slate-600">${escapeHtml(item.answer)}</p></details>`
    )
    .join('\n');
}

function replaceInputPlaceholder(html, fieldName, placeholder) {
  const regex = new RegExp(`(<input[^>]+name="${fieldName}"[^>]+placeholder=")([^"]*)(")`, 'i');
  if (!regex.test(html)) {
    throw new Error(`Missing input placeholder for field ${fieldName}`);
  }
  return html.replace(regex, `$1${escapeHtml(placeholder)}$3`);
}

export function replaceServiceSchemaContent(html, schemaText) {
  const regex = /(<script[^>]*data-slot="service-schema"[^>]*>)([\s\S]*?)(<\/script>)/i;
  if (!regex.test(html)) {
    throw new Error('Missing service-schema script block');
  }
  return html.replace(regex, `$1\n${schemaText}\n    $3`);
}

export function extractServiceSchemaContent(html) {
  return html.match(/<script[^>]*data-slot="service-schema"[^>]*>([\s\S]*?)<\/script>/i)?.[1] ?? null;
}

export function normalizeComparableMarkup(value) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/>\s+</g, '><')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
}

function buildServiceSchema({ pageMeta, service }) {
  return `    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${escapeHtml(service.schemaName)}",
      "description": "${escapeHtml(pageMeta.description)}",
      "provider": {
        "@type": "LocalBusiness",
        "name": "MosPochin",
        "telephone": "+79990057172",
        "url": "https://mospochin.ru",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Москва",
          "addressCountry": "RU"
        }
      },
      "areaServed": {
        "@type": "City",
        "name": "Москва"
      }
    }`;
}

function buildSyncPayload({ pageMeta, service, slotEntry }) {
  return {
    schema: buildServiceSchema({ pageMeta, service }),
    zones: {
      'faq-items': buildFaqMarkup(slotEntry.faq || []),
    },
    placeholders: {
      type: slotEntry.formHints?.typePlaceholder ?? '',
      problem: slotEntry.formHints?.problemPlaceholder ?? '',
    },
  };
}

export function loadRestaurantSyncState() {
  return {
    metadata: readJson(METADATA_PATH),
    registry: readJson(REGISTRY_PATH),
    slots: readJson(SLOTS_PATH),
    proofLayer: readJson(PROOF_LAYER_PATH),
    policy: readJson(POLICY_PATH),
  };
}

export function getPublicRestaurantServices(registry) {
  return (registry?.services || []).filter((entry) => !entry.isShadow);
}

export function analyzeRestaurantSyncState(html, { pageMeta, service, slotEntry }) {
  const expected = buildSyncPayload({ pageMeta, service, slotEntry });
  const issues = [];

  const schemaContent = extractServiceSchemaContent(html);
  if (schemaContent == null) {
    issues.push('Missing service-schema script block');
  } else if (normalizeComparableMarkup(schemaContent) !== normalizeComparableMarkup(expected.schema)) {
    issues.push('service-schema fallback drift');
  }

  for (const zone of RESTAURANT_SYNC_ZONES) {
    if (!hasSyncZoneMarker(html, zone)) {
      issues.push(`Missing sync marker block for ${zone}`);
      continue;
    }
    const actualContent = extractSyncZoneContent(html, zone);
    if (actualContent == null) {
      issues.push(`Empty sync marker block for ${zone}`);
      continue;
    }
    if (normalizeComparableMarkup(actualContent) !== normalizeComparableMarkup(expected.zones[zone])) {
      issues.push(`${zone} fallback drift`);
    }
  }

  const currentTypePlaceholder = html.match(/<input[^>]+name="type"[^>]+placeholder="([^"]*)"/i)?.[1] ?? null;
  const currentProblemPlaceholder = html.match(/<input[^>]+name="problem"[^>]+placeholder="([^"]*)"/i)?.[1] ?? null;
  if (currentTypePlaceholder == null || currentTypePlaceholder !== expected.placeholders.type) {
    issues.push('type placeholder drift');
  }
  if (currentProblemPlaceholder == null || currentProblemPlaceholder !== expected.placeholders.problem) {
    issues.push('problem placeholder drift');
  }

  return { expected, issues };
}

export function syncRestaurantServiceHtml(html, context) {
  const { expected } = analyzeRestaurantSyncState(html, context);
  let nextHtml = replaceServiceSchemaContent(html, expected.schema);
  nextHtml = replaceSyncZoneContent(nextHtml, 'faq-items', expected.zones['faq-items']);
  nextHtml = replaceInputPlaceholder(nextHtml, 'type', expected.placeholders.type);
  nextHtml = replaceInputPlaceholder(nextHtml, 'problem', expected.placeholders.problem);
  return nextHtml.replace(/[ \t]+$/gm, '');
}

export function getPublicRestaurantServiceSyncContext(page, state = loadRestaurantSyncState()) {
  const pageMeta = state.metadata.pages?.[page] ?? null;
  const service = (state.registry.services || []).find((entry) => entry.page === page && !entry.isShadow) ?? null;
  const slotEntry = state.slots.pages?.[page] ?? null;

  if (!pageMeta) {
    throw new Error(`Unknown page in metadata: ${page}`);
  }
  if (!service) {
    throw new Error(`Unknown public restaurant service page: ${page}`);
  }
  if (!slotEntry) {
    throw new Error(`Missing restaurant slot entry for ${page}`);
  }

  return {
    pageMeta,
    service,
    slotEntry,
    registry: state.registry,
    proofLayer: state.proofLayer,
    policy: state.policy,
  };
}

export function readPageHtml(page) {
  return fs.readFileSync(path.join(SITE_ROOT, page), 'utf8');
}

export function writePageHtml(page, html) {
  fs.writeFileSync(path.join(SITE_ROOT, page), html);
}
