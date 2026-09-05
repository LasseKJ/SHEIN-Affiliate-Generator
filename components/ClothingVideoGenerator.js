"use client";

import { useState } from "react";

const clothingCategories = [
  "AutumnTop",
  "AutumnBottom",
  "AutumnShoe",
  "AutumnAccessories",

  "WinterTop",
  "WinterBottom",
  "WinterShoe",
  "WinterAccessories",

  "Dresses",
  "LongDresses",
  "ShortDresses"
];

export default function ClothingVideoGenerator() {
  const [category, setCategory] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [product, setProduct] =
    useState(null);

  const [prompt, setPrompt] =
    useState("");

  async function generateClothingVideo() {
    if (!category) {
      setMessage(
        "Choose a clothing category first."
      );

      return;
    }

    setLoading(true);

    setProduct(null);
    setPrompt("");

    setMessage(
      "Selecting clothing product..."
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
              category
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

      if (!data.product) {
        throw new Error(
          "Der blev ikke fundet et produkt."
        );
      }

      if (!data.prompt) {
        throw new Error(
          "Der blev ikke oprettet en video prompt."
        );
      }

      setProduct(
        data.product
      );

      setPrompt(
        data.prompt
      );

      setMessage(
        "Complete, clothing product and video prompt ready."
      );

    } catch (error) {
      console.error(
        "Clothing generate error:",
        error
      );

      setMessage(
        `Error, ${error.message}`
      );

    } finally {
      setLoading(false);
    }
  }

  async function copyPrompt() {
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
    <>

      <section className="hero clothing-hero">

        <div className="eyebrow">
          CLOTHING VIDEO
        </div>

        <h1>
          SHEIN
          <br />
          <span>
            Clothing Video
          </span>
        </h1>

        <p>
          Choose a clothing category,
          select a product and create a
          ready to use AI fashion video prompt.
        </p>

        <div className="clothing-category-section">

          <div className="clothing-category-label">
            CHOOSE CATEGORY
          </div>

          <div className="clothing-category-grid">

            {clothingCategories.map(
              (item) => (
                <button
                  key={item}
                  className={
                    category === item
                      ? "category-button selected"
                      : "category-button"
                  }
                  onClick={() =>
                    setCategory(item)
                  }
                  disabled={loading}
                >
                  {item}
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
            generateClothingVideo
          }
          disabled={
            loading ||
            !category
          }
        >

          <span>
            {loading
              ? "GENERATING..."
              : "GENERATE VIDEO"}
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

      {product && prompt && (
        <section className="results clothing-results">

          <div className="results-header">

            <div>

              <div className="section-label">
                GENERATED VIDEO
              </div>

              <h2>
                Your clothing video
              </h2>

            </div>

            <div className="count">

              <strong>
                01
              </strong>

              PRODUCT READY

            </div>

          </div>

          <div className="clothing-result-card">

            <div className="clothing-product-info">

              <div className="clothing-info-label">
                SELECTED CATEGORY
              </div>

              <div className="clothing-category-name">
                {category}
              </div>

              <div className="clothing-info-grid">

                <div>
                  <span>
                    PRODUCT
                  </span>

                  <strong>
                    {product.name}
                  </strong>
                </div>

                <div>
                  <span>
                    CODE
                  </span>

                  <strong>
                    {product.code}
                  </strong>
                </div>

                <div>
                  <span>
                    PRICE
                  </span>

                  <strong>
                    {product.price}{" "}
                    {product.currency}
                  </strong>
                </div>

              </div>

            </div>

            <div className="clothing-prompt-section">

              <div className="prompt-heading">

                <div>
                  <div className="section-label">
                    AI VIDEO PROMPT
                  </div>

                  <h3>
                    Ready to copy
                  </h3>
                </div>

              </div>

              <button
                className="copy-button"
                onClick={
                  copyPrompt
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
                  value={prompt}
                  readOnly
                />

              </div>

            </div>

          </div>

        </section>
      )}

    </>
  );
}
