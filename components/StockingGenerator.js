"use client";

import { useState } from "react";
import VideoCountSelect from "./VideoCountSelect";
import ChatGPTExport from "./ChatGPTExport";
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
        <div className="clothing-video-count">
          <div className="selector-label">HOW MANY CAROUSELS?</div>
          <VideoCountSelect value={carouselCount} onChange={setVideoCount} disabled={busy} />
        </div>
        <button type="button" className={`generate-button ${busy ? "loading" : ""}`} onClick={generate} disabled={busy} style={{ marginTop: 28 }}><span>{busy ? "GENERATING..." : `GENERATE ${carouselCount} CAROUSEL${carouselCount === 1 ? "" : "S"}`}</span><span className="button-arrow">→</span></button>
        {message && <div className="message" role="status"><span className="message-dot" />{message}</div>}
      </div>

      <ChatGPTExport category="stocking" videos={carousels} disabled={busy} />

      {carousels.length > 0 && <section className="clothing-results">
        <div className="results-header"><div><div className="section-label">GENERATED CONTENT</div><h2>Your Christmas Videos prompts</h2></div><div className="count"><strong>{carousels.length * 4}</strong>PROMPTS READY</div></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <button type="button" className="copy-button" onClick={() => downloadZip(carousels)} disabled={busy}>{downloading ? "DOWNLOADING..." : "DOWNLOAD ZIP"}</button>


        </div>
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


