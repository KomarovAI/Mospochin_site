import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';

async function freePort(){return await new Promise((resolve,reject)=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});s.on('error',reject);});}
async function waitHealth(url){for(let i=0;i<80;i++){try{const r=await fetch(url+'/health');if(r.ok)return;}catch{} await new Promise(r=>setTimeout(r,100));}throw new Error('server_start_timeout');}

test('backend idempotency returns duplicate 200 and conflict 409', {timeout:60000}, async () => {
 const port=await freePort(); const logDir=fs.mkdtempSync(path.join(os.tmpdir(),'mospochin-paid-v3-'));
 const child=spawn(process.execPath,['server/telegram-api.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:String(port),HOST:'127.0.0.1',MOSPOCHIN_TELEGRAM_TEST_MODE:'1',MOSPOCHIN_LOG_DIR:logDir,RATE_LIMIT_MAX_REQUESTS:'100',GLOBAL_RATE_LIMIT_MAX_REQUESTS:'100',EVENT_RATE_LIMIT_MAX_REQUESTS:'100'},stdio:['ignore','pipe','pipe']});
 let stderr=''; child.stderr.on('data',d=>stderr+=d);
 try {
  const base=`http://127.0.0.1:${port}`; await waitHealth(base);
  const payload={schema_version:'mospochin.lead.v3',tracking_version:'2026-07-15',page:'parokonvektomat-ne-greet.html',page_path:'/parokonvektomat-ne-greet.html',page_slug:'parokonvektomat-ne-greet',phone:'+79990000001',consent:true,form_id:'parokonvektomat_no_heat_phone_only',form_variant:'parokonvektomat_no_heat_phone_only_v1',idempotency_key:'idem-test-001',session_id:'00000000-0000-4000-8000-000000000001',trace_id:'trace-test-001'};
  const post=async(x)=>{const r=await fetch(base+'/api/send-telegram',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(x)});return {status:r.status,body:await r.json()};};
  const first=await post(payload); assert.equal(first.status,200); assert.equal(first.body.ok,true); assert.equal(first.body.deduplicated,false); assert.ok(first.body.lead_id); assert.equal('telegram_message_id' in first.body,false);
  const dup=await post(payload); assert.equal(dup.status,200); assert.equal(dup.body.deduplicated,true); assert.equal(dup.body.lead_id,first.body.lead_id);
  const conflict=await post({...payload,phone:'+79990000002'}); assert.equal(conflict.status,409); assert.equal(conflict.body.error,'idempotency_conflict');
  const lines=fs.readFileSync(path.join(logDir,'direct_leads.jsonl'),'utf8').trim().split('\n').filter(Boolean); assert.equal(lines.length,1);
  const row=JSON.parse(lines[0]); assert.equal(row.gclid_hash ?? null,null); assert.equal(row.yclid_for_offline_hash ?? null,null); assert.notEqual(row.session_id_hash,row.yclid_for_offline_hash ?? null);
 } finally { child.kill('SIGTERM'); await new Promise(r=>setTimeout(r,100)); if(child.exitCode===null)child.kill('SIGKILL'); }
 assert.equal(stderr,'',stderr);
});
