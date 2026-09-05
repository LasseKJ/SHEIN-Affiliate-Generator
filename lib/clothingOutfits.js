import {
  getClothingProduct
} from "./googleSheetsClothing";

export async function generateAutumnOutfit() {
  const [
    shoe,
    top,
    bottom,
    accessory
  ] = await Promise.all([
    getClothingProduct(
      "AutumnShoe"
    ),

    getClothingProduct(
      "AutumnTop"
    ),

    getClothingProduct(
      "AutumnBottom"
    ),

    getClothingProduct(
      "AutumnAccessories"
    )
  ]);

  return {
    shoe,
    top,
    bottom,
    accessory
  };
}
