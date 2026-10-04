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
The sweater should look neatly styled with the front side visible.
No hanger. No person. No model. No mannequin. No hands. No other clothing items.

IMPORTANT SWEATER STYLING:
Do NOT lay the torso of the sweater completely straight or box shaped.
After laying the sweater flat, gently push and tuck BOTH side edges of the sweater inward directly underneath the sleeves and around the waist area.
The left and right sides must curve inward symmetrically and then widen slightly again toward the bottom hem.
This must create a clearly visible soft HOURGLASS silhouette while the sweater remains completely flat on the bed.
The waist area should look intentionally cinched inward by arranging the fabric, not by changing the actual sweater design.
Keep the shoulders and sleeves at their natural width.
Keep the bottom hem visible and naturally wider than the cinched waist area.
The result should look like a stylist physically pushed the loose fabric inward from both sides underneath the sleeves to create a flattering hourglass flat lay shape.
Do not fold the front of the sweater over itself.
Do not hide important graphics, patterns, buttons, pockets or other design details.
Do not make the sweater look worn by an invisible person or give it a three dimensional body shape.
It must remain a real garment lying flat on the bed.

PRODUCT FIDELITY:
Use the exact sweater shown in the uploaded product reference: ${name(product)}.
Preserve its exact color, knit, pattern, graphics, neckline, sleeves, original garment proportions, material appearance and all visible design details.
Do not redesign it.
Do not recolor it.
Do not invent details.
Do not replace it with a similar sweater.
The hourglass appearance must come ONLY from how the loose sweater is arranged on the bed, never from redesigning or tailoring the product.

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
Clearly cinched inward sides underneath the sleeves, creating a soft hourglass silhouette.
Enough clean space around the sweater.
Realistic fabric texture and natural folds created by pushing the sides inward.
Professional fashion photography.

NEGATIVE REQUIREMENTS:
No straight box shaped torso.
No completely parallel side edges.
No invisible body inside the sweater.
No fake fitted garment redesign.
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

The final result must look like a real premium top down photograph of the exact SHEIN sweater laid flat on a bed, with the fabric deliberately pushed inward from both sides below the sleeves to form a flattering hourglass silhouette.
`;
}

export function createSweaterCoverPrompt(sweaters) {
  const refs = sweaters.map((product, index) => `Sweater ${index + 1}: ${name(product)} | Code: ${code(product)}`).join("\n");

  return `
Create a vertical 9:16 raw, effortless autumn fashion cover photographed directly from above on a real bed.

Use exactly the FOUR uploaded sweater references below:
${refs}

The final image may contain ONLY these four sweaters, the bed and the required text. Nothing else may be added to the image.

SCENE:
Use a real, naturally made bed with simple neutral bedding.
Photograph everything directly from above in a true top down perspective.
Lay the four sweaters casually around the bed.
Do NOT arrange them in a grid.
Do NOT make the placement perfectly symmetrical.
Do NOT make the composition look overly designed, staged or precise.
The sweaters may sit at slightly different angles and positions.
Allow natural spacing and imperfect placement so it feels raw, relaxed and effortless, like someone naturally laid four favorite sweaters on their bed for a quick fashion photo.
The composition should still look attractive and intentional enough for social media, but never perfect or artificial.

SWEATERS:
Use exactly the four uploaded sweaters and keep each one clearly recognizable.
Preserve the exact original color, knit, graphics, pattern, neckline, sleeves, material appearance and visible design details of every sweater.
Do not recolor, redesign or replace any sweater.
Keep them lying flat on the bed with natural fabric folds.
They do not need to have identical positioning or identical shapes.

TEXT PLACEMENT:
All text must be placed in the MIDDLE OF THE BED, visually centered in the composition.
Keep a natural open area near the center of the bed for the text.
The sweaters should sit loosely around this central text area rather than forming a rigid frame or grid.

TEXT HIERARCHY, EXACTLY THREE LEVELS:
Line 1, OVERLINE: Always write the exact word “Autumn”. This must be a smaller overline above the main headline.
Line 2, MAIN HEADLINE: Create a short stylish sweater headline that does NOT contain the word “Autumn”. Good examples are “Sweater Season”, “Cozy Sweaters”, “The Sweater Edit”, “Cozy Knit Edit” or another short sweater focused headline without the word Autumn.
Line 3, SUBLINE: Always write the exact phrase “From Shein”.

The visual order must always be:
Autumn
[creative main headline without the word Autumn]
From Shein

IMPORTANT: The word “Autumn” may appear ONLY ONCE in the entire image. Never generate combinations such as “Autumn Autumn Sweaters”, “Autumn Autumn Edit” or a main headline containing Autumn. Because the overline already says Autumn, the main headline must never include Autumn.

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

The cover must feel raw, simple and natural. It should look like a real top down photo of four sweaters casually laid on a bed. In the middle of the bed, the text hierarchy must be Autumn as the overline, a creative sweater headline without the word Autumn, and From Shein underneath. The only visible elements must be the bed, the four sweaters and these three text lines.

Output format: vertical 9:16.
`;
}

export function createSweaterPrompts(video) {
  const imagePrompts = video.sweaters.map((product, index) => createSweaterImagePrompt(product, index + 1));
  const coverPrompt = createSweaterCoverPrompt(video.sweaters);
  return { prompts: [...imagePrompts, coverPrompt], coverPrompt };
}
