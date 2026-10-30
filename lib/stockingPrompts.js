export const stockingReferenceName = (slide, index) => `B${slide}-P${String(index + 1).padStart(2, "0")}`;

export function createStockingPrompts(video) {
  const coverPrompt = `Create one original vertical 9:16 Christmas shopping carousel cover, 1080 x 1920. Opaque warm white background, pastel pink gingham corners, pink satin bows, delicate snowflakes and tiny festive sparkles. No cherry blossoms. Large bold dark chocolate decorative serif title centered in the upper half, spelled exactly:
STOCKING
STUFFERS
Below it in smaller clear type: SHEIN CODES + PRICES
The main visual below the title is ONE large beautiful blush pink Christmas stocking with a fluffy white cuff and satin bow, fully visible and instantly recognizable. Leave generous breathing room around the title and stocking. Festive, cute, kawaii and clean, matching a pink squishy product catalogue. The stocking is an illustration/decorative prop, not a product listing. No product photos or invented gift products, no prices, codes, discount claims, logos, watermark or social media interface. Only the specified title and subtitle. Output one finished cover, no references required.`;
  const prompts = video.slides.map((products, slideIndex) => `Create one finished vertical 9:16 product catalogue image, 1080 x 1920, for a Stocking Stuffers Christmas carousel. Use exactly the THREE supplied product references identified below. All printed text must be English; preserve product names and codes exactly as supplied.

LAYOUT — match the pink squishy catalogue arrangement:
Opaque white background. Exactly THREE equally sized horizontal product sections stacked vertically, never a 3-column grid. In EACH section, place a large isolated product photo on the LEFT and its information on the RIGHT. Product name in bold black over a pastel pink brushstroke; below it the label SEARCH CODE and the exact code in a pale pink rounded box with a fine dashed pink outline; below that the supplied price and currency in very large hot-pink type inside a pale pink rounded rectangle, with a short black underline. Thin pink dividers between rows. Small pink hearts, satin bows and delicate snowflake doodles in the margins, without covering products or text. Keep spacing, scale and alignment consistent across all three pages.

EXACT REFERENCES (file extension may vary):
${products.map((p, i) => `Row ${i + 1}: reference ${stockingReferenceName(slideIndex + 1, i)} | Name: ${p.name} | Exact search code: ${p.code} | Exact price: ${p.price} | Currency: ${p.currency}`).join("\n")}

Match by reference filename, never upload order. Preserve every code character, including leading zeros. Use only supplied prices and currencies; no conversion, discounts or invented details. Preserve each actual product's shape, color, material, markings, proportions and quantity as sold. Remove original photo backgrounds cleanly, use subtle grounding shadows, and keep each complete product large and uncropped. Do not duplicate or substitute products. These are small stocking gift ideas; do not put a stocking on the product pages.

At the bottom, add a pale pink rounded banner with a bookmark icon and the exact text SAVE THIS FOR CHRISTMAS! followed by so you don't lose the codes. Keep all content inside safe margins. No extra heading, watermark, username, platform interface or unrelated props. Final check: exactly three product rows, photos LEFT, matching names/codes/prices RIGHT, fully legible English text.`);
  return { prompts: [...prompts, coverPrompt], coverPrompt };
}
