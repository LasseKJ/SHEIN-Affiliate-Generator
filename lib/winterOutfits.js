import { VIDEO_COUNT_OPTIONS } from "./videoCount.js";
import {
  getClothingProduct
} from "./googleSheetsClothing";

const ALLOWED_VIDEO_COUNTS = VIDEO_COUNT_OPTIONS;

const WINTER_TOP_CATEGORIES = [
  "WinterTop",
  "WinterJacket",
  "WinterSweater"
];

async function getTwoUniqueProducts(categories) {
  const categoryList = Array.isArray(categories) ? categories : [categories];
  const products = [];
  const usedCodes = new Set();
  const maxAttempts = 60;

  for (
    let attempt = 0;
    attempt < maxAttempts && products.length < 2;
    attempt++
  ) {
    const category = categoryList[attempt % categoryList.length];
    let product;

    try {
      product = await getClothingProduct(category);
    } catch (error) {
      if (error.message?.includes("Der blev ikke fundet aktive produkter i kategorien")) {
        continue;
      }

      throw error;
    }

    if (!product?.code || usedCodes.has(product.code)) {
      continue;
    }

    usedCodes.add(product.code);
    products.push(product);
  }

  if (products.length !== 2) {
    throw new Error(
      `Kunne ikke finde 2 forskellige produkter i kategorierne ${categoryList.join(", ")}. Sørg for, at der findes mindst 2 aktive produkter i disse kategorier.`
    );
  }

  return products;
}
async function createSingleVideo(videoIndex) {
  const shoes =
    await getTwoUniqueProducts(
      "WinterShoe"
    );

  const topCategories = [
    WINTER_TOP_CATEGORIES[videoIndex % WINTER_TOP_CATEGORIES.length],
    WINTER_TOP_CATEGORIES[(videoIndex + 1) % WINTER_TOP_CATEGORIES.length]
  ];

  const tops =
    await getTwoUniqueProducts(topCategories);

  const bottoms =
    await getTwoUniqueProducts(
      "WinterBottom"
    );

  const accessories =
    await getTwoUniqueProducts(
      "WinterAccessories"
    );

  return [
    {
      shoe: shoes[0],
      top: tops[0],
      bottom: bottoms[0],
      accessory: accessories[0]
    },
    {
      shoe: shoes[1],
      top: tops[1],
      bottom: bottoms[1],
      accessory: accessories[1]
    },
  ];
}

export async function generateWinterVideos(
  videoCount = 1
) {
  const count = Number(videoCount);

  if (!ALLOWED_VIDEO_COUNTS.includes(count)) {
    throw new Error("Antallet af videoer skal være mellem 1 og 50.");
  }

  const videos = [];

  for (
    let videoIndex = 0;
    videoIndex < count;
    videoIndex++
  ) {
    const outfits =
      await createSingleVideo(videoIndex);

    videos.push({
      videoNumber: videoIndex + 1,
      outfits
    });
  }

  return videos;
}

export async function generateWinterOutfits() {
  const videos =
    await generateWinterVideos(1);

  return videos[0].outfits;
}
