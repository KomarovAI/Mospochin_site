#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const IN_ROOT = path.join(ROOT, 'reports', 'visual-shards-downloaded');
const OUT_ROOT = path.join(ROOT, 'reports', 'live-visual-pack');
const LLM_DIR = path.join(OUT_ROOT, 'llm');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function walk(dir) {
  const out = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) out.push(...await walk(p));
      else out.push(p);
    }
  } catch {}
  return out;
}

async function copyMerge(src, dst) {
  await ensureDir(path.dirname(dst));
  await fs.copyFile(src, dst);
}

async function readText(file, fallback = '') {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return fallback;
  }
}

async function mergeCsv(name, header) {
  const files = (await walk(IN_ROOT)).filter((f) => f.endsWith(name));
  let out = header + '\n';
  for (const file of files) {
    const text = await readText(file);
    const lines = text.split(/\r?\n/).filter(Boolean);
    out += lines.slice(1).join('\n');
    if (lines.length > 1) out += '\n';
  }
  await ensureDir(path.dirname(path.join(OUT_ROOT, name)));
  await fs.writeFile(path.join(OUT_ROOT, name), out);
}

async function mergeJsonl(name) {
  const files = (await walk(IN_ROOT)).filter((f) => f.endsWith(name));
  let out = '';
  for (const file of files) out += await readText(file);
  if (out) {
    await ensureDir(path.dirname(path.join(OUT_ROOT, name)));
    await fs.writeFile(path.join(OUT_ROOT, name), out);
  }
}

async function main() {
  await fs.rm(OUT_ROOT, { recursive: true, force: true });
  await ensureDir(OUT_ROOT);
  await ensureDir(LLM_DIR);

  const files = await walk(IN_ROOT);

  for (const file of files) {
    const relFromShard = file.split('/').slice(file.split('/').findIndex((x) => x.startsWith('mospochin-visual-shard-')) + 1).join('/');
    if (!relFromShard) continue;

    if (relFromShard.startsWith('pages/')) {
      await copyMerge(file, path.join(OUT_ROOT, relFromShard));
    }
  }

  await mergeCsv('capture-plan.csv', 'page_index,page_id,path,url,class,reason,depth,critical,viewports,parts,status');
  await mergeCsv('manifest.csv', 'page_id,path,viewport,part,selector,file,status,x,y,w,h,text');
  await mergeCsv('llm/llm_visual_blocks.csv', 'page_id,path,class,viewport,block_id,kind,role,text_sample,screenshot,parent_id,x,y,width,height');
  await mergeCsv('llm/llm_visual_elements.csv', 'page_id,path,class,viewport,element_id,parent_block,tag,kind,text,href,screenshot,x,y,width,height');
  await mergeCsv('llm/llm_visual_files.csv', 'page_id,path,viewport,kind,file');
  await mergeCsv('llm/llm_visual_warnings.csv', 'type,label,message');
  await mergeCsv('llm/llm_visual_dom_warnings.csv', 'page_id,path,viewport,severity,code,message,selector,part');

  await mergeJsonl('llm/llm_visual_atomic_pages.jsonl');

  const shardSummaries = [];
  for (const file of files.filter((f) => f.endsWith('shard-summary.json'))) {
    try {
      shardSummaries.push(JSON.parse(await fs.readFile(file, 'utf8')));
    } catch {}
  }

  const pageFiles = (await walk(path.join(OUT_ROOT, 'pages'))).length;
  const summary = [
    '# Live Visual Pack Parallel Summary',
    '',
    `- generated_at: ${new Date().toISOString()}`,
    `- shard_count: ${shardSummaries.length}`,
    `- shard_tasks: ${shardSummaries.reduce((s, x) => s + Number(x.tasks || 0), 0)}`,
    `- shard_warnings: ${shardSummaries.reduce((s, x) => s + Number(x.warnings || 0), 0)}`,
    `- page_files: ${pageFiles}`,
    '',
    '## Shards',
    '',
    ...shardSummaries.map((s) => `- shard ${s.shard}: tasks=${s.tasks}, warnings=${s.warnings}`)
  ].join('\n') + '\n';

  await fs.writeFile(path.join(OUT_ROOT, 'run-summary.md'), summary);

  console.log(`VISUAL_SHARD_MERGE_OK shards=${shardSummaries.length} page_files=${pageFiles}`);
}

main().catch((err) => {
  console.error('VISUAL_SHARD_MERGE_FAIL');
  console.error(err);
  process.exit(0);
});
