"use client";

import { useState } from "react";

import SquishyGenerator from "../components/SquishyGenerator";
import AutumnGenerator from "../components/AutumnGenerator";
import WinterGenerator from "../components/WinterGenerator";
import PhoneCaseGenerator from "../components/PhoneCaseGenerator";
import EssentialsGenerator from "../components/EssentialsGenerator";

export default function Home() {
  const [contentType, setContentType] = useState("squishy");
  const [clothingCategory, setClothingCategory] = useState("");

  function changeContentType(type) {
    setContentType(type);

    if (type !== "clothing") {
      setClothingCategory("");
    }
  }

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
          <div className="selector-label">CONTENT TYPE</div>

          <div className="content-selector">
            <button
              className={`content-type-button ${
                contentType === "squishy" ? "active" : ""
              }`}
              onClick={() => changeContentType("squishy")}
              type="button"
            >
              <span>SQUISHY POST</span>
              <span className="selector-arrow">→</span>
            </button>

            <button
              className={`content-type-button ${
                contentType === "clothing" ? "active" : ""
              }`}
              onClick={() => changeContentType("clothing")}
              type="button"
            >
              <span>CLOTHING</span>
              <span className="selector-arrow">→</span>
            </button>

            <button
              className={`content-type-button ${
                contentType === "phoneCases" ? "active" : ""
              }`}
              onClick={() => changeContentType("phoneCases")}
              type="button"
            >
              <span>PHONE CASES</span>
              <span className="selector-arrow">→</span>
            </button>

            <button
              className={`content-type-button ${
                contentType === "essentials" ? "active" : ""
              }`}
              onClick={() => changeContentType("essentials")}
              type="button"
            >
              <span>ESSENTIALS</span>
              <span className="selector-arrow">→</span>
            </button>
          </div>
        </section>

        {contentType === "squishy" && <SquishyGenerator />}
        {contentType === "phoneCases" && <PhoneCaseGenerator />}
        {contentType === "essentials" && <EssentialsGenerator />}

        {contentType === "clothing" && (
          <section className="clothing-selection">
            <div className="clothing-hero">
              <div className="eyebrow">CLOTHING</div>

              <h1>
                Choose your
                <span> season.</span>
              </h1>

              <p>
                Select a season to create complete fashion outfits.
              </p>
            </div>

            <div className="clothing-category-section">
              <div className="clothing-category-label">SEASON</div>

              <div className="clothing-category-grid">
                <button
                  type="button"
                  className={`category-button ${
                    clothingCategory === "Autumn" ? "selected" : ""
                  }`}
                  onClick={() => setClothingCategory("Autumn")}
                >
                  AUTUMN
                </button>

                <button
                  type="button"
                  className={`category-button ${
                    clothingCategory === "Winter" ? "selected" : ""
                  }`}
                  onClick={() => setClothingCategory("Winter")}
                >
                  WINTER
                </button>
              </div>
            </div>

            {clothingCategory === "Autumn" && <AutumnGenerator />}
            {clothingCategory === "Winter" && <WinterGenerator />}
          </section>
        )}
      </div>
    </main>
  );
}
