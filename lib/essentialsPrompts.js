function productCode(product) {
  return product?.code || "";
}

function productName(product) {
  return product?.name || "";
}

function categoryLabel(category) {
  return String(category || "")
    .replace(/^Essentials-/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .trim();
}

function createProductList(products) {
  return products
    .map(
      (product, index) =>
        `Product ${index + 1}: ${productName(product)} | Product Code: ${productCode(product)}`
    )
    .join("\n");
}

export function createEssentialsSlidePrompt(slide) {
  const category = slide?.category || "";
  const products = slide?.products || [];
  const label = categoryLabel(category);

  return `
Create a vertical 9:16 clean editorial product showcase using the six uploaded SHEIN product references.

This image is for the Essentials category: ${label}.

Create exactly six individual products in one clean product showcase.

IMPORTANT:

Use all six uploaded product references.

Show exactly six products.

Do not add any extra products.

Do not remove any of the six products.

Keep all six products clearly visible and naturally separated.

The six products must look like real physical products photographed professionally.

Use a clean, premium Pinterest inspired editorial composition.

Arrange the six products in a balanced 2 by 3 composition within the vertical 9:16 image.

Each product should have enough white space around it.

Do not overlap the products.

Keep the products large enough to be clearly recognizable.

PRODUCT CODES:

Place the exact corresponding product code naturally above each product.

Use simple natural black typography.

Product 1 code:
${productCode(products[0])}

Product 2 code:
${productCode(products[1])}

Product 3 code:
${productCode(products[2])}

Product 4 code:
${productCode(products[3])}

Product 5 code:
${productCode(products[4])}

Product 6 code:
${productCode(products[5])}

Each code must correspond exactly to the product underneath it.

Do not invent product codes.

Do not change product codes.

Do not swap product codes between products.

PRODUCT REFERENCES:

${createProductList(products)}

PRODUCT FIDELITY:

Use the exact six products shown in the uploaded product references.

Do not replace any product with a similar product.

Do not redesign any product.

Do not recolor any product.

Do not change the original graphics.

Do not change patterns.

Do not change materials.

Do not change proportions.

Do not remove product details.

Do not add product details.

Do not invent any part of the products.

Each product must remain visually accurate to its uploaded product reference.

The products must remain clearly recognizable.

PHOTOGRAPHY:

Use realistic professional product photography.

Use soft studio lighting.

Use subtle realistic shadows.

Use realistic materials and textures.

Use accurate perspective.

Keep the image clean and premium.

The result should look like one professionally photographed product showcase.

BACKGROUND:

Use a completely clean white or very soft neutral background.

No lifestyle scenery.

No decorative objects that are not part of the six products.

No additional products.

No people.

No hands.

No models.

No packaging unless packaging is part of the uploaded product reference.

NEGATIVE REQUIREMENTS:

No extra products.

No duplicated products.

No missing products.

No invented products.

No altered product designs.

No incorrect product codes.

No swapped product codes.

No people.

No hands.

No screenshots.

No watermark.

No prices.

No product names as text.

No additional text.

The only text in the image should be the six exact product codes.

The final result must contain exactly six products from the uploaded references.

Output format: vertical 9:16.
`;
}

export function createEssentialsPrompts(video) {
  return {
    prompts: (video?.slides || []).map((slide) =>
      createEssentialsSlidePrompt(slide)
    )
  };
}
