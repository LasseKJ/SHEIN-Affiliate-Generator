"use client";

import { useState } from "react";
import VideoCountSelect from "./VideoCountSelect";
import ChatGPTExport from "./ChatGPTExport";
import { createChatGPTZip } from "../lib/chatGPTExport";

const PROMPTS = [1, 2, 3, 4, 5];

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

      const zipBlob = await createChatGPTZip("jackets", data.videos, setMessage);

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

        <div className="clothing-video-count">
          <div className="selector-label">HOW MANY VIDEOS?</div>
          <VideoCountSelect value={videoCount} onChange={setVideoCount} disabled={loading} />
        </div>

        <button className={`generate-button ${loading ? "loading" : ""}`} onClick={generate} disabled={loading}>
          <span>{loading ? "GENERATING..." : `GENERATE ${videoCount} VIDEO${videoCount === 1 ? "" : "S"}`}</span>
          <span className="button-arrow">→</span>
        </button>
        {message && <div className="message"><span className="message-dot" />{message}</div>}
      </div>

      <ChatGPTExport category="jackets" videos={videos} disabled={loading} />

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
