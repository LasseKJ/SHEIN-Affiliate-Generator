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

If the category is Essentials-Makeup, display the product name from the Google Sheet directly above each exact product code. The product name may be cleaned up for spelling, capitalization, spacing or punctuation so it reads naturally and professionally.

For all other Essentials categories, do NOT display product names.

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

For Essentials-Makeup only:
Place the product name from the Google Sheet directly above the product code.
The name may be cleaned up, shortened, corrected for spelling, capitalization, spacing or punctuation so it reads naturally and professionally in the generated image.

For all other Essentials categories, including Essentials-MakeupStorage:
Do NOT display product names anywhere in the image.
Display ONLY the exact product code above each product.

Do not change the actual product identity.

The product code must never be changed.

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

PRODUCT CUTOUT AND BACKGROUND REMOVAL:

The uploaded product reference may contain a background, room, table, shelf, packaging scene, shadows, props or other surrounding visual elements.

Remove the entire original background from every uploaded product reference.

Extract ONLY the actual product.

Do not preserve the original background.

Do not preserve furniture.

Do not preserve rooms.

Do not preserve walls.

Do not preserve tables or surfaces.

Do not preserve unrelated props.

Do not preserve decorative objects.

Do not preserve background shadows that belong to the original photograph.

The product itself must remain completely intact and visually accurate.

Create a clean isolated product cutout with the product as the only visual subject.

Place the isolated products on a completely pure white background.

The background must be solid white, not transparent.

Do not generate a transparent background.

Do not generate a PNG style transparent cutout.

The final image must be a normal image with a solid white background.

The final image must look like professional clean product photography, not like the original product listing photograph.

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

Use a completely solid pure white background.

Do not use a transparent background.

Do not use a soft colored background.

Do not use a neutral colored background.

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

No product names as text, except for Essentials-Makeup.

No additional text.

For Essentials-Makeup, the image may contain the six product names and the six exact product codes.

For Essentials-MakeupStorage, do NOT display any product names. The image must contain only the six exact product codes as text.

For all other Essentials categories, the only text in the image should be the six exact product codes.

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
