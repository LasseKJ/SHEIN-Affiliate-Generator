import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { chatGPTEntries, createChatGPTPromptFiles, createChatGPTZip } from '../lib/chatGPTExport.js';

const product = id => ({ name: `Product ${id}`, code: `00Ab-${id}`, price: '2.22', currency: 'EUR', imageUrl: `https://example.com/${id}.webp` });
const list = (n, prefix = '') => Array.from({length:n}, (_, i) => product(`${prefix}${i}`));
const cases = {
  squishy: { groups: [1,2,3].map(n => ({products:list(3, n)})), prompts: ['slide1','slide2','slide3','cover'] },
  autumn: { outfits: [1,2,3].map(n => ({products: Object.fromEntries(['shoe','top','bottom','accessory'].map(key=>[key,product(`${n}${key}`)]))})), coverProducts:list(9,'cover'), prompts: Array.from({length:7},(_,i)=>`autumn ${i}`) },
  winter: { outfits: [1,2,3].map(n=>({products:{shoe:product(`${n}shoe`),top:product(`${n}top`),bottom:product(`${n}bottom`),accessory:product(`${n}accessory`)}})), prompts: Array.from({length:6},(_,i)=>`winter ${i}`) },
  'phone-cases': {slides:[1,2,3,4].map(n=>list(6,n)),prompts:['one','two','three','four','cover']},
  essentials:{slides:[1,2,3].map(n=>({products:list(6,n)})),prompts:['one','two','three']},
  jackets:{jackets:list(4),prompts:['one','two','three','four','cover']},
  sweaters:{sweaters:list(4),prompts:['one','two','three','four','cover']},
  dresses:{images:['COVER','IMAGE 1','IMAGE 2','IMAGE 3'].map((folder,i)=>({folder,products:i===0?list(3):[product(i-1)],prompt:`dress ${i}`}))},
  'boo-basket':{slides:[1,2,3].map(n=>list(10,n)),prompts:['one','two','three','cover']},
  stocking:{slides:[1,2,3].map(n=>list(3,n)),prompts:['one','two','three','cover']}
};
const templates = {image:'https://example.com/template.webp',cover:'https://example.com/cover.webp'};
for (const [category, fixture] of Object.entries(cases)) {
  test(`${category}: every prompt, reference and output matches for 1, 2, 4 and 8 videos`, async()=>{
    for (const count of [1,2,4,8]) {
      const videos=Array.from({length:count},(_,i)=>({...fixture,videoNumber:i+1}));
      const calls=[];
      const fetchImage=async url=>{calls.push(url);return new Response(new Uint8Array([1,2,3]),{headers:{'Content-Type':'image/webp'}});};
      const files=createChatGPTPromptFiles(category,videos,templates);
      const zip=await JSZip.loadAsync(await (await createChatGPTZip(category,videos,()=>{},templates,fetchImage)).arrayBuffer());
      assert.equal(await zip.file('MASTER-PROMPT.txt').async('string'),files.master);
      assert.equal(await zip.file('PROMPTS.txt').async('string'),files.all);
      assert.equal(new Set(files.entries.map(e=>e.output)).size,files.entries.length);
      for (const entry of files.entries) {
        assert.equal(await zip.file(`${entry.path}/PROMPT.txt`).async('string'),entry.prompt);
        assert.ok(files.master.includes(`${entry.path}/PROMPT.txt → ${entry.output}`));
        const manifest=JSON.parse(await zip.file(`${entry.path}/PRODUCTS.json`).async('string'));
        assert.deepEqual(manifest.map(p=>p.code),entry.products.map(p=>p.code));
        for (const item of manifest) assert.deepEqual(await zip.file(`${entry.path}/${item.filename}`).async('uint8array'),new Uint8Array([1,2,3]));
        assert.equal(Boolean(zip.file(`${entry.path}/TEMPLATE.webp`)),Boolean(entry.template));
      }
      assert.equal(calls.length,new Set(calls).size,'download each unique source once');
    }
  });
}
test('flat lays reuse the correct outfit; covers preserve category-specific references and order',()=>{
  const entries=cat=>chatGPTEntries(cat,[{...cases[cat],videoNumber:1}],templates);
  const winter=entries('winter');
  for(let i=0;i<6;i+=2) assert.deepEqual(winter[i].products,winter[i+1].products);
  assert.deepEqual(entries('squishy')[3].products,cases.squishy.groups.map(g=>g.products[0]));
  for(const cat of ['phone-cases','boo-basket','stocking']) assert.equal(entries(cat).at(-1).products.length,0);
  assert.equal(entries('jackets').at(-1).products.length,4);
  assert.equal(entries('autumn').at(-1).products.length,9);
  assert.equal(entries('dresses')[0].path,'VIDEO 1/COVER');
});
test('failed downloads, missing templates and non-image responses reject the export',async()=>{
  const videos=[{...cases.jackets,videoNumber:1}];
  await assert.rejects(createChatGPTZip('jackets',videos,()=>{},{},async()=>new Response('',{status:404})),/Kunne ikke hente/);
  await assert.rejects(createChatGPTZip('jackets',videos,()=>{},{},async()=>new Response('html',{headers:{'Content-Type':'text/html'}})),/Ukendt billedformat/);
  assert.throws(()=>chatGPTEntries('squishy',[{...cases.squishy,videoNumber:1}]),/template mangler/);
});
