import { NextResponse } from "next/server";
import { generatePhoneCaseVideos } from "../../../lib/phoneCases";
import { createPhoneCasePrompts } from "../../../lib/phoneCasePrompts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_VIDEO_COUNTS = [1, 2, 4, 8];
const ALLOWED_PHONE_MODELS = [
  "iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max",
  "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max",
  "iPhone 18", "iPhone 18 Pro", "iPhone 18 Pro Max"
];

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
    const phoneModel = String(body?.phoneModel || "").trim();

    if (!ALLOWED_VIDEO_COUNTS.includes(videoCount)) throw new Error("Antallet af videoer skal være 1, 2, 4 eller 8.");
    if (!ALLOWED_PHONE_MODELS.includes(phoneModel)) throw new Error("Vælg en gyldig iPhone model.");

    const generatedVideos = await generatePhoneCaseVideos(videoCount);
    const videos = generatedVideos.map((video) => {
      const promptData = createPhoneCasePrompts(video, phoneModel);
      return {
        videoNumber: video.videoNumber,
        phoneModel,
        cases: video.cases.map(serializeProduct),
        slides: video.slides.map((slide) => slide.map(serializeProduct)),
        prompts: promptData.prompts,
        coverPrompt: promptData.coverPrompt
      };
    });

    return NextResponse.json({
      success: true,
      category: "PhoneCase",
      phoneModel,
      videoCount,
      totalVideos: videos.length,
      casesPerVideo: 24,
      slidesPerVideo: 4,
      casesPerSlide: 6,
      promptsPerVideo: 5,
      totalPrompts: videos.length * 5,
      videos
    });
  } catch (error) {
    console.error("Phone case generate error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Kunne ikke generere Phone Cases." }, { status: 500 });
  }
}
