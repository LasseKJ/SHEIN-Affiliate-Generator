import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const sheets = await readFile(new URL('../lib/googleSheets.js', import.meta.url), 'utf8');
const route = await readFile(new URL('../app/api/generate/route.js', import.meta.url), 'utf8');
const pool = count => Array.from({ length: count }, (_, i) => ({
  'Product ID': `id-${i}`, 'Product Code': `code-${i}`, 'Product Name': `Squishy ${i}`
}));
function setup(products) {
  const context = vm.createContext({
    process: { env: { TEMPLATE_COVER_URL: 'cover', TEMPLATE_IMAGE_URL: 'image' } },
    console: { log() {}, error() {} },
    NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) },
    createPromptSet: products => {
      assert.equal(products.length, 9);
      return ['prompt1', 'prompt2', 'prompt3'];
    },
    createCoverPrompt: () => 'cover'
  });
  vm.runInContext(sheets.replace(/^import .*;\r?\n/gm, '').replaceAll('export ', ''), context);
  context.pool = products;
  vm.runInContext('cachedSquishyProducts = pool;', context);
  vm.runInContext(route.replace(/^import[\s\S]*?from [^;]+;\s*/gm, '').replaceAll('export ', ''), context);
  return context;
}

test('all supported counts allow reuse across posts with 9 or 48 products', async () => {
  for (const available of [9, 48]) {
    for (const videoCount of [1, 2, 4, 8]) {
      const result = await setup(pool(available)).POST({ json: async () => ({ videoCount }) });
      assert.equal(result.status, 200);
      assert.equal(result.body.videos.length, videoCount);
      assert.equal(result.body.totalProducts, videoCount * 9);
      assert.equal(result.body.totalPrompts, videoCount * 4);
      for (const video of result.body.videos) {
        const selected = video.groups.flatMap(group => Array.from(group.products));
        assert.equal(selected.length, 9);
        assert.equal(new Set(selected.map(p => p.code)).size, 9);
        assert.equal(new Set(selected.map(p => p.id)).size, 9);
        assert.equal(video.prompts.length, 4);
      }
    }
  }
});

test('duplicate sheet rows by code or ID cannot fill a post', async () => {
  const products = pool(8);
  products.push({ ...products[0], 'Product ID': 'other', 'Product Code': ' CODE-0 ' });
  products.push({ ...products[1], 'Product Code': 'other', 'Product ID': ' ID-1 ' });
  products.push({ 'Product Name': 'No identity' });
  const result = await setup(products).POST({ json: async () => ({ videoCount: 8 }) });
  assert.equal(result.status, 500);
  assert.match(result.body.error, /kun 8.*9 pr\. post/);
});
