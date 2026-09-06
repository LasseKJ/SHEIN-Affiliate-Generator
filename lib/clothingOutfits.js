import {
  getClothingProduct
} from "./googleSheetsClothing";

const ALLOWED_VIDEO_COUNTS = [
  1,
  2,
  4,
  8
];

async function getUniqueProducts(
  category,
  count,
  usedProducts
) {
  const products = [];

  const maxAttempts =
    count * 50;

  for (
    let attempt = 0;
    attempt < maxAttempts &&
    products.length < count;
    attempt++
  ) {
    const product =
      await getClothingProduct(
        category
      );

    if (
      !product?.code
    ) {
      continue;
    }

    if (
      usedProducts.has(
        product.code
      )
    ) {
      continue;
    }

    if (
      products.some(
        (item) =>
          item.code ===
          product.code
      )
    ) {
      continue;
    }

    products.push(
      product
    );

    usedProducts.add(
      product.code
    );
  }

  if (
    products.length !==
    count
  ) {
    throw new Error(
      `Kunne ikke finde ${count} forskellige produkter i kategorien ${category}. Sørg for, at der findes mindst ${count} aktive produkter i denne kategori.`
    );
  }

  return products;
}

async function createSeasonVideos(
  season,
  videoCount
) {
  if (
    !ALLOWED_VIDEO_COUNTS.includes(
      videoCount
    )
  ) {
    throw new Error(
      "Antallet af videoer skal være 1, 2, 4 eller 8."
    );
  }

  const totalOutfits =
    videoCount * 3;

  const usedProducts =
    new Set();

  const shoeCategory =
    `${season}Shoe`;

  const topCategory =
    `${season}Top`;

  const bottomCategory =
    `${season}Bottom`;

  const accessoryCategory =
    `${season}Accessories`;

  const [
    shoes,
    tops,
    bottoms,
    accessories
  ] = await Promise.all([
    getUniqueProducts(
      shoeCategory,
      totalOutfits,
      usedProducts
    ),

    getUniqueProducts(
      topCategory,
      totalOutfits,
      usedProducts
    ),

    getUniqueProducts(
      bottomCategory,
      totalOutfits,
      usedProducts
    ),

    getUniqueProducts(
      accessoryCategory,
      totalOutfits,
      usedProducts
    )
  ]);

  const videos = [];

  for (
    let videoIndex = 0;
    videoIndex <
    videoCount;
    videoIndex++
  ) {
    const outfits = [];

    for (
      let outfitIndex = 0;
      outfitIndex < 3;
      outfitIndex++
    ) {
      const productIndex =
        videoIndex * 3 +
        outfitIndex;

      outfits.push({
        shoe:
          shoes[
            productIndex
          ],

        top:
          tops[
            productIndex
          ],

        bottom:
          bottoms[
            productIndex
          ],

        accessory:
          accessories[
            productIndex
          ]
      });
    }

    videos.push(
      {
        videoNumber:
          videoIndex + 1,

        outfits
      }
    );
  }

  return videos;
}

export async function generateAutumnVideos(
  videoCount
) {
  return createSeasonVideos(
    "Autumn",
    videoCount
  );
}

export async function generateAutumnOutfits() {
  const videos =
    await generateAutumnVideos(
      1
    );

  return videos[0].outfits;
}
