import test from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { generateBooBasketVideos } from "../lib/booBaskets.js";
import { createBooBasketPrompts } from "../lib/booBasketPrompts.js";
import { createBooBasketZip } from "../lib/booBasketZip.js";

const products = (count) => Array.from({ length: count }, (_, index) => ({
  name: `Item ${index}`, code: `00Ab-${index}`, category: "BooBasket", active: "YES", imageUrl: `https://example.com/${index}.png`
}));

test("1, 2, 4 and 8 videos each have three slides of nine unique products", () => {
  for (const count of [1, 2, 4, 8]) {
    for (const poolSize of [9, 10, 26, 27, 40]) {
      const videos = generateBooBasketVideos(products(poolSize), count);
      assert.equal(videos.length, count);
      videos.forEach((video, index) => {
        assert.equal(video.videoNumber, index + 1);
        assert.equal(video.slides.length, 3);
        for (const slide of video.slides) {
          assert.equal(slide.length, 9);
          assert.equal(new Set(slide.map((product) => product.code)).size, 9);
        }
        assert.equal(new Set(video.slides.flat().map((product) => product.code)).size, Math.min(poolSize, 27));
      });
    }
  }
});

test("invalid counts, missing images, inactive rows, wrong categories and duplicate codes cannot fill a slide", () => {
  for (const count of [0, 3, -1, 9, 1.5, "1", null]) assert.throws(() => generateBooBasketVideos(products(27), count), /1, 2, 4 eller 8/);
  const pool = products(8);
  const extra = products(9)[8];
  pool.push({ ...extra, active: "NO" }, { ...extra, category: "boobasket" }, { ...extra, imageUrl: "" }, { ...extra, code: "" }, { ...extra, imageUrl: "javascript:bad" });
  pool.push({ ...pool[0], code: ` ${pool[0].code.toLowerCase()} ` });
  assert.throws(() => generateBooBasketVideos(pool), /kun 8/);
});

test("prompts retain exact codes and reference order, with a separate cover", () => {
  const video = generateBooBasketVideos(products(27))[0];
  const result = createBooBasketPrompts(video);
  assert.equal(result.prompts.length, 4);
  assert.equal(result.prompts[3], result.coverPrompt);
  video.slides.forEach((slide, slideIndex) => {
    slide.forEach((product, index) => {
      assert.ok(result.prompts[slideIndex].includes(`reference B${slideIndex + 1}-P${String(index + 1).padStart(2, "0")} | Product: ${product.name} | Exact product code: ${product.code}`));
      assert.ok(!result.coverPrompt.includes(product.code));
    });
  });
});

test("ZIP groups nine actual image files, exact code mappings and prompts per image", async () => {
  const videos = generateBooBasketVideos(products(9), 2).map((video) => ({ ...video, ...createBooBasketPrompts(video) }));
  let downloads = 0;
  const blob = await createBooBasketZip(videos, () => {}, async () => {
    downloads++;
    return new Response(new Uint8Array([1, 2, 3]), { headers: { "Content-Type": "image/webp" } });
  });
  assert.equal(downloads, 9);
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  for (const video of videos) {
    for (let index = 0; index < 3; index++) {
      const base = `VIDEO ${video.videoNumber}/BILLEDE ${index + 1}/`;
      const manifest = JSON.parse(await zip.file(`${base}PRODUCTS.json`).async("string"));
      assert.equal(manifest.length, 9);
      assert.equal(Object.keys(zip.files).filter((path) => path.startsWith(base) && path.endsWith(".webp")).length, 9);
      for (const [productIndex, item] of manifest.entries()) {
        assert.equal(item.code, video.slides[index][productIndex].code);
        assert.deepEqual(await zip.file(base + item.filename).async("uint8array"), new Uint8Array([1, 2, 3]));
      }
      assert.equal(await zip.file(`${base}PROMPT.txt`).async("string"), video.prompts[index]);
    }
    assert.equal(await zip.file(`VIDEO ${video.videoNumber}/FORSIDE/PROMPT.txt`).async("string"), video.coverPrompt);
  }
});

test("ZIP rejects failed downloads and non-image responses instead of silently omitting references", async () => {
  const videos = generateBooBasketVideos(products(9)).map((video) => ({ ...video, ...createBooBasketPrompts(video) }));
  await assert.rejects(createBooBasketZip(videos, () => {}, async () => new Response("missing", { status: 404 })), /Kunne ikke hente/);
  await assert.rejects(createBooBasketZip(videos, () => {}, async () => new Response("<html>not an image</html>", { headers: { "Content-Type": "text/html" } })), /Ukendt billedformat/);
});
