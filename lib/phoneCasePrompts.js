function productCode(product) {
  return product?.code || "";
}

function productName(product) {
  return product?.name || "";
}

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
  return `B${imageNumber}-PhoneCase-${safeFilePart(productName(product))}-${safeCode(productCode(product))}.jpg`;
}

function createSlideProductList(products, imageNumber) {
  return products
    .map(
      (product, index) =>
        `Product ${index + 1}: ${productName(product)} | Product Code: ${productCode(product)} | Filename: ${productFilename(imageNumber, product)}`
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

IMPORTANT:

ALL FOUR phone cases must be shown as standalone empty phone cases.

Do NOT place a phone inside any phone case.

Do NOT mount any phone case on an iPhone or smartphone.

The inside of each phone case should be visible enough to clearly show that it is an empty case.

The phone case itself must be the only product in each position.

Do NOT show any phone, smartphone or phone screen.

The actual phone case design and shape must remain clearly visible.

Each phone and case combination should look like a real physical product photographed professionally.

Use a completely clean pure white background.

COMPOSITION:

Arrange the four silver iPhones with their phone cases in a clean 2 by 2 grid.

Top left:
Standalone Phone Case 1, shown empty.

Top right:
Standalone Phone Case 2, shown empty.

Bottom left:
Standalone Phone Case 3, shown empty.

Bottom right:
Standalone Phone Case 4, shown empty.

Each phone case must be clearly visible and naturally separated from the other three.

Do not overlap the four phones.

Keep enough white space around each phone.

Each phone should be positioned naturally and consistently.

PRODUCT CODES:

Place the exact corresponding product code naturally above each phone case.

Use simple natural black typography.

The product code must be positioned directly above its corresponding phone case.

Product 1 filename:\n${productFilename(imageNumber, products[0])}\n\nProduct 1 code:
${productCode(products[0])}

Product 2 filename:\n${productFilename(imageNumber, products[1])}\n\nProduct 2 code:
${productCode(products[1])}

Product 3 filename:\n${productFilename(imageNumber, products[2])}\n\nProduct 3 code:
${productCode(products[2])}

Product 4 filename:\n${productFilename(imageNumber, products[3])}\n\nProduct 4 code:
${productCode(products[3])}

The product codes must be clearly readable.

Each code must correspond exactly to the phone case underneath it.

Do not invent product codes.

Do not change product codes.

Do not swap product codes between products.

PRODUCT REFERENCES:

${createSlideProductList(products, imageNumber)}

PRODUCT FIDELITY:

Use the exact four phone case products shown in the uploaded product references.

Do not replace any phone case with a similar product.

Do not redesign any phone case.

Do not recolor any phone case.

Do not change the original graphics.

Do not change patterns.

Do not change materials.

Do not change proportions.

Do not change the camera cutout.

Do not simplify the design.

Do not remove any design details.

Do not add design details.

Do not invent any part of the phone case.

Each phone case must remain visually accurate to its uploaded product reference.

The phone case design must be clearly recognizable.

SILVER IPHONE:

Do not add any phone inside or behind the cases.

Do not add an iPhone or smartphone as a supporting product.

The phone cases must remain standalone empty cases.

PHOTOGRAPHY:

Use realistic professional product photography.

Use soft natural studio lighting.

Use subtle realistic shadows underneath the phone cases.

Use realistic materials and subtle reflections on the phone cases.

Use realistic materials and textures.

Use accurate perspective.

Keep the image clean and premium.

The result should look like one professionally photographed product showcase.

The image must NOT look like four separate screenshots.

The image must NOT look like a digital collage.

The four phones should appear to exist together in the same physical studio scene.

BACKGROUND:

Pure white background.

Clean white surface.

No colored background.

No lifestyle scenery.

No decorative objects.

No props.

No flowers.

No fabric.

No additional products.

No unnecessary visual elements.

NEGATIVE REQUIREMENTS:

No people.

No hands.

No models.

No phones.
No iPhones.
No smartphones.
No phone screens.
No phone backs.
No phone edges inside cases.
No installed phone cases.
No case and phone combinations.
No phones inside cases.
No cases mounted on phones.
No duplicated phone cases.

No invented phone cases.

No distorted phone cases.

No distorted phones.

No altered case designs.

No incorrect product codes.

No swapped product codes.

No packaging.

No screenshots.

No borders.

No individual frames.

No prices.

No product names.

No watermark.

No additional text.

The final result MUST contain exactly four phone cases.

ALL FOUR cases MUST be installed on silver iPhones.

ALL FOUR silver iPhones MUST show their BACK toward the camera.

ALL FOUR phone case designs MUST be clearly visible.

The final image MUST be a clean 2 by 2 product showcase on a pure white background.

Output format: vertical 9:16.
`;
}

export function createPhoneCaseCoverPrompt() {
  return `
Create a vertical 9:16 clean editorial cover image for a SHEIN phone case TikTok post.

The image must be a completely clean standalone cover.

IMPORTANT:

There must be NO phone cases in the image.

There must be NO phones in the image.

There must be NO products in the image.

There must be NO product photographs.

There must be NO product references visible.

There must be NO people.

There must be NO hands.

There must be NO objects representing phone cases.

There must be NO objects representing phones.

Create a cute, feminine and aesthetic background inspired by modern Pinterest fashion and lifestyle design.

The background should feel soft, trendy, youthful, elegant and visually appealing.

Use a clean pastel aesthetic with subtle feminine details.

The background can contain very subtle abstract decorative elements, soft shapes, delicate patterns, tiny hearts, subtle bows, stars, ribbons or other cute minimal design details.

Keep the decorative elements subtle and sophisticated.

Do not make the background busy.

Do not create a collage.

Do not create a product showcase.

Do not include any products.

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

No phones.

No products.

No product images.

No product references.

No product codes.

No product names.

No people.

No hands.

No screenshots.

No packaging.

No product collage.

No product grid.

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