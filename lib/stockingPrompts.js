export const CHRISTMAS_COVER_THEMES = [
  {
    "id": "christmas-gift-ideas",
    "title": "CHRISTMAS\nGIFT IDEAS",
    "visual": "One matte forest green gift box with a cream fabric ribbon."
  },
  {
    "id": "elf-gifts",
    "title": "ELF\nGIFTS",
    "visual": "One forest green felt elf hat with a softly bent tip beside a tiny oatmeal gift with burgundy ribbon. No character or face."
  },
  {
    "id": "secret-santa-gifts",
    "title": "SECRET SANTA\nGIFTS",
    "visual": "One matte burgundy gift with cream cotton ribbon and a blank ivory gift tag."
  },
  {
    "id": "little-christmas-treats",
    "title": "LITTLE CHRISTMAS\nTREATS",
    "visual": "Three tiny presents in matte oatmeal, dusty sage and burgundy paper with cream cotton ribbons, arranged in a relaxed cluster."
  },
  {
    "id": "gifts-for-her",
    "title": "GIFTS\nFOR HER",
    "visual": "One muted plum gift with an oversized relaxed ivory fabric bow and a tiny evergreen sprig tucked beneath the ribbon."
  },
  {
    "id": "christmas-wishlist",
    "title": "CHRISTMAS\nWISHLIST",
    "visual": "A blank ivory wish-list card resting at an angle on a forest green envelope, with loose burgundy fabric ribbon. No writing or markings on the stationery."
  },
  {
    "id": "under-the-tree",
    "title": "UNDER\nTHE TREE",
    "visual": "Two modest oatmeal and burgundy gifts with cream ribbons beneath a natural fir branch extending from the lower right edge."
  },
  {
    "id": "stocking-stuffers",
    "title": "STOCKING\nSTUFFERS",
    "visual": ""
  }
];

export const stockingReferenceName = (slide, index) => `B${slide}-P${String(index + 1).padStart(2, "0")}`;

export function createStockingPrompts(video) {
  // One distinct stocking body color per carousel, including batches of eight.
  const stockingColors = ["oatmeal","muted forest green","muted burgundy","dusty sage green","warm taupe","dusty blue","soft terracotta","muted plum"];
  const videoIndex = Number.isInteger(video.videoNumber) && video.videoNumber > 0 ? video.videoNumber - 1 : 0;
  const stockingColor = stockingColors[videoIndex % stockingColors.length];
  const stockingCoverPrompt = `Create one original vertical 9:16 Christmas shopping carousel cover, 1080 x 1920. Quiet Scandinavian Christmas style. Flat opaque warm ivory background, generous empty space, muted forest green and soft burgundy accents. A single small evergreen sprig in one corner. Simple, natural and understated. No patterns, gingham, sparkles, doodles, hearts, decorative borders or glossy effects. Medium-sized dark charcoal classic serif title centered in the upper half, spelled exactly:
STOCKING
STUFFERS
Below it in smaller clear type: SHEIN CODES + PRICES
The main visual below the title is ONE simple ${stockingColor} knitted Christmas stocking with a cream cuff and a small muted burgundy hanging loop, fully visible and instantly recognizable. The stocking body must be ${stockingColor}; keep this assigned color clearly visible rather than replacing it with cream or oatmeal. Leave generous breathing room around the title and stocking. Calm, warm and naturally Christmas-like, matching a minimal Scandinavian gift catalogue. Soft natural light, realistic knitted texture, restrained contrast and a very subtle shadow. The stocking is an illustration/decorative prop, not a product listing. No product photos or invented gift products, no prices, codes, discount claims, logos, watermark or social media interface. Only the specified title and subtitle. Output one finished cover, no references required.`;
  const theme = CHRISTMAS_COVER_THEMES.find(t => t.id === video.coverThemeId) || CHRISTMAS_COVER_THEMES[7];
  const coverPrompt = theme.id === "stocking-stuffers" ? stockingCoverPrompt : `Create one original vertical 9:16 Christmas shopping carousel cover, 1080 x 1920. Quiet Scandinavian Christmas style. Flat opaque warm ivory background, generous empty space, muted forest green and soft burgundy accents. One small evergreen sprig in a corner. Simple, natural and understated. Medium-sized dark charcoal classic serif title centered in the upper half, spelled exactly:
${theme.title}
Below it in smaller clear type: SHEIN CODES + PRICES
Main visual below the title: ${theme.visual}
Soft natural light, realistic tactile textures, restrained contrast and subtle shadows. Generous breathing room. All objects are decorative props, not product listings. No product photos, invented gift products, visible contents, prices, codes, discount claims, logos, watermark or social media interface. No patterns, gingham, sparkles, doodles, hearts, decorative borders or glossy effects. No text on tags, cards or envelopes. Only the specified title and subtitle. Output one finished cover, no references required.`;
  const prompts = video.slides.map((products, slideIndex) => `Create one finished vertical 9:16 product catalogue image, 1080 x 1920, for a Christmas gift carousel. Use exactly the THREE supplied product references identified below. All printed text must be English; preserve product names and codes exactly as supplied.

LAYOUT — clean, understated Christmas gift catalogue:
Flat opaque warm ivory background. Exactly THREE equally sized horizontal product sections stacked vertically. In EACH section, place a large isolated product photo on the LEFT and its information on the RIGHT. Use a simple readable sans-serif font: product name in medium-weight charcoal, then the small label SEARCH CODE with the exact code beneath it, then the supplied price and currency in moderately sized muted burgundy type. Use plain text, without boxes, pills, brushstrokes, dashed outlines or underlines. Thin warm-grey dividers between rows. Generous whitespace and consistent alignment. One tiny evergreen sprig in the top margin is the only Christmas decoration on each page. Keep the layout identical across all three pages. The overall result should feel like a quiet, practical Scandinavian Christmas catalogue. No hot pink, vivid accents, hearts, bows, snowflake doodles, sparkles, gradients or oversized promotional typography. These palette restrictions apply to the design, never recolor the actual products.

EXACT REFERENCES (file extension may vary):
${products.map((p, i) => `Row ${i + 1}: reference ${stockingReferenceName(slideIndex + 1, i)} | Name: ${p.name} | Exact search code: ${p.code} | Exact price: ${p.price} | Currency: ${p.currency}`).join("\n")}

Match by reference filename, never upload order. Preserve every code character, including leading zeros. Use only supplied prices and currencies; no conversion, discounts or invented details. Preserve each actual product's shape, color, material, markings, proportions and quantity as sold. Remove original photo backgrounds cleanly, use subtle grounding shadows, and keep each complete product large and uncropped. Do not duplicate or substitute products. These are Christmas gift ideas; do not put a stocking on the product pages.

At the bottom, place a small plain-text footer in muted charcoal with the exact text SAVE THIS FOR CHRISTMAS! followed by so you don't lose the codes. No banner or icon. Keep all content inside safe margins. No extra heading, watermark, username, platform interface or unrelated props. Final check: exactly three product rows, photos LEFT, matching names/codes/prices RIGHT, fully legible English text.`);
  return { prompts: [...prompts, coverPrompt], coverPrompt };
}
