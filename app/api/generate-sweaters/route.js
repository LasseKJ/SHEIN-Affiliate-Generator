import { NextResponse } from "next/server";
import { generateSweaterVideos } from "../../../lib/sweaters";
import { createSweaterPrompts } from "../../../lib/sweaterPrompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    const videoCount = Number(body?.videoCount || 1);
    const generated = await generateSweaterVideos(videoCount);

    const videos = generated.map((video) => {
      const promptData = createSweaterPrompts(video);
      return {
        videoNumber: video.videoNumber,
        sweaters: video.sweaters.map(serializeProduct),
        prompts: promptData.prompts,
        coverPrompt: promptData.coverPrompt
      };
    });

    return NextResponse.json({
      success: true,
      category: "Sweaters",
      videoCount,
      sweatersPerVideo: 4,
      promptsPerVideo: 5,
      videos
    });
  } catch (error) {
    console.error("Sweaters generate error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Kunne ikke generere Sweaters." }, { status: 500 });
  }
}
