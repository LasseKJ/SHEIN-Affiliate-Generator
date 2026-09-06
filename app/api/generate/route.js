import { NextResponse } from "next/server";

import {
  getProducts
} from "../../../lib/googleSheets";

import {
  createPromptSet,
  createCoverPrompt
} from "../../../lib/promptTemplate";

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

    const totalProducts =
      videoCount * 9;

    console.log(
      `Selecting ${totalProducts} Squishy products for ${videoCount} videos...`
    );

    const products =
      await getProducts(
        totalProducts
      );

    if (
      !products ||
      products.length !==
        totalProducts
    ) {
      throw new Error(
        `Der blev ikke valgt præcis ${totalProducts} produkter.`
      );
    }

    const templates = {
      cover:
        process.env
          .TEMPLATE_COVER_URL,

      image:
        process.env
          .TEMPLATE_IMAGE_URL
    };

    if (
      !templates.cover
    ) {
      throw new Error(
        "TEMPLATE_COVER_URL mangler i Environment Variables."
      );
    }

    if (
      !templates.image
    ) {
      throw new Error(
        "TEMPLATE_IMAGE_URL mangler i Environment Variables."
      );
    }

    const videos = [];

    for (
      let videoIndex = 0;
      videoIndex <
      videoCount;
      videoIndex++
    ) {
      const start =
        videoIndex * 9;

      const videoProducts =
        products.slice(
          start,
          start + 9
        );

      const prompts =
        createPromptSet(
          videoProducts
        );

      const coverPrompt =
        createCoverPrompt();

      const groups = [
        videoProducts.slice(
          0,
          3
        ),

        videoProducts.slice(
          3,
          6
        ),

        videoProducts.slice(
          6,
          9
        )
      ];

      videos.push({
        videoNumber:
          videoIndex + 1,

        prompts: [
          prompts[0],
          prompts[1],
          prompts[2],
          coverPrompt
        ],

        coverPrompt,

        groups:
          groups.map(
            (
              group,
              groupIndex
            ) => ({
              number:
                groupIndex + 1,

              prompt:
                prompts[
                  groupIndex
                ],

              products:
                group.map(
                  (
                    product
                  ) => ({
                    id:
                      product[
                        "Product ID"
                      ],

                    name:
                      product[
                        "Product Name"
                      ],

                    code:
                      product[
                        "Product Code"
                      ],

                    price:
                      product[
                        "Price"
                      ],

                    currency:
                      product[
                        "Currency"
                      ],

                    imageUrl:
                      product[
                        "Product Image URL"
                      ]
                  })
                )
            })
          )
      });
    }

    return NextResponse.json({
      success: true,

      videoCount,

      totalProducts,

      totalPrompts:
        videoCount * 4,

      templates,

      videos
    });

  } catch (error) {
    console.error(
      "Generate error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error?.message ||
          "Kunne ikke generere Squishy videoer."
      },
      {
        status: 500
      }
    );
  }
}
