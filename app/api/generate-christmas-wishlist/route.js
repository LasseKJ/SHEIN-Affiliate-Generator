import { NextResponse } from "next/server";
import { getChristmasWishListProducts } from "../../../lib/googleSheetsClothing";
import { CHRISTMAS_WISHLIST_VIDEO_COUNTS, generateChristmasWishListVideos } from "../../../lib/christmasWishList";
import { createChristmasWishListPrompts } from "../../../lib/christmasWishListPrompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try { body = await request.json(); }
  catch { return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 }); }
  const videoCount = Number(body?.videoCount ?? 1);
  if (!CHRISTMAS_WISHLIST_VIDEO_COUNTS.includes(videoCount)) {
    return NextResponse.json({ success: false, error: "Choose 1, 2, 4, 7 (Week) or 8 wish lists." }, { status: 400 });
  }
  try {
    const products = await getChristmasWishListProducts();
    const videos = generateChristmasWishListVideos(products, videoCount).map(video => ({
      ...video,
      ...createChristmasWishListPrompts(video)
    }));
    return NextResponse.json({ success: true, videos, videoCount, productsPerImage: 4, imagesPerWishList: 4 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.message || "Could not generate Christmas Wish Lists." }, { status: 500 });
  }
}
