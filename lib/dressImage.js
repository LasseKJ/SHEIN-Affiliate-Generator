import sharp from "sharp";

const DRESS_PROMPT = `
Create a realistic overhead photograph of the exact dress in the reference,
laid casually on a bed with lightly rumpled neutral bedding and soft window light.
Use the reference as a garment reference. Show the whole dress on its own,
with no people, body parts, mannequin, hanger, accessories or other clothing.
Preserve the dress's color, pattern, neckline, cut, length and visible construction.
Let the fabric settle under gravity with small creases and slight asymmetry,
as if the dress was just laid down by hand. Keep its shape and details recognizable.
Leave a clear strip of bedding at the top for a product code. Generate no added text.
`;

export async function generateDressImage({ code, imageUrl }, apiKey) {
  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-image-1.5",
      images: [{ image_url: imageUrl }],
      prompt: DRESS_PROMPT,
      size: "1024x1536",
      quality: "medium",
      output_format: "webp"
    }),
    signal: AbortSignal.timeout(160_000)
  });

  if (!response.ok) {
    console.error("OpenAI dress image request failed:", response.status, response.headers.get("x-request-id"));
    throw new Error("Billedtjenesten kunne ikke redigere produktbilledet.");
  }

  const data = await response.json();
  const encodedImage = data.data?.[0]?.b64_json;
  if (!encodedImage) throw new Error("Billedtjenesten returnerede intet billede.");

  const image = sharp(Buffer.from(encodedImage, "base64"));
  const { width, height } = await image.metadata();
  const fontSize = Math.min(44, Math.floor((width * 0.85) / [...code].length));
  const escapedCode = code.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const label = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <text x="50%" y="5%" text-anchor="middle" font-family="sans-serif" font-weight="bold"
        font-size="${fontSize}" fill="#1a1a1a" stroke="#fff" stroke-width="3" paint-order="stroke">${escapedCode}</text>
    </svg>
  `);

  return image.composite([{ input: label }]).webp({ quality: 90 }).toBuffer();
}
