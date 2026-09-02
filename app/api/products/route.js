const COVER_TEMPLATE_URL = process.env.TEMPLATE_COVER_URL;
const IMAGE_TEMPLATE_URL = process.env.TEMPLATE_IMAGE_URL;

export const COVER_TEMPLATE = {
  url: COVER_TEMPLATE_URL,
  productSlots: [1, 2, 3]
};

export const IMAGE_TEMPLATE = {
  url: IMAGE_TEMPLATE_URL,
  productSlots: [1, 2, 3]
};

export function getTemplateSet(products) {
  if (!products || products.length !== 9) {
    throw new Error("Der skal bruges præcis 9 produkter.");
  }

  return {
    cover: {
      templateUrl: COVER_TEMPLATE_URL,
      products: products.slice(0, 3)
    },

    images: [
      {
        templateUrl: IMAGE_TEMPLATE_URL,
        products: products.slice(0, 3)
      },
      {
        templateUrl: IMAGE_TEMPLATE_URL,
        products: products.slice(3, 6)
      },
      {
        templateUrl: IMAGE_TEMPLATE_URL,
        products: products.slice(6, 9)
      }
    ]
  };
}
