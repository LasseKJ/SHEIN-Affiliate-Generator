const PRODUCT_FIELDS = {
  shoe: "SHOE",
  top: "TOP",
  bottom: "BOTTOM",
  accessory: "ACCESSORY"
};

function productDetails(product, label) {
  return `
${label}
Product Name: ${product.name}
Product Code: ${product.code}
Price: ${product.price} ${product.currency}
`;
}

export function createModelPrompt(outfit) {
  return `
Create a realistic vertical 9:16 fashion photo using the four provided product reference images.

The four provided products are the ONLY clothing and accessory items that should be used.

${productDetails(
  outfit.shoe,
  PRODUCT_FIELDS.shoe
)}

${productDetails(
  outfit.top,
  PRODUCT_FIELDS.top
)}

${productDetails(
  outfit.bottom,
  PRODUCT_FIELDS.bottom
)}

${productDetails(
  outfit.accessory,
  PRODUCT_FIELDS.accessory
)}

IMPORTANT PRODUCT FIDELITY RULES:

Use the exact four products shown in the reference images.

Do not replace any product with a similar item.

Do not change the colors, patterns, materials, shape, design, length, proportions, logos, prints or details of any product.

The shoes must match the provided shoe reference.

The top must match the provided top reference.

The bottom must match the provided bottom reference.

The accessory must match the provided accessory reference.

Do not add additional clothing or accessories that are not provided.

SCENE:

Create a realistic young adult female fashion model wearing the complete outfit.

She is taking a natural mirror selfie with a smartphone.

The entire outfit should be clearly visible from head to shoes.

The pose should look natural and effortless, like a real fashion post on Instagram or Pinterest.

Use a beautiful aesthetic autumn fashion environment.

The setting should feel warm, stylish and realistic.

Use natural indoor lighting with a high quality smartphone photography look.

The image should look like a genuine fashion photo rather than an AI generated image.

The clothing must remain the main focus.

Do not add text.

Do not add product codes.

Do not add prices.

Do not add watermarks.

Do not add logos or graphics that are not present on the original products.

Output format: vertical 9:16.
`;
}

export function createFlatLayPrompt(
  outfit
) {
  return `
Create a realistic vertical 9:16 fashion flat lay using the exact four products from the provided reference images.

The four products are:

${productDetails(
  outfit.shoe,
  PRODUCT_FIELDS.shoe
)}

${productDetails(
  outfit.top,
  PRODUCT_FIELDS.top
)}

${productDetails(
  outfit.bottom,
  PRODUCT_FIELDS.bottom
)}

${productDetails(
  outfit.accessory,
  PRODUCT_FIELDS.accessory
)}

IMPORTANT:

Use the exact same four products from the reference images.

This image must represent the exact outfit from the corresponding model image.

Do not replace, redesign or modify any product.

Do not change colors, patterns, materials, shapes, proportions or details.

Arrange the four products neatly as a premium fashion flat lay.

The products should be photographed from directly above.

Use a completely clean white background.

Leave generous white space around every individual product.

The four products must be clearly separated from each other.

The complete products must be visible.

Do not overlap the products.

Place the shoe, top, bottom and accessory in an aesthetically pleasing composition.

PRODUCT CODES:

Place the exact Product Code from the information above directly above the corresponding product.

Shoe code:
${outfit.shoe.code}

Top code:
${outfit.top.code}

Bottom code:
${outfit.bottom.code}

Accessory code:
${outfit.accessory.code}

The product codes must be clearly readable.

Do not invent or modify any product code.

Do not display product names.

Do not display prices.

Do not display additional text.

Do not add watermarks.

Do not add decorative graphics.

The result should look like a clean professional clothing product board.

Output format: vertical 9:16.
`;
}

export function createAutumnPrompts(
  outfit
) {
  return {
    model: createModelPrompt(
      outfit
    ),

    flatLay: createFlatLayPrompt(
      outfit
    )
  };
}
