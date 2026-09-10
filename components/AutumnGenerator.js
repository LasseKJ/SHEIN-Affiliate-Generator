"use client";

import { useState } from "react";
import JSZip from "jszip";

const VIDEO_COUNTS = [
  1,
  2,
  4,
  8
];

const IMAGE_NUMBERS = [
  1,
  2,
  3,
  4,
  5,
  6
];

export default function AutumnGenerator() {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [videoCount, setVideoCount] =
    useState(1);

  const [videos, setVideos] =
    useState([]);

  function promptLabel(
    videoNumber,
    imageNumber
  ) {
    return `PROMPT V${videoNumber}-${imageNumber}`;
  }

  function getPrompt(
    video,
    imageNumber
  ) {
    return (
      video?.prompts?.[
        imageNumber - 1
      ] || ""
    );
  }

  async function copyPrompt(
    prompt,
    label
  ) {
    try {
      await navigator.clipboard.writeText(
        prompt
      );

      setMessage(
        `${label} copied to clipboard.`
      );
    } catch {
      setMessage(
        "Could not copy the prompt automatically."
      );
    }
  }

  async function downloadProduct(
    product
  ) {
    if (!product?.imageUrl) {
      throw new Error(
        `Produktet ${product?.name || "ukendt"} har ingen billed URL.`
      );
    }

    const response =
      await fetch(
        product.imageUrl
      );

    if (!response.ok) {
      throw new Error(
        `Kunne ikke hente produktbillede: ${product.name}`
      );
    }

    return response.blob();
  }

  function createSafeFilePart(
    value
  ) {
    return String(
      value || "product"
    )
      .trim()
      .replace(
        /[^a-zA-Z0-9æøåÆØÅ]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        "");
  }

  function createSafeCode(
    value
  ) {
    return String(
      value || "UNKNOWN"
    )
      .trim()
      .replace(
        /[^a-zA-Z0-9]+/g,
        "");
  }

  function createProductFilename(
    imageNumber,
    type,
    product,
    extension
  ) {
    const productName =
      createSafeFilePart(
        product?.name ||
        product?.["Product Name"]
      );

    const productCode =
      createSafeCode(
        product?.code ||
        product?.["Product Code"]
      );

    return `B${imageNumber}-${type}-${productName}-${productCode}.${extension}`;
  }

  async function generate() {
    setLoading(true);
    setVideos([]);

    setMessage(
      `Selecting products for ${videoCount} Autumn video${videoCount === 1 ? "" : "s"}...`
    );

    try {
      const response =
        await fetch(
          "/api/generate-clothing",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              category: "Autumn",
              videoCount
            })
          }
        );

      const responseText =
        await response.text();

      let data;

      try {
        data =
          JSON.parse(
            responseText
          );
      } catch {
        throw new Error(
          `API returnerede ikke gyldig JSON. Status: ${response.status}.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Der opstod en fejl."
        );
      }

      if (
        !data.success ||
        !Array.isArray(data.videos) ||
        data.videos.length !== videoCount
      ) {
        throw new Error(
          "Der blev ikke oprettet det valgte antal videoer."
        );
      }

      setVideos(
        data.videos
      );

      const zip =
        new JSZip();

      /*
        ZIP STRUKTUR:

        VIDEO 1/
          B1-Accessory-...
          B1-Top-...
          B1-Bottom-...
          B1-Shoe-...

          B2-Accessory-...
          B2-Top-...
          B2-Bottom-...
          B2-Shoe-...

          B3-...
          B4-...
          B5-...
          B6-...

        Der oprettes IKKE længere mapper som:
          Billede 1/
          Billede 3/
          Billede 5/

        Alle filer ligger direkte i VIDEO mappen.
      */

      for (
        const video of data.videos
      ) {
        const videoFolder =
          zip.folder(
            `VIDEO ${video.videoNumber}`
          );

        for (
          let outfitIndex = 0;
          outfitIndex < 3;
          outfitIndex++
        ) {
          const outfit =
            video.outfits[
              outfitIndex
            ];

          const modelImageNumber =
            outfitIndex * 2 + 1;

          setMessage(
            `Video ${video.videoNumber} of ${data.videos.length}, downloading outfit ${outfitIndex + 1}...`
          );

          const products = [
            {
              product:
                outfit.products.shoe,
              type: "Shoe"
            },
            {
              product:
                outfit.products.top,
              type: "Top"
            },
            {
              product:
                outfit.products.bottom,
              type: "Bottom"
            },
            {
              product:
                outfit.products.accessory,
              type: "Accessory"
            }
          ];

          for (
            const item of products
          ) {
            const blob =
              await downloadProduct(
                item.product
              );

            const extension =
              blob.type ===
              "image/png"
                ? "png"
                : "jpg";

            const fileName =
              createProductFilename(
                modelImageNumber,
                item.type,
                item.product,
                extension
              );

            videoFolder.file(
              fileName,
              blob
            );
          }
        }
      }

      setMessage(
        "Creating Autumn ZIP..."
      );

      const zipBlob =
        await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 6
          }
        });

      const url =
        URL.createObjectURL(
          zipBlob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        `autumn-outfits-${videoCount}-videos.zip`;

      link.style.display =
        "none";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setMessage(
        `Complete, ${videoCount} Autumn video${videoCount === 1 ? "" : "s"} with ${videoCount * 6} prompts generated.`
      );
    } catch (error) {
      console.error(
        "Autumn generate error:",
        error
      );

      setMessage(
        `Error, ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="clothing-generator">
      <div className="clothing-hero">
        <div className="eyebrow">
          AUTUMN
        </div>

        <h1>
          Create
          <span> Autumn Looks.</span>
        </h1>

        <p>
          Generate complete Autumn
          videos with 6 image prompts
          per video.
        </p>

        <div className="clothing-video-count">
          <div className="selector-label">
            HOW MANY VIDEOS?
          </div>

          <div className="video-count-grid">
            {VIDEO_COUNTS.map(
              (count) => (
                <button
                  key={count}
                  type="button"
                  className={`video-count-button ${videoCount === count ? "selected" : ""}`}
                  onClick={() =>
                    setVideoCount(count)
                  }
                  disabled={loading}
                >
                  {count}
                </button>
              )
            )}
          </div>
        </div>

        <button
          className={`generate-button ${loading ? "loading" : ""}`}
          onClick={generate}
          disabled={loading}
        >
          <span>
            {loading
              ? "GENERATING..."
              : `GENERATE ${videoCount} VIDEO${videoCount === 1 ? "" : "S"}`}
          </span>

          <span className="button-arrow">
            →
          </span>
        </button>

        {message && (
          <div className="message">
            <span className="message-dot" />
            {message}
          </div>
        )}
      </div>

      {videos.length > 0 && (
        <section className="clothing-results">
          <div className="results-header">
            <div>
              <div className="section-label">
                GENERATED CONTENT
              </div>

              <h2>
                Your Autumn prompts
              </h2>
            </div>

            <div className="count">
              <strong>
                {videos.length * 6}
              </strong>

              PROMPTS READY
            </div>
          </div>

          <div className="section-label">
            QUICK COPY
          </div>

          <div className="clothing-quick-copy-table">
            <div className="clothing-quick-copy-header">
              <div>
                VIDEO
              </div>

              {IMAGE_NUMBERS.map(
                (imageNumber) => (
                  <div
                    key={imageNumber}
                  >
                    BILLEDE {imageNumber}
                  </div>
                )
              )}
            </div>

            {videos.map(
              (video) => (
                <div
                  className="clothing-quick-copy-row"
                  key={
                    video.videoNumber
                  }
                >
                  <div className="clothing-quick-copy-video">
                    VIDEO{" "}
                    {
                      video.videoNumber
                    }
                  </div>

                  {IMAGE_NUMBERS.map(
                    (
                      imageNumber
                    ) => {
                      const label =
                        promptLabel(
                          video.videoNumber,
                          imageNumber
                        );

                      return (
                        <button
                          key={
                            imageNumber
                          }
                          className="quick-copy-button"
                          onClick={() =>
                            copyPrompt(
                              getPrompt(
                                video,
                                imageNumber
                              ),
                              label
                            )
                          }
                        >
                          <span>
                            {
                              label
                            }
                          </span>

                          <span className="copy-icon">
                            ⧉
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              )
            )}
          </div>

          <div className="section-label">
            PROMPTS
          </div>

          <div className="clothing-prompt-table">
            <div className="clothing-prompt-header">
              <div>
                VIDEO
              </div>

              {IMAGE_NUMBERS.map(
                (imageNumber) => (
                  <div
                    key={
                      imageNumber
                    }
                  >
                    BILLEDE{" "}
                    {
                      imageNumber
                    }
                  </div>
                )
              )}
            </div>

            {videos.map(
              (video) => (
                <div
                  className="clothing-prompt-row"
                  key={
                    video.videoNumber
                  }
                >
                  <div className="clothing-prompt-video-name">
                    VIDEO{" "}
                    {
                      video.videoNumber
                    }
                  </div>

                  {IMAGE_NUMBERS.map(
                    (
                      imageNumber
                    ) => {
                      const label =
                        promptLabel(
                          video.videoNumber,
                          imageNumber
                        );

                      const prompt =
                        getPrompt(
                          video,
                          imageNumber
                        );

                      return (
                        <article
                          className="clothing-prompt-card"
                          key={
                            imageNumber
                          }
                        >
                          <div className="clothing-prompt-card-top">
                            <span>
                              BILLEDE{" "}
                              {
                                imageNumber
                              }
                            </span>

                            <strong>
                              V
                              {
                                video.videoNumber
                              }
                              -
                              {
                                imageNumber
                              }
                            </strong>
                          </div>

                          <button
                            className="copy-button"
                            onClick={() =>
                              copyPrompt(
                                prompt,
                                label
                              )
                            }
                          >
                            <span>
                              {
                                label
                              }
                            </span>

                            <span className="copy-icon">
                              ⧉
                            </span>
                          </button>

                          <div className="prompt-wrapper">
                            <textarea
                              value={
                                prompt
                              }
                              readOnly
                            />
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              )
            )}
          </div>
        </section>
      )}
    </section>
  );
}
