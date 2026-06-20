import fs from 'node:fs';
import path from 'node:path';

const downloadRoot = 'reports/visual-audit/downloaded';
const finalDir = 'reports/visual-audit/final';
fs.rmSync(finalDir, { recursive: true, force: true });
fs.mkdirSync(finalDir, { recursive: true });

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

function csvEscape(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

const files = walk(downloadRoot);
const manifests = [];
const issues = [];

for (const f of files) {
  if (path.basename(f) === 'manifest.json') {
    try {
      const arr = JSON.parse(fs.readFileSync(f, 'utf8'));
      if (Array.isArray(arr)) manifests.push(...arr);
    } catch {}
  }
  if (path.basename(f) === 'issues.jsonl') {
    const lines = fs.readFileSync(f, 'utf8').split(/\n+/).filter(Boolean);
    for (const line of lines) {
      try { issues.push(JSON.parse(line)); } catch {}
    }
  }
}

const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));
for (const f of imageFiles) {
  const relFromPages = f.includes('/pages/') ? f.split('/pages/').pop() : path.basename(f);
  const dest = path.join(finalDir, 'pages', relFromPages);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(f, dest);
}

const issueHeader = ['path','url','viewport','severity','type','evidence','recommendation','screenshot'];
const manifestHeader = ['path','url','viewport','status','error','title','h1','contact_links','first_screen_cta','forms','horizontal_scroll','screenshot','full'];

fs.writeFileSync(path.join(finalDir, 'visual_issues.csv'), issueHeader.join(',') + '\n' + issues.map(i => issueHeader.map(k => csvEscape(i[k])).join(',')).join('\n') + '\n');
fs.writeFileSync(path.join(finalDir, 'manifest.csv'), manifestHeader.join(',') + '\n' + manifests.map(m => manifestHeader.map(k => csvEscape(m[k])).join(',')).join('\n') + '\n');
fs.writeFileSync(path.join(finalDir, 'manifest.json'), JSON.stringify({ generated_at: new Date().toISOString(), pages: manifests.length, issues: issues.length, manifests, issues }, null, 2));

const counts = issues.reduce((acc, i) => {
  acc[i.severity] = (acc[i.severity] || 0) + 1;
  acc[`${i.severity}:${i.type}`] = (acc[`${i.severity}:${i.type}`] || 0) + 1;
  return acc;
}, {});

const topIssues = issues.slice(0, 100).map(i => `- **${i.severity} ${i.type}** — ${i.path} / ${i.viewport}: ${i.evidence}`).join('\n');

fs.writeFileSync(path.join(finalDir, 'VISUAL_AUDIT_SUMMARY.md'), `# MosPochin Visual Audit

Generated: ${new Date().toISOString()}

## Counts

- Pages/viewports captured: ${manifests.length}
- Issues: ${issues.length}
- P0: ${counts.P0 || 0}
- P1: ${counts.P1 || 0}
- P2: ${counts.P2 || 0}
- P3: ${counts.P3 || 0}

## Top issues

${topIssues || 'No issues found by automated surface checks.'}
`);

const cards = manifests.map(m => `
<section>
  <h2>${m.path} — ${m.viewport}</h2>
  <p>Status: ${m.status ?? ''} | H1: ${m.h1 ?? ''}</p>
  <img src="${m.screenshot}" style="max-width:48%;vertical-align:top;border:1px solid #ccc">
  <img src="${m.full}" style="max-width:48%;vertical-align:top;border:1px solid #ccc">
</section>`).join('\n');

fs.writeFileSync(path.join(finalDir, 'index.html'), `<!doctype html><meta charset="utf-8"><title>MosPochin Visual Audit</title><body><h1>MosPochin Visual Audit</h1><p>Issues: ${issues.length}</p>${cards}</body>`);

console.log(`merged manifests=${manifests.length} issues=${issues.length} images=${imageFiles.length}`);
