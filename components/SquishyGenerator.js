"use client";

import { useState } from "react";
import JSZip from "jszip";

const VIDEO_COUNTS = [
  1,
  2,
  4,
  8
];

export default function SquishyGenerator() {
  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

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
    promptIndex
  ) {
    return (
      video?.prompts?.[
        promptIndex
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

  async function generate() {
    setLoading(true);
    setVideos([]);

    setMessage(
      `Selecting products for ${videoCount} video${videoCount === 1 ? "" : "s"}...`
    );

    try {
      const response =
        await fetch(
          "/api/generate",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
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

      const templates =
        data.templates;

      if (!templates?.cover) {
        throw new Error(
          "Forside template kunne ikke findes."
        );
      }

      if (!templates?.image) {
        throw new Error(
          "Produkt template kunne ikke findes."
        );
      }

      setVideos(data.videos);

      const zip =
        new JSZip();

      let downloadedProducts = 0;

      for (
        const video of data.videos
      ) {
        // Alle filer for én video ligger direkte i samme mappe.
        // Mapperne 01, 02, 03 og 04 bruges ikke længere.
        const videoFolder =
          zip.folder(
            `VIDEO ${video.videoNumber}`
          );

        for (
          const group of video.groups
        ) {
          const imageNumber =
            String(group.number).padStart(2, "0");

          for (
            let index = 0;
            index < group.products.length;
            index++
          ) {
            const product =
              group.products[index];

            const blob =
              await downloadProduct(
                product
              );

            const extension =
              blob.type ===
              "image/png"
                ? "png"
                : "jpg";

            // Produktnavnet gøres sikkert til et filnavn.
            const productName = String(
              product.name ||
              product["Product Name"] ||
              "product"
            )
              .trim()
              .replace(
                /[^a-zA-Z0-9æøåÆØÅ]+/g,
                "-"
              )
              .replace(
                /^-+|-+$/g,
                ""
              );

            // Produktkoden bruges også direkte i filnavnet.
            const productCode = String(
              product.code ||
              product["Product Code"] ||
              "UNKNOWN"
            )
              .trim()
              .replace(
                /[^a-zA-Z0-9]+/g,
                ""
              );

            // Eksempel:
            // V1-01-Product-1-Banana-HDK23D.jpg
            //
            // V1 = Video 1
            // 01 = Billede 1
            // Product-1 = Produkt nummer 1
            // Banana = Produktnavn
            // HDK23D = Produktkode
            const fileName =
              `B${Number(group.number)}-Squishy-${productName}-${productCode}.${extension}`;

            videoFolder.file(
              fileName,
              blob
            );

            downloadedProducts++;
          }
        }

        setMessage(
          `Video ${video.videoNumber} of ${data.videos.length}, downloading templates...`
        );

        const productTemplateResponse =
          await fetch(
            templates.image
          );

        if (
          !productTemplateResponse.ok
        ) {
          throw new Error(
            "Produkt template kunne ikke downloades."
          );
        }

        const productTemplateBlob =
          await productTemplateResponse.blob();

        // Produkt template til Billede 1.
        videoFolder.file(
          `V${video.videoNumber}-01-Product-Template.jpg`,
          productTemplateBlob
        );

        // Produkt template til Billede 2.
        videoFolder.file(
          `V${video.videoNumber}-02-Product-Template.jpg`,
          productTemplateBlob
        );

        // Produkt template til Billede 3.
        videoFolder.file(
          `V${video.videoNumber}-03-Product-Template.jpg`,
          productTemplateBlob
        );

        // Forsiden bruger ét produkt fra hver af de tre grupper.
        const coverProducts = [
          video.groups[0].products[0],
          video.groups[1].products[0],
          video.groups[2].products[0]
        ];

        for (
          let index = 0;
          index < coverProducts.length;
          index++
        ) {
          const product =
            coverProducts[index];

          const blob =
            await downloadProduct(
              product
            );

          const extension =
            blob.type ===
            "image/png"
              ? "png"
              : "jpg";

          const productName = String(
            product.name ||
            product["Product Name"] ||
            "product"
          )
            .trim()
            .replace(
              /[^a-zA-Z0-9æøåÆØÅ]+/g,
              "-"
            )
            .replace(
              /^-+|-+$/g,
              ""
            );

          const productCode = String(
            product.code ||
            product["Product Code"] ||
            "UNKNOWN"
          )
            .trim()
            .replace(
              /[^a-zA-Z0-9]+/g,
              ""
            );

          // Eksempel:
          // V1-04-Product-1-Banana-HDK23D.jpg
          videoFolder.file(
            `B4-Squishy-${productName}-${productCode}.${extension}`,
            blob
          );
        }

        const coverResponse =
          await fetch(
            templates.cover
          );

        if (!coverResponse.ok) {
          throw new Error(
            "Forside template kunne ikke downloades."
          );
        }

        const coverBlob =
          await coverResponse.blob();

        videoFolder.file(
          `V${video.videoNumber}-04-Cover-Template.jpg`,
          coverBlob
        );
      }

      if (
        downloadedProducts !==
        data.videos.length * 9
      ) {
        throw new Error(
          `Kun ${downloadedProducts} af ${data.videos.length * 9} produktbilleder blev hentet.`
        );
      }

      setMessage(
        "Preparing ZIP..."
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
        `shein-squishy-${videoCount}-videos.zip`;

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
        `Complete, ${videoCount} video${videoCount === 1 ? "" : "s"} with ${videoCount * 4} prompts generated.`
      );
    } catch (error) {
      console.error(
        "Generate error:",
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
    <section className="squishy-generator">
      <section className="hero">
        <div className="eyebrow">
          CONTENT GENERATOR
        </div>

        <h1>
          SHEIN Affiliate
          <br />
          <span>Generator</span>
        </h1>

        <p>
          Create complete Squishy
          content packages in batches
          and get all prompts ready
          for production.
        </p>

        <div className="video-count-selector">
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
      </section>

      {videos.length > 0 && (
        <section className="results">
          <div className="results-header">
            <div>
              <div className="section-label">
                GENERATED CONTENT
              </div>

              <h2>
                Your video prompts
              </h2>
            </div>

            <div className="count">
              <strong>
                {videos.length * 4}
              </strong>
              PROMPTS READY
            </div>
          </div>

          <div className="section-label">
            QUICK COPY
          </div>

          <div className="quick-copy-table">
            <div className="quick-copy-header">
              <div className="quick-copy-video-label">
                VIDEO
              </div>

              <div>BILLEDE 1</div>
              <div>BILLEDE 2</div>
              <div>BILLEDE 3</div>
              <div>FORSIDE</div>
            </div>

            {videos.map((video) => (
              <div
                className="quick-copy-row"
                key={video.videoNumber}
              >
                <div className="quick-copy-video-name">
                  VIDEO {video.videoNumber}
                </div>

                {video.prompts.map(
                  (prompt, promptIndex) => {
                    const imageNumber =
                      promptIndex + 1;

                    const label =
                      promptLabel(
                        video.videoNumber,
                        imageNumber
                      );

                    return (
                      <button
                        key={imageNumber}
                        className="quick-copy-button"
                        onClick={() =>
                          copyPrompt(
                            prompt,
                            label
                          )
                        }
                      >
                        <span>
                          {label}
                        </span>

                        <span className="copy-icon">
                          ⧉
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            ))}
          </div>

          <div className="section-label">
            PROMPTS
          </div>

          <div className="squishy-prompt-table">
            <div className="squishy-table-header">
              <div className="squishy-video-label">
                VIDEO
              </div>

              <div>BILLEDE 1</div>
              <div>BILLEDE 2</div>
              <div>BILLEDE 3</div>
              <div>FORSIDE</div>
            </div>

            {videos.map((video) => (
              <div
                className="squishy-video-row"
                key={video.videoNumber}
              >
                <div className="squishy-video-name">
                  VIDEO {video.videoNumber}
                </div>

                {video.prompts.map(
                  (prompt, promptIndex) => {
                    const imageNumber =
                      promptIndex + 1;

                    const label =
                      promptLabel(
                        video.videoNumber,
                        imageNumber
                      );

                    return (
                      <article
                        className="squishy-prompt-card"
                        key={imageNumber}
                      >
                        <div className="squishy-prompt-card-top">
                          <span>
                            {imageNumber === 4
                              ? "FORSIDE"
                              : `BILLEDE ${imageNumber}`}
                          </span>

                          <strong>
                            V
                            {video.videoNumber}
                            -
                            {imageNumber}
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
                            {label}
                          </span>

                          <span className="copy-icon">
                            ⧉
                          </span>
                        </button>

                        <div className="prompt-wrapper">
                          <textarea
                            value={prompt}
                            readOnly
                          />
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}