export const DRESS_VIDEO_COUNTS = [1, 2, 4, 8];
const DRESSES_PER_VIDEO = 3;

const BED_STYLE = `Photograph from directly above in vertical 9:16. Use softly lit, lightly rumpled neutral bedding. Keep the full garment visible. Let the fabric settle under gravity with small creases and slight asymmetry, like a dress casually laid down by hand. Preserve each dress's colour, pattern, neckline, length and visible construction. Show only the referenced garments and the bed. Leave out people, body parts, mannequins, hangers and accessories. The exact supplied product codes are the only text to add. Keep them legible and off the fabric.`;

function createDressVideo(dresses, videoNumber) {
  const cover = {
    folder: "COVER",
    products: dresses,
    prompt: `Create a natural fashion carousel cover with the three exact dresses in the reference images. Arrange them loosely on the same bed with enough space to see each dress clearly. Vary their angles slightly.

${dresses.map(({ code }, index) => `REFERENCE-${index + 1} → product code ${code}. Place this code next to its own dress.`).join("\n")}

${BED_STYLE}`
  };
  const slides = dresses.map((dress, index) => ({
    folder: `IMAGE ${index + 1}`,
    products: [dress],
    prompt: `Use REFERENCE-1 as the source for the exact dress. Recreate the garment on its own, laid naturally on the bed, using the product photo to identify its design.

Place this exact product code in clear space above the dress: ${dress.code}

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
    const dresses = Array.from({ length: DRESSES_PER_VIDEO }, (_, index) =>
      pool[(videoIndex * DRESSES_PER_VIDEO + index) % pool.length]
    );
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

Lav ét stående 9:16-billede pr. mappe. Brug kun referencebillederne i den pågældende mappe sammen med dens PROMPT.txt. Den samlede PROMPTS.txt gengiver de samme prompts. Match REFERENCE-numre og produktkoder inden for hver mappe. Kjolerne skal ligge naturligt på en seng med små folder og let asymmetri. Brug de præcise produktkoder som eneste billedtekst.

Gem billederne i den rækkefølge og med de filnavne, der står her:
${entries.map(({ path, output }) => `${path} → ${output}`).join("\n")}

Kontrollér at alle ${entries.length} billeder er med, og returnér dem i én ZIP-fil som et klikbart downloadlink.`,
    all: entries.map(({ path, output, prompt }) => `${path} → ${output}\n\n${prompt}`).join("\n\n\n")
  };
}
