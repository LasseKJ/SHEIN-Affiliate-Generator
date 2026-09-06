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

export async function POST(
  request
) {
  try {
    const body =
      await request.json();

    const category =
      body?.category || "";

    const videoCount =
      Number(
        body?.videoCount || 1
      );

    if (
      category !== "Winter"
    ) {
      throw new Error(
        "Der er kun understøttet Winter i denne route."
      );
    }

    if (
      !ALLOWED_VIDEO_COUNTS.includes(
        videoCount
      )
    ) {
      throw new Error(
        "Antallet af videoer skal være 1, 2, 4 eller 8."
      );
    }

    const videos =
      await generateWinterVideos(
        videoCount
      );

    if (
      !videos ||
      videos.length !==
        videoCount
    ) {
      throw new Error(
        "Der blev ikke oprettet det valgte antal videoer."
      );
    }

    const results =
      videos.map(
        (video) => {

          const videoOutfits =
            video.outfits.map(
              (
                outfit,
                outfitIndex
              ) => {

                const prompts =
                  createWinterPrompts(
                    outfit
                  );

                return {
                  outfitNumber:
                    outfitIndex +
                    1,

                  imageNumbers: {
                    model:
                      outfitIndex *
                        2 +
                      1,

                    flatLay:
                      outfitIndex *
                        2 +
                      2
                  },

                  modelPrompt:
                    prompts.model,

                  flatLayPrompt:
                    prompts.flatLay,

                  products: {
                    shoe: {
                      id:
                        outfit.shoe.id,

                      name:
                        outfit.shoe.name,

                      category:
                        outfit.shoe.category,

                      code:
                        outfit.shoe.code,

                      imageUrl:
                        outfit.shoe.imageUrl,

                      price:
                        outfit.shoe.price,

                      currency:
                        outfit.shoe.currency
                    },

                    top: {
                      id:
                        outfit.top.id,

                      name:
                        outfit.top.name,

                      category:
                        outfit.top.category,

                      code:
                        outfit.top.code,

                      imageUrl:
                        outfit.top.imageUrl,

                      price:
                        outfit.top.price,

                      currency:
                        outfit.top.currency
                    },

                    bottom: {
                      id:
                        outfit.bottom.id,

                      name:
                        outfit.bottom.name,

                      category:
                        outfit.bottom.category,

                      code:
                        outfit.bottom.code,

                      imageUrl:
                        outfit.bottom.imageUrl,

                      price:
                        outfit.bottom.price,

                      currency:
                        outfit.bottom.currency
                    },

                    accessory: {
                      id:
                        outfit.accessory.id,

                      name:
                        outfit.accessory.name,

                      category:
                        outfit.accessory.category,

                      code:
                        outfit.accessory.code,

                      imageUrl:
                        outfit.accessory.imageUrl,

                      price:
                        outfit.accessory.price,

                      currency:
                        outfit.accessory.currency
                    }
                  }
                };
              }
            );

          return {
            videoNumber:
              video.videoNumber,

            prompts: videoOutfits.flatMap(
              (outfit) => [
                outfit.modelPrompt,
                outfit.flatLayPrompt
              ]
            ),

            outfits:
              videoOutfits
          };
        }
      );

    return NextResponse.json({
      success: true,

      category:
        "Winter",

      videoCount,

      totalVideos:
        results.length,

      totalImages:
        results.length * 6,

      totalPrompts:
        results.length * 6,

      videos:
        results
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
