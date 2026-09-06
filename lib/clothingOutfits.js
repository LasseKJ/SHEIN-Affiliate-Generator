import { getClothingProduct } from "./googleSheetsClothing";

const ALLOWED_VIDEO_COUNTS = [1, 2, 4, 8];

async function getUniqueProducts(category, count, usedProducts) {
  const products = [];
  const maxAttempts = count * 50;
  for (let attempt = 0; attempt < maxAttempts && products.length < count; attempt++) {
    const product = await getClothingProduct(category);
    if (!product?.code || usedProducts.has(product.code) || products.some((item) => item.code === product.code)) continue;
    products.push(product);
    usedProducts.add(product.code);
  }
  if (products.length !== count) throw new Error(`Kunne ikke finde ${count} forskellige produkter i kategorien ${category}. Sørg for, at der findes mindst ${count} aktive produkter i denne kategori.`);
  return products;
}

async function createSeasonVideos(season, videoCount) {
  if (!ALLOWED_VIDEO_COUNTS.includes(videoCount)) throw new Error("Antallet af videoer skal være 1, 2, 4 eller 8.");
  const totalOutfits = videoCount * 3;
  const usedProducts = new Set();
  const [shoes, tops, bottoms, accessories] = await Promise.all([
    getUniqueProducts(`$__SEASON__Shoe`, totalOutfits, usedProducts),
    getUniqueProducts(`$__SEASON__Top`, totalOutfits, usedProducts),
    getUniqueProducts(`$__SEASON__Bottom`, totalOutfits, usedProducts),
    getUniqueProducts(`$__SEASON__Accessories`, totalOutfits, usedProducts)
  ]);
  return Array.from({ length: videoCount }, (_, videoIndex) => ({
    videoNumber: videoIndex + 1,
    outfits: Array.from({ length: 3 }, (_, outfitIndex) => {
      const i = videoIndex * 3 + outfitIndex;
      return { shoe: shoes[i], top: tops[i], bottom: bottoms[i], accessory: accessories[i] };
    })
  }));
}

export async function generateAutumnVideos(videoCount) { return createSeasonVideos("Autumn", videoCount); }
export async function generateAutumnOutfits() { return (await generateAutumnVideos(1))[0].outfits; }
