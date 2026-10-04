function code(product) {
  return String(product?.code || "").trim();
}

function name(product) {
  return String(product?.name || "Sweater").trim();
}

export function createSweaterImagePrompt(product, imageNumber) {
  return `
Create a vertical 9:16 premium SHEIN fashion product image using the uploaded sweater reference.

This is BILLEDE ${imageNumber}.

Use exactly ONE sweater, the exact sweater from the uploaded reference.

SCENE:
Place the sweater naturally laid completely flat on a beautiful made bed.
Photograph the scene directly from above in a true top down flat lay perspective.
The camera should look straight down at the bed and sweater.
The sweater must be the clear visual focus and large enough to see its design clearly.
Use soft natural bedroom lighting and a clean, cozy, premium Pinterest inspired autumn aesthetic.
The bedding should be tasteful and neutral so it does not compete with the sweater.
The sweater should look naturally arranged but neat, with the front side visible.
No hanger. No person. No model. No mannequin. No hands. No other clothing items.

PRODUCT FIDELITY:
Use the exact sweater shown in the uploaded product reference: ${name(product)}.
Preserve its exact color, knit, pattern, graphics, neckline, sleeves, proportions, material appearance and all visible design details.
Do not redesign it.
Do not recolor it.
Do not invent details.
Do not replace it with a similar sweater.

PRODUCT CODE:
Place this exact product code above the sweater:
${code(product)}

The code must be clearly readable in simple elegant black typography.
The code must appear above the sweater, not on top of the sweater.
Do not change, shorten or invent the code.
Do not display the product name, price or any other text.

COMPOSITION:
Vertical 9:16.
One sweater only.
Sweater laid flat on the bed.
Direct top down photograph.
Enough clean space around the sweater.
Realistic fabric texture and folds.
Professional fashion photography.

NEGATIVE REQUIREMENTS:
No people.
No model.
No mannequin.
No hands.
No hanger.
No extra sweaters.
No other clothes.
No shoes.
No accessories placed as products.
No product packaging.
No screenshots.
No watermark.
No prices.
No product name as text.
No extra text besides the exact product code.

The final result must look like a real premium top down photograph of the exact SHEIN sweater laid flat on a bed.
`;
}

export function createSweaterCoverPrompt(sweaters) {
  const refs = sweaters.map((product, index) => `Sweater ${index + 1}: ${name(product)} | Code: ${code(product)}`).join("\n");

  return `
Create a vertical 9:16 premium editorial cover image for a SHEIN autumn sweater post using the four uploaded sweater references.

Use exactly the FOUR sweaters from the references below:
${refs}

Create a beautiful cohesive autumn fashion cover where all four sweaters are clearly visible and recognizable.
Arrange the four sweaters aesthetically as a premium Pinterest inspired flat lay composition on soft neutral bedding.
Use a direct top down camera angle.
Keep the original color, pattern, knit, graphics, neckline, proportions and design details of every sweater accurate to its reference.
Do not replace, recolor or redesign any sweater.

TYPOGRAPHY:
Create an elegant editorial headline inspired by autumn sweater fashion. You may choose a short creative headline such as “Autumn Sweater Edit”, “Cozy Autumn Sweaters” or another polished autumn sweater title.

MANDATORY TEXT:
The cover MUST always contain the exact phrase:
From Shein

“From Shein” must be clearly readable.
Do not omit it.

Do not show product codes on the cover.
Do not show prices.
Do not add unrelated text.

STYLE:
Warm, cozy, feminine, clean and premium.
Pinterest inspired fashion editorial aesthetic.
Soft natural lighting.
Neutral autumn bedding.
Balanced composition with all four sweaters visible.
Vertical 9:16.

NEGATIVE REQUIREMENTS:
No people.
No models.
No hands.
No mannequins.
No extra sweaters.
No unrelated clothing.
No screenshots.
No watermark.
No prices.
No product codes.

The final cover must feature exactly the four selected sweaters, a stylish autumn sweater headline, and the mandatory words “From Shein”.
`;
}

export function createSweaterPrompts(video) {
  const imagePrompts = video.sweaters.map((product, index) => createSweaterImagePrompt(product, index + 1));
  const coverPrompt = createSweaterCoverPrompt(video.sweaters);
  return { prompts: [...imagePrompts, coverPrompt], coverPrompt };
}
