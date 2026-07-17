import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function between(source, start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.ok(from >= 0, `missing start marker: ${start}`);
  assert.ok(to > from, `missing end marker: ${end}`);
  return source.slice(from, to);
}

test('main and form share one in-flight JSON request', async () => {
  const main = fs.readFileSync('main.js', 'utf8');
  const form = fs.readFileSync('telegram-form.js', 'utf8');
  const mainLoader = between(main, 'function getSharedJsonPromiseRegistry()', 'async function loadCurrentPageMetadata()');
  const formLoader = between(form, '  function loadSharedJson(path)', '  function getRuntimeConfigSource()');

  let fetchCount = 0;
  const context = vm.createContext({
    Map,
    Error,
    Promise,
    window: {},
    fetch: async () => {
      fetchCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 5));
      return {
        ok: true,
        json: async () => ({ pages: { 'index.html': { branch: 'restaurant' } } }),
      };
    },
    setTimeout,
  });

  vm.runInContext(`${mainLoader}\n${formLoader}`, context);
  const [fromMain, fromForm] = await Promise.all([
    vm.runInContext(`loadJson('/data/page-metadata.json')`, context),
    vm.runInContext(`loadSharedJson('/data/page-metadata.json')`, context),
  ]);

  assert.equal(fetchCount, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(fromMain)), JSON.parse(JSON.stringify(fromForm)));
});

test('failed shared request is evicted and can be retried', async () => {
  const main = fs.readFileSync('main.js', 'utf8');
  const mainLoader = between(main, 'function getSharedJsonPromiseRegistry()', 'async function loadCurrentPageMetadata()');
  let fetchCount = 0;
  const context = vm.createContext({
    Map,
    Error,
    Promise,
    window: {},
    fetch: async () => {
      fetchCount += 1;
      if (fetchCount === 1) throw new Error('temporary failure');
      return { ok: true, json: async () => ({ ok: true }) };
    },
  });
  vm.runInContext(mainLoader, context);
  await assert.rejects(vm.runInContext(`loadJson('/data/test.json')`, context));
  const result = await vm.runInContext(`loadJson('/data/test.json')`, context);
  assert.equal(fetchCount, 2);
  assert.equal(result.ok, true);
});
