"use client";

import { useState } from "react";
import JSZip from "jszip";

const VIDEO_COUNTS = [1, 2, 4, 8];
const PROMPTS = [1, 2, 3, 4, 5];

function safe(value) {
  return String(value || "product").trim().replace(/[^a-zA-Z0-9æøåÆØÅ]+/g, "-").replace(/^-+|-+$/g, "");
}

async function downloadProduct(product) {
  const response = await fetch(product.imageUrl);
  if (!response.ok) throw new Error(`Kunne ikke hente produktbillede: ${product.name}`);
  return response.blob();
}

export default function JacketGenerator() {
  const [videoCount, setVideoCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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
    setLoading(true);
    setVideos([]);
    setMessage(`Selecting jackets for ${videoCount} video${videoCount === 1 ? "" : "s"}...`);

    try {
      const response = await fetch("/api/generate-jackets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoCount })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Der opstod en fejl.");
      setVideos(data.videos);

      const zip = new JSZip();
      for (const video of data.videos) {
        const folder = zip.folder(`VIDEO ${video.videoNumber}`);
        for (let index = 0; index < video.jackets.length; index++) {
          const product = video.jackets[index];
          setMessage(`Video ${video.videoNumber} of ${data.videos.length}, downloading jacket ${index + 1}...`);
          const blob = await downloadProduct(product);
          const extension = blob.type === "image/png" ? "png" : "jpg";
          folder.file(`B${index + 1}-Jacket-${safe(product.name)}-${safe(product.code)}.${extension}`, blob);
        }
        const cover = folder.folder("FORSIDE");
        for (let index = 0; index < video.jackets.length; index++) {
          const product = video.jackets[index];
          const blob = await downloadProduct(product);
          const extension = blob.type === "image/png" ? "png" : "jpg";
          cover.file(`B${index + 1}-Jacket-${safe(product.name)}-${safe(product.code)}.${extension}`, blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jackets-${videoCount}-videos.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(`Complete, ${videoCount} Jacket video${videoCount === 1 ? "" : "s"} with ${videoCount * 5} prompts generated.`);
    } catch (error) {
      setMessage(`Error, ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="clothing-generator">
      <div className="clothing-hero">
        <div className="eyebrow">JACKETS</div>
        <h1>Create <span>Autumn Jackets.</span></h1>
        <p>Four jacket images and one cover per video. Each jacket is photographed flat on a bed from above.</p>

        <div className="clothing-video-count">
          <div className="selector-label">HOW MANY VIDEOS?</div>
          <div className="video-count-grid">
            {VIDEO_COUNTS.map((count) => (
              <button key={count} type="button" className={`video-count-button ${videoCount === count ? "selected" : ""}`} onClick={() => setVideoCount(count)} disabled={loading}>{count}</button>
            ))}
          </div>
        </div>

        <button className={`generate-button ${loading ? "loading" : ""}`} onClick={generate} disabled={loading}>
          <span>{loading ? "GENERATING..." : `GENERATE ${videoCount} VIDEO${videoCount === 1 ? "" : "S"}`}</span>
          <span className="button-arrow">→</span>
        </button>
        {message && <div className="message"><span className="message-dot" />{message}</div>}
      </div>

      {videos.length > 0 && (
        <section className="clothing-results">
          <div className="results-header">
            <div><div className="section-label">GENERATED CONTENT</div><h2>Your Jacket prompts</h2></div>
            <div className="count"><strong>{videos.length * 5}</strong>PROMPTS READY</div>
          </div>

          <div className="section-label">QUICK COPY</div>
          <div className="clothing-quick-copy-table">
            <div className="clothing-quick-copy-header"><div>VIDEO</div><div>BILLEDE 1</div><div>BILLEDE 2</div><div>BILLEDE 3</div><div>BILLEDE 4</div><div>FORSIDE</div></div>
            {videos.map((video) => (
              <div className="clothing-quick-copy-row" key={video.videoNumber}>
                <div className="clothing-quick-copy-video">VIDEO {video.videoNumber}</div>
                {PROMPTS.map((number) => <button key={number} className="quick-copy-button" onClick={() => copyPrompt(video.prompts[number - 1], `PROMPT V${video.videoNumber}-${number}`)}><span>PROMPT V{video.videoNumber}-{number}</span><span className="copy-icon">⧉</span></button>)}
              </div>
            ))}
          </div>

          <div className="section-label">PROMPTS</div>
          <div className="clothing-prompt-table">
            <div className="clothing-prompt-header"><div>VIDEO</div><div>BILLEDE 1</div><div>BILLEDE 2</div><div>BILLEDE 3</div><div>BILLEDE 4</div><div>FORSIDE</div></div>
            {videos.map((video) => (
              <div className="clothing-prompt-row" key={video.videoNumber}>
                <div className="clothing-prompt-video-name">VIDEO {video.videoNumber}</div>
                {PROMPTS.map((number) => (
                  <article className="clothing-prompt-card" key={number}>
                    <div className="clothing-prompt-card-top"><span>{number === 5 ? "FORSIDE" : `BILLEDE ${number}`}</span><strong>V{video.videoNumber}-{number}</strong></div>
                    <button className="copy-button" onClick={() => copyPrompt(video.prompts[number - 1], `PROMPT V${video.videoNumber}-${number}`)}><span>PROMPT V{video.videoNumber}-{number}</span><span className="copy-icon">⧉</span></button>
                    <div className="prompt-wrapper"><textarea value={video.prompts[number - 1]} readOnly /></div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
