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
  return `B${imageNumber}-Winter-${safeFilePart(product.name)}-${safeCode(product.code)}.jpg`;
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

export function createWinterModelPrompt(outfit, imageNumber) {
  return `
Create a realistic vertical 9:16 fashion photo using the four provided product reference images.

The four provided products are the ONLY clothing and accessory items that should be used.

${productDetails(
  outfit.shoe,
  PRODUCT_FIELDS.shoe,
  imageNumber
)}

${productDetails(
  outfit.top,
  PRODUCT_FIELDS.top,
  imageNumber
)}

${productDetails(
  outfit.bottom,
  PRODUCT_FIELDS.bottom,
  imageNumber
)}

${productDetails(
  outfit.accessory,
  PRODUCT_FIELDS.accessory,
  imageNumber
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

Create a realistic adult female fashion model wearing the complete winter outfit.

She is taking a natural mirror selfie with a smartphone.

Keep realistic adult human anatomy and natural body proportions. Legs must be a natural length relative to the torso and head: never elongate the thighs, shins or overall legs, raise the hips unnaturally, shorten the torso or shrink the head to create a taller silhouette. Keep knees, hips and ankles in anatomically plausible positions. Use a level camera at normal chest height with natural perspective; no low-angle, ultra-wide-angle or perspective stretching that makes the legs look longer. Fit the full body into the vertical frame by moving the camera back and leaving space around the model, never by stretching the body or clothing. Check and correct body proportions before delivering the image.

The entire outfit should be clearly visible from head to shoes.

The pose should look natural and effortless, like a real fashion post on Instagram or Pinterest.

Use a beautiful aesthetic winter fashion environment.

The setting should feel warm, cozy, stylish and realistic.

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

export function createWinterFlatLayPrompt(outfit, imageNumber) {
  return `
Create a realistic vertical 9:16 fashion flat lay using the exact four products from the provided reference images.

The four products are:

${productDetails(
  outfit.shoe,
  PRODUCT_FIELDS.shoe,
  imageNumber
)}

${productDetails(
  outfit.top,
  PRODUCT_FIELDS.top,
  imageNumber
)}

${productDetails(
  outfit.bottom,
  PRODUCT_FIELDS.bottom,
  imageNumber
)}

${productDetails(
  outfit.accessory,
  PRODUCT_FIELDS.accessory,
  imageNumber
)}

IMPORTANT:

Use the exact same four products from the reference images.

This image must represent the exact outfit from the corresponding model image.

Do not replace, redesign or modify any product.

Do not change colors, patterns, materials, shapes, proportions or details.

STYLE AND COMPOSITION:

Create one natural winter outfit flat lay on a soft cream or warm ivory bed, matching the cozy editorial style of the supplied example.

Photograph the scene directly from above in one realistic shot. Show subtle folds in the duvet and soft pillows entering from the upper corners.

Use warm neutral color grading, natural window light, gentle shadows and realistic fabric and leather textures.

Arrange the top and bottom in the upper half, with the shoes and accessory below. Adapt the placement to the actual four products so every complete item is clearly visible and each code has room.

Keep the placement casually styled and visually balanced, with clear space between products. No grid, product cards, cutout appearance, white studio backdrop or extra decorative objects.

Keep all important parts inside the vertical 9:16 frame. The bed must fill the entire background with no borders.

PRODUCT CODES:

Place each exact Product Code directly on its corresponding product, centered over a clear area of that item. Use large bold white sans-serif lettering with a thin black outline, like the example. Keep every code legible without hiding the product's distinctive features.

Shoe code:
${outfit.shoe.code}

Top code:
${outfit.top.code}

Bottom code:
${outfit.bottom.code}

Accessory code:
${outfit.accessory.code}

The product codes must be clearly readable and appear exactly once each. Check every letter and digit against the codes above.

Do not invent or modify any product code.

Do not display product names.

Do not display prices.

Do not display any text other than the four exact product codes.

Do not add watermarks.

Do not add decorative graphics.

The result should look like a genuine cozy fashion photograph on a bed with clear overlaid product codes.

Output format: vertical 9:16.
`;
}

export function createWinterPrompts(outfit, imageNumber) {
  return {
    model: createWinterModelPrompt(outfit, imageNumber),
    flatLay: createWinterFlatLayPrompt(outfit, imageNumber)
  };
}
