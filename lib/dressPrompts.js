export const DRESS_VIDEO_COUNTS = [1, 2, 4, 8];
const DRESSES_PER_VIDEO = 3;

const BED_STYLE = `Photograph from directly above in vertical 9:16. Use softly lit, lightly rumpled neutral bedding. Keep the full garment visible. Let the fabric settle under gravity with small creases and slight asymmetry, like a dress casually laid down by hand. Preserve each dress's colour, pattern, neckline, length and visible construction. Show only the referenced garments and the bed. Leave out people, body parts, mannequins, hangers and accessories. Keep all text legible and off the fabric. Leave a comfortable bedding margin around every garment so no straps or hems are cropped.`;

// Both spellings have been supplied for the blue dress; preserve the actual code.
const EXCLUSIVE_DRESS_CODES = new Set(["775P84R", "775P86R"]);
function canShareVideo(dress, selected) {
  const code = String(dress.code).trim().toUpperCase();
  return !selected.some((other) => {
    const otherCode = String(other.code).trim().toUpperCase();
    return (code === "EEVATZ9" && EXCLUSIVE_DRESS_CODES.has(otherCode)) ||
      (otherCode === "EEVATZ9" && EXCLUSIVE_DRESS_CODES.has(code));
  });
}

function createDressVideo(dresses, videoNumber) {
  const cover = {
    folder: "COVER",
    products: dresses,
    prompt: `Create a professional, eye-catching TikTok fashion cover in portrait 9:16, 1080 x 1920 pixels. Use only the three uploaded reference images as sources for the exact dress designs.

Photograph directly from above on a real bed with warm ivory, lightly rumpled bedding, warm soft sunlight and gentle shadows. Lay the dresses naturally by hand with small creases, relaxed fabric and slight asymmetry, not inflated or body-shaped. Preserve each reference dress's exact colour, material, pattern, neckline, length and visible construction.

Place REFERENCE-1 on the left, REFERENCE-2 in the middle and REFERENCE-3 on the right. Angle them gently and stagger their heights in a loose editorial arrangement. Keep every dress completely visible, including all straps and hems, with comfortable bedding margins on every side.

Overlay the title across the dresses near the middle of the portrait. Centre the title block horizontally with its vertical centre approximately 48% down the image, NOT at the top or in the upper fifth. First line exactly "Shein Dresses", second line exactly "+ Codes". Use large, elegant, dark chocolate italic serif typography, with the first line largest and the second smaller. Add a subtle light outline or shadow if needed for excellent phone readability.

The ONLY visible text is "Shein Dresses" and "+ Codes". No product codes, labels, sticker bubbles or other text anywhere on the cover. No people, body parts, mannequins, hangers or accessories, except a matching scarf when it belongs to a referenced dress. The result should feel like authentic, stylish fashion photography with a clear central title and a polished TikTok look.`
  };
  const slides = dresses.map((dress, index) => ({
    folder: `IMAGE ${index + 1}`,
    products: [dress],
    prompt: `Use REFERENCE-1 as the source for the exact dress. Recreate the garment on its own, laid naturally on the bed, using the product photo to identify its design.

Place this exact product code in clear space above the dress: ${dress.code}. This code is the only text allowed on this individual image.

${BED_STYLE}`
  }));

  return { videoNumber, images: [cover, ...slides] };
}

export function generateDressVideos(products, videoCount) {
  if (products.length < DRESSES_PER_VIDEO) {
    throw new Error("Der skal være mindst tre aktive kjoler med forskellige koder og gyldige billedlinks i Google Sheets.");
  }

  const pool = [...products];
  for (let index = pool.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[other]] = [pool[other], pool[index]];
  }

  return Array.from({ length: videoCount }, (_, videoIndex) => {
    let dresses = [];
    const start = (videoIndex * DRESSES_PER_VIDEO) % pool.length;
    // Try another starting product if the first group cannot be completed.
    for (let attempt = 0; attempt < pool.length; attempt++) {
      dresses = [];
      for (let offset = 0; offset < pool.length && dresses.length < DRESSES_PER_VIDEO; offset++) {
        const candidate = pool[(start + attempt + offset) % pool.length];
        if (canShareVideo(candidate, dresses)) dresses.push(candidate);
      }
      if (dresses.length === DRESSES_PER_VIDEO) break;
    }
    if (dresses.length < DRESSES_PER_VIDEO) {
      throw new Error("Der er ikke nok kompatible kjoler til en video med tre produkter. 775P84R/775P86R og EEVATZ9 må ikke være i samme video. Tilføj flere aktive kjoler.");
    }
    return createDressVideo(dresses, videoIndex + 1);
  });
}

export function createDressPromptFiles(videos) {
  const entries = videos.flatMap(({ videoNumber, images }) => images.map(({ folder, prompt }, index) => ({
    path: `VIDEO ${videoNumber}/${folder}`,
    output: `v${videoNumber}/v${videoNumber}-${index + 1}.png`,
    prompt
  })));

  return {
    master: `Brug den uploadede ZIP med produktbilleder og de tilhørende prompts til at lave alle ${entries.length} færdige billeder.

Lav ét stående 9:16-billede pr. mappe. Brug kun referencebillederne i den pågældende mappe sammen med dens PROMPT.txt. Den samlede PROMPTS.txt gengiver de samme prompts. Match REFERENCE-numre og produktkoder inden for hver mappe. Kjolerne skal ligge naturligt på en seng med små folder og let asymmetri. Forsiderne skal være 1080 × 1920 pixels i 9:16 med varmt, blødt sollys og et naturligt, forskudt layout. På forsiderne er den eneste tekst præcis "Shein Dresses" med "+ Codes" på linjen under. Placér titelblokken hen over kjolerne mod midten, centreret vandret med centrum cirka 48 % nede i billedet, i stor, elegant, mørkebrun kursiv serifskrift. Der må ikke være produktkoder eller mærkater på forsiderne. På de enkelte produktbilleder er den præcise produktkode den eneste billedtekst.

Gem billederne i den rækkefølge og med de filnavne, der står her:
${entries.map(({ path, output }) => `${path} → ${output}`).join("\n")}

Kontrollér at alle ${entries.length} billeder er med, og returnér dem i én ZIP-fil som et klikbart downloadlink.`,
    all: entries.map(({ path, output, prompt }) => `${path} → ${output}\n\n${prompt}`).join("\n\n\n")
  };
}
