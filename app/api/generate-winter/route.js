import { NextResponse } from "next/server";

import {
  generateWinterVideos
} from "../../../lib/winterOutfits";

import {
  createWinterPrompts
} from "../../../lib/winterPrompts";

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
    const body =
      await request.json();

    const category =
      body?.category || "";

    const videoCount =
      Number(body?.videoCount || 1);

    if (category !== "Winter") {
      throw new Error(
        "Der er kun understøttet Winter i denne route."
      );
    }

    if (!ALLOWED_VIDEO_COUNTS.includes(videoCount)) {
      throw new Error(
        "Antallet af videoer skal være 1, 2, 4 eller 8."
      );
    }

    const videos =
      await generateWinterVideos(
        videoCount
      );

    const results =
      videos.map((video) => {
        const outfits =
          video.outfits.map(
            (outfit, outfitIndex) => {
              const prompts =
                createWinterPrompts(
                  outfit
                );

              return {
                outfitNumber:
                  outfitIndex + 1,

                imageNumbers: {
                  model:
                    outfitIndex * 2 + 1,
                  flatLay:
                    outfitIndex * 2 + 2
                },

                modelPrompt:
                  prompts.model,

                flatLayPrompt:
                  prompts.flatLay,

                products: {
                  shoe:
                    serializeProduct(
                      outfit.shoe
                    ),
                  top:
                    serializeProduct(
                      outfit.top
                    ),
                  bottom:
                    serializeProduct(
                      outfit.bottom
                    ),
                  accessory:
                    serializeProduct(
                      outfit.accessory
                    )
                }
              };
            }
          );

        return {
          videoNumber:
            video.videoNumber,

          prompts: outfits.flatMap(
            (outfit) => [
              outfit.modelPrompt,
              outfit.flatLayPrompt
            ]
          ),

          outfits
        };
      });

    return NextResponse.json({
      success: true,
      category: "Winter",
      videoCount,
      totalVideos: results.length,
      totalImages: results.length * 6,
      totalPrompts: results.length * 6,
      videos: results
    });
  } catch (error) {
    console.error(
      "Winter generate error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Kunne ikke generere Winter videoer."
      },
      {
        status: 500
      }
    );
  }
}
