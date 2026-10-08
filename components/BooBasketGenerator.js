"use client";

import { useState } from "react";
import { BOO_BASKET_VIDEO_COUNTS } from "../lib/booBaskets";
import { createBooBasketZip } from "../lib/booBasketZip";

const PROMPT_COLUMNS = [1, 2, 3, 4];
const columnLabel = (number) => number === 4 ? "FORSIDE" : `BILLEDE ${number}`;
const promptLabel = (videoNumber, number) => `PROMPT V${videoNumber}-${number}`;

export default function BooBasketGenerator() {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState("");
  const [videoCount, setVideoCount] = useState(1);
  const [videos, setVideos] = useState([]);
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
      const blob = await createBooBasketZip(selectedVideos, setMessage);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `boo-basket-${selectedVideos.length}-videos.zip`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(`Complete. ${selectedVideos.length} Boo Basket video${selectedVideos.length === 1 ? "" : "s"}, with references grouped by image.`);
    } catch (error) {
      setMessage(`ZIP failed: ${error.message} Your prompts are ready. Use DOWNLOAD ZIP to retry.`);
    } finally {
      setDownloading(false);
    }
  }

  async function generate() {
    setLoading(true);
    setVideos([]);
    setMessage("Selecting BooBasket products...");
    try {
      const response = await fetch("/api/generate-boo-basket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoCount })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not generate Boo Basket.");
      if (!Array.isArray(data.videos) || data.videos.length !== videoCount) throw new Error("The selected number of videos was not generated.");
      setVideos(data.videos);
      await downloadZip(data.videos);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="clothing-generator boo-basket-generator">
      <div className="clothing-hero">
        <div className="eyebrow">BOO BASKET</div>
        <h1>Create <span>Boo Basket ideas.</span></h1>
        <p>Each video includes 3 product images with 9 different items in a natural 3 × 3 layout, plus a separate cover. White backgrounds, exact codes below each product, vertical 9:16.</p>
        <p>Uses active BooBasket products. At least 9 are required; 27 allows all three images to use different products. Carousel order: cover, image 1, image 2, image 3.</p>
        <div className="clothing-video-count">
          <div className="selector-label">HOW MANY VIDEOS?</div>
          <div className="video-count-grid">
            {BOO_BASKET_VIDEO_COUNTS.map((count) => <button key={count} type="button" className={`video-count-button ${videoCount === count ? "selected" : ""}`} aria-pressed={videoCount === count} onClick={() => setVideoCount(count)} disabled={busy}>{count}</button>)}
          </div>
        </div>
        <button type="button" className={`generate-button ${busy ? "loading" : ""}`} onClick={generate} disabled={busy} style={{ marginTop: 28 }}><span>{busy ? "GENERATING..." : `GENERATE ${videoCount} VIDEO${videoCount === 1 ? "" : "S"}`}</span><span className="button-arrow">→</span></button>
        {message && <div className="message" role="status"><span className="message-dot" />{message}</div>}
      </div>

      {videos.length > 0 && <section className="clothing-results">
        <div className="results-header"><div><div className="section-label">GENERATED CONTENT</div><h2>Your Boo Basket prompts</h2></div><div className="count"><strong>{videos.length * 4}</strong>PROMPTS READY</div></div>
        <button type="button" className="copy-button" onClick={() => downloadZip(videos)} disabled={busy}>{downloading ? "DOWNLOADING..." : "DOWNLOAD ZIP"}</button>
        <p>Each image folder contains its 9 reference images, exact product codes and prompt. FORSIDE contains the separate cover prompt.</p>
        <div className="section-label">QUICK COPY</div>
        <div className="clothing-quick-copy-table">
          <div className="clothing-quick-copy-header"><div>VIDEO</div>{PROMPT_COLUMNS.map((number) => <div key={number}>{columnLabel(number)}</div>)}</div>
          {videos.map((video) => <div className="clothing-quick-copy-row" key={video.videoNumber}><div className="clothing-quick-copy-video">VIDEO {video.videoNumber}</div>{PROMPT_COLUMNS.map((number) => {
            const label = promptLabel(video.videoNumber, number);
            return <button key={number} type="button" className="quick-copy-button" aria-label={`Copy ${columnLabel(number)} for video ${video.videoNumber}`} onClick={() => copyPrompt(video.prompts[number - 1], label)}><span>{label}</span><span className="copy-icon">⧉</span></button>;
          })}</div>)}
        </div>
        <div className="section-label">PROMPTS</div>
        <div className="clothing-prompt-table">
          <div className="clothing-prompt-header"><div>VIDEO</div>{PROMPT_COLUMNS.map((number) => <div key={number}>{columnLabel(number)}</div>)}</div>
          {videos.map((video) => <div className="clothing-prompt-row" key={video.videoNumber}><div className="clothing-prompt-video-name">VIDEO {video.videoNumber}</div>{PROMPT_COLUMNS.map((number) => {
            const label = promptLabel(video.videoNumber, number);
            const prompt = video.prompts[number - 1];
            return <article className="clothing-prompt-card" key={number}><div className="clothing-prompt-card-top"><span>{columnLabel(number)}</span><strong>V{video.videoNumber}-{number}</strong></div><button type="button" className="copy-button" onClick={() => copyPrompt(prompt, label)}><span>{label}</span><span className="copy-icon">⧉</span></button><div className="prompt-wrapper"><textarea aria-label={label} value={prompt} readOnly /></div></article>;
          })}</div>)}
        </div>
      </section>}
    </section>
  );
}
