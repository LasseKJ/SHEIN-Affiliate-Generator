import {
  getClothingProduct
} from "./googleSheetsClothing";

function hasDuplicateProduct(
  outfit,
  product
) {
  return Object.values(outfit).some(
    (existingProduct) =>
      existingProduct?.code &&
      existingProduct.code === product.code
  );
}

async function getUniqueProduct(
  category,
  existingOutfits
) {
  const maxAttempts = 20;

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt++
  ) {
    const product =
      await getClothingProduct(
        category
      );

    const alreadyUsed =
      existingOutfits.some(
        (outfit) =>
          hasDuplicateProduct(
            outfit,
            product
          )
      );

    if (!alreadyUsed) {
      return product;
    }
  }

  throw new Error(
    `Kunne ikke finde et nyt produkt i kategorien ${category}.`
  );
}

async function createOutfit(
  existingOutfits
) {
  const outfit = {};

  outfit.shoe =
    await getUniqueProduct(
      "AutumnShoe",
      existingOutfits
    );

  outfit.top =
    await getUniqueProduct(
      "AutumnTop",
      existingOutfits
    );

  outfit.bottom =
    await getUniqueProduct(
      "AutumnBottom",
      existingOutfits
    );

  outfit.accessory =
    await getUniqueProduct(
      "AutumnAccessories",
      existingOutfits
    );

  return outfit;
}

export async function generateAutumnOutfits() {
  const outfits = [];

  for (
    let index = 0;
    index < 3;
    index++
  ) {
    const outfit =
      await createOutfit(
        outfits
      );

    outfits.push(outfit);
  }

  return outfits;
}
