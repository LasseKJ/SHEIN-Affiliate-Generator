
const COVER_THEMES = [
  { id: "fir-gifts", scene: "A small cluster of wrapped ivory gifts beneath a simple fir branch, with burgundy ribbon." },
  { id: "candlelight", scene: "A softly glowing candle beside a single pine sprig and a folded forest-green knit." },
  { id: "ornament", scene: "A single muted red glass ornament resting beside evergreen branches on warm ivory linen." },
  { id: "window-snow", scene: "A softly lit winter window with a hint of snow outside and one evergreen branch in a ceramic vase." },
  { id: "stocking", scene: "A natural knitted Christmas stocking hanging from a simple wooden peg beside a tiny pine sprig." },
  { id: "berry-wreath", scene: "A modest evergreen wreath with a few red berries on a pale wall, photographed in soft daylight." },
  { id: "gift-bow", scene: "One matte forest-green gift box tied with a relaxed cream fabric bow, with a small fir clipping." },
  { id: "gingerbread", scene: "A small plate of simple gingerbread stars beside a pine sprig and folded cream linen." }
];

function createCoverPrompt(theme, products = []) {
  const giftContext = products.map(product => `${product.name} (${product.category})`).join(", ") || "the products in this wish list";
  return `Create one vertical 9:16 Christmas Wish List cover image. The only visible text must be the exact title “Christmas Wish List Ideas From SHEIN”, clearly spelled and easy to read. Design a warm, tasteful Christmas scene with a softly lit Scandinavian holiday feel: ${theme.scene} Make this selected scene feel relevant to this wish list’s gift mix: ${giftContext}. Treat these names and categories as private art direction only; do not render them or show the products as listings. Each post in the same batch must have a visibly different cover composition; use the selected scene as its defining visual. Use natural warm light, gentle shadows, realistic materials, a calm festive palette of cream, evergreen and restrained burgundy. Make the scene feel like a polished holiday editorial photograph. Do not include product listings, product codes, prices, logos, watermarks, social media UI, extra words, or unrelated clutter. Keep the title prominent with generous negative space and safe margins. Create a fresh cover visual by using this selected scene theme; keep the specified title unchanged.`;
}

function createImagePrompt(products, imageNumber) {
  const references = products.map((product, index) =>
    `Reference B${imageNumber}-P${String(index + 1).padStart(2, "0")} | Item: ${product.name} | Exact code: ${product.code}`
  ).join("\n");
  return `Create one vertical 9:16 Christmas Wish List product image. Use exactly these four supplied product references, with each complete item shown once in a clean 2-by-2 arrangement. Give every item its own clear area; place its exact product code directly below or beside the item in legible simple type, then add one short AI-generated product title (3-6 words) directly beneath the code. The exact code and generated title are the only text for that item. Generate an accurate, appealing English title based only on the supplied product name and reference photo; do not invent features, materials, benefits or claims. Do not show the supplied product name or price.

PRODUCT REFERENCES (match by filename, never upload order):
${references}

Use the reference photo as the sole source for each product. Preserve the actual shape, color, material, pattern, markings, proportions and quantity. Do not redesign, duplicate, omit, crop, replace, or invent products. Keep all four items and codes inside safe margins. Use a restrained, cozy Christmas setting with soft warm light and subtle evergreen details; background styling must not compete with or cover the products. No extra products, labels, discount claims, logos, watermark, or other text. Output one finished image in exact 9:16 portrait format.`;
}

export function createChristmasWishListPrompts(video) {
  const theme = COVER_THEMES.find(item => item.id === video.coverThemeId) || COVER_THEMES[0];
  const coverPrompt = createCoverPrompt(theme, video.slides.flat());
  const imagePrompts = video.slides.map((products, index) => createImagePrompt(products, index + 1));
  const prompts = [coverPrompt, ...imagePrompts];
  const images = [
    { folder: "COVER", products: [], prompt: coverPrompt },
    ...video.slides.map((products, index) => ({
      folder: `IMAGE ${index + 1}`,
      products,
      prompt: imagePrompts[index]
    }))
  ];
  return { coverPrompt, prompts, images };
}
