"use client";

import { useState } from "react";
import JSZip from "jszip";

const VIDEO_COUNTS = [1, 2, 4, 8];
const PROMPT_COLUMNS = [1, 2, 3, 4, 5];
const PHONE_MODELS = [
  "iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max",
  "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max",
  "iPhone 18", "iPhone 18 Pro", "iPhone 18 Pro Max"
];

function promptLabel(videoNumber, promptNumber) {
  return `PROMPT V${videoNumber}-${promptNumber}`;
}

function getPrompt(video, promptNumber) {
  return video?.prompts?.[promptNumber - 1] || "";
}

function safeFilePart(value) {
  return String(value || "product").trim().replace(/[^a-zA-Z0-9æøåÆØÅ]+/g, "-").replace(/^-+|-+$/g, "");
}

function safeCode(value) {
  return String(value || "UNKNOWN").trim().replace(/[^a-zA-Z0-9]+/g, "");
}

function createFileName(imageNumber, product, extension) {
  return `B${imageNumber}-PhoneCase-${safeFilePart(product?.name)}-${safeCode(product?.code)}.${extension}`;
}

async function downloadProduct(product) {
  if (!product?.imageUrl) throw new Error(`Produktet ${product?.name || "ukendt"} har ingen billed URL.`);
  const response = await fetch(product.imageUrl);
  if (!response.ok) throw new Error(`Kunne ikke hente produktbillede: ${product.name}`);
  return response.blob();
}

async function addProduct(folder, imageNumber, product) {
  const blob = await downloadProduct(product);
  const extension = blob.type === "image/png" ? "png" : "jpg";
  folder.file(createFileName(imageNumber, product, extension), blob);
}

