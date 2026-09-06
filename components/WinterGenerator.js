"use client";

import { useState } from "react";
import JSZip from "jszip";

export default function WinterGenerator() {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [videoCount, setVideoCount] =
    useState(1);

  const [videos, setVideos] =
    useState([]);

  async function generate() {
    setLoading(true);

    setVideos([]);

    setMessage(
      `Creating ${videoCount} Winter video${videoCount === 1 ? "" : "s"}...`
    );

    try {
      const response =
        await fetch(
          "/api/generate-winter",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                category:
                  "Winter",

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
        !data.videos ||
        data.videos.length !==
          videoCount
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

      for (
        let videoIndex = 0;
        videoIndex <
        data.videos.length;
        videoIndex++
      ) {
        const video =
          data.videos[
            videoIndex
          ];

        const videoFolder =
          zip.folder(
            `VIDEO ${video.videoNumber}`
          );

        const imageFolders = {};

        const imageNumbers = [
          1,
          3,
          5
        ];

        for (
          const imageNumber of
          imageNumbers
        ) {
          imageFolders[
            imageNumber
          ] =
            videoFolder.folder(
              `Billede ${imageNumber}`
            );
        }

        for (
          let outfitIndex = 0;
          outfitIndex <
          video.outfits.length;
          outfitIndex++
        ) {
          const outfit =
            video.outfits[
              outfitIndex
            ];

          const modelImageNumber =
            outfitIndex * 2 + 1;

          const modelFolder =
            imageFolders[
              modelImageNumber
            ];

          if (!modelFolder) {
            throw new Error(
              `Kunne ikke finde ZIP mappe til Billede ${modelImageNumber}.`
            );
          }

          setMessage(
            `Video ${video.videoNumber} of ${data.videos.length}, downloading outfit ${outfitIndex + 1}...`
          );

          const products = [
            {
              product:
                outfit.products.shoe,

              type:
                "shoe"
            },

            {
              product:
                outfit.products.top,

              type:
                "top"
            },

            {
              product:
                outfit.products.bottom,

              type:
                "bottom"
            },

            {
              product:
                outfit.products.accessory,

              type:
                "accessory"
            }
          ];

          for (
            const item of products
          ) {
            const product =
              item.product;

            if (
              !product.imageUrl
            ) {
              throw new Error(
                `Produktet ${product.name} har ingen billed URL.`
              );
            }

            const imageResponse =
              await fetch(
                product.imageUrl
              );

            if (
              !imageResponse.ok
            ) {
              throw new Error(
                `Kunne ikke hente produktbillede: ${product.name}`
              );
            }

            const imageBlob =
              await imageResponse.blob();

            const extension =
              imageBlob.type ===
              "image/png"
                ? "png"
                : "jpg";

            const fileName =
              `${item.type}-${product.code}.${extension}`;

            modelFolder.file(
              fileName,
              imageBlob
            );
          }
        }
      }

      setMessage(
        "Creating Winter ZIP..."
      );

      const zipBlob =
        await zip.generateAsync({
          type: "blob",

          compression:
            "DEFLATE",

          compressionOptions: {
            level: 6
          }
        });

      const downloadUrl =
        URL.createObjectURL(
          zipBlob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        downloadUrl;

      link.download =
        `winter-outfits-${videoCount}-videos.zip`;

      link.style.display =
        "none";

      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );

      setTimeout(() => {
        URL.revokeObjectURL(
          downloadUrl
        );
      }, 1000);

      setMessage(
        `Complete, ${videoCount} Winter video${videoCount === 1 ? "" : "s"} with ${videoCount * 6} image prompts generated.`
      );

    } catch (error) {
      console.error(
        "Winter generate error:",
        error
      );

      setMessage(
        `Error, ${error.message}`
      );

    } finally {
      setLoading(false);
    }
  }

  async function copyPrompt(
    prompt,
    number
  ) {
    try {
      await navigator.clipboard.writeText(
        prompt
      );

      setMessage(
        `Prompt ${number} copied to clipboard.`
      );

    } catch {
      setMessage(
        "Could not copy the prompt automatically."
      );
    }
  }

  function getPrompt(
    videoNumber,
    imageNumber
  ) {
    const video =
      videos.find(
        (item) =>
          item.videoNumber ===
          videoNumber
      );

    if (!video) {
      return "";
    }

    const promptIndex =
      imageNumber - 1;

    return (
      video.prompts[
        promptIndex
      ] || ""
    );
  }

  function getGlobalPromptNumber(
    videoNumber,
    imageNumber
  ) {
    return (
      (videoNumber - 1) *
        6 +
      imageNumber
    );
  }

  return (
    <section className="clothing-generator">

      <div className="clothing-hero">

        <div className="eyebrow">
          WINTER
        </div>

        <h1>
          Create
          <span> Winter Looks.</span>
        </h1>

        <p>
          Generate complete Winter
          videos with 6 image prompts
          per video.
        </p>

        <div className="clothing-video-count">

          <div className="selector-label">
            HOW MANY VIDEOS?
          </div>

          <div className="video-count-grid">

            {[1, 2, 4, 8].map(
              (count) => (
                <button
                  key={count}
                  type="button"
                  className={`video-count-button ${
                    videoCount === count
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setVideoCount(
                      count
                    )
                  }
                  disabled={
                    loading
                  }
                >
                  {count}
                </button>
              )
            )}

          </div>

        </div>

        <button
          className={`generate-button ${
            loading
              ? "loading"
              : ""
          }`}
          onClick={
            generate
          }
          disabled={
            loading
          }
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
                Your Winter prompts
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

              <div>
                BILLEDE 1
              </div>

              <div>
                BILLEDE 2
              </div>

              <div>
                BILLEDE 3
              </div>

              <div>
                BILLEDE 4
              </div>

              <div>
                BILLEDE 5
              </div>

              <div>
                BILLEDE 6
              </div>

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
                    {video.videoNumber}
                  </div>

                  {[
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                  ].map(
                    (
                      imageNumber
                    ) => {

                      const promptNumber =
                        getGlobalPromptNumber(
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
                                video.videoNumber,
                                imageNumber
                              ),
                              promptNumber
                            )
                          }
                        >

                          <span>
                            COPY PROMPT{" "}
                            {
                              promptNumber
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

              <div>
                BILLEDE 1
              </div>

              <div>
                BILLEDE 2
              </div>

              <div>
                BILLEDE 3
              </div>

              <div>
                BILLEDE 4
              </div>

              <div>
                BILLEDE 5
              </div>

              <div>
                BILLEDE 6
              </div>

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
                    {video.videoNumber}
                  </div>

                  {video.prompts.map(
                    (
                      prompt,
                      promptIndex
                    ) => {

                      const imageNumber =
                        promptIndex +
                        1;

                      const promptNumber =
                        getGlobalPromptNumber(
                          video.videoNumber,
                          imageNumber
                        );

                      return (
                        <article
                          className="clothing-prompt-card"
                          key={
                            promptNumber
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
                              {
                                promptNumber
                              }
                            </strong>

                          </div>

                          <button
                            className="copy-button"
                            onClick={() =>
                              copyPrompt(
                                prompt,
                                promptNumber
                              )
                            }
                          >

                            <span>
                              COPY PROMPT
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
