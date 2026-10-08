import JSZip from "jszip";
import { booBasketReferenceName } from "./booBasketPrompts.js";

const IMAGE_EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/gif": "gif" };

export async function createBooBasketZip(videos, onProgress = () => {}, fetchImage = fetch) {
  const zip = new JSZip();
  // Reused products need only one download per ZIP. Keep failures visible and retryable.
  const downloaded = new Map();
  for (const video of videos) {
    const folder = zip.folder(`VIDEO ${video.videoNumber}`);
    folder.file("READ ME.txt", "Carousel order: FORSIDE, BILLEDE 1, BILLEDE 2, BILLEDE 3.\nUpload all ten references (nine grid products and one basket) from one BILLEDE folder with its PROMPT.txt.\nGenerate the cover separately without product references.\n");
    for (const [slideIndex, slide] of video.slides.entries()) {
      const imageNumber = slideIndex + 1;
      const imageFolder = folder.folder(`BILLEDE ${imageNumber}`);
      onProgress(`Video ${video.videoNumber}/${videos.length}: downloading BILLEDE ${imageNumber}...`);
      const manifest = [];
      for (const [productIndex, product] of slide.entries()) {
        if (!downloaded.has(product.imageUrl)) {
          const response = await fetchImage(product.imageUrl, { signal: AbortSignal.timeout(30000) });
          if (!response.ok) throw new Error(`Kunne ikke hente produktbillede: ${product.name} (${product.code}).`);
          const blob = await response.blob();
          const extension = IMAGE_EXTENSIONS[blob.type.split(";")[0].toLowerCase()];
          if (!extension) throw new Error(`Ukendt billedformat for ${product.code}: ${blob.type || "tomt"}.`);
          downloaded.set(product.imageUrl, { bytes: await blob.arrayBuffer(), extension });
        }
        const { bytes, extension } = downloaded.get(product.imageUrl);
        const filename = `${booBasketReferenceName(imageNumber, productIndex)}.${extension}`;
        imageFolder.file(filename, bytes);
        manifest.push({ position: productIndex === 9 ? "basket-bottom-center" : `row-${Math.floor(productIndex / 3) + 1}-column-${productIndex % 3 + 1}`, category: product.category, filename, code: product.code, name: product.name, imageUrl: product.imageUrl });
      }
      imageFolder.file("PRODUCTS.json", JSON.stringify(manifest, null, 2));
      imageFolder.file("PROMPT.txt", video.prompts[slideIndex]);
    }
    folder.folder("FORSIDE").file("PROMPT.txt", video.coverPrompt);
  }
  onProgress("Creating Boo Basket ZIP...");
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}
