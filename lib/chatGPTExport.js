import JSZip from "jszip";

// Prompt order is authoritative; a cover is not necessarily the last image.
export function chatGPTEntries(category, videos, templates = {}) {
  return videos.flatMap(video => {
    const prompts = video.images?.map(image => image.prompt) || video.prompts;
    if (!Array.isArray(prompts) || !prompts.length) throw new Error("Videoen mangler prompts.");
    return prompts.map((prompt, index) => {
      const n = index + 1;
      let products = [], template;
      let folder = `IMAGE ${n}`;
      let referenceName = i => `B${n}-P${String(i + 1).padStart(2, "0")}`;
      if (category === "christmas-wishlist") {
        products = video.images[index].products;
        folder = video.images[index].folder;
        const imageNumber = Number(folder.match(/\\d+/)?.[0]);
        if (imageNumber) referenceName = i => `B${imageNumber}-P${String(i + 1).padStart(2, "0")}`;
      } else if (category === "dresses") {
        products = video.images[index].products;
        folder = video.images[index].folder;
        referenceName = i => `REFERENCE-${i + 1}`;
      } else if (category === "squishy") {
        products = index < 3 ? video.groups[index].products : video.groups.map(group => group.products[0]);
        template = index < 3 ? templates.image : templates.cover;
        if (!template) throw new Error("Squishy template mangler.");
      } else if (category === "autumn" || category === "winter") {
        products = index < 6 ? Object.values(video.outfits[Math.floor(index / 2)].products) : video.coverProducts;
      } else if (category === "jackets" || category === "sweaters") {
        const items = category === "jackets" ? video.jackets : video.sweaters;
        products = index < items.length ? [items[index]] : items;
      } else if (category === "essentials") {
        products = video.slides[index].products;
      } else if (category === "phone-cases") {
        products = video.slides[index] || [];
      } else if (category === "boo-basket" || category === "stocking") {
        products = video.slides[index] || [];
        folder = index < 3 ? `${category === "boo-basket" ? "BILLEDE" : "IMAGE"} ${n}` : category === "boo-basket" ? "FORSIDE" : "COVER";
      } else throw new Error(`Ukendt eksportkategori: ${category}`);
      if (!prompt?.trim() || !Array.isArray(products)) throw new Error(`Video ${video.videoNumber} mangler billeddata.`);
      return { id: `V${video.videoNumber}-${n}`, path: `VIDEO ${video.videoNumber}/${folder}`, output: `v${video.videoNumber}/v${video.videoNumber}-${n}.png`, prompt, products, template, referenceName };
    });
  });
}

export function createChatGPTPromptFiles(category, videos, templates) {
  const entries = chatGPTEntries(category, videos, templates);
  const mapping = entries.map(entry => `${entry.id}: ${entry.path}/PROMPT.txt → ${entry.output}`).join("\n");
  const master = `Brug den uploadede ZIP-fil og PROMPTS.txt til at lave alle ${entries.length} færdige billeder for ${category}.

Lav ét billede pr. prompt. Hver billedmappe indeholder PROMPT.txt, PRODUCTS.json og netop de referencebilleder, der hører til prompten. Brug kun referencerne i den pågældende mappe. PRODUCTS.json knytter hvert filnavn til det præcise produktnavn, produktkode, pris og valuta. Match efter disse oplysninger, hvis et B-nummer i prompten afviger: B-numre gælder kun inden for den aktuelle mappe. Bland aldrig referencer mellem billeder eller videoer. Hvis mappen ikke har produktreferencer, skal billedet laves uden produktfotos. TEMPLATE-filen, når den findes, hører kun til dette billede.

Følg hver prompts layout, titel, tekst og produktinformation præcist. Bevar produkternes identitet, form, farver og detaljer. Brug den vedlagte template, hvis der er en, og fjern pladsholdere. Lever færdige PNG-billeder i høj opløsning i præcis 9:16 med uigennemsigtig baggrund. Forsidens placering bestemmes af listen herunder, ikke af en generel antagelse om rækkefølgen.

På billeder med mennesker skal modellerne have naturlige, realistiske kropsproportioner. Benene må ikke forlænges kunstigt i forhold til overkrop og hoved. Ingen unaturligt høje hofter, forkortet overkrop eller forvrænget perspektiv. Brug normal kamerahøjde og et lige kamera uden lav vinkel eller ultravidvinkel. Tilpas 9:16-kompositionen ved at øge kameraafstanden og give luft omkring kroppen, aldrig ved at strække kroppen eller tøjet. Kontrollér og ret proportionerne før levering.

${mapping}

Kontrollér alle ${entries.length} billeder, deres produktkoder, navne og eventuelle priser mod promptene. Returnér én ZIP med de angivne vN-mapper og filnavne som et klikbart downloadlink.`;
  const all = entries.map(entry => `${entry.id}: ${entry.path}/PROMPT.txt → ${entry.output}\n\n${entry.prompt.trim()}`).join("\n\n\n");
  return { master, all, entries };
}

const EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/gif": "gif" };
export async function createChatGPTZip(category, videos, onProgress = () => {}, templates = {}, fetchImage = fetch) {
  const { master, all, entries } = createChatGPTPromptFiles(category, videos, templates);
  const zip = new JSZip();
  zip.file("MASTER-PROMPT.txt", master);
  zip.file("PROMPTS.txt", all);
  zip.file("READ ME.txt", "Upload denne ZIP og PROMPTS.txt til ChatGPT. Indsæt MASTER-PROMPT.txt som besked. Hver billedmappe har sin egen prompt og referencer. Outputrækkefølgen står i masterprompten.\n");
  const downloaded = new Map();
  async function image(url) {
    if (!url) throw new Error("Et produkt mangler billedlink.");
    if (!downloaded.has(url)) {
      const response = await fetchImage(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`Kunne ikke hente billede: ${url}`);
      const blob = await response.blob();
      const extension = EXTENSIONS[blob.type.split(";")[0].toLowerCase()];
      if (!extension) throw new Error(`Ukendt billedformat: ${blob.type || "tomt"}`);
      downloaded.set(url, { bytes: await blob.arrayBuffer(), extension });
    }
    return downloaded.get(url);
  }
  for (const entry of entries) {
    onProgress(`Henter referencer til ${entry.id}…`);
    const folder = zip.folder(entry.path);
    const manifest = [];
    for (const [index, product] of entry.products.entries()) {
      const { bytes, extension } = await image(product.imageUrl);
      const filename = `${entry.referenceName(index)}.${extension}`;
      folder.file(filename, bytes);
      manifest.push({ ...product, filename });
    }
    if (entry.template) {
      const { bytes, extension } = await image(entry.template);
      folder.file(`TEMPLATE.${extension}`, bytes);
    }
    folder.file("PRODUCTS.json", JSON.stringify(manifest, null, 2));
    folder.file("PROMPT.txt", entry.prompt);
  }
  onProgress("Pakker ZIP-filen…");
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}
