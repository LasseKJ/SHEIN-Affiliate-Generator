import JSZip from "jszip";
import { stockingReferenceName } from "./stockingPrompts.js";

const IMAGE_EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/gif": "gif" };

export async function createStockingZip(videos, onProgress = () => {}, fetchImage = fetch) {
  const zip = new JSZip();
  // Reused products need only one download per ZIP. Keep failures visible and retryable.
  const downloaded = new Map();
  for (const video of videos) {
    const folder = zip.folder(`VIDEO ${video.videoNumber}`);
    folder.file("READ ME.txt", "Carousel order: COVER, IMAGE 1, IMAGE 2, IMAGE 3.\nUpload all three product references from one IMAGE folder with its PROMPT.txt.\nGenerate the cover separately without product references.\n");
    for (const [slideIndex, slide] of video.slides.entries()) {
      const imageNumber = slideIndex + 1;
      const imageFolder = folder.folder(`IMAGE ${imageNumber}`);
      onProgress(`Video ${video.videoNumber}/${videos.length}: downloading IMAGE ${imageNumber}...`);
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
        const filename = `${stockingReferenceName(imageNumber, productIndex)}.${extension}`;
        imageFolder.file(filename, bytes);
        manifest.push({ position: `row-${productIndex + 1}-left`, category: product.category, filename, code: product.code, name: product.name, price: product.price, currency: product.currency, imageUrl: product.imageUrl });
      }
      imageFolder.file("PRODUCTS.json", JSON.stringify(manifest, null, 2));
      imageFolder.file("PROMPT.txt", video.prompts[slideIndex]);
    }
    folder.folder("COVER").file("PROMPT.txt", video.coverPrompt);
  }
  onProgress("Creating Stocking Stuffers ZIP...");
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

