function productCode(product) {
  return product?.code || "";
}

function productName(product) {
  return product?.name || "";
}

function safeFilePart(value) {
  return String(value || "product").trim().replace(/[^a-zA-Z0-9æøåÆØÅ]+/g, "-").replace(/^-+|-+$/g, "");
}

function safeCode(value) {
  return String(value || "UNKNOWN").trim().replace(/[^a-zA-Z0-9]+/g, "");
}

function productFilename(imageNumber, product) {
  return `B${imageNumber}-PhoneCase-${safeFilePart(productName(product))}-${safeCode(productCode(product))}.jpg`;
}

function createSlideProductList(products, imageNumber) {
  return products.map((product, index) =>
    `Product ${index + 1}: ${productName(product)} | Product Code: ${productCode(product)} | Filename: ${productFilename(imageNumber, product)}`
  ).join("\n");
}

function createCodeList(products, imageNumber) {
  return products.map((product, index) =>
    `Product ${index + 1} filename: ${productFilename(imageNumber, product)}\nProduct ${index + 1} code: ${productCode(product)}`
  ).join("\n\n");
}

export function createPhoneCaseSlidePrompt(products, imageNumber, phoneModel) {
  return `
Create a vertical 9:16 premium phone case product showcase using the SIX uploaded SHEIN phone case references.

SELECTED PHONE MODEL: ${phoneModel}

Create exactly SIX products in a clean 3 ROW by 2 COLUMN composition on a pure white background.

The layout must visually be:
Product 1    Product 2
Product 3    Product 4
Product 5    Product 6

There must be exactly 3 horizontal rows and exactly 2 products in each row.

IMPORTANT VERTICAL SPACING:
Do NOT stretch the six products from the very top to the very bottom of the 9:16 canvas.
Keep the entire 3 by 2 product grid grouped more compactly around the vertical center of the image.
Leave a clearly visible EMPTY PURE WHITE BAND across the full width at the TOP of the image.
Leave a clearly visible EMPTY PURE WHITE BAND across the full width at the BOTTOM of the image.
These top and bottom white bands must contain absolutely no phones, cases, product codes, shadows, graphics or other elements.
Use approximately the middle 70 to 75 percent of the canvas height for the complete six product grid, including the product codes.
Reserve approximately 12 to 15 percent of the canvas height as clean empty white space at the top and approximately 12 to 15 percent at the bottom.
The three product rows should still have comfortable spacing between them, but they must NOT be spread out to fill the full height of the canvas.
The result should feel compact, centered and balanced, with intentional white breathing room above and below the products.

MOST IMPORTANT PHONE MODEL INSTRUCTION:
The uploaded references are references for the CASE DESIGN only. They may have been manufactured for a different phone model.
Adapt the physical shape of every case so it fits the selected ${phoneModel} exactly.
Preserve the original case design, color, graphics, pattern, material appearance and decorative details, but change the case geometry where necessary to correctly fit a ${phoneModel}.
The camera opening, camera protection area, button positions, side openings, dimensions, corner shape and overall proportions must be appropriate for a ${phoneModel}.

PHONE INSIDE EVERY CASE:
Place every adapted case on a realistic SILVER ${phoneModel}.
All SIX cases MUST have a silver ${phoneModel} installed inside them.
Use the same selected phone model for all six products.
Do not use another iPhone model or mix phone generations or sizes.
Show every phone and case from the BACK so the case design is clearly visible.
Do not show the screen or front of the phone.
The camera area must visually match the selected ${phoneModel}.

COMPOSITION:
Arrange all six cased silver ${phoneModel} devices in a balanced 3 by 2 grid, three rows tall and two columns wide.
Top row, left: Product 1.
Top row, right: Product 2.
Middle row, left: Product 3.
Middle row, right: Product 4.
Bottom row, left: Product 5.
Bottom row, right: Product 6.
Keep all six products clearly visible, naturally separated and consistent in scale.
Do not overlap the products.
Keep the complete grid vertically centered within the middle portion of the canvas.
Keep the top row well below the top white band and the bottom row well above the bottom white band.
Do not enlarge the gaps between the three rows just to fill vertical space.
Keep enough local white space above each phone for its product code.

PRODUCT CODES:
Place only the exact corresponding product code in simple black typography directly above each product.

${createCodeList(products, imageNumber)}

Each code must correspond exactly to the case underneath it.
Do not invent, alter or swap product codes.
Do not display product names.

PRODUCT REFERENCES:
${createSlideProductList(products, imageNumber)}

CASE DESIGN FIDELITY:
Use the exact six case designs from the uploaded references.
Do not replace a case with a similar design.
Do not recolor the case.
Do not change its graphics, pattern, material appearance or decorative details.
The ONLY design changes allowed are structural changes required to make the case physically appropriate for the selected ${phoneModel}.
The final case must look like the same SHEIN case design manufactured specifically for a ${phoneModel}.

PHOTOGRAPHY:
Use realistic professional studio product photography.
Use soft studio lighting, subtle realistic shadows, accurate materials and accurate perspective.
All six products should look photographed together in the same studio scene, not like screenshots or a digital collage.

BACKGROUND:
Use a completely solid pure white background.
No transparent background.
The pure white background must continue uninterrupted through the empty top and bottom bands.
No lifestyle scenery.
No decorative props.
No additional products.

NEGATIVE REQUIREMENTS:
No products touching or entering the top white band.
No products touching or entering the bottom white band.
No product codes inside the top or bottom white bands.
No grid stretched across the full canvas height.
No excessive vertical gaps between product rows.
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
No additional text beyond the six exact product codes.

FINAL CHECK:
Exactly SIX uploaded case designs.
Exactly SIX silver ${phoneModel} devices, one installed inside each case.
Exactly THREE rows and TWO columns.
Every case structurally adapted to fit ${phoneModel}.
All six shown from the back.
The complete 3 by 2 grid is compact and vertically centered.
A substantial completely empty pure white band is visible above the grid.
A substantial completely empty pure white band is visible below the grid.
Pure white background.
Exact product code above each case.

Output format: vertical 9:16.
`;
}

export function createPhoneCaseCoverPrompt(phoneModel) {
  return `
Create a vertical 9:16 clean editorial cover image for a SHEIN phone case TikTok post for ${phoneModel} cases.
Create a cute, feminine, modern Pinterest inspired background with soft pastel details and plenty of negative space.
Place the title “SHEIN ${phoneModel} Cases” inside one elegant white label with black typography.
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
  return { prompts: [...slidePrompts, coverPrompt], coverPrompt };
}
