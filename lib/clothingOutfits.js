import {
  getClothingProduct
} from "./googleSheetsClothing";

const ALLOWED_VIDEO_COUNTS = [
  1,
  2,
  4,
  8
];

async function getThreeUniqueProducts(category) {
  const products = [];
  const usedCodes = new Set();
  const maxAttempts = 60;

  for (
    let attempt = 0;
    attempt < maxAttempts && products.length < 3;
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

  if (products.length !== 3) {
    throw new Error(
      `Kunne ikke finde 3 forskellige produkter i kategorien ${category}. Sørg for, at der findes mindst 3 aktive produkter i denne kategori.`
    );
  }

  return products;
}

async function createSingleVideo() {
  const shoes =
    await getThreeUniqueProducts(
      "AutumnShoe"
    );

  const tops =
    await getThreeUniqueProducts(
      "AutumnTop"
    );

  const bottoms =
    await getThreeUniqueProducts(
      "AutumnBottom"
    );

  const accessories =
    await getThreeUniqueProducts(
      "AutumnAccessories"
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
    {
      shoe: shoes[2],
      top: tops[2],
      bottom: bottoms[2],
      accessory: accessories[2]
    }
  ];
}

export async function generateAutumnVideos(
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

export async function generateAutumnOutfits() {
  const videos =
    await generateAutumnVideos(1);

  return videos[0].outfits;
}