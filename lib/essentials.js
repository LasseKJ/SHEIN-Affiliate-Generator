import { getClothingProduct } from "./googleSheetsClothing";

export const ESSENTIALS_CATEGORIES = [
  "Essentials-Makeup",
  "Essentials-Cases",
  "Essentials-MakeupStorage",
  "Essentials-Hair",
  "Essentials-HomeDecor",
  "Essentials-VanityExtras",
  "Essentials-Kitchen",
  "Essentials-Bath"
];

const ALLOWED_VIDEO_COUNTS = [1, 2, 4, 8];
const PRODUCTS_PER_SLIDE = 6;

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

async function getUniqueProducts(category) {
  const products = [];
  const usedCodes = new Set();
  const maxAttempts = 120;

  for (
    let attempt = 0;
    attempt < maxAttempts && products.length < PRODUCTS_PER_SLIDE;
    attempt++
  ) {
    const product = await getClothingProduct(category);

    if (!product?.code) continue;

    const code = normalize(product.code);

    if (usedCodes.has(code)) continue;

    usedCodes.add(code);
    products.push(product);
  }

  if (products.length !== PRODUCTS_PER_SLIDE) {
    throw new Error(
      `Kunne ikke finde ${PRODUCTS_PER_SLIDE} forskellige aktive produkter i kategorien ${category}. Der skal være mindst ${PRODUCTS_PER_SLIDE} aktive produkter i Google Sheet.`
    );
  }

  return products;
}

export async function generateEssentialsVideos(
  videoCount = 1,
  selectedCategories = [],
  categoryUsage = {}
) {
  const count = Number(videoCount);

  if (!ALLOWED_VIDEO_COUNTS.includes(count)) {
    throw new Error("Antallet af videoer skal være 1, 2, 4 eller 8.");
  }

  const usage = Object.fromEntries(
    ESSENTIALS_CATEGORIES.map((category) => [
      category,
      Math.max(0, Number(categoryUsage?.[category] || 0))
    ])
  );

  const videos = [];

  for (let videoIndex = 0; videoIndex < count; videoIndex++) {
    let categories;

    if (Array.isArray(selectedCategories) && selectedCategories.length === 3) {
      categories = selectedCategories.map((category) => {
        const allowed = ESSENTIALS_CATEGORIES.find(
          (item) => normalize(item) === normalize(category)
        );

        if (!allowed) {
          throw new Error(`Ugyldig Essentials kategori: ${category}`);
        }

        return allowed;
      });

      if (new Set(categories.map(normalize)).size !== 3) {
        throw new Error("Du skal vælge 3 forskellige Essentials kategorier.");
      }
    } else {
      categories = pickBalancedCategories(usage);
    }

    categories.forEach((category) => {
      usage[category] += 1;
    });

    const slides = [];

    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
      const category = categories[categoryIndex];
      const products = await getUniqueProducts(category);

      slides.push({
        category,
        imageNumber: categoryIndex + 1,
        products
      });
    }

    videos.push({
      videoNumber: videoIndex + 1,
      categories,
      slides
    });
  }

  return videos;
}

function pickBalancedCategories(usage) {
  const sorted = [...ESSENTIALS_CATEGORIES].sort((a, b) => {
    const difference = usage[a] - usage[b];

    if (difference !== 0) return difference;

    return Math.random() - 0.5;
  });

  return sorted.slice(0, 3);
}
