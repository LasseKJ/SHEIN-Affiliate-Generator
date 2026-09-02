"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  async function generate() {
    setLoading(true);
    setMessage("Vælger 9 produkter...");
    setGroups([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST"
      });

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `API returnerede ikke gyldig JSON. Status: ${response.status}. Svar: ${
            responseText || "Tomt svar"
          }`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Der opstod en fejl."
        );
      }

      setGroups(data.groups || []);

      setMessage(
        "9 produkter er valgt og 3 prompts er klar."
      );
    } catch (error) {
      setMessage(`Fejl: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function copyPrompt(prompt) {
    try {
      await navigator.clipboard.writeText(prompt);
      setMessage("Prompt kopieret.");
    } catch {
      setMessage(
        "Kunne ikke kopiere prompten automatisk."
      );
    }
  }

  function downloadImage(url, filename) {
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadGroup(group) {
    group.products.forEach((product, index) => {
      setTimeout(() => {
        downloadImage(
          product.imageUrl,
          `product-${group.number}-${index + 1}.jpg`
        );
      }, index * 500);
    });

    setMessage(
      `Downloader billederne fra gruppe ${group.number}...`
    );
  }

  return (
    <main className="page">
      <div className="container">
        <div className="badge">
          SHEIN AFFILIATE TOOL
        </div>

        <h1>SHEIN Affiliate Generator</h1>

        <p className="subtitle">
          Vælg 9 produkter og lav 3 færdige prompts.
        </p>

        <button
          onClick={generate}
          disabled={loading}
        >
          {loading ? "GENERATING..." : "GENERATE"}
        </button>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {groups.length > 0 && (
          <div className="groups">
            {groups.map((group) => (
              <div
                className="group"
                key={group.number}
              >
                <h2>
                  Gruppe {group.number}
                </h2>

                <div className="group-products">
                  {group.products.map(
                    (product, index) => (
                      <div
                        className="group-product"
                        key={product.id}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                        />

                        <strong>
                          {product.name}
                        </strong>

                        <div>
                          Kode: {product.code}
                        </div>

                        <div>
                          Pris: {product.price}{" "}
                          {product.currency}
                        </div>
                      </div>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    copyPrompt(group.prompt)
                  }
                >
                  COPY PROMPT
                </button>

                <button
                  onClick={() =>
                    downloadGroup(group)
                  }
                >
                  DOWNLOAD 3 BILLEDER
                </button>

                <textarea
                  value={group.prompt}
                  readOnly
                  rows={12}
                />
              </div>
            ))}
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
