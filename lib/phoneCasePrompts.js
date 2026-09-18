function productCode(product) {
  return product?.code || "";
}

function productName(product) {
  return product?.name || "";
}

function createSlideProductList(products) {
  return products
    .map(
      (product, index) =>
        `Product ${index + 1}: ${productName(
          product
        )} | Product Code: ${productCode(
          product
        )}`
    )
    .join("\n");
}

export function createPhoneCaseSlidePrompt(
  products
) {
  return `
Create a vertical 9:16 phone case product showcase using the four uploaded phone case product references.

Create exactly four individual phone cases in a realistic 2 by 2 composition.

The four phone cases must be arranged in a clear 2 by 2 grid within the vertical 9:16 image.

Each phone case must be clearly visible and naturally separated from the other three.

Use a completely clean pure white background.

Each phone case must be shown from the back, facing directly toward the camera, so the actual phone case design is clearly visible.

Each phone case should be presented as a realistic physical product photographed professionally.

Place the exact corresponding product code naturally above each phone case.

Use simple natural black typography for the product codes.

The product codes should be clean, minimal and easy to read.

PRODUCT REFERENCES:

${createSlideProductList(products)}

PRODUCT FIDELITY:

Use the exact four phone cases shown in the uploaded product references.

Do not replace any phone case with a similar product.

Do not redesign any phone case.

Do not change the original colors.

Do not change the original graphics.

Do not change patterns.

Do not change materials.

Do not change proportions.

Do not change the camera cutout.

Do not invent details.

Do not remove details.

Each phone case must remain visually accurate to its uploaded reference.

The product code displayed above each case must correspond exactly to the phone case underneath it.

Do not invent or modify product codes.

The final image should look like one professionally photographed product showcase.

Use soft natural lighting.

Use subtle realistic shadows.

Keep the background completely white and clean.

No people.

No hands.

No phones inside the cases.

No phone screens.

No packaging.

No additional products.

No decorative objects.

No colored background.

No lifestyle scenery.

No duplicated cases.

No distorted cases.

No invented cases.

No borders.

No individual frames.

No screenshots.

No prices.

No product names.

No watermarks.

No additional text.

The final result must contain exactly four phone cases in a clear 2 by 2 composition.

Output format: vertical 9:16.
`;
}

export function createPhoneCaseCoverPrompt() {
  return `
Create a vertical 9:16 clean editorial cover image for a SHEIN phone case TikTok post.

The image must be a completely clean standalone cover.

IMPORTANT:

There must be NO phone cases in the image.

There must be NO products in the image.

There must be NO product photographs.

There must be NO product references visible.

There must be NO people.

There must be NO hands.

There must be NO phones.

There must be NO objects representing phone cases.

Create a cute, feminine and aesthetic background inspired by modern Pinterest fashion and lifestyle design.

The background should feel soft, trendy, youthful, elegant and visually appealing.

Use a clean pastel aesthetic with subtle feminine details.

The background can contain very subtle abstract decorative elements, soft shapes, delicate patterns, tiny hearts, subtle bows, stars, ribbons or other cute minimal design details.

Keep the decorative elements subtle and sophisticated.

Do not make the background busy.

Do not create a collage.

Do not create a product showcase.

The main focus must be the typography.

Place the title:

“SHEIN Phone Cases”

inside one elegant white label or white paper style sign.

The white label should be clearly visible against the background.

The label should have a clean, slightly soft and aesthetic shape.

It can have subtly rounded corners or a natural paper label appearance.

The label must remain completely white.

The title text must be black.

Use elegant, clean and feminine typography.

The typography should feel premium, modern and Pinterest inspired.

The title should be centered naturally within the white label.

The composition should have plenty of clean negative space.

The final image should feel like a polished TikTok fashion cover rather than an advertisement.

Use soft lighting and a subtle premium editorial finish.

Keep everything minimal, clean and aesthetically balanced.

IMPORTANT NEGATIVE REQUIREMENTS:

No phone cases.

No products.

No product images.

No product references.

No product codes.

No product names.

No people.

No hands.

No phones.

No screenshots.

No packaging.

No product collage.

No grid.

No 2 by 2 product arrangement.

No borders.

No frames around products.

No busy background.

No excessive decorations.

No additional text.

No watermark.

The only text in the image should be:

“SHEIN Phone Cases”

The final image must contain only the cute background and the single white label with black text.

Output format: vertical 9:16.
`;
}

export function createPhoneCasePrompts(
  video
) {
  const slidePrompts =
    video.slides.map(
      (slide) =>
        createPhoneCaseSlidePrompt(
          slide
        )
    );

  const coverPrompt =
    createPhoneCaseCoverPrompt();

  return {
    prompts: [
      ...slidePrompts,
      coverPrompt
    ],

    coverPrompt
  };
}