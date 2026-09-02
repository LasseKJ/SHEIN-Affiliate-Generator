"use client";

import { useState } from "react";
import JSZip from "jszip";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  async function generate() {
    setLoading(true);
    setMessage("Vælger 9 produkter og downloader billeder...");
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
          `API returnerede ikke gyldig JSON. Status: ${response.status}.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Der opstod en fejl."
        );
      }

      const selectedGroups = data.groups || [];

      setGroups(selectedGroups);

      const zip = new JSZip();

      let downloadedImages = 0;

      for (const group of selectedGroups) {
        for (let index = 0; index < group.products.length; index++) {
          const product = group.products[index];

          try {
            const imageResponse = await fetch(product.imageUrl);

            if (!imageResponse.ok) {
              throw new Error(
                `Kunne ikke hente billede for ${product.name}`
              );
            }

            const imageBlob = await imageResponse.blob();

            const extension =
              imageBlob.type === "image/png"
                ? "png"
                : "jpg";

            const fileName =
              `gruppe-${group.number}-produkt-${index + 1}-${product.code}.${extension}`;

            zip.file(fileName, imageBlob);

            downloadedImages++;
          } catch (error) {
            console.error(
              `Kunne ikke downloade ${product.name}:`,
              error
            );
          }
        }
      }

      if (downloadedImages === 0) {
        throw new Error(
          "Ingen af produktbillederne kunne downloades."
        );
      }

      setMessage(
        `9 produkter valgt. ${downloadedImages} af 9 billeder er hentet. Opretter download...`
      );

      const zipBlob = await zip.generateAsync({
        type: "blob"
      });

      const downloadUrl =
        URL.createObjectURL(zipBlob);

      const link =
        document.createElement("a");

      link.href = downloadUrl;
      link.download = "shein-products-9-images.zip";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);

      setMessage(
        `Færdig. ${downloadedImages} billeder er downloadet i én ZIP fil.`
      );
    } catch (error) {
      console.error("Generate error:", error);

      setMessage(
        `Fejl: ${error.message}`
      );
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

  return (
    <main className="page">
      <div className="container">

        <div className="badge">
          SHEIN AFFILIATE TOOL
        </div>

        <h1>
          SHEIN Affiliate Generator
        </h1>

        <p className="subtitle">
          Generer 9 produkter og 3 færdige prompts.
        </p>

        <button
          onClick={generate}
          disabled={loading}
        >
          {loading
            ? "GENERATING..."
            : "GENERATE"}
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

                <button
                  onClick={() =>
                    copyPrompt(group.prompt)
                  }
                >
                  COPY PROMPT
                </button>

                <textarea
                  value={group.prompt}
                  readOnly
                  rows={20}
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