export default function PhoneCaseGenerator() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [videoCount, setVideoCount] = useState(1);
  const [phoneModel, setPhoneModel] = useState("");
  const [videos, setVideos] = useState([]);

  async function copyPrompt(prompt, label) {
    try {
      await navigator.clipboard.writeText(prompt);
      setMessage(`${label} copied to clipboard.`);
    } catch {
      setMessage("Could not copy the prompt automatically.");
    }
  }

  async function generate() {
    if (!phoneModel) {
      setMessage("Choose an iPhone model first.");
      return;
    }

    setLoading(true);
    setVideos([]);
    setMessage(`Selecting Phone Cases for ${phoneModel}...`);

    try {
      const response = await fetch("/api/generate-phone-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoCount, phoneModel })
      });

      const responseText = await response.text();
      let data;
      try { data = JSON.parse(responseText); }
      catch { throw new Error(`API returnerede ikke gyldig JSON. Status: ${response.status}.`); }

      if (!response.ok || !data.success) throw new Error(data.error || "Der opstod en fejl.");
      if (!Array.isArray(data.videos) || data.videos.length !== videoCount) throw new Error("Der blev ikke oprettet det valgte antal videoer.");

      setVideos(data.videos);
      const zip = new JSZip();

      for (const video of data.videos) {
        const videoFolder = zip.folder(`VIDEO ${video.videoNumber}`);
        for (let slideIndex = 0; slideIndex < 4; slideIndex++) {
          const slide = video.slides[slideIndex];
          const imageNumber = slideIndex + 1;
          setMessage(`Video ${video.videoNumber} of ${data.videos.length}, downloading BILLEDE ${imageNumber}...`);
          for (const product of slide) await addProduct(videoFolder, imageNumber, product);
        }
        videoFolder.folder("FORSIDE");
      }

      setMessage("Creating Phone Cases ZIP...");
      const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `phone-cases-${safeFilePart(phoneModel)}-${videoCount}-videos.zip`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(`Complete, ${videoCount} ${phoneModel} video${videoCount === 1 ? "" : "s"} generated.`);
    } catch (error) {
      console.error("Phone Case generate error:", error);
      setMessage(`Error, ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="clothing-generator">
      <div className="clothing-hero">
        <div className="eyebrow">PHONE CASES</div>
        <h1>Create <span>Phone Cases.</span></h1>
        <p>Choose an iPhone model. Every case prompt will adapt the case to that model and place it on a silver version of the selected iPhone.</p>

        <div className="clothing-category-section" style={{ padding: 0, marginBottom: 34 }}>
          <div className="clothing-category-label">CHOOSE IPHONE MODEL</div>
          <div className="clothing-category-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {PHONE_MODELS.map((model) => (
              <button key={model} type="button" className={`category-button ${phoneModel === model ? "selected" : ""}`} onClick={() => setPhoneModel(model)} disabled={loading}>
                {model.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="clothing-video-count">
          <div className="selector-label">HOW MANY VIDEOS?</div>
          <div className="video-count-grid">
            {VIDEO_COUNTS.map((count) => (
              <button key={count} type="button" className={`video-count-button ${videoCount === count ? "selected" : ""}`} onClick={() => setVideoCount(count)} disabled={loading}>{count}</button>
            ))}
          </div>
        </div>

        <button className={`generate-button ${loading ? "loading" : ""}`} onClick={generate} disabled={loading || !phoneModel} style={{ marginTop: 28 }}>
          <span>{loading ? "GENERATING..." : `GENERATE ${videoCount} VIDEO${videoCount === 1 ? "" : "S"}`}</span>
          <span className="button-arrow">→</span>
        </button>

        {message && <div className="message"><span className="message-dot" />{message}</div>}
      </div>

      {videos.length > 0 && (
        <section className="clothing-results">
          <div className="results-header">
            <div><div className="section-label">GENERATED CONTENT</div><h2>Your {phoneModel} prompts</h2></div>
            <div className="count"><strong>{videos.length * 5}</strong>PROMPTS READY</div>
          </div>

          <div className="section-label">QUICK COPY</div>
          <div className="clothing-quick-copy-table">
            <div className="clothing-quick-copy-header">
              <div>VIDEO</div>
              {PROMPT_COLUMNS.map((number) => <div key={number}>{number < 5 ? `BILLEDE ${number}` : "FORSIDE"}</div>)}
            </div>
            {videos.map((video) => (
              <div className="clothing-quick-copy-row" key={video.videoNumber}>
                <div className="clothing-quick-copy-video">VIDEO {video.videoNumber}</div>
                {PROMPT_COLUMNS.map((number) => {
                  const label = promptLabel(video.videoNumber, number);
                  return <button key={number} className="quick-copy-button" onClick={() => copyPrompt(getPrompt(video, number), label)}><span>{label}</span><span className="copy-icon">⧉</span></button>;
                })}
              </div>
            ))}
          </div>

          <div className="section-label">PROMPTS</div>
          <div className="clothing-prompt-table">
            <div className="clothing-prompt-header">
              <div>VIDEO</div>
              {PROMPT_COLUMNS.map((number) => <div key={number}>{number < 5 ? `BILLEDE ${number}` : "FORSIDE"}</div>)}
            </div>
            {videos.map((video) => (
              <div className="clothing-prompt-row" key={video.videoNumber}>
                <div className="clothing-prompt-video-name">VIDEO {video.videoNumber}</div>
                {PROMPT_COLUMNS.map((number) => {
                  const label = promptLabel(video.videoNumber, number);
                  const prompt = getPrompt(video, number);
                  return (
                    <article className="clothing-prompt-card" key={number}>
                      <div className="clothing-prompt-card-top"><span>{number < 5 ? `BILLEDE ${number}` : "FORSIDE"}</span><strong>V{video.videoNumber}-{number}</strong></div>
                      <button className="copy-button" onClick={() => copyPrompt(prompt, label)}><span>{label}</span><span className="copy-icon">⧉</span></button>
                      <div className="prompt-wrapper"><textarea value={prompt} readOnly /></div>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
