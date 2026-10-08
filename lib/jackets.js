import { getClothingProduct } from "./googleSheetsClothing";

const ALLOWED_VIDEO_COUNTS = [1, 2, 4, 8];
const JACKETS_PER_VIDEO = 4;

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

async function getUniqueJackets() {
  const products = [];
  const usedCodes = new Set();

  for (let attempt = 0; attempt < 120 && products.length < JACKETS_PER_VIDEO; attempt++) {
    const product = await getClothingProduct("Jacket");
    if (!product?.code || product.category !== "Jacket") continue;
    const code = normalize(product.code);
    if (usedCodes.has(code)) continue;
    usedCodes.add(code);
    products.push(product);
  }

  if (products.length !== JACKETS_PER_VIDEO) {
    throw new Error("Der skal være mindst 4 forskellige aktive produkter i kategorien Jacket i Google Sheet.");
  }

  return products;
}

export async function generateJacketVideos(videoCount = 1) {
  const count = Number(videoCount);
  if (!ALLOWED_VIDEO_COUNTS.includes(count)) {
    throw new Error("Antallet af videoer skal være 1, 2, 4 eller 8.");
  }

  const videos = [];
  for (let index = 0; index < count; index++) {
    const jackets = await getUniqueJackets();
    videos.push({ videoNumber: index + 1, jackets });
  }
  return videos;
}
