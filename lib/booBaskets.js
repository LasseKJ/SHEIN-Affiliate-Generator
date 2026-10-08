export const BOO_BASKET_VIDEO_COUNTS = [1, 2, 4, 8];
export const PRODUCTS_PER_SLIDE = 9;
export const PRODUCT_SLIDES_PER_VIDEO = 3;

function shuffle(products) {
  const result = [...products];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateBooBasketVideos(products, videoCount = 1) {
  if (!BOO_BASKET_VIDEO_COUNTS.includes(videoCount)) {
    throw new Error("Antallet af videoer skal være 1, 2, 4 eller 8.");
  }

  const unique = new Map();
  for (const product of products) {
    const code = String(product.code || "").trim();
    const imageUrl = String(product.imageUrl || "").trim();
    if (product.category !== "BooBasket" || String(product.active).trim().toUpperCase() !== "YES") continue;
    if (!code || !/^https?:\/\//i.test(imageUrl)) continue;
    const key = code.toLowerCase();
    if (!unique.has(key)) unique.set(key, { ...product, code, imageUrl });
  }
  const pool = [...unique.values()];
  if (pool.length < PRODUCTS_PER_SLIDE) {
    throw new Error(`Der er kun ${pool.length} forskellige aktive BooBasket produkter med produktkode og billed-URL. Der skal bruges mindst 9.`);
  }

  return Array.from({ length: videoCount }, (_, videoIndex) => {
    const used = new Set();
    const slides = Array.from({ length: PRODUCT_SLIDES_PER_VIDEO }, () => {
      // Prefer unused products across the video; reuse only between slides when necessary.
      const unused = shuffle(pool.filter((product) => !used.has(product.code)));
      const reused = shuffle(pool.filter((product) => used.has(product.code)));
      const slide = [...unused, ...reused].slice(0, PRODUCTS_PER_SLIDE);
      slide.forEach((product) => used.add(product.code));
      return slide;
    });
    return { videoNumber: videoIndex + 1, slides };
  });
}
