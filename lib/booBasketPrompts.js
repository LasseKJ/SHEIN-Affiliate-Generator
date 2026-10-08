export function booBasketReferenceName(imageNumber, productIndex) {
  return `B${imageNumber}-P${String(productIndex + 1).padStart(2, "0")}`;
}

export function createBooBasketSlidePrompt(products, imageNumber) {
  const references = products.map((product, index) =>
    `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}: reference ${booBasketReferenceName(imageNumber, index)} | Product: ${product.name} | Exact product code: ${product.code}`
  ).join("\n");

  return `Create one vertical 9:16 Boo Basket product image (1080 x 1920 composition) using exactly the NINE uploaded product references for BILLEDE ${imageNumber}.

LAYOUT
Pure white, opaque background. Arrange exactly nine different products in THREE ROWS and THREE COLUMNS, read left to right, top to bottom:
1  2  3
4  5  6
7  8  9
Make the arrangement aesthetic and natural, like a curated autumn gift guide. Use subtle differences in scale and angle appropriate to each item, with balanced whitespace and clear separation. Keep the 3x3 reading order unmistakable without visible grid lines, cards or boxes. Show each complete product clearly, with no overlap or cropping. Leave comfortable white margins above, below and at the sides. A set sold as one product must remain one grouped reference item, with one code.

EXACT PRODUCT REFERENCES AND CODES
Reference filenames start with the identifiers below; their file extensions may differ.
${references}

Place each exact product code in legible black, bold serif typography DIRECTLY BELOW its corresponding product, close to the bottom of the item. Keep the code and product visually paired. Match every character and preserve leading zeros, punctuation and capitalization. Do not invent, shorten, swap or duplicate codes. The ONLY added text is these nine exact codes. Product names above are identification metadata and must not be printed.

PRODUCT FIDELITY
Use the supplied products, preserving their colors, shape, materials, patterns, proportions and details. Do not substitute generic autumn products or recolor them to match a theme. Use soft, consistent studio lighting and very subtle grounding shadows. The mood is cozy and curated while every product remains easy to identify.

EXCLUSIONS
No extra basket or decorative props unless one of the nine references is that product. No tenth item. No duplicate products. No people or hands. No heading, prices, creator handle, watermark or added brand text. No TikTok interface, buttons, hearts, captions, search bar, carousel dots, slide counter or screenshot border.

FINAL CHECK
Exactly nine reference products, three rows by three columns, each with its own exact code closely underneath. Pure white background, natural balanced arrangement, vertical 9:16.`;
}

export function createBooBasketCoverPrompt() {
  return `Create one minimalist vertical 9:16 cover image for an autumn Boo Basket idea carousel.
Use an almost-white background with a very soft warm cream glow behind the centered title and generous empty space above and below.
Place the exact title in bold black decorative serif typography, centered on two lines:
BOO BASKET
IDEAS
Keep the whole title and decoration group near the center of the canvas. Place a small orange pumpkin above the title, a small cream candle with a subtle autumn leaf detail to the lower left, and a small warm brown/orange plaid autumn bow to the lower right. These three accents must be smaller than the title, balanced and separated from the lettering.
Keep the composition clean, cozy and spacious. Do not add a product grid, product photos, product codes or a basket. No creator handle, username, watermark or other text. No TikTok interface, hearts, buttons, captions, search bar, slide counter or carousel dots.
The only text must be BOO BASKET IDEAS, spelled exactly. Output a clean original cover, vertical 9:16, with an opaque cream/white background. No reference product images are required.`;
}

export function createBooBasketPrompts(video) {
  const coverPrompt = createBooBasketCoverPrompt();
  return {
    prompts: [...video.slides.map((slide, index) => createBooBasketSlidePrompt(slide, index + 1)), coverPrompt],
    coverPrompt
  };
}
