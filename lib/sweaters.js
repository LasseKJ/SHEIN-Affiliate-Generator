import { getClothingProduct } from "./googleSheetsClothing";

const ALLOWED_VIDEO_COUNTS = [1, 2, 4, 8];
const SWEATERS_PER_VIDEO = 4;

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

async function getUniqueSweaters() {
  const products = [];
  const usedCodes = new Set();

  for (let attempt = 0; attempt < 120 && products.length < SWEATERS_PER_VIDEO; attempt++) {
    const product = await getClothingProduct("Sweaters");
    if (!product?.code) continue;
    const code = normalize(product.code);
    if (usedCodes.has(code)) continue;
    usedCodes.add(code);
    products.push(product);
  }

  if (products.length !== SWEATERS_PER_VIDEO) {
    throw new Error("Der skal være mindst 4 forskellige aktive produkter i kategorien Sweaters i Google Sheet.");
  }

  return products;
}

export async function generateSweaterVideos(videoCount = 1) {
  const count = Number(videoCount);
  if (!ALLOWED_VIDEO_COUNTS.includes(count)) {
    throw new Error("Antallet af videoer skal være 1, 2, 4 eller 8.");
  }

  const videos = [];
  for (let index = 0; index < count; index++) {
    const sweaters = await getUniqueSweaters();
    videos.push({ videoNumber: index + 1, sweaters });
  }
  return videos;
}
