"use client";

import { useState } from "react";
import ChatGPTExport from "./ChatGPTExport";
import { createDressPromptFiles, DRESS_VIDEO_COUNTS } from "../lib/dressPrompts";
import { createDressZip } from "../lib/dressZip";

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadPrompt(prompt, filename) {
  download(new Blob(["\uFEFF", prompt], { type: "text/plain;charset=utf-8" }), filename);
}

export default function DressGenerator() {
  const [videoCount, setVideoCount] = useState(1);
  const [videos, setVideos] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const prompts = videos.length ? createDressPromptFiles(videos) : null;

  async function downloadZip(selectedVideos) {
    const zip = await createDressZip(selectedVideos, setMessage);
    download(zip, `dresses-${selectedVideos.length}-videos.zip`);
    setMessage("ZIP-filen er klar.");
  }

  async function generate() {
    setBusy(true);
    setVideos([]);
    setError("");
    setMessage("Henter kjoler fra Google Sheets…");

    try {
      const response = await fetch("/api/generate-dresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoCount })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Kunne ikke forberede videoerne.");
      setVideos(data.videos);
      await downloadZip(data.videos);
    } catch (error) {
      setError(error.message);
      setMessage("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="clothing-generator">
      <div className="clothing-hero">
        <h1>Dress <span>Generator</span></h1>
        <div className="clothing-video-count">
          <div className="selector-label">ANTAL VIDEOER</div>
          <div className="video-count-grid">
            {DRESS_VIDEO_COUNTS.map((count) => (
              <button
                key={count}
                type="button"
                className={`video-count-button ${videoCount === count ? "selected" : ""}`}
                aria-pressed={videoCount === count}
                disabled={busy}
                onClick={() => setVideoCount(count)}
              >
                {count === 7 ? "Week" : count}
              </button>
            ))}
          </div>
        </div>
        <button className="generate-button" type="button" onClick={generate} disabled={busy} style={{ marginTop: 28 }}>
          Download {videoCount} {videoCount === 1 ? "video" : "videoer"} som ZIP
        </button>
        {message && <div className="message" role="status"><span className="message-dot" />{message}</div>}
        {error && <div className="message" role="alert">{error}</div>}
      </div>

      <ChatGPTExport category="dresses" videos={videos} disabled={busy} />

      {prompts && (
        <section className="clothing-results">
          <div className="results-header"><h2>Prompts til ChatGPT</h2></div>

          {videos.map(({ videoNumber, images }) => (
            <div className="clothing-video-count" key={videoNumber}>
              <h3>Video {videoNumber}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {images.map(({ folder, prompt }, index) => (
                  <button
                    key={folder}
                    type="button"
                    className="copy-button"
                    onClick={() => downloadPrompt(prompt, `v${videoNumber}-${index + 1}-prompt.txt`)}
                  >
                    {folder === "COVER" ? "Forside" : `Billede ${index}`} (.txt)
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </section>
  );
}
