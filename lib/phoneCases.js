import { getClothingProduct } from "./googleSheetsClothing";

const ALLOWED_VIDEO_COUNTS = [1, 2, 4, 8];
const CASES_PER_SLIDE = 6;
const SLIDES_PER_VIDEO = 4;
const CASES_PER_VIDEO = CASES_PER_SLIDE * SLIDES_PER_VIDEO;

async function getUniquePhoneCases() {
  const products = [];
  const usedCodes = new Set();
  const maxAttempts = 240;

  for (let attempt = 0; attempt < maxAttempts && products.length < CASES_PER_VIDEO; attempt++) {
    const product = await getClothingProduct("PhoneCase");
    if (!product?.code) continue;
    const normalizedCode = String(product.code).trim().toLowerCase();
    if (usedCodes.has(normalizedCode)) continue;
    usedCodes.add(normalizedCode);
    products.push(product);
  }

  if (products.length !== CASES_PER_VIDEO) {
    throw new Error(`Kunne ikke finde ${CASES_PER_VIDEO} forskellige aktive PhoneCase produkter. Der skal være mindst ${CASES_PER_VIDEO} aktive PhoneCase produkter i Google Sheet.`);
  }

  return products;
}

export async function generatePhoneCaseVideos(videoCount = 1) {
  const count = Number(videoCount);
  if (!ALLOWED_VIDEO_COUNTS.includes(count)) {
    throw new Error("Antallet af videoer skal være 1, 2, 4 eller 8.");
  }

  const videos = [];
  for (let videoIndex = 0; videoIndex < count; videoIndex++) {
    const cases = await getUniquePhoneCases();
    const slides = [];

    for (let slideIndex = 0; slideIndex < SLIDES_PER_VIDEO; slideIndex++) {
      const start = slideIndex * CASES_PER_SLIDE;
      slides.push(cases.slice(start, start + CASES_PER_SLIDE));
    }

    videos.push({ videoNumber: videoIndex + 1, cases, slides });
  }

  return videos;
}
