import { NextResponse } from "next/server";
import { generateAutumnVideos } from "../../../lib/clothingOutfits";
import { createAutumnPrompts, createAutumnCoverPrompt } from "../../../lib/clothingPrompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const ALLOWED_VIDEO_COUNTS = [1, 2, 4, 7, 8];

function serializeProduct(product) {
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
    if (category !== "Autumn") throw new Error("There is only Autumn support in this route.");
    if (!ALLOWED_VIDEO_COUNTS.includes(videoCount)) throw new Error("Choose 1, 2, 4, 7 (Week) or 8 videos.");

    const videos = await generateAutumnVideos(videoCount);
    const results = videos.map(video => {
      const outfits = video.outfits.map((outfit, outfitIndex) => {
        const prompts = createAutumnPrompts(outfit, outfitIndex * 2 + 1);
        return {
          outfitNumber: outfitIndex + 1,
          imageNumbers: { model: outfitIndex * 2 + 2, flatLay: outfitIndex * 2 + 3 },
          modelPrompt: prompts.model,
          flatLayPrompt: prompts.flatLay,
          products: {
            shoe: serializeProduct(outfit.shoe),
            top: serializeProduct(outfit.top),
            bottom: serializeProduct(outfit.bottom),
            accessory: serializeProduct(outfit.accessory)
          }
        };
      });
      const coverProducts = outfits.flatMap(outfit => [
        outfit.products.top,
        outfit.products.bottom,
        outfit.products.accessory
      ]);
      const coverPrompt = createAutumnCoverPrompt(video.outfits);
      return {
        videoNumber: video.videoNumber,
        prompts: [
          coverPrompt,
          ...outfits.flatMap(outfit => [outfit.modelPrompt, outfit.flatLayPrompt])
        ],
        coverPrompt,
        coverProducts,
        outfits
      };
    });

    return NextResponse.json({
      success: true,
      category: "Autumn",
      videoCount,
      totalVideos: results.length,
      totalImages: results.length * 5,
      totalPrompts: results.length * 5,
      videos: results
    });
  } catch (error) {
    console.error("Autumn clothing prompt generation failed:", error);
    return NextResponse.json({
      success: false,
      error: error?.message || "Could not generate Autumn outfits."
    }, { status: 500 });
  }
}
