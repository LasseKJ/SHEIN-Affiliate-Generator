const PRODUCT_FIELDS = {
  shoe: "SHOE",
  top: "TOP",
  bottom: "BOTTOM",
  accessory: "ACCESSORY"
};

function safeFilePart(value) {
  return String(value || "product")
    .trim()
    .replace(/[^a-zA-Z0-9æøåÆØÅ]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeCode(value) {
  return String(value || "UNKNOWN")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "");
}

function productFilename(imageNumber, product) {
  return `B${imageNumber}-Autumn-${safeFilePart(product.name)}-${safeCode(product.code)}.jpg`;
}

function productDetails(product, label, imageNumber) {
  return `
${label}
Product Name: ${product.name}
Product Code: ${product.code}
Filename: ${productFilename(imageNumber, product)}
Price: ${product.price} ${product.currency}
`;
}

export function createModelPrompt(outfit, imageNumber) {
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

export function createAutumnCoverPrompt(
  outfits
) {
  const coverProducts = [];

  outfits.forEach((outfit) => {
    coverProducts.push(outfit.top);
    coverProducts.push(outfit.bottom);
    coverProducts.push(outfit.accessory);
  });

  const productReferenceText =
    coverProducts
      .map(
        (product, index) =>
          `Product ${index + 1}: ${product.name} | Product Code: ${product.code} | Filename: ${productFilename(index + 1, product)}`
      )
      .join("\n");

  return `
Create a vertical 9:16 fashion editorial image inspired by the uploaded reference.

Create a beautiful autumn SHEIN fashion product showcase featuring exactly 9 individual clothing and accessory items from the uploaded product references.

The products should be arranged naturally across one cohesive physical scene, inspired by a premium autumn bedroom fashion flat lay.

Do NOT arrange the products in a 3 by 3 grid.

Do NOT arrange the products in rows or columns.

Do NOT give every product equal spacing.

Do NOT make the image look like a product catalog.

The products should feel naturally styled and casually placed, with some items slightly overlapping, partially folded, loosely draped or positioned at different angles.

The arrangement should look effortless, aesthetic and realistic, as if someone has naturally laid out their favorite autumn fashion pieces on a cozy bed before getting dressed.

The composition should have a visually balanced but organic placement without looking overly organized or artificial.

All 9 products must exist together in the same physical scene with consistent lighting, shadows, perspective, texture and color grading.

Create a warm, cozy and luxurious autumn atmosphere inspired by the reference image.

Use a beautiful autumn color palette with cream, beige, brown, burgundy, dark green, denim and black tones.

The scene can include subtle autumn leaves, a warm candle, dried flowers, knit blankets, cozy fabrics and elegant small accessories as environmental styling elements.

These environmental elements should enhance the autumn atmosphere without covering or replacing any of the 9 required products.

The background should feel like a beautiful cozy bedroom or bedroom inspired setting, with soft bedding, blankets and subtle autumn decorations.

The environment should feel realistic and naturally photographed.

Each of the 9 products must remain visually accurate to the uploaded product references.

Do not redesign, alter, merge, simplify or invent any of the products.

Preserve each product's original shape, color, material, details, proportions and recognizable characteristics.

Products may overlap naturally where appropriate, but every one of the 9 required products must remain clearly identifiable and substantially visible.

The final image should look like one professionally photographed fashion editorial photograph, not nine separate product images.

Use soft warm natural lighting, realistic fabric textures, subtle shadows, realistic depth and a slightly luxurious editorial color grade.

The overall aesthetic should be feminine, cozy, trendy, premium and Pinterest inspired, similar to a high end autumn fashion magazine photoshoot.

Add the title:

“Autumn Shein Outfits”

The title should be elegant and integrated naturally into the photograph, inspired by the typography and placement style of the reference image.

Use refined editorial typography combined with an elegant handwritten or script style where appropriate.

The title should be large enough to be clearly readable but should not cover or significantly obstruct the 9 products.

The typography should feel feminine, sophisticated, warm and autumn inspired.

It should look like part of the original editorial design rather than text placed on top afterward.

Maintain a vertical 9:16 composition with strong visual depth and a natural photographic perspective.

The final image should feel like an authentic Pinterest fashion inspiration cover showing a beautiful collection of autumn clothing laid naturally together.

PRODUCT REFERENCES:

${productReferenceText}

These 9 uploaded product references are the exact products that must appear in the final image.

The 9 products are taken from the three generated Autumn outfits.

Use all 9 product references.

Do not replace any of them.

Do not omit any of them.

Do not duplicate any of them.

No people.
No models.
No screenshots.
No borders.
No separate frames.
No product cards.
No obvious grid.
No 3 by 3 arrangement.
No equal spacing.
No rows or columns.
No duplicated products.
No invented products.
No distorted products.
No merged products.
No collage appearance.

The final result must look like one cohesive professional autumn fashion photograph containing exactly the 9 specified fashion items, naturally arranged together in one beautiful scene.

Output format: vertical 9:16.
`;
}

export function createAutumnPrompts(
  outfit,
  imageNumber
) {
  return {
    model: createModelPrompt(
      outfit,
      imageNumber
    ),

    flatLay: createFlatLayPrompt(
      outfit,
      imageNumber
    )
  };
}
