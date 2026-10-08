function code(product) {
  return String(product?.code || "").trim();
}

function name(product) {
  return String(product?.name || "Jacket").trim();
}

export function createJacketImagePrompt(product, imageNumber) {
  return `
Create a vertical 9:16 premium SHEIN fashion product image using the uploaded jacket reference.

This is BILLEDE ${imageNumber}.

Use exactly ONE jacket, the exact jacket from the uploaded reference.

SCENE:
Place the jacket naturally laid completely flat on a beautiful made bed.
Photograph the scene directly from above in a true top down flat lay perspective.
The camera should look straight down at the bed and jacket.
The jacket must be the clear visual focus and large enough to see its design clearly.
Use soft natural bedroom lighting and a clean, cozy, premium Pinterest inspired autumn aesthetic.
The bedding should be tasteful and neutral so it does not compete with the jacket.
The jacket should look neatly styled with the front side visible.
No hanger. No person. No model. No mannequin. No hands. No other clothing items.

IMPORTANT JACKET STYLING:
Where the jacket material naturally allows it, gently push BOTH loose side edges inward below the sleeves and around the waist to create a soft, subtly shaped flat lay silhouette.
Shape only the loose fabric; never alter the jacket cut, construction or original proportions.
For structured, padded, leather or stiff jackets, keep their natural shape instead of forcing an hourglass silhouette.
Keep the shoulders, sleeves and hem at their natural width, with the front clearly visible.
Do not fold the front over itself or hide zippers, buttons, lapels, collars, pockets, graphics or other design details.
Do not make the jacket look worn by an invisible person or give it a three dimensional body shape.
It must remain a real garment lying flat on the bed.

PRODUCT FIDELITY:
Use the exact jacket shown in the uploaded product reference: ${name(product)}.
Preserve its exact color, fabric texture, pattern, graphics, collar, lapels, zippers, buttons, pockets, sleeves, original garment proportions, material appearance and all visible design details.
Do not redesign it.
Do not recolor it.
Do not invent details.
Do not replace it with a similar jacket.
Any shaping must come ONLY from arranging loose fabric naturally on the bed, never from redesigning or tailoring the jacket.

PRODUCT CODE:
Place this exact product code above the jacket:
${code(product)}

The code must be clearly readable in simple elegant black typography.
The code must appear above the jacket, not on top of the jacket.
Do not change, shorten or invent the code.
Do not display the product name, price or any other text.

COMPOSITION:
Vertical 9:16.
One jacket only.
Jacket laid flat on the bed.
Direct top down photograph.
Gently shaped sides below the sleeves where the material naturally allows it.
Enough clean space around the jacket.
Realistic fabric texture and natural folds created by pushing the sides inward.
Professional fashion photography.

NEGATIVE REQUIREMENTS:
No forced hourglass shape on structured or stiff jackets.
No invisible body inside the jacket.
No fake fitted garment redesign.
No people.
No model.
No mannequin.
No hands.
No hanger.
No extra jackets.
No other clothes.
No shoes.
No accessories placed as products.
No product packaging.
No screenshots.
No watermark.
No prices.
No product name as text.
No extra text besides the exact product code.

The final result must look like a real premium top down photograph of the exact SHEIN jacket laid flat on a bed, with loose fabric gently shaped inward below the sleeves where natural for this jacket, while preserving its original construction.
`;
}

export function createJacketCoverPrompt(jackets) {
  const refs = jackets.map((product, index) => `Jacket ${index + 1}: ${name(product)} | Code: ${code(product)}`).join("\n");

  return `
Create a vertical 9:16 raw, effortless autumn fashion cover photographed directly from above on a real bed.

Use exactly the FOUR uploaded jacket references below:
${refs}

The final image may contain ONLY these four jackets, the bed and the required text. Nothing else may be added to the image.

SCENE:
Use a real, naturally made bed with simple neutral bedding.
Photograph everything directly from above in a true top down perspective.
Lay the four jackets casually around the bed.
Do NOT arrange them in a grid.
Do NOT make the placement perfectly symmetrical.
Do NOT make the composition look overly designed, staged or precise.
The jackets may sit at slightly different angles and positions.
Allow natural spacing and imperfect placement so it feels raw, relaxed and effortless, like someone naturally laid four favorite jackets on their bed for a quick fashion photo.
The composition should still look attractive and intentional enough for social media, but never perfect or artificial.

JACKETS:
Use exactly the four uploaded jackets and keep each one clearly recognizable.
Preserve the exact original color, fabric texture, graphics, pattern, collar, lapels, zippers, buttons, pockets, sleeves, material appearance and visible design details of every jacket.
Do not recolor, redesign or replace any jacket.
Keep them lying flat on the bed with natural fabric folds.
They do not need to have identical positioning or identical shapes.

TEXT PLACEMENT:
All text must be placed in the MIDDLE OF THE BED, visually centered in the composition.
Keep a natural open area near the center of the bed for the text.
The jackets should sit loosely around this central text area rather than forming a rigid frame or grid.

TEXT HIERARCHY, EXACTLY THREE LEVELS:
Line 1, OVERLINE: Always write the exact word “Autumn”. This must be a smaller overline above the main headline.
Line 2, MAIN HEADLINE: Create a short stylish jacket headline that does NOT contain the word “Autumn”. Good examples are “Jacket Season”, “Cozy Jackets”, “The Jacket Edit”, “The Layering Edit” or another short jacket focused headline without the word Autumn.
Line 3, SUBLINE: Always write the exact phrase “From Shein”.

The visual order must always be:
Autumn
[creative main headline without the word Autumn]
From Shein

IMPORTANT: The word “Autumn” may appear ONLY ONCE in the entire image. Never generate combinations such as “Autumn Autumn Jackets”, “Autumn Autumn Edit” or a main headline containing Autumn. Because the overline already says Autumn, the main headline must never include Autumn.

These three text lines are the only text allowed in the image.
Use simple tasteful typography that feels natural and editorial, not like a decorative graphic poster.

ABSOLUTELY NO EXTRA OBJECTS:
No flowers.
No leaves.
No autumn decorations.
No pumpkins.
No candles.
No coffee cups.
No books.
No magazines.
No jewelry.
No shoes.
No bags.
No accessories.
No pillows added as decorative props.
No blankets added as styling props.
No product packaging.
No hangers.
No people.
No hands.
No models.
No mannequins.
No product codes.
No prices.
No logos.
No watermark.
No extra text.

The cover must feel raw, simple and natural. It should look like a real top down photo of four jackets casually laid on a bed. In the middle of the bed, the text hierarchy must be Autumn as the overline, a creative jacket headline without the word Autumn, and From Shein underneath. The only visible elements must be the bed, the four jackets and these three text lines.

Output format: vertical 9:16.
`;
}

export function createJacketPrompts(video) {
  const imagePrompts = video.jackets.map((product, index) => createJacketImagePrompt(product, index + 1));
  const coverPrompt = createJacketCoverPrompt(video.jackets);
  return { prompts: [...imagePrompts, coverPrompt], coverPrompt };
}
