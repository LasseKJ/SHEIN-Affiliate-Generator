"use client";

import { useState } from "react";
import { createChatGPTPromptFiles, createChatGPTZip } from "../lib/chatGPTExport";

export function downloadExport(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ChatGPTExport({ category, videos, templates, disabled = false }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  if (!videos.length) return null;
  const { master, all, entries } = createChatGPTPromptFiles(category, videos, templates);
  const textFile = (text, filename) => downloadExport(new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" }), filename);
  async function downloadZip() {
    setBusy(true);
    try {
      const blob = await createChatGPTZip(category, videos, setMessage, templates);
      downloadExport(blob, `${category}-${videos.length}-videos.zip`);
      setMessage("ZIP-filen er klar.");
    } catch (error) {
      setMessage(`ZIP mislykkedes: ${error.message} Prøv igen med Download ZIP.`);
    } finally { setBusy(false); }
  }
  async function copyMaster() {
    try { await navigator.clipboard.writeText(master); setMessage("Masterprompt kopieret."); }
    catch { setMessage("Kunne ikke kopiere. Download masterprompten som TXT."); }
  }
  return <section className="clothing-results" aria-label="ChatGPT eksport">
    <h2>Klar til ChatGPT</h2>
    <p>Upload ZIP-filen og alle prompts i samme chat. Indsæt masterprompten for at få alle {entries.length} billeder samlet i en ny ZIP.</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <button type="button" className="copy-button" disabled={disabled || busy} onClick={downloadZip}>Download ZIP</button>
      <button type="button" className="copy-button" onClick={copyMaster}>Kopiér masterprompt</button>
      <button type="button" className="copy-button" onClick={() => textFile(master, "MASTER-PROMPT.txt")}>Download masterprompt (.txt)</button>
      <button type="button" className="copy-button" onClick={() => textFile(all, "PROMPTS.txt")}>Download alle prompts (.txt)</button>
    </div>
    {message && <p role="status">{message}</p>}
  </section>;
}
