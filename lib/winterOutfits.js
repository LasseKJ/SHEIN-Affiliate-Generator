import {
  getClothingProduct
} from "./googleSheetsClothing";

const ALLOWED_VIDEO_COUNTS = [
  1,
  2,
  4,
  8
];

async function getTwoUniqueProducts(category) {
  const products = [];
  const usedCodes = new Set();
  const maxAttempts = 60;

  for (
    let attempt = 0;
    attempt < maxAttempts && products.length < 2;
    attempt++
  ) {
    const product =
      await getClothingProduct(category);

    if (!product?.code) {
      continue;
    }

    if (usedCodes.has(product.code)) {
      continue;
    }

    usedCodes.add(product.code);
    products.push(product);
  }

  if (products.length !== 2) {
    throw new Error(
      `Kunne ikke finde 2 forskellige produkter i kategorien ${category}. Sørg for, at der findes mindst 2 aktive produkter i denne kategori.`
    );
  }

  return products;
}

async function createSingleVideo() {
  const shoes =
    await getTwoUniqueProducts(
      "WinterShoe"
    );

  const tops =
    await getTwoUniqueProducts(
      "WinterTop"
    );

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
    throw new Error(
      "Antallet af videoer skal være 1, 2, 4 eller 8."
    );
  }

  const videos = [];

  for (
    let videoIndex = 0;
    videoIndex < count;
    videoIndex++
  ) {
    const outfits =
      await createSingleVideo();

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