import { NextResponse } from "next/server";
import { generateJacketVideos } from "../../../lib/jackets";
import { createJacketPrompts } from "../../../lib/jacketPrompts";

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
    const generated = await generateJacketVideos(videoCount);

    const videos = generated.map((video) => {
      const promptData = createJacketPrompts(video);
      return {
        videoNumber: video.videoNumber,
        jackets: video.jackets.map(serializeProduct),
        prompts: promptData.prompts,
        coverPrompt: promptData.coverPrompt
      };
    });

    return NextResponse.json({
      success: true,
      category: "Jacket",
      videoCount,
      jacketsPerVideo: 4,
      promptsPerVideo: 5,
      videos
    });
  } catch (error) {
    console.error("Jackets generate error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Kunne ikke generere Jackets." }, { status: 500 });
  }
}
