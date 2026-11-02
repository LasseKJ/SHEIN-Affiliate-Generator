"use client";

import { useState } from "react";
import { STOCKING_VIDEO_COUNTS } from "../lib/stockingStuffers";
import { createStockingZip } from "../lib/stockingZip";

const PROMPT_COLUMNS = [1, 2, 3, 4];
const columnLabel = (number) => number === 4 ? "COVER" : `IMAGE ${number}`;
const promptLabel = (carouselNumber, number) => `PROMPT V${carouselNumber}-${number}`;

export default function StockingGenerator() {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState("");
  const [carouselCount, setVideoCount] = useState(1);
  const [carousels, setVideos] = useState([]);
  const busy = loading || downloading;

  async function copyPrompt(prompt, label) {
    try {
      await navigator.clipboard.writeText(prompt);
      setMessage(`${label} copied to clipboard.`);
    } catch {
      setMessage("Could not copy automatically. Select and copy the prompt below.");
    }
  }


  function downloadAllPrompts() {
    const text = carousels.flatMap((carousel) =>
      carousel.prompts.map((prompt, index) =>
        `${promptLabel(carousel.videoNumber, index + 1)}\n\n${prompt.trim()}`
      )
    ).join("\n\n\n");
    const blob = new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `christmas-videos-${carousels.length}-carousels-prompts.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(`All ${carousels.length * 4} prompts downloaded as TXT.`);
  }

  function masterPrompt() {
    const folders = carousels.map((carousel) => `VIDEO ${carousel.videoNumber}`).join(", ");
    const promptIds = carousels.flatMap((carousel) =>
      [1, 2, 3, 4].map((number) => `V${carousel.videoNumber}-${number}`)
    ).join(", ");
    return `Use the uploaded TXT prompts and ZIP product references to create all ${carousels.length * 4} Christmas Videos images: ${promptIds}.

The ZIP contains ${folders}. Each VIDEO folder has IMAGE 1, IMAGE 2 and IMAGE 3 with three product references, PRODUCTS.json and PROMPT.txt. Use exactly the references in each image folder with its matching prompt. COVER contains the selected cover theme; create it without product references. Carousel order: COVER, IMAGE 1, IMAGE 2, IMAGE 3.

Follow every prompt for layout, exact names, codes, prices and colors. Preserve original product identities and colors. Create one vertical 9:16 image per prompt. All printed text must be English. Never mix products or information between folders.

Return one ZIP with a vN folder for each video. Save four images per folder as vN-1.png (cover), vN-2.png (image 1), vN-3.png (image 2), vN-4.png (image 3). Verify all ${carousels.length * 4} images are included and provide a clickable ZIP download link.`;
  }

  async function downloadZip(selectedVideos) {
    setDownloading(true);
    try {
      const blob = await createStockingZip(selectedVideos, setMessage);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `christmas-videos-${selectedVideos.length}-carousels.zip`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(`Complete. ${selectedVideos.length} Christmas Videos carousel${selectedVideos.length === 1 ? "" : "s"}, with references grouped by image.`);
    } catch (error) {
      setMessage(`ZIP failed: ${error.message} Your prompts are ready. Use DOWNLOAD ZIP to retry.`);
    } finally {
      setDownloading(false);
    }
  }

  async function generate() {
    setLoading(true);
    setVideos([]);
    setMessage("Selecting StockingStuffer products...");
    try {
      const response = await fetch("/api/generate-stocking-stuffers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoCount: carouselCount })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not generate Christmas Videos.");
      if (!Array.isArray(data.videos) || data.videos.length !== carouselCount) throw new Error("The selected number of carousels was not generated.");
      setVideos(data.videos);
      await downloadZip(data.videos);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="clothing-generator stocking-stuffers-generator">
      <div className="clothing-hero">
        <div className="eyebrow">CHRISTMAS VIDEOS</div>
        <h1>Create <span>Christmas videos.</span></h1>
        <p>Each carousel includes one of eight randomly selected Christmas cover themes, without repeats within a batch, and three clean catalogue pages with three products each. Warm ivory, muted Christmas accents and generous space. Product photos on the left, names, search codes and prices on the right. Vertical 9:16.</p>
        <p>Add at least 9 small gift products to your Google Sheet with Category StockingStuffer and Active YES, including name, code, image URL, price and currency. Carousel order: cover, image 1, image 2, image 3.</p>
        <div className="clothing-video-count">
          <div className="selector-label">HOW MANY CAROUSELS?</div>
          <div className="video-count-grid">
            {STOCKING_VIDEO_COUNTS.map((count) => <button key={count} type="button" className={`video-count-button ${carouselCount === count ? "selected" : ""}`} aria-pressed={carouselCount === count} onClick={() => setVideoCount(count)} disabled={busy}>{count}</button>)}
          </div>
        </div>
        <button type="button" className={`generate-button ${busy ? "loading" : ""}`} onClick={generate} disabled={busy} style={{ marginTop: 28 }}><span>{busy ? "GENERATING..." : `GENERATE ${carouselCount} CAROUSEL${carouselCount === 1 ? "" : "S"}`}</span><span className="button-arrow">→</span></button>
        {message && <div className="message" role="status"><span className="message-dot" />{message}</div>}
      </div>

      {carousels.length > 0 && <section className="clothing-results">
        <div className="results-header"><div><div className="section-label">GENERATED CONTENT</div><h2>Your Christmas Videos prompts</h2></div><div className="count"><strong>{carousels.length * 4}</strong>PROMPTS READY</div></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <button type="button" className="copy-button" onClick={() => downloadZip(carousels)} disabled={busy}>{downloading ? "DOWNLOADING..." : "DOWNLOAD ZIP"}</button>
          <button type="button" className="copy-button" onClick={downloadAllPrompts} disabled={busy}>DOWNLOAD ALL PROMPTS (.TXT)</button>
          <button type="button" className="copy-button" onClick={() => copyPrompt(masterPrompt(), "Master prompt")} disabled={busy}>COPY MASTER PROMPT</button>
        </div>
        <p>Each image folder contains 3 product references, exact names, codes, prices and a prompt. COVER contains the selected Christmas cover prompt.</p>
        <div className="section-label">QUICK COPY</div>
        <div className="clothing-quick-copy-table">
          <div className="clothing-quick-copy-header"><div>CAROUSEL</div>{PROMPT_COLUMNS.map((number) => <div key={number}>{columnLabel(number)}</div>)}</div>
          {carousels.map((carousel) => <div className="clothing-quick-copy-row" key={carousel.videoNumber}><div className="clothing-quick-copy-video">CAROUSEL {carousel.videoNumber}</div>{PROMPT_COLUMNS.map((number) => {
            const label = promptLabel(carousel.videoNumber, number);
            return <button key={number} type="button" className="quick-copy-button" aria-label={`Copy ${columnLabel(number)} for carousel ${carousel.videoNumber}`} onClick={() => copyPrompt(carousel.prompts[number - 1], label)}><span>{label}</span><span className="copy-icon">⧉</span></button>;
          })}</div>)}
        </div>
        <div className="section-label">PROMPTS</div>
        <div className="clothing-prompt-table">
          <div className="clothing-prompt-header"><div>CAROUSEL</div>{PROMPT_COLUMNS.map((number) => <div key={number}>{columnLabel(number)}</div>)}</div>
          {carousels.map((carousel) => <div className="clothing-prompt-row" key={carousel.videoNumber}><div className="clothing-prompt-video-name">CAROUSEL {carousel.videoNumber}</div>{PROMPT_COLUMNS.map((number) => {
            const label = promptLabel(carousel.videoNumber, number);
            const prompt = carousel.prompts[number - 1];
            return <article className="clothing-prompt-card" key={number}><div className="clothing-prompt-card-top"><span>{columnLabel(number)}</span><strong>V{carousel.videoNumber}-{number}</strong></div><button type="button" className="copy-button" onClick={() => copyPrompt(prompt, label)}><span>{label}</span><span className="copy-icon">⧉</span></button><div className="prompt-wrapper"><textarea aria-label={label} value={prompt} readOnly /></div></article>;
          })}</div>)}
        </div>
      </section>}
    </section>
  );
}


