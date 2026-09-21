"use client";

import { useState } from "react";
import JSZip from "jszip";

const VIDEO_COUNTS = [1, 2, 4, 8];
const USAGE_STORAGE_KEY = "shein-essentials-category-usage";

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
  const [categoryUsage, setCategoryUsage] = useState(() => {
    if (typeof window === "undefined") return {};

    try {
      return JSON.parse(localStorage.getItem(USAGE_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  });
  const [videos, setVideos] = useState([]);

  function resetCategoryUsage() {
    const reset = {};
    CATEGORIES.forEach((category) => {
      reset[category.value] = 0;
    });
    setCategoryUsage(reset);
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(reset));
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
    setLoading(true);
    setVideos([]);

    setMessage(
      `Randomly selecting 3 balanced categories for ${videoCount} video${videoCount === 1 ? "" : "s"}...`
    );

    try {
      const response = await fetch("/api/generate-essentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          videoCount,
          selectedCategories: null,
          categoryUsage
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

      const nextUsage = { ...categoryUsage };

      for (const video of data.videos) {
        for (const category of video.categories || []) {
          nextUsage[category] = Number(nextUsage[category] || 0) + 1;
        }
      }

      setCategoryUsage(nextUsage);
      localStorage.setItem(
        USAGE_STORAGE_KEY,
        JSON.stringify(nextUsage)
      );

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
          Pick 3 categories automatically. Each category gets its own image with 6 products.
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
          PICK 3, AUTOMATIC
        </div>

        <p style={{ marginTop: 12 }}>
          The generator randomly selects 3 Essentials categories for each video.
          It prioritizes categories used the least, while keeping random selection
          between categories with the same usage count.
        </p>

        <div className="clothing-category-grid essentials-category-grid">
          {CATEGORIES.map((category) => (
            <div
              key={category.value}
              className="category-button essentials-category-button"
              style={{ cursor: "default" }}
            >
              <span>{category.label}</span>
              <strong style={{ display: "block", marginTop: 6 }}>
                {Number(categoryUsage[category.value] || 0)} used
              </strong>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="content-type-button"
          onClick={resetCategoryUsage}
          disabled={loading}
          style={{ marginTop: 16 }}
        >
          RESET COUNTER
        </button>
      </div>
