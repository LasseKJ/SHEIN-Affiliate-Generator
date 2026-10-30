import { NextResponse } from "next/server";
import { getStockingStufferProducts } from "../../../lib/googleSheetsClothing";
import { STOCKING_VIDEO_COUNTS, generateStockingVideos } from "../../../lib/stockingStuffers";
import { createStockingPrompts } from "../../../lib/stockingPrompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 }); }
  const videoCount = body?.videoCount ?? 1;
  if (!STOCKING_VIDEO_COUNTS.includes(videoCount)) return NextResponse.json({ success: false, error: "Choose 1, 2, 4 or 8 carousels." }, { status: 400 });
  try {
    const products = await getStockingStufferProducts();
    const videos = generateStockingVideos(products, videoCount).map(video => ({ ...video, ...createStockingPrompts(video) }));
    return NextResponse.json({ success: true, videos, videoCount, productsPerSlide: 3, slidesPerVideo: 4 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.message || "Could not generate Stocking Stuffers." }, { status: 500 });
  }
}
