"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  function generate() {
    setMessage("Generate knappen virker. Næste trin bliver at hente produkter fra Google Sheet.");
  }

  return (
    <main className="page">
      <div className="container">
        <div className="badge">SHEIN AFFILIATE TOOL</div>

        <h1>SHEIN Affiliate Generator</h1>

        <p className="subtitle">
          Generer affiliate content automatisk fra dine produkter.
        </p>

        <button onClick={generate}>
          GENERATE
        </button>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        <div className="status">
          <span className="dot"></span>
          System ready
        </div>
      </div>
    </main>
  );
}
