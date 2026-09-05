"use client";

import { useState } from "react";
import JSZip from "jszip";

export default function AutumnGenerator() {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [results, setResults] =
    useState([]);

  async function generate() {
    setLoading(true);
    setResults([]);
    setMessage(
      "Creating 3 Autumn outfits..."
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
              category: "Autumn"
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
        !data.outfits ||
        data.outfits.length !== 3
      ) {
        throw new Error(
          "Der blev ikke oprettet præcis 3 outfits."
        );
      }

      const zip =
        new JSZip();

      setMessage(
        "Creating folders..."
      );

      const folders = [];

      for (
        let index = 0;
        index < 6;
        index++
      ) {
        folders.push(
          zip.folder(
            `Billede ${index + 1}`
          )
        );
      }

      for (
        let outfitIndex = 0;
        outfitIndex < 3;
        outfitIndex++
      ) {
        const outfit =
          data.outfits[
            outfitIndex
          ];

        const modelImageNumber =
          outfitIndex * 2 + 1;

        const flatLayImageNumber =
          outfitIndex * 2 + 2;

        const modelFolder =
          folders[
            modelImageNumber - 1
          ];

        const flatLayFolder =
          folders[
            flatLayImageNumber - 1
          ];

        setMessage(
          `Downloading products for outfit ${outfitIndex + 1}...`
        );

        const products = [
          {
            product:
              outfit.products.shoe,
            type: "shoe"
          },
          {
            product:
              outfit.products.top,
            type: "top"
          },
          {
            product:
              outfit.products.bottom,
            type: "bottom"
          },
          {
            product:
              outfit.products.accessory,
            type: "accessory"
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

          let extension =
            "jpg";

          if (
            imageBlob.type ===
            "image/png"
          ) {
            extension =
              "png";
          }

          const fileName =
            `${item.type}-${product.code}.${extension}`;

          modelFolder.file(
            fileName,
            imageBlob
          );
        }

        modelFolder.file(
          "prompt.txt",
          outfit.modelPrompt
        );

        flatLayFolder.file(
          "prompt.txt",
          outfit.flatLayPrompt
        );
      }

      setMessage(
        "Creating Autumn ZIP..."
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
        "autumn-outfits.zip";

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

      setResults(
        data.outfits
      );

      setMessage(
        "Complete, 3 Autumn outfits and 6 image prompts downloaded."
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

  async function copyPrompt(
    prompt
  ) {
    try {
      await navigator.clipboard.writeText(
        prompt
      );

      setMessage(
        "Prompt copied to clipboard."
      );
    } catch {
      setMessage(
        "Could not copy the prompt automatically."
      );
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
          Generate 3 complete Autumn
          outfits with 6 ready to use
          image prompts.
        </p>

        <button
          className={`generate-button ${
            loading
              ? "loading"
              : ""
          }`}
          onClick={generate}
          disabled={loading}
        >
          <span>
            {loading
              ? "GENERATING..."
              : "GENERATE AUTUMN"}
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

      {results.length > 0 && (
        <section className="clothing-results">

          <div className="section-label">
            GENERATED OUTFITS
          </div>

          <div className="clothing-outfit-grid">

            {results.map(
              (
                outfit,
                index
              ) => (
                <article
                  className="clothing-result-card"
                  key={
                    outfit.outfitNumber
                  }
                >

                  <div className="clothing-result-header">

                    <div>
                      <div className="group-label">
                        OUTFIT
                        {" "}
                        {index + 1}
                      </div>

                      <div className="clothing-category-name">
                        AUTUMN
                      </div>
                    </div>

                    <div className="group-number">
                      0
                      {index + 1}
                    </div>

                  </div>

                  <div className="clothing-info-grid">

                    <div>
                      <span>
                        SHOE
                      </span>

                      <strong>
                        {
                          outfit
                            .products
                            .shoe
                            .name
                        }
                      </strong>

                      <small>
                        CODE:
                        {" "}
                        {
                          outfit
                            .products
                            .shoe
                            .code
                        }
                      </small>
                    </div>

                    <div>
                      <span>
                        TOP
                      </span>

                      <strong>
                        {
                          outfit
                            .products
                            .top
                            .name
                        }
                      </strong>

                      <small>
                        CODE:
                        {" "}
                        {
                          outfit
                            .products
                            .top
                            .code
                        }
                      </small>
                    </div>

                    <div>
                      <span>
                        BOTTOM
                      </span>

                      <strong>
                        {
                          outfit
                            .products
                            .bottom
                            .name
                        }
                      </strong>

                      <small>
                        CODE:
                        {" "}
                        {
                          outfit
                            .products
                            .bottom
                            .code
                        }
                      </small>
                    </div>

                    <div>
                      <span>
                        ACCESSORY
                      </span>

                      <strong>
                        {
                          outfit
                            .products
                            .accessory
                            .name
                        }
                      </strong>

                      <small>
                        CODE:
                        {" "}
                        {
                          outfit
                            .products
                            .accessory
                            .code
                        }
                      </small>
                    </div>

                  </div>

                  <div className="clothing-prompt-section">

                    <div className="prompt-heading">
                      <h3>
                        BILLEDE
                        {" "}
                        {index * 2 + 1}
                      </h3>
                    </div>

                    <button
                      className="copy-button"
                      onClick={() =>
                        copyPrompt(
                          outfit.modelPrompt
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
                          outfit.modelPrompt
                        }
                        readOnly
                      />
                    </div>

                  </div>

                  <div className="clothing-prompt-section">

                    <div className="prompt-heading">
                      <h3>
                        BILLEDE
                        {" "}
                        {index * 2 + 2}
                      </h3>
                    </div>

                    <button
                      className="copy-button"
                      onClick={() =>
                        copyPrompt(
                          outfit.flatLayPrompt
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
                          outfit.flatLayPrompt
                        }
                        readOnly
                      />
                    </div>

                  </div>

                </article>
              )
            )}

          </div>

        </section>
      )}

    </section>
  );
}
