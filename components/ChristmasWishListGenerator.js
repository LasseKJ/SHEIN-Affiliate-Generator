"use client";

import { useState } from "react";
import ChatGPTExport from "./ChatGPTExport";
import { CHRISTMAS_WISHLIST_VIDEO_COUNTS } from "../lib/christmasWishList";

const IMAGE_COLUMNS = [0, 1, 2, 3];
const columnLabel = number => number === 0 ? "COVER" : `IMAGE ${number}`;
const promptLabel = (videoNumber, number) => `PROMPT V${videoNumber}-${number === 0 ? "COVER" : number}`;

export default function ChristmasWishListGenerator() {
  const [videoCount, setVideoCount] = useState(1);
  const [videos, setVideos] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function copyPrompt(prompt, label) {
    try {
      await navigator.clipboard.writeText(prompt);
      setMessage(`${label} copied to clipboard.`);
    } catch {
      setMessage("Could not copy automatically. Select and copy the prompt below.");
    }
  }

  async function generate() {
    setBusy(true);
    setVideos([]);
    setMessage("Selecting products for your Christmas Wish List...");
    try {
      const response = await fetch("/api/generate-christmas-wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoCount })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not generate wish lists.");
      if (!Array.isArray(data.videos) || data.videos.length !== videoCount) {
        throw new Error("The selected number of wish lists was not generated.");
      }
      setVideos(data.videos);
      setMessage(`Ready: ${data.videos.length} wish list${data.videos.length === 1 ? "" : "s"}, with a cover and three four-item images each.`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="clothing-generator stocking-stuffers-generator">
      <div className="clothing-hero">
        <div className="eyebrow">CHRISTMAS WISH LIST</div>
        <h1>Create <span>Christmas Wish Lists.</span></h1>
        <div className="clothing-video-count">
          <div className="selector-label">HOW MANY WISH LISTS?</div>
          <div className="video-count-grid">
            {CHRISTMAS_WISHLIST_VIDEO_COUNTS.map(count => (
              <button key={count} type="button" className={`video-count-button ${videoCount === count ? "selected" : ""}`} aria-pressed={videoCount === count} onClick={() => setVideoCount(count)} disabled={busy}>{count}</button>
            ))}
          </div>
        </div>
        <button type="button" className={`generate-button ${busy ? "loading" : ""}`} onClick={generate} disabled={busy} style={{ marginTop: 28 }}>
          <span>{busy ? "GENERATING..." : `GENERATE ${videoCount} WISH LIST${videoCount === 1 ? "" : "S"}`}</span><span className="button-arrow">→</span>
        </button>
        {message && <div className="message" role="status"><span className="message-dot" />{message}</div>}
      </div>

      <ChatGPTExport category="christmas-wishlist" videos={videos} disabled={busy} />

      {videos.length > 0 && <section className="clothing-results">
        <div className="results-header">
          <div><div className="section-label">GENERATED CONTENT</div><h2>Your Christmas Wish List prompts</h2></div>
          <div className="count"><strong>{videos.length * 4}</strong>PROMPTS READY</div>
        </div>
        <div className="section-label">QUICK COPY</div>
        <div className="clothing-quick-copy-table">
          <div className="clothing-quick-copy-header"><div>WISH LIST</div>{IMAGE_COLUMNS.map(number => <div key={number}>{columnLabel(number)}</div>)}</div>
          {videos.map(video => (
            <div className="clothing-quick-copy-row" key={video.videoNumber}>
              <div className="clothing-quick-copy-video">WISH LIST {video.videoNumber}</div>
              {IMAGE_COLUMNS.map(number => {
                const label = promptLabel(video.videoNumber, number);
                return <button key={number} type="button" className="quick-copy-button" onClick={() => copyPrompt(video.prompts[number], label)}><span>{label}</span><span className="copy-icon">⧉</span></button>;
              })}
            </div>
          ))}
        </div>
        <div className="section-label">PROMPTS</div>
        <div className="clothing-prompt-table">
          <div className="clothing-prompt-header"><div>WISH LIST</div>{IMAGE_COLUMNS.map(number => <div key={number}>{columnLabel(number)}</div>)}</div>
          {videos.map(video => (
            <div className="clothing-prompt-row" key={video.videoNumber}>
              <div className="clothing-prompt-video-name">WISH LIST {video.videoNumber}</div>
              {IMAGE_COLUMNS.map(number => {
                const label = promptLabel(video.videoNumber, number);
                return <article className="clothing-prompt-card" key={number}>
                  <div className="clothing-prompt-card-top"><span>{columnLabel(number)}</span><strong>V{video.videoNumber}-{number === 0 ? "COVER" : number}</strong></div>
                  <button type="button" className="copy-button" onClick={() => copyPrompt(video.prompts[number], label)}><span>{label}</span><span className="copy-icon">⧉</span></button>
                  <div className="prompt-wrapper"><textarea aria-label={label} value={video.prompts[number]} readOnly /></div>
                </article>;
              })}
            </div>
          ))}
        </div>
      </section>}
    </section>
  );
}
