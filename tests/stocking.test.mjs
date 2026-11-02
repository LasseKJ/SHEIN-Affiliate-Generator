import test from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { generateStockingVideos } from "../lib/stockingStuffers.js";
import { CHRISTMAS_COVER_THEMES, createStockingPrompts } from "../lib/stockingPrompts.js";
import { createStockingZip } from "../lib/stockingZip.js";

const products = Array.from({ length: 12 }, (_, i) => ({ name: `Gift ${i}`, code: `00Ab-${i}`, category: "StockingStuffer", active: "YES", imageUrl: `https://example.com/${i}.png`, price: "2.22", currency: "EUR" }));

test("carousels contain nine distinct valid gifts and English stocking/catalogue prompts", () => {
  for (const count of [1, 2, 4, 8]) {
    const videos = generateStockingVideos(products, count);
    assert.equal(videos.length, count);
    assert.equal(new Set(videos.map(v => v.coverThemeId)).size, count);
    if (count === 8) assert.deepEqual(videos.map(v => v.coverThemeId).sort(), CHRISTMAS_COVER_THEMES.map(t => t.id).sort());
    for (const video of videos) {
      assert.deepEqual(video.slides.map(slide => slide.length), [3, 3, 3]);
      assert.equal(new Set(video.slides.flat().map(p => p.code)).size, 9);
      const result = createStockingPrompts(video);
      assert.equal(result.prompts.length, 4);
      assert.ok(result.coverPrompt.includes(CHRISTMAS_COVER_THEMES.find(t => t.id === video.coverThemeId).title));
      video.slides.forEach((slide, i) => slide.forEach(p => {
        assert.ok(result.prompts[i].includes(`Exact search code: ${p.code}`));
        assert.ok(result.prompts[i].includes(`Exact price: ${p.price} | Currency: ${p.currency}`));
      }));
    }
  }
});

test("invalid, duplicate, inactive and incomplete products cannot fill the carousel", () => {
  assert.throws(() => generateStockingVideos(products, 3));
  const eight = products.slice(0, 8);
  for (const extra of [{ ...products[8], active: "NO" }, { ...products[8], price: "" }, { ...products[8], currency: "" }, { ...products[8], category: "BooBasket" }, { ...products[0], code: "00ab-0" }]) {
    assert.throws(() => generateStockingVideos([...eight, extra]), /at least 9/);
  }
});

test("ZIP includes three actual references per page and a separate cover", async () => {
  const videos = generateStockingVideos(products).map(v => ({ ...v, ...createStockingPrompts(v) }));
  const fetchImage = async () => new Response(new Uint8Array([1, 2, 3]), { headers: { "Content-Type": "image/png" } });
  const blob = await createStockingZip(videos, () => {}, fetchImage);
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  for (let i = 1; i <= 3; i++) {
    const base = `VIDEO 1/IMAGE ${i}/`;
    const manifest = JSON.parse(await zip.file(`${base}PRODUCTS.json`).async("string"));
    assert.equal(manifest.length, 3);
    for (const item of manifest) {
      assert.equal(item.price, "2.22");
      assert.equal(item.currency, "EUR");
      assert.ok(zip.file(base + item.filename));
    }
  }
  assert.equal(await zip.file("VIDEO 1/COVER/PROMPT.txt").async("string"), videos[0].coverPrompt);
  await assert.rejects(createStockingZip(videos, () => {}, async () => new Response("missing", { status: 404 })));
});

test("original stocking cover is theme eight and product pages remain theme independent", () => {
  assert.equal(CHRISTMAS_COVER_THEMES[7].id, "stocking-stuffers");
  const video = generateStockingVideos(products)[0];
  const results = CHRISTMAS_COVER_THEMES.map(t => createStockingPrompts({...video, coverThemeId: t.id}));
  assert.match(results[7].coverPrompt, /ONE simple oatmeal knitted Christmas stocking/);
  for (const result of results) assert.deepEqual(result.prompts.slice(0,3), results[0].prompts.slice(0,3));
});
