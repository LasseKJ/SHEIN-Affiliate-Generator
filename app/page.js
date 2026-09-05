"use client";

import { useState } from "react";
import SquishyGenerator from "../components/SquishyGenerator";
import ClothingVideoGenerator from "../components/ClothingVideoGenerator";

export default function Home() {
  const [contentType, setContentType] =
    useState("squishy");

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

        <section className="content-selector-section">

          <div className="selector-label">
            CONTENT TYPE
          </div>

          <div className="content-selector">

            <button
              className={
                contentType === "squishy"
                  ? "content-type-button active"
                  : "content-type-button"
              }
              onClick={() =>
                setContentType("squishy")
              }
            >
              <span>
                SQUISHY POST
              </span>

              <span className="selector-arrow">
                →
              </span>
            </button>

            <button
              className={
                contentType === "clothing"
                  ? "content-type-button active"
                  : "content-type-button"
              }
              onClick={() =>
                setContentType("clothing")
              }
            >
              <span>
                CLOTHING VIDEO
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
          <ClothingVideoGenerator />
        )}

        <footer>
          <span>
            SHEIN AFFILIATE GENERATOR
          </span>

          <span>
            CONTENT TOOL
          </span>
        </footer>

      </div>
    </main>
  );
}
