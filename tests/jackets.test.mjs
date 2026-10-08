import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createJacketPrompts } from '../lib/jacketPrompts.js';

const source = await readFile(new URL('../lib/jackets.js', import.meta.url), 'utf8');
async function generator(pool) {
  let calls = 0;
  const context = vm.createContext({ getClothingProduct: async category => {
    assert.equal(category, 'Jacket');
    return pool[calls++ % pool.length];
  }});
  vm.runInContext(source.replace(/^import .*;\r?\n/, '').replace('export async function', 'async function'), context);
  return { generate: context.generateJacketVideos, calls: () => calls };
}
const products = Array.from({length:4}, (_, i) => ({name:`Jacket ${i}`, code:`00Ab-${i}`, category:'Jacket', imageUrl:`https://example.com/${i}.jpg`}));

test('all video counts preserve four unique Jacket references and five prompts per video', async () => {
  for (const count of [1,2,4,8]) {
    const {generate} = await generator(products);
    const videos = await generate(count);
    assert.equal(videos.length,count);
    videos.forEach((video,index) => {
      assert.equal(video.videoNumber,index+1);
      assert.equal(new Set(video.jackets.map(p=>p.code)).size,4);
      const {prompts,coverPrompt} = createJacketPrompts(video);
      assert.equal(prompts.length,5);
      assert.equal(prompts[4],coverPrompt);
      video.jackets.forEach((product,i) => {
        assert.ok(prompts[i].includes(`BILLEDE ${i+1}`));
        assert.ok(prompts[i].includes(`\n${product.code}\n`));
        assert.ok(coverPrompt.includes(`Jacket ${i+1}: ${product.name} | Code: ${product.code}`));
        assert.match(prompts[i], /structured, padded, leather or stiff jackets/);
        assert.doesNotMatch(prompts[i], /sweater/i);
      });
      assert.match(coverPrompt,/exactly the FOUR uploaded jacket references/);
      assert.match(coverPrompt,/does NOT contain the word “Autumn”/);
      assert.match(coverPrompt,/exact phrase “From Shein”/);
      assert.match(coverPrompt,/Do NOT arrange them in a grid/);
    });
  }
});

test('invalid counts fail before selecting products',async()=>{
  const {generate,calls}=await generator(products);
  for (const count of [0,3,9,-1,1.5,'bad']) await assert.rejects(generate(count),/1, 2, 4 eller 8/);
  assert.equal(calls(),0);
});

test('missing codes, duplicate codes and wrong categories cannot fill a video',async()=>{
  const pool=[...products.slice(0,3),{...products[0],code:' 00ab-0 '},{...products[3],category:'Jackets'},{...products[3],category:'jacket'},{...products[3],code:''}];
  const {generate,calls}=await generator(pool);
  await assert.rejects(generate(1),/mindst 4.*Jacket/);
  assert.equal(calls(),120);
});

test('API returns the same selected jackets in image and cover prompts', async () => {
  const route = await readFile(new URL('../app/api/generate-jackets/route.js',import.meta.url),'utf8');
  const {generate} = await generator(products);
  const context = vm.createContext({
    generateJacketVideos: generate, createJacketPrompts,
    NextResponse: {json: (body,options) => ({body,status:options?.status || 200})},
    console: {error:()=>{}}
  });
  vm.runInContext(route.replace(/^import .*;\r?\n/gm,'').replaceAll('export ',''),context);
  const result = await context.POST({json:async()=>({videoCount:2})});
  assert.equal(result.status,200);
  assert.equal(result.body.category,'Jacket');
  assert.equal(result.body.jacketsPerVideo,4);
  assert.equal(result.body.promptsPerVideo,5);
  assert.equal(result.body.videos.length,2);
  for (const video of result.body.videos) {
    assert.deepEqual(Array.from(video.jackets,p=>p.code),products.map(p=>p.code));
    assert.equal(video.prompts[4],video.coverPrompt);
  }
  const failed = await context.POST({json:async()=>({videoCount:3})});
  assert.equal(failed.status,500);
  assert.equal(failed.body.success,false);
});
