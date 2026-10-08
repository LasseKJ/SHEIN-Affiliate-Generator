import { NextResponse } from "next/server";
import { getBooBasketProducts } from "../../../lib/googleSheetsClothing";
import { BOO_BASKET_VIDEO_COUNTS, PRODUCTS_PER_SLIDE, PRODUCT_SLIDES_PER_VIDEO, generateBooBasketVideos } from "../../../lib/booBaskets";
import { createBooBasketPrompts } from "../../../lib/booBasketPrompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Ugyldig JSON." }, { status: 400 });
  }
  const videoCount = body?.videoCount ?? 1;
  if (!BOO_BASKET_VIDEO_COUNTS.includes(videoCount)) {
    return NextResponse.json({ success: false, error: "Antallet af videoer skal være 1, 2, 4 eller 8." }, { status: 400 });
  }

  try {
    const products = await getBooBasketProducts();
    const videos = generateBooBasketVideos(products, videoCount).map((video) => ({
      ...video,
      ...createBooBasketPrompts(video)
    }));
    return NextResponse.json({
      success: true,
      category: "BooBasket",
      videoCount,
      totalVideos: videos.length,
      productsPerSlide: PRODUCTS_PER_SLIDE,
      productSlidesPerVideo: PRODUCT_SLIDES_PER_VIDEO,
      slidesPerVideo: PRODUCT_SLIDES_PER_VIDEO + 1,
      promptsPerVideo: PRODUCT_SLIDES_PER_VIDEO + 1,
      totalPrompts: videos.length * (PRODUCT_SLIDES_PER_VIDEO + 1),
      videos
    });
  } catch (error) {
    console.error("Boo Basket generate error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Kunne ikke generere Boo Basket." }, { status: 500 });
  }
}
