"use client";

import { useState } from "react";
import JSZip from "jszip";

const VIDEO_COUNTS = [1, 2, 4, 8];

const CATEGORIES = [
  { value: "Essentials-Makeup", label: "MAKEUP" },
  { value: "Essentials-Cases", label: "CASES" },
  { value: "Essentials-MakeupStorage", label: "MAKEUP STORAGE" },
  { value: "Essentials-Hair", label: "HAIR" },
  { value: "Essentials-HomeDecor", label: "HOME DECOR" },
  { value: "Essentials-VanityExtras", label: "VANITY EXTRAS" },
  { value: "Essentials-Kitchen", label: "KITCHEN" },
  { value: "Essentials-Bath", label: "BATH" },
];

function safeFilePart(value) {
  return String(value || "product")
    .trim()
    .replace(/[^a-zA-Z0-9æøåÆØÅ]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeCode(value) {
  return String(value || "UNKNOWN")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "");
}

function createFileName(imageNumber, product, extension) {
  const name = safeFilePart(product?.name);
  const code = safeCode(product?.code);

  return `B${imageNumber}-Essentials-${name}-${code}.${extension}`;
}

async function downloadProduct(product) {
  if (!product?.imageUrl) {
    throw new Error(
      `Produktet ${product?.name || "ukendt"} har ingen billed URL.`
    );
  }

  const response = await fetch(product.imageUrl);

  if (!response.ok) {
    throw new Error(
      `Kunne ikke hente produktbillede: ${product.name}`
    );
  }

  return response.blob();
}

async function addProduct(folder, imageNumber, product) {
  const blob = await downloadProduct(product);
  const extension = "jpg";

  folder.file(
    createFileName(imageNumber, product, extension),
    blob
  );
}

function categoryLabel(value) {
  const item = CATEGORIES.find(
    (category) => category.value === value
  );

  return item?.label || value;
}

function getPrompt(video, promptNumber) {
  return video?.prompts?.[promptNumber - 1] || "";
}

export default function EssentialsGenerator() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [videoCount, setVideoCount] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [videos, setVideos] = useState([]);

  function toggleCategory(value) {
    if (loading) return;

    setSelectedCategories((current) => {
      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, value];
    });
  }

  async function copyPrompt(prompt, label) {
    try {
      await navigator.clipboard.writeText(prompt);
      setMessage(`${label} copied to clipboard.`);
    } catch {
      setMessage("Could not copy the prompt automatically.");
    }
  }

  async function generate() {
    if (selectedCategories.length !== 3) {
      setMessage("Choose exactly 3 Essentials categories first.");
      return;
    }

    setLoading(true);
    setVideos([]);

    setMessage(
      `Selecting 6 products from each of the 3 selected categories for ${videoCount} video${videoCount === 1 ? "" : "s"}...`
    );

    try {
      const response = await fetch("/api/generate-essentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          videoCount,
          selectedCategories
        })
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

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Der opstod en fejl.");
      }

      if (
        !Array.isArray(data.videos) ||
        data.videos.length !== videoCount
      ) {
        throw new Error(
          "Der blev ikke oprettet det valgte antal videoer."
        );
      }

      setVideos(data.videos);

      const zip = new JSZip();

      for (const video of data.videos) {
        const videoFolder = zip.folder(
          `VIDEO ${video.videoNumber}`
        );

        for (let slideIndex = 0; slideIndex < 3; slideIndex++) {
          const slide = video.slides[slideIndex];
          const imageNumber = slideIndex + 1;

          if (!slide || !Array.isArray(slide.products)) {
            throw new Error(
              `Video ${video.videoNumber} mangler BILLEDE ${imageNumber}.`
            );
          }

          setMessage(
            `Video ${video.videoNumber} of ${data.videos.length}, downloading BILLEDE ${imageNumber}...`
          );

          for (const product of slide.products) {
            await addProduct(
              videoFolder,
              imageNumber,
              product
            );
          }
        }
      }

      setMessage("Creating Essentials ZIP...");

      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6
        }
      });

      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `essentials-${videoCount}-videos.zip`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setMessage(
        `Complete, ${videoCount} Essentials video${videoCount === 1 ? "" : "s"} with ${videoCount * 3} prompts generated.`
      );
    } catch (error) {
      console.error("Essentials generate error:", error);
      setMessage(`Error, ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="clothing-generator">
      <div className="clothing-hero">
        <div className="eyebrow">ESSENTIALS</div>

        <h1>
          Create
          <span> Essentials.</span>
        </h1>

        <p>
          Choose 3 categories. Each category gets its own image with 6 products.
        </p>

        <div className="clothing-video-count">
          <div className="selector-label">HOW MANY VIDEOS?</div>

          <div className="video-count-grid">
            {VIDEO_COUNTS.map((count) => (
              <button
                key={count}
                type="button"
                className={`video-count-button ${
                  videoCount === count ? "selected" : ""
                }`}
                onClick={() => setVideoCount(count)}
                disabled={loading}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="clothing-category-section essentials-category-section">
        <div className="clothing-category-label">
          CHOOSE 3 CATEGORIES
        </div>

        <div className="clothing-category-grid essentials-category-grid">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              className={`category-button essentials-category-button ${
                selectedCategories.includes(category.value)
                  ? "selected"
                  : ""
              }`}
              onClick={() => toggleCategory(category.value)}
              disabled={
                loading ||
                (!selectedCategories.includes(category.value) &&
                  selectedCategories.length >= 3)
              }
            >
              {category.label}
            </button>
          ))}
        </div>

        <p style={{ marginTop: 16 }}>
          Selected: {selectedCategories.length} / 3
        </p>
      </div>

      <div style={{ marginTop: 28 }}>
        <button
          type="button"
          className="content-type-button active"
          onClick={generate}
          disabled={loading || selectedCategories.length !== 3}
        >
          <span>
            {loading ? "GENERATING..." : "GENERATE ESSENTIALS"}
          </span>
          <span className="selector-arrow">→</span>
        </button>
      </div>

      {message && (
        <div style={{ marginTop: 18 }}>
          {message}
        </div>
      )}

      {videos.length > 0 && (
        <section className="essentials-results" style={{ marginTop: 40 }}>
          <div className="clothing-category-label essentials-results-label">QUICK COPY</div>

          {videos.map((video) => (
            <div
              className="clothing-prompt-row essentials-prompt-row"
              key={video.videoNumber}
              style={{ marginTop: 20 }}
            >
              <div className="clothing-prompt-video-name essentials-prompt-video-name">
                VIDEO {video.videoNumber}
              </div>

              {[1, 2, 3].map((promptNumber) => {
                const prompt = getPrompt(video, promptNumber);
                const label = `PROMPT V${video.videoNumber}-${promptNumber}`;

                return (
                  <article
                    className="clothing-prompt-card essentials-prompt-card"
                    key={promptNumber}
                  >
                    <div className="clothing-prompt-card-top">
                      <span>BILLEDE {promptNumber}</span>
                      <strong>
                        V{video.videoNumber}-{promptNumber}
                      </strong>
                    </div>

                    <button
                      className="copy-button"
                      onClick={() => copyPrompt(prompt, label)}
                      type="button"
                    >
                      <span>{label}</span>
                      <span className="copy-icon">⧉</span>
                    </button>

                    <div className="prompt-wrapper">
                      <textarea value={prompt} readOnly />
                    </div>
                  </article>
                );
              })}
            </div>
          ))}
        </section>
      )}
    </section>
  );
}
