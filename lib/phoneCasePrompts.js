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

export function createPhoneCaseSlidePrompt(products, imageNumber, phoneModel) {
  return `
Create a vertical 9:16 premium phone case product showcase using the four uploaded SHEIN phone case references.

SELECTED PHONE MODEL: ${phoneModel}

Create exactly four products in a clean 2 by 2 composition on a pure white background.

MOST IMPORTANT PHONE MODEL INSTRUCTION:

The uploaded references are references for the CASE DESIGN only. They may have been photographed or manufactured for a different phone model.

Adapt the physical shape of every case so it fits the selected ${phoneModel} exactly.

Preserve the original case design, color, graphics, pattern, material appearance and decorative details, but change the case geometry where necessary to correctly fit a ${phoneModel}.

The camera opening, camera protection area, button positions, side openings, dimensions, corner shape and overall proportions of the case must be appropriate for a ${phoneModel}.

Do not preserve an incompatible camera cutout or body shape from the uploaded reference if it belongs to another phone model.

PHONE INSIDE EVERY CASE:

Place every adapted case on a realistic SILVER ${phoneModel}.

All four cases MUST have a silver ${phoneModel} installed inside them.

Use the same selected phone model for all four products.

Do not use another iPhone model.

Do not mix phone generations or sizes.

The phone must fit naturally and perfectly inside the case.

Show every phone and case from the BACK so the case design is clearly visible.

Do not show the screen or front of the phone.

The silver phone may be subtly visible at appropriate edges and through openings, while the case remains the dominant visual element.

The camera area must visually match the selected ${phoneModel} and fit naturally inside the adapted case opening.

COMPOSITION:

Arrange the four cased silver ${phoneModel} devices in a balanced 2 by 2 grid.

Top left: Product 1.
Top right: Product 2.
Bottom left: Product 3.
Bottom right: Product 4.

Keep all four products large, clearly visible, naturally separated and consistent in scale.

Do not overlap the products.

PRODUCT CODES:

Place only the exact corresponding product code in simple black typography directly above each product.

Product 1 filename: ${productFilename(imageNumber, products[0])}
Product 1 code: ${productCode(products[0])}

Product 2 filename: ${productFilename(imageNumber, products[1])}
Product 2 code: ${productCode(products[1])}

Product 3 filename: ${productFilename(imageNumber, products[2])}
Product 3 code: ${productCode(products[2])}

Product 4 filename: ${productFilename(imageNumber, products[3])}
Product 4 code: ${productCode(products[3])}

Each code must correspond exactly to the case underneath it.
Do not invent, alter or swap product codes.
Do not display product names.

PRODUCT REFERENCES:

${createSlideProductList(products, imageNumber)}

CASE DESIGN FIDELITY:

Use the exact four case designs from the uploaded references.
Do not replace a case with a similar design.
Do not recolor the case.
Do not change its graphics, pattern, material appearance or decorative details.
Do not remove or invent decorative details.

The ONLY design changes allowed are structural changes required to make the case physically appropriate for the selected ${phoneModel}.

The final case must look like the same SHEIN case design manufactured specifically for a ${phoneModel}.

PHOTOGRAPHY:

Use realistic professional studio product photography.
Use soft studio lighting, subtle realistic shadows, accurate materials and accurate perspective.
The four products should look photographed together in the same studio scene, not like screenshots or a digital collage.

BACKGROUND:

Use a completely solid pure white background.
No transparent background.
No lifestyle scenery.
No decorative props.
No additional products.

NEGATIVE REQUIREMENTS:

No people.
No hands.
No models.
No front facing phones.
No visible phone screens.
No phone model other than ${phoneModel}.
No black, gold or colored phones, the installed phones must be silver.
No empty cases.
No cases without phones.
No incorrect camera openings for ${phoneModel}.
No incompatible phone proportions.
No duplicated cases.
No invented case designs.
No incorrect product codes.
No swapped product codes.
No prices.
No product names.
No watermark.
No additional text beyond the four exact product codes.

FINAL CHECK:

Exactly four uploaded case designs.
Exactly four silver ${phoneModel} devices, one installed inside each case.
Every case structurally adapted to fit ${phoneModel}.
All four shown from the back.
Pure white background.
Exact product code above each case.

Output format: vertical 9:16.
`;
}

export function createPhoneCaseCoverPrompt(phoneModel) {
  return `
Create a vertical 9:16 clean editorial cover image for a SHEIN phone case TikTok post for ${phoneModel} cases.

Create a cute, feminine, modern Pinterest inspired background with soft pastel details and plenty of negative space.

Place the title:

“SHEIN ${phoneModel} Cases”

inside one elegant white label with black typography.

The cover must contain NO phone cases, NO phones, NO products, NO product photographs, NO product codes, NO people and NO hands.

Do not create a product collage or product grid.
Keep the design minimal, polished and premium.
The only text in the image should be “SHEIN ${phoneModel} Cases”.

Output format: vertical 9:16.
`;
}

export function createPhoneCasePrompts(video, phoneModel) {
  const slidePrompts = video.slides.map((slide, index) =>
    createPhoneCaseSlidePrompt(slide, index + 1, phoneModel)
  );

  const coverPrompt = createPhoneCaseCoverPrompt(phoneModel);

  return {
    prompts: [...slidePrompts, coverPrompt],
    coverPrompt
  };
}
