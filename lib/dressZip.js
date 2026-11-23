import { createChatGPTPromptFiles } from "./chatGPTExport.js";
import JSZip from "jszip";
import { addTikTokCaptionsToZip } from "./tiktokCaptions.js";

const IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif"
};

export async function createDressZip(videos, onProgress = () => {}, fetchImage = fetch) {
  const zip = new JSZip();
  addTikTokCaptionsToZip(zip, "dresses", videos);
  const downloaded = new Map();
  const { master, all } = createChatGPTPromptFiles("dresses", videos);
  zip.file("MASTER-PROMPT.txt", master);
  zip.file("PROMPTS.txt", all);

  for (const { videoNumber, images } of videos) {
    const videoFolder = zip.folder(`VIDEO ${videoNumber}`);
    for (const { folder, products, prompt } of images) {
      const imageFolder = videoFolder.folder(folder);
      onProgress(`Henter billeder til video ${videoNumber} af ${videos.length} · ${folder}…`);
      for (const [index, { imageUrl, code }] of products.entries()) {
        if (!downloaded.has(imageUrl)) {
          const response = await fetchImage(imageUrl, { signal: AbortSignal.timeout(30_000) });
          if (!response.ok) throw new Error(`Kunne ikke hente produktbilledet for ${code}.`);
          const image = await response.blob();
          const extension = IMAGE_EXTENSIONS[image.type];
          if (!extension) throw new Error(`Billedformatet for ${code} understøttes ikke (${image.type || "ukendt format"}).`);
          downloaded.set(imageUrl, { bytes: await image.arrayBuffer(), extension });
        }
        const { bytes, extension } = downloaded.get(imageUrl);
        imageFolder.file(`REFERENCE-${index + 1}.${extension}`, bytes);
      }
      imageFolder.file("PROMPT.txt", prompt);
    }
  }

  onProgress("Pakker ZIP-filen…");
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}
