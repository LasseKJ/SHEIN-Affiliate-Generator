"use client";

import { useState } from "react";
import { createTikTokCaptions, formatTikTokCaptions } from "../lib/tiktokCaptions.js";

export default function TikTokCaptions({ category, videos, disabled = false }) {
  const [message, setMessage] = useState("");
  const captions = createTikTokCaptions(category, videos);
  if (!captions.length) return null;
  const all = formatTikTokCaptions(captions);
  async function copy(text, label) {
    try { await navigator.clipboard.writeText(text); setMessage(`${label} copied.`); }
    catch { setMessage("Could not copy automatically. Select the text or download the TXT file."); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob(["\uFEFF", all], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${category}-${captions.length}-tiktok-captions.txt`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className="tiktok-captions" aria-label="TikTok titles and descriptions">
    <h2>TikTok titles &amp; descriptions</h2>
    <p>{captions.length} unique titles and descriptions · titles max. 29 characters · descriptions max. 70 including hashtags</p>
    <div className="tiktok-caption-actions">
      <button type="button" className="copy-button" disabled={disabled} onClick={() => copy(all, "All captions")}>Copy all captions</button>
      <button type="button" className="copy-button" disabled={disabled} onClick={download}>Download captions (.txt)</button>
    </div>
    <p role="status" aria-live="polite">{message}</p>
    <div className="tiktok-caption-grid">
      {captions.map((caption, index) => <article className="tiktok-caption-card" key={index}>
        <h3>VIDEO {caption.videoNumber}</h3>
        <label>Title<textarea aria-label={`Video ${caption.videoNumber} title`} readOnly value={caption.title} rows={2} /></label>
        <button type="button" className="copy-button" disabled={disabled} onClick={() => copy(caption.title, `Video ${caption.videoNumber} title`)}>Copy title</button>
        <label>Description + hashtags<textarea aria-label={`Video ${caption.videoNumber} description and hashtags`} readOnly value={caption.description} rows={4} /></label>
        <button type="button" className="copy-button" disabled={disabled} onClick={() => copy(caption.description, `Video ${caption.videoNumber} description`)}>Copy description + hashtags</button>
      </article>)}
    </div>
  </section>;
}
