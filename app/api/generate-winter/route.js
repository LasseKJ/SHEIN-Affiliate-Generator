import { NextResponse } from "next/server";
import { VIDEO_COUNT_OPTIONS } from "../../../lib/videoCount.js";
import { generateWinterVideos } from "../../../lib/winterOutfits";
import { createWinterPrompts, createWinterCoverPrompt } from "../../../lib/winterPrompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const ALLOWED_VIDEO_COUNTS = VIDEO_COUNT_OPTIONS;

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
    if (category !== "Winter") throw new Error("There is only Winter support in this route.");
    if (!ALLOWED_VIDEO_COUNTS.includes(videoCount)) throw new Error("Choose between 1 and 50 videos.");

    const videos = await generateWinterVideos(videoCount);
    const results = videos.map(video => {
      const outfits = video.outfits.map((outfit, outfitIndex) => {
        const prompts = createWinterPrompts(outfit, outfitIndex * 2 + 1);
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
      const coverPrompt = createWinterCoverPrompt(video.outfits);
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
      category: "Winter",
      videoCount,
      totalVideos: results.length,
      totalImages: results.length * 5,
      totalPrompts: results.length * 5,
      videos: results
    });
  } catch (error) {
    console.error("Winter clothing prompt generation failed:", error);
    return NextResponse.json({
      success: false,
      error: error?.message || "Could not generate Winter outfits."
    }, { status: 500 });
  }
}
