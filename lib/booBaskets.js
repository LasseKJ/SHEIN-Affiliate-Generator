export const BOO_BASKET_VIDEO_COUNTS = [1, 2, 4, 8];
export const GRID_PRODUCTS_PER_SLIDE = 9;
export const PRODUCTS_PER_SLIDE = GRID_PRODUCTS_PER_SLIDE + 1;
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
  const uniqueBaskets = new Map();
  for (const product of products) {
    const code = String(product.code || "").trim();
    const imageUrl = String(product.imageUrl || "").trim();
    if (!["BooBasket", "BooBasketBasket"].includes(product.category) || String(product.active).trim().toUpperCase() !== "YES") continue;
    if (!code || !/^https?:\/\//i.test(imageUrl)) continue;
    const key = code.toLowerCase();
    const target = product.category === "BooBasketBasket" ? uniqueBaskets : unique;
    if (!target.has(key)) target.set(key, { ...product, code, imageUrl });
  }
  // A basket reference must never also occupy one of the nine grid positions.
  const pool = [...unique.values()].filter(product => !uniqueBaskets.has(product.code.toLowerCase()));
  const baskets = [...uniqueBaskets.values()];
  if (pool.length < GRID_PRODUCTS_PER_SLIDE) {
    throw new Error(`Der er kun ${pool.length} forskellige aktive BooBasket produkter med produktkode og billed-URL. Der skal bruges mindst 9.`);
  }

  if (!baskets.length) {
    throw new Error("Der skal være mindst 1 aktiv BooBasketBasket kurv med produktkode og billed-URL i Google Sheet.");
  }

  return Array.from({ length: videoCount }, (_, videoIndex) => {
    const used = new Set();
    const slides = Array.from({ length: PRODUCT_SLIDES_PER_VIDEO }, () => {
      // Prefer unused products across the video; reuse only between slides when necessary.
      const unused = shuffle(pool.filter((product) => !used.has(product.code)));
      const reused = shuffle(pool.filter((product) => used.has(product.code)));
      const slide = [...unused, ...reused].slice(0, GRID_PRODUCTS_PER_SLIDE);
      slide.forEach((product) => used.add(product.code));
      return [...slide, shuffle(baskets)[0]];
    });
    return { videoNumber: videoIndex + 1, slides };
  });
}
