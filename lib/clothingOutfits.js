import {
  getClothingProduct
} from "./googleSheetsClothing";

async function getThreeUniqueProducts(
  category
) {
  const maxAttempts = 20;

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt++
  ) {
    const products =
      await Promise.all([
        getClothingProduct(category),
        getClothingProduct(category),
        getClothingProduct(category)
      ]);

    const uniqueProducts =
      products.filter(
        (product, index, array) => {
          return (
            product?.code &&
            array.findIndex(
              (item) =>
                item?.code ===
                product.code
            ) === index
          );
        }
      );

    if (
      uniqueProducts.length === 3
    ) {
      return uniqueProducts;
    }
  }

  throw new Error(
    `Kunne ikke finde 3 forskellige produkter i kategorien ${category}. Sørg for, at der findes mindst 3 aktive produkter i denne kategori.`
  );
}

async function createOutfits(
  season
) {
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
    getThreeUniqueProducts(
      shoeCategory
    ),

    getThreeUniqueProducts(
      topCategory
    ),

    getThreeUniqueProducts(
      bottomCategory
    ),

    getThreeUniqueProducts(
      accessoryCategory
    )
  ]);

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

export async function generateAutumnOutfits() {
  return createOutfits("Autumn");
}
