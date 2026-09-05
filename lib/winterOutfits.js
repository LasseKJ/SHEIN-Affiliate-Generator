import {
  getClothingProduct
} from "./googleSheetsClothing";

function productAlreadyUsed(
  usedProducts,
  product
) {
  return usedProducts.has(
    product.code
  );
}

async function getNewProduct(
  category,
  usedProducts
) {
  const maxAttempts = 50;

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt++
  ) {
    const product =
      await getClothingProduct(
        category
      );

    if (
      product?.code &&
      !productAlreadyUsed(
        usedProducts,
        product
      )
    ) {
      usedProducts.add(
        product.code
      );

      return product;
    }
  }

  throw new Error(
    `Kunne ikke finde et unikt produkt i kategorien ${category}. Sørg for, at der findes mindst 3 aktive produkter i denne kategori.`
  );
}

async function createWinterOutfit(
  usedProducts
) {
  const outfit = {};

  outfit.shoe =
    await getNewProduct(
      "WinterShoe",
      usedProducts
    );

  outfit.top =
    await getNewProduct(
      "WinterTop",
      usedProducts
    );

  outfit.bottom =
    await getNewProduct(
      "WinterBottom",
      usedProducts
    );

  outfit.accessory =
    await getNewProduct(
      "WinterAccessories",
      usedProducts
    );

  return outfit;
}

export async function generateWinterOutfits() {
  const outfits = [];

  const usedProducts =
    new Set();

  for (
    let index = 0;
    index < 3;
    index++
  ) {
    const outfit =
      await createWinterOutfit(
        usedProducts
      );

    outfits.push(
      outfit
    );
  }

  return outfits;
}
