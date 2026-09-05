"use client";

import { useState } from "react";

import SquishyGenerator from "../components/SquishyGenerator";
import AutumnGenerator from "../components/AutumnGenerator";

export default function Home() {
  const [contentType, setContentType] =
    useState("squishy");

  const [clothingCategory, setClothingCategory] =
    useState("");

  return (
    <main className="page">

      <div className="container">

        <header className="header">
          <div className="brand">
            SHEIN
            <span>AFFILIATE</span>
          </div>

          <div className="online">
            <span className="online-dot" />
            ONLINE
          </div>
        </header>

        <section className="content-selector-section">

          <div className="selector-label">
            CONTENT TYPE
          </div>

          <div className="content-selector">

            <button
              className={`content-type-button ${
                contentType === "squishy"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setContentType("squishy");
                setClothingCategory("");
              }}
            >
              <span>
                SQUISHY POST
              </span>

              <span className="selector-arrow">
                →
              </span>
            </button>

            <button
              className={`content-type-button ${
                contentType === "clothing"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setContentType("clothing");
                setClothingCategory("");
              }}
            >
              <span>
                CLOTHING
              </span>

              <span className="selector-arrow">
                →
              </span>
            </button>

          </div>

        </section>

        {contentType === "squishy" && (
          <SquishyGenerator />
        )}

        {contentType === "clothing" && (
          <section className="clothing-selection">

            <div className="clothing-hero">
              <div className="eyebrow">
                CLOTHING
              </div>

              <h1>
                Choose your
                <span> season.</span>
              </h1>

              <p>
                Select a season to create
                complete fashion outfits.
              </p>
            </div>

            <div className="clothing-category-section">

              <div className="clothing-category-label">
                SEASON
              </div>

              <div className="clothing-category-grid">

                <button
                  className={`category-button ${
                    clothingCategory ===
                    "Autumn"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setClothingCategory(
                      "Autumn"
                    )
                  }
                >
                  AUTUMN
                </button>

                <button
                  className="category-button"
                  disabled
                >
                  WINTER
                </button>

              </div>

            </div>

            {clothingCategory ===
              "Autumn" && (
              <AutumnGenerator />
            )}

          </section>
        )}

      </div>

    </main>
  );
}
