function productCode(
  product
) {
  return product?.code || "";
}

function productName(
  product
) {
  return product?.name || "";
}

function createSlideProductList(
  products
) {
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

The four phone cases must be arranged in a 2 by 2 grid within the vertical 9:16 image.

Each phone case must be clearly visible and separated naturally from the other three.

Use a completely clean white background.

Each phone case must be shown from the back, facing directly toward the camera, so the actual phone case design is clearly visible.

The phone cases should appear as realistic physical products photographed professionally from above or directly facing the camera, depending on the natural shape and orientation of the case.

Each phone case must have its corresponding product code placed naturally above it.

Use simple natural black typography for the product codes.

The typography should be clean, minimal and easy to read.

PRODUCT REFERENCES:

${createSlideProductList(
  products
)}

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

The product code displayed above each case must correspond to the exact case underneath it.

Do not invent or modify product codes.

The final image should look like one professionally photographed product showcase.

Use soft natural lighting.

Use realistic subtle shadows.

Keep the background pure white and clean.

Do not use decorative elements.

Do not use colored backgrounds.

Do not use lifestyle scenery.

Do not use people.

Do not use hands.

Do not show phones inside the cases.

Do not show phone screens.

Do not show packaging.

Do not add extra products.

Do not duplicate any product.

Do not create a collage appearance.

Do not add borders around the individual cases.

Do not add frames around the individual cases.

Do not add prices.

Do not add product names.

Do not add watermarks.

Do not add logos that are not part of the original phone case design.

The final result must contain exactly four phone cases.

The four cases must be arranged in a clear 2 by 2 grid.

Output format: vertical 9:16.
`;
}

export function createPhoneCaseCoverPrompt(
  products
) {
  return `
Create a vertical 9:16 fashion editorial product image inspired by a premium Pinterest phone case aesthetic.

Create a beautiful SHEIN phone case showcase featuring exactly 16 individual phone cases from the uploaded product references.

All 16 phone cases must appear together in one cohesive physical scene.

Do not arrange the 16 phone cases in a rigid 4 by 4 grid.

Do not arrange them in perfect rows or columns.

Do not give every phone case identical spacing.

Instead, create a natural, aesthetic and slightly effortless arrangement.

The phone cases can be placed at different angles.

Some cases can overlap slightly where it looks natural.

Some cases can be positioned closer together while others have more breathing room.

The composition should feel intentionally styled but naturally arranged.

The image should look like one professionally photographed fashion and lifestyle flat lay rather than 16 separate images digitally combined.

Use a beautiful feminine and trendy SHEIN aesthetic.

Create a clean premium background with soft neutral tones and subtle fashion editorial styling.

The environment can include subtle elegant decorative elements that complement the phone cases, but these elements must never cover the phone cases.

The phone cases themselves must remain the visual focus.

Use soft natural lighting.

Use realistic shadows.

Use realistic product textures.

Use realistic depth.

Use premium editorial photography.

Each of the 16 phone cases must remain visually accurate to its uploaded reference.

Do not redesign any phone case.

Do not recolor any phone case.

Do not alter any graphics.

Do not change patterns.

Do not change materials.

Do not change proportions.

Do not invent any phone case.

Do not merge phone cases together.

Do not duplicate phone cases.

Every uploaded phone case reference must appear exactly once.

All 16 phone cases must be clearly identifiable.

The cases should be shown from the back so their actual designs are visible.

Do not show phones inside the cases.

Do not show people.

Do not show hands.

Do not show screenshots.

Do not show packaging.

Do not add product cards.

Do not add individual frames.

Do not add borders.

Do not create a rigid grid.

Do not create a digital collage appearance.

Add the title:

“SHEIN Phone Cases”

The title should be elegant, feminine and minimal.

Use refined editorial typography.

The title should be integrated naturally into the composition without covering any phone cases.

PRODUCT REFERENCES:

${products
  .map(
    (product, index) =>
      `Product ${
        index + 1
      }: ${productName(
        product
      )} | Product Code: ${productCode(
        product
      )}`
  )
  .join("\n")}

These 16 uploaded product references are the exact phone cases that must appear in the final image.

Use all 16 products.

Do not omit any product.

Do not replace any product.

Do not duplicate any product.

The final image must contain exactly 16 phone cases in one cohesive natural fashion flat lay.

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
    createPhoneCaseCoverPrompt(
      video.cases
    );

  return {
    prompts: [
      ...slidePrompts,
      coverPrompt
    ],

    coverPrompt
  };
}