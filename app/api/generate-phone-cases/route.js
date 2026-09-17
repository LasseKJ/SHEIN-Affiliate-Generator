import {
  NextResponse
} from "next/server";

import {
  generatePhoneCaseVideos
} from "../../../../lib/phoneCases";

import {
  createPhoneCasePrompts
} from "../../../../lib/phoneCasePrompts";

export const dynamic =
  "force-dynamic";

export const runtime =
  "nodejs";

const ALLOWED_VIDEO_COUNTS = [
  1,
  2,
  4,
  8
];

function serializeProduct(
  product
) {
  return {
    id:
      product.id,

    name:
      product.name,

    category:
      product.category,

    code:
      product.code,

    imageUrl:
      product.imageUrl,

    price:
      product.price,

    currency:
      product.currency
  };
}

export async function POST(
  request
) {
  try {
    const body =
      await request.json();

    const videoCount =
      Number(
        body?.videoCount || 1
      );

    if (
      !ALLOWED_VIDEO_COUNTS.includes(
        videoCount
      )
    ) {
      throw new Error(
        "Antallet af videoer skal være 1, 2, 4 eller 8."
      );
    }

    const generatedVideos =
      await generatePhoneCaseVideos(
        videoCount
      );

    const videos =
      generatedVideos.map(
        (video) => {
          const prompts =
            createPhoneCasePrompts(
              video
            );

          return {
            videoNumber:
              video.videoNumber,

            cases:
              video.cases.map(
                serializeProduct
              ),

            slides:
              video.slides.map(
                (slide) =>
                  slide.map(
                    serializeProduct
                  )
              ),

            prompts:
              prompts.prompts,

            coverPrompt:
              prompts.coverPrompt
          };
        }
      );

    return NextResponse.json({
      success: true,

      category:
        "PhoneCase",

      videoCount,

      totalVideos:
        videos.length,

      casesPerVideo:
        16,

      slidesPerVideo:
        4,

      casesPerSlide:
        4,

      promptsPerVideo:
        5,

      totalPrompts:
        videos.length * 5,

      videos
    });
  } catch (error) {
    console.error(
      "Phone case generate error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error?.message ||
          "Kunne ikke generere Phone Cases."
      },
      {
        status: 500
      }
    );
  }
}