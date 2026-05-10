#!/usr/bin/env node

const METRIKA_COUNTER_ID = process.env.METRIKA_COUNTER_ID || '109138661';
const DIRECT_CAMPAIGN_ID = process.env.DIRECT_CAMPAIGN_ID || '709782647';
const DATE_1 = process.env.DATE_1 || '7daysAgo';
const DATE_2 = process.env.DATE_2 || 'today';

const METRIKA_TOKEN = process.env.YANDEX_METRIKA_TOKEN;
const DIRECT_TOKEN = process.env.YANDEX_DIRECT_TOKEN;

function assertToken(name, value) {
  if (!value) {
    throw new Error(`${name} is required`);
  }
}

function formatNumber(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return String(value);
  return number.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.errors || json.error) {
    throw new Error(JSON.stringify({ status: response.status, body: json }));
  }
  return json;
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(JSON.stringify({ status: response.status, body: text.slice(0, 500) }));
  }
  return text;
}

function metrikaUrl(path, params) {
  const url = new URL(path, 'https://api-metrika.yandex.net');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}

async function getMetrikaOverview() {
  const url = metrikaUrl('/stat/v1/data', {
    ids: METRIKA_COUNTER_ID,
    date1: DATE_1,
    date2: DATE_2,
    metrics: [
      'ym:s:visits',
      'ym:s:users',
      'ym:s:bounceRate',
      'ym:s:goal558329465reaches',
      'ym:s:goal558329466reaches',
      'ym:s:goal558329471reaches',
      'ym:s:goal558329472reaches'
    ].join(','),
    dimensions: 'ym:s:lastsignTrafficSource',
    limit: '20'
  });

  return fetchJson(url, {
    headers: { Authorization: `OAuth ${METRIKA_TOKEN}` }
  });
}

async function getMetrikaUtm() {
  const url = metrikaUrl('/stat/v1/data', {
    ids: METRIKA_COUNTER_ID,
    date1: DATE_1,
    date2: DATE_2,
    metrics: 'ym:s:visits,ym:s:goal558329471reaches',
    dimensions: [
      'ym:s:lastsignUTMSource',
      'ym:s:lastsignUTMMedium',
      'ym:s:lastsignUTMCampaign',
      'ym:s:lastsignUTMContent',
      'ym:s:lastsignUTMTerm'
    ].join(','),
    limit: '50'
  });

  return fetchJson(url, {
    headers: { Authorization: `OAuth ${METRIKA_TOKEN}` }
  });
}

async function getDirectCampaign() {
  const body = {
    method: 'get',
    params: {
      SelectionCriteria: { Ids: [Number(DIRECT_CAMPAIGN_ID)] },
      FieldNames: ['Id', 'Name', 'State', 'Status', 'StatusClarification', 'DailyBudget'],
      TextCampaignFieldNames: ['TrackingParams', 'CounterIds', 'PriorityGoals']
    }
  };

  const json = await fetchJson('https://api.direct.yandex.com/json/v5/campaigns', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${DIRECT_TOKEN}`,
      'Accept-Language': 'ru',
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body)
  });

  return json.result.Campaigns[0];
}

async function getDirectStats() {
  const body = {
    params: {
      SelectionCriteria: {
        DateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        DateTo: new Date().toISOString().slice(0, 10),
        Filter: [{ Field: 'CampaignId', Operator: 'EQUALS', Values: [DIRECT_CAMPAIGN_ID] }]
      },
      FieldNames: ['CampaignId', 'Impressions', 'Clicks', 'Cost'],
      ReportName: `mospochin_${Date.now()}`,
      ReportType: 'CAMPAIGN_PERFORMANCE_REPORT',
      DateRangeType: 'CUSTOM_DATE',
      Format: 'TSV',
      IncludeVAT: 'YES',
      IncludeDiscount: 'NO'
    }
  };

  return fetchText('https://api.direct.yandex.com/json/v5/reports', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${DIRECT_TOKEN}`,
      'Accept-Language': 'ru',
      'Content-Type': 'application/json; charset=utf-8',
      'returnMoneyInMicros': 'false',
      skipReportHeader: 'true',
      skipColumnHeader: 'false',
      skipReportSummary: 'false'
    },
    body: JSON.stringify(body)
  });
}

function printMetrikaOverview(report) {
  console.log('## Metrika overview');
  console.log(`Period: ${DATE_1} - ${DATE_2}`);
  console.log(`Totals: visits ${formatNumber(report.totals?.[0])}, users ${formatNumber(report.totals?.[1])}, bounce ${formatNumber(report.totals?.[2])}%`);
  console.log(`Goals: phone ${formatNumber(report.totals?.[3])}, whatsapp ${formatNumber(report.totals?.[4])}, form_success ${formatNumber(report.totals?.[5])}, form_error ${formatNumber(report.totals?.[6])}`);
  console.log('');
  for (const row of report.data || []) {
    console.log(`- ${row.dimensions?.[0]?.name || '(none)'}: ${row.metrics.map(formatNumber).join(' / ')}`);
  }
  console.log('');
}

function printMetrikaUtm(report) {
  console.log('## UTM performance');
  if (!report.data?.length) {
    console.log('No UTM traffic yet.');
    console.log('');
    return;
  }

  for (const row of report.data) {
    const label = row.dimensions.map((dimension) => dimension.name || '(none)').join(' | ');
    console.log(`- ${label}: visits ${formatNumber(row.metrics[0])}, form_success ${formatNumber(row.metrics[1])}`);
  }
  console.log('');
}

function printDirectCampaign(campaign) {
  console.log('## Direct campaign');
  console.log(`Campaign: ${campaign.Id} ${campaign.Name}`);
  console.log(`Status: ${campaign.Status} / ${campaign.State} (${campaign.StatusClarification})`);
  console.log(`Daily budget: ${formatNumber(Number(campaign.DailyBudget?.Amount || 0) / 1_000_000)} RUB`);
  console.log(`Tracking: ${campaign.TextCampaign?.TrackingParams || '(none)'}`);
  console.log('');
}

async function main() {
  assertToken('YANDEX_METRIKA_TOKEN', METRIKA_TOKEN);
  assertToken('YANDEX_DIRECT_TOKEN', DIRECT_TOKEN);

  const [campaign, metrikaOverview, metrikaUtm, directStats] = await Promise.all([
    getDirectCampaign(),
    getMetrikaOverview(),
    getMetrikaUtm(),
    getDirectStats()
  ]);

  printDirectCampaign(campaign);
  printMetrikaOverview(metrikaOverview);
  printMetrikaUtm(metrikaUtm);
  console.log('## Direct report');
  console.log(directStats.trim() || 'No Direct rows yet.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
