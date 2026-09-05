import { NextResponse } from "next/server";

import {
  generateWinterOutfits
} from "../../../lib/winterOutfits";

import {
  createWinterPrompts
} from "../../../lib/winterPrompts";

export const dynamic = "force-dynamic";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();

    const category = body?.category || "";

    if (category !== "Winter") {
      throw new Error(
        "Der er kun understøttet Winter endnu."
      );
    }

    const outfits =
      await generateWinterOutfits();

    if (
      !outfits ||
      outfits.length !== 3
    ) {
      throw new Error(
        "Der blev ikke oprettet præcis 3 Winter outfits."
      );
    }

    const results =
      outfits.map(
        (outfit, index) => {
          const prompts =
            createWinterPrompts(
              outfit
            );

          return {
            outfitNumber:
              index + 1,

            imageNumber:
              index * 2 + 1,

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

    return NextResponse.json({
      success: true,

      category: "Winter",

      totalOutfits:
        results.length,

      totalImages:
        results.length * 2,

      outfits: results
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
          "Kunne ikke generere Winter outfits."
      },
      {
        status: 500
      }
    );
  }
}
