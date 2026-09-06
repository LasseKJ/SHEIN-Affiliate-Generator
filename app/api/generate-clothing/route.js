import { NextResponse } from "next/server";
import { generateAutumnVideos } from "../../../lib/clothingOutfits";
import { createAutumnPrompts } from "../../../lib/clothingPrompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_VIDEO_COUNTS = [1, 2, 4, 8];

function cleanProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    code: product.code,
    imageUrl: product.imageUrl,
    price: product.price,
    currency: product.currency
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const category = body?.category || "";
    const videoCount = Number(body?.videoCount || 1);

    if (category !== "Autumn") throw new Error("Der er kun understøttet Autumn i denne route.");
    if (!ALLOWED_VIDEO_COUNTS.includes(videoCount)) throw new Error("Antallet af videoer skal være 1, 2, 4 eller 8.");

    const videos = await generateAutumnVideos(videoCount);

    const results = videos.map((video) => {
      const outfits = video.outfits.map((outfit, index) => {
        const prompts = createAutumnPrompts(outfit);
        return {
          outfitNumber: index + 1,
          imageNumbers: { model: index * 2 + 1, flatLay: index * 2 + 2 },
          modelPrompt: prompts.model,
          flatLayPrompt: prompts.flatLay,
          products: {
            shoe: cleanProduct(outfit.shoe),
            top: cleanProduct(outfit.top),
            bottom: cleanProduct(outfit.bottom),
            accessory: cleanProduct(outfit.accessory)
          }
        };
      });

      return {
        videoNumber: video.videoNumber,
        prompts: outfits.flatMap((outfit) => [outfit.modelPrompt, outfit.flatLayPrompt]),
        outfits
      };
    });

    return NextResponse.json({
      success: true,
      category: "Autumn",
      videoCount,
      totalVideos: results.length,
      totalImages: results.length * 6,
      totalPrompts: results.length * 6,
      videos: results
    });
  } catch (error) {
    console.error("Clothing generate error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Kunne ikke generere Autumn videoer." },
      { status: 500 }
    );
  }
}
