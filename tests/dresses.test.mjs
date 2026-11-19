import test from "node:test";
import assert from "node:assert/strict";
import { generateDressVideos, createDressPromptFiles } from "../lib/dressPrompts.js";
const products = codes => codes.map(code => ({ code, imageUrl: "https://example.com/" + code }));
test("cover headline agrees with master and individual slides keep code-only text", () => {
  const videos = generateDressVideos(products(["A", "B", "C"]), 2);
  const files = createDressPromptFiles(videos);
  assert.match(files.master, /Shein Dresses/);
  assert.match(files.master, /\+ Codes/);
  for (const { images } of videos) {
    assert.equal(images.length, 4);
    assert.match(images[0].prompt, /"Shein Dresses"/);
    assert.match(images[0].prompt, /"\+ Codes"/);
    for (const slide of images.slice(1)) {
      assert.doesNotMatch(slide.prompt, /Shein Dresses/);
      assert.match(slide.prompt, /only text allowed/);
      assert.match(slide.prompt, new RegExp(slide.products[0].code));
    }
  }
  assert.equal((files.all.match(/→ v\d+\/v\d+-\d+\.png/g) || []).length, 8);
});
test("exclusive codes never share a video, including wraparound and either spelling", () => {
  for (const code of ["775P84R", "775P86R", " 775p84r "]) {
    for (let run = 0; run < 100; run++) {
      for (const { images } of generateDressVideos(products([code, "EEVATZ9", "A", "B", "C"]), 8)) {
        const codes = images[0].products.map(p => p.code);
        assert.equal(codes.length, 3);
        assert.equal(new Set(codes).size, 3);
        assert.ok(!(codes.includes(code) && codes.includes("EEVATZ9")));
        assert.deepEqual(images.slice(1).map(i => i.products[0].code), codes);
      }
    }
  }
});
test("tries another group when the first starting product cannot fit", () => {
  const videos = generateDressVideos(products(["EEVATZ9", "775P84R", "775P86R", "A"]), 8);
  for (const video of videos) assert.ok(!video.images[0].products.some(p => p.code === "EEVATZ9"));
});
test("fails clearly when no compatible triple exists", () => {
  assert.throws(() => generateDressVideos(products(["775P84R", "EEVATZ9", "A"]), 1), /ikke nok kompatible/);
  assert.throws(() => generateDressVideos(products(["A", "B"]), 1), /mindst tre/);
});
