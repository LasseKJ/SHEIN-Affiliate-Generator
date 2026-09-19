import { NextResponse } from "next/server";

import { generateEssentialsVideos } from "../../../lib/essentials";
import { createEssentialsPrompts } from "../../../lib/essentialsPrompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_VIDEO_COUNTS = [1, 2, 4, 8];

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
    const selectedCategories = body?.selectedCategories;

    if (!ALLOWED_VIDEO_COUNTS.includes(videoCount)) {
      throw new Error(
        "Antallet af videoer skal være 1, 2, 4 eller 8."
      );
    }

    const generatedVideos = await generateEssentialsVideos(
      videoCount,
      selectedCategories
    );

    const videos = generatedVideos.map((video) => {
      const promptData = createEssentialsPrompts(video);

      return {
        videoNumber: video.videoNumber,
        categories: video.categories,
        slides: video.slides.map((slide, slideIndex) => ({
          category: slide.category,
          imageNumber: slideIndex + 1,
          products: slide.products.map(serializeProduct)
        })),
        prompts: promptData.prompts
      };
    });

    return NextResponse.json({
      success: true,
      videoCount,
      totalVideos: videos.length,
      categoriesPerVideo: 3,
      productsPerSlide: 6,
      slidesPerVideo: 3,
      productsPerVideo: 18,
      promptsPerVideo: 3,
      totalPrompts: videos.length * 3,
      videos
    });
  } catch (error) {
    console.error("Essentials generate error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message || "Kunne ikke generere Essentials."
      },
      { status: 500 }
    );
  }
}
