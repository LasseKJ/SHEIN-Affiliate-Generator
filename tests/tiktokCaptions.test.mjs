import test from "node:test";
import assert from "node:assert/strict";
import { CAPTION_PREFIX, CAPTION_PROFILES, createTikTokCaptions, formatTikTokCaptions, addTikTokCaptionsToZip } from "../lib/tiktokCaptions.js";
import JSZip from "jszip";
import { createChatGPTZip } from "../lib/chatGPTExport.js";
import { createDressZip } from "../lib/dressZip.js";
import { createBooBasketZip } from "../lib/booBasketZip.js";
import { createStockingZip } from "../lib/stockingZip.js";

for (const category of Object.keys(CAPTION_PROFILES)) {
  test(`${category}: correct counts, English Shein titles, fixed prefix and bounded captions`, () => {
    for (const count of [0, 1, 2, 4, 7, 8, 16, 32]) {
      const videos = Array.from({ length: count }, (_, i) => ({ videoNumber: i + 1 }));
      const captions = createTikTokCaptions(category, videos);
      assert.equal(captions.length, count);
      assert.equal(new Set(captions.map(item => item.title)).size, count);
      assert.equal(new Set(captions.map(item => item.description)).size, count);
      assert.deepEqual(createTikTokCaptions(category, videos), captions, "rerenders and downloads must agree");
      for (const [index, caption] of captions.entries()) {
        assert.equal(caption.videoNumber, index + 1);
        if (category === "squishy") {
          assert.ok(caption.title.startsWith("Squishies from shein "));
          assert.match(caption.title, /\p{Extended_Pictographic}/u);
        } else {
          assert.match(caption.title, /Shein/);
        }
        assert.ok(caption.description.startsWith(CAPTION_PREFIX));
        const tags = caption.description.match(/#\w+/g);
        assert.ok(caption.title.length <= 29);
        assert.ok(caption.description.length <= 70);
        assert.ok(tags.length >= 2);
        assert.equal(new Set(tags).size, tags.length);
        assert.ok(tags.every(tag => ["Shein", "SheinFinds", ...CAPTION_PROFILES[category].tags].includes(tag.slice(1))));
      }
    }
  });
}

test("Essentials captions match the actual selected categories", () => {
  for (const [key, word, tag] of [["Makeup", "Makeup", "MakeupFinds"], ["Cases", "Cases", "CuteCases"], ["MakeupStorage", "Makeup Storage", "MakeupStorage"], ["Hair", "Hair", "HairAccessories"], ["HomeDecor", "Home Decor", "HomeDecor"], ["VanityExtras", "Vanity", "VanityFinds"], ["Kitchen", "Kitchen", "KitchenFinds"], ["Bath", "Bath", "BathroomFinds"]]) {
    const [caption] = createTikTokCaptions("essentials", [{ slides: [{ category: `Essentials-${key}` }] }]);
    assert.ok(caption.title.includes(word));
    assert.ok(caption.description.includes(`#${tag}`));
  }
  const mixed = createTikTokCaptions("essentials", Array.from({length:16}, () => ({ categories: ["Essentials-Hair", "Essentials-Kitchen", "Essentials-Bath"] })));
  assert.equal(new Set(mixed.map(item => item.description)).size, 16);
  assert.ok(mixed.every(item => item.title.length <= 29 && item.description.length <= 70));
});

test("ZIP captions and TXT formatting match the website including video numbering", () => {
  const videos = [{ videoNumber: 7 }, { videoNumber: 12 }];
  const captions = createTikTokCaptions("squishy", videos);
  const files = new Map();
  addTikTokCaptionsToZip({ file: (path, text) => files.set(path, text) }, "squishy", videos);
  assert.equal(files.get("TIKTOK-CAPTIONS.txt"), formatTikTokCaptions(captions));
  for (const caption of captions) {
    assert.equal(files.get(`VIDEO ${caption.videoNumber}/TIKTOK.txt`), `${caption.title}\n${caption.description}`);
  }
  assert.throws(() => createTikTokCaptions("missing", [{}]), /Unknown caption category/);
});

test("all ZIP download paths include the same video captions shown on the page", async () => {
  const product = { name: "Gift", code: "ABC123", imageUrl: "https://example.com/item.png", currency: "EUR", price: "2.00" };
  const fetchImage = async () => new Response(new Uint8Array([1, 2, 3]), { headers: { "Content-Type": "image/png" } });
  const images = [{ folder: "COVER", products: [], prompt: "cover" }, { folder: "IMAGE 1", products: [product], prompt: "product" }];
  const fixtures = [
    ["squishy", { groups: Array.from({ length: 3 }, () => ({ products: [product] })), prompts: ["one", "two", "three", "cover"] }, (videos) => createChatGPTZip("squishy", videos, () => {}, { image: product.imageUrl, cover: product.imageUrl }, fetchImage)],
    ["christmas-wishlist", { images }, (videos) => createChatGPTZip("christmas-wishlist", videos, () => {}, {}, fetchImage)],
    ["dresses", { images }, (videos) => createDressZip(videos, () => {}, fetchImage)],
    ["boo-basket", { slides: [[product], [product], [product]], prompts: ["one", "two", "three", "cover"] }, (videos) => createBooBasketZip(videos, () => {}, fetchImage)],
    ["stocking", { slides: [[product], [product], [product]], prompts: ["one", "two", "three", "cover"] }, (videos) => createStockingZip(videos, () => {}, fetchImage)],
  ];
  for (const [category, fixture, build] of fixtures) {
    const videos = Array.from({ length: category === "squishy" ? 16 : 2 }, (_, index) => ({ ...fixture, videoNumber: index + 1 }));
    const captions = createTikTokCaptions(category, videos);
    const zip = await JSZip.loadAsync(await (await build(videos)).arrayBuffer());
    assert.equal(await zip.file("TIKTOK-CAPTIONS.txt").async("string"), formatTikTokCaptions(captions));
    if (category === "squishy") {
      const master = await zip.file("MASTER-PROMPT.txt").async("string");
      assert.match(master, /Title må højst være 29 tegn/);
      assert.match(master, /Text må højst være 70 tegn i alt inklusive mellemrum, tegn og hashtags/);
      assert.match(master, /Tæl længden af de endelige CSV feltværdier før levering/);
      assert.doesNotMatch(master, /præcis fem hashtags/);
    }
    for (const caption of captions) assert.equal(await zip.file(`VIDEO ${caption.videoNumber}/TIKTOK.txt`).async("string"), `${caption.title}\n${caption.description}`);
  }
});
