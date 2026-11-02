import { CHRISTMAS_COVER_THEMES } from "./stockingPrompts.js";

export const STOCKING_VIDEO_COUNTS = [1, 2, 4, 8];

export function generateStockingVideos(products, videoCount = 1) {
  if (!STOCKING_VIDEO_COUNTS.includes(videoCount)) throw new Error("Choose 1, 2, 4 or 8 carousels.");
  const unique = new Map();
  for (const product of products) {
    const code = String(product.code || "").trim();
    if (product.category !== "StockingStuffer" || String(product.active).trim().toUpperCase() !== "YES") continue;
    if (!code || !String(product.name || "").trim() || !/^https?:\/\//i.test(product.imageUrl || "") || !String(product.price ?? "").trim() || !String(product.currency || "").trim()) continue;
    if (!unique.has(code.toLowerCase())) unique.set(code.toLowerCase(), { ...product, code });
  }
  const pool = [...unique.values()];
  if (pool.length < 9) throw new Error(`Found ${pool.length} valid active StockingStuffer products. Add at least 9 with name, code, image URL, price and currency.`);
  const coverThemes = [...CHRISTMAS_COVER_THEMES];
  for (let i = coverThemes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [coverThemes[i], coverThemes[j]] = [coverThemes[j], coverThemes[i]];
  }
  return Array.from({ length: videoCount }, (_, index) => {
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return { videoNumber: index + 1, coverThemeId: coverThemes[index].id, slides: [shuffled.slice(0, 3), shuffled.slice(3, 6), shuffled.slice(6, 9)] };
  });
}
