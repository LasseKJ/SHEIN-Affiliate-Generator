"use client";

import { useState } from "react";
import JSZip from "jszip";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  async function generate() {
    setLoading(true);
    setGroups([]);
    setMessage("Selecting 9 products...");

    try {
      const response = await fetch(
        "/api/generate",
        {
          method: "POST"
        }
      );

      const responseText =
        await response.text();

      let data;

      try {
        data = JSON.parse(
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

      const selectedGroups =
        data.groups || [];

      const templates =
        data.templates;

      if (
        selectedGroups.length !== 3
      ) {
        throw new Error(
          "Der blev ikke oprettet præcis 3 produktgrupper."
        );
      }

      if (!templates?.cover) {
        throw new Error(
          "Forside template kunne ikke findes."
        );
      }

      if (!templates?.image) {
        throw new Error(
          "Billede template kunne ikke findes."
        );
      }

      const zip =
        new JSZip();

      let downloadedProducts = 0;

      setMessage(
        "Downloading 9 product images..."
      );

      for (
        const group of selectedGroups
      ) {
        for (
          let index = 0;
          index <
          group.products.length;
          index++
        ) {
          const product =
            group.products[index];

          const imageResponse =
            await fetch(
              product.imageUrl
            );

          if (!imageResponse.ok) {
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
            `group-${group.number}-product-${index + 1}-${product.code}.${extension}`;

          zip.file(
            fileName,
            imageBlob
          );

          downloadedProducts++;
        }
      }

      setMessage(
        "Downloading cover template..."
      );

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

      zip.file(
        "cover-template.jpg",
        coverBlob
      );

      setMessage(
        "Downloading image template..."
      );

      const imageTemplateResponse =
        await fetch(
          templates.image
        );

      if (!imageTemplateResponse.ok) {
        throw new Error(
          "Billede template kunne ikke downloades."
        );
      }

      const imageTemplateBlob =
        await imageTemplateResponse.blob();

      zip.file(
        "image-template.jpg",
        imageTemplateBlob
      );

      if (
        downloadedProducts !== 9
      ) {
        throw new Error(
          `Kun ${downloadedProducts} af 9 produktbilleder blev hentet.`
        );
      }

      setMessage(
        "Preparing 11 files..."
      );

      const zipBlob =
        await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
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
        "shein-affiliate-11-files.zip";

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

      setGroups(
        selectedGroups
      );

      setMessage(
        "Complete, 9 products and 2 templates downloaded."
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
    <main className="page">

      <div className="container">

        <header className="header">

          <div className="brand">
            SHEIN

            <span>
              AFFILIATE TOOL
            </span>
          </div>

          <div className="online">

            <span className="online-dot"></span>

            ONLINE

          </div>

        </header>

        <section className="hero">

          <div className="eyebrow">
            CONTENT GENERATOR
          </div>

          <h1>
            SHEIN Affiliate
            <br />

            <span>
              Generator
            </span>
          </h1>

          <p>
            Select 9 products,
            download all product
            images and templates,
            and create 3 ready to
            use prompts.
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
                : "GENERATE"}
            </span>

            <span className="button-arrow">
              →
            </span>

          </button>

          {message && (
            <div className="message">

              <span className="message-dot"></span>

              {message}

            </div>
          )}

        </section>

        {groups.length > 0 && (
          <section className="results">

            <div className="results-header">

              <div>

                <div className="section-label">
                  GENERATED CONTENT
                </div>

                <h2>
                  Your 3 prompts
                </h2>

              </div>

              <div className="count">

                <strong>
                  11
                </strong>

                FILES READY

              </div>

            </div>

            <div className="groups">

              {groups.map(
                (group) => (
                  <article
                    className="group"
                    key={
                      group.number
                    }
                  >

                    <div className="group-top">

                      <div>

                        <div className="group-label">
                          GROUP 0
                          {
                            group.number
                          }
                        </div>

                        <div className="product-count">
                          3 PRODUCTS
                        </div>

                      </div>

                      <div className="group-number">
                        0
                        {
                          group.number
                        }
                      </div>

                    </div>

                    <button
                      className="copy-button"
                      onClick={() =>
                        copyPrompt(
                          group.prompt
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
                          group.prompt
                        }
                        readOnly
                      />

                    </div>

                  </article>
                )
              )}

            </div>

          </section>
        )}

        <footer>

          <span>
            SHEIN AFFILIATE GENERATOR
          </span>

          <span>
            9 PRODUCTS · 2 TEMPLATES · 3 PROMPTS
          </span>

        </footer>

      </div>

    </main>
  );
}
