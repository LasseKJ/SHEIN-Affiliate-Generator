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
    prompt: `Create an eye-catching fashion carousel cover with the three exact dresses in the reference images. Reserve the upper fifth of the portrait for a large, bold headline reading exactly "Shein Dresses" and a smaller second line reading exactly "+ Codes". Use clean, high-contrast typography that is readable on a phone. Arrange the three dresses loosely below the heading on the same bed, with distinct angles, natural folds and enough space to see every dress clearly. Keep the heading and product labels separate from the garments. The only text allowed on this cover is "Shein Dresses", "+ Codes" and the exact supplied product codes.

${dresses.map(({ code }, index) => `REFERENCE-${index + 1} → product code ${code}. Place this code next to its own dress.`).join("\n")}

${BED_STYLE}`
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

Lav ét stående 9:16-billede pr. mappe. Brug kun referencebillederne i den pågældende mappe sammen med dens PROMPT.txt. Den samlede PROMPTS.txt gengiver de samme prompts. Match REFERENCE-numre og produktkoder inden for hver mappe. Kjolerne skal ligge naturligt på en seng med små folder og let asymmetri. På forsiderne skal overskriften være præcis "Shein Dresses" med "+ Codes" på linjen under, samt de præcise produktkoder ved hver kjole. På de enkelte produktbilleder er den præcise produktkode den eneste billedtekst.

Gem billederne i den rækkefølge og med de filnavne, der står her:
${entries.map(({ path, output }) => `${path} → ${output}`).join("\n")}

Kontrollér at alle ${entries.length} billeder er med, og returnér dem i én ZIP-fil som et klikbart downloadlink.`,
    all: entries.map(({ path, output, prompt }) => `${path} → ${output}\n\n${prompt}`).join("\n\n\n")
  };
}
