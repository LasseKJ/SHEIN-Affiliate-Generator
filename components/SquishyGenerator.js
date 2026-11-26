"use client";

import { useState } from "react";
import VideoCountSelect from "./VideoCountSelect";
import ChatGPTExport from "./ChatGPTExport";
import { createChatGPTZip } from "../lib/chatGPTExport";


export default function SquishyGenerator() {
  const [exportTemplates, setExportTemplates] = useState({});
  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [videoCount, setVideoCount] =
    useState(1);

  const [videos, setVideos] =
    useState([]);

  function promptLabel(
    videoNumber,
    imageNumber
  ) {
    return `PROMPT V${videoNumber}-${imageNumber}`;
  }

  function getPrompt(
    video,
    promptIndex
  ) {
    return (
      video?.prompts?.[
        promptIndex
      ] || ""
    );
  }

  async function copyPrompt(
    prompt,
    label
  ) {
    try {
      await navigator.clipboard.writeText(
        prompt
      );

      setMessage(
        `${label} copied to clipboard.`
      );
    } catch {
      setMessage(
        "Could not copy the prompt automatically."
      );
    }
  }


  async function generate() {
    setLoading(true);
    setVideos([]);

    setMessage(
      `Selecting products for ${videoCount} video${videoCount === 1 ? "" : "s"}...`
    );

    try {
      const response =
        await fetch(
          "/api/generate",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              videoCount
            })
          }
        );

      const responseText =
        await response.text();

      let data;

      try {
        data =
          JSON.parse(
            responseText
          );
      } catch {
        throw new Error(
          `API returnerede ikke gyldig JSON. Status: ${response.status}.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Der opstod en fejl."
        );
      }

      if (
        !data.success ||
        !Array.isArray(data.videos) ||
        data.videos.length !== videoCount
      ) {
        throw new Error(
          "Der blev ikke oprettet det valgte antal videoer."
        );
      }

      const templates = data.templates;
      setExportTemplates(templates);

      if (!templates?.cover) {
        throw new Error("Forside template kunne ikke findes.");
      }

      if (!templates?.image) {
        throw new Error("Produkt template kunne ikke findes.");
      }

      setVideos(data.videos);

      const zipBlob = await createChatGPTZip("squishy", data.videos, setMessage, templates);

      const url =
        URL.createObjectURL(
          zipBlob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        `shein-squishy-${videoCount}-videos.zip`;

      link.style.display =
        "none";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setMessage(
        `Complete, ${videoCount} video${videoCount === 1 ? "" : "s"} with ${videoCount * 4} prompts generated.`
      );
    } catch (error) {
      console.error(
        "Generate error:",
        error
      );

      setMessage(
        `Error, ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="squishy-generator">
      <section className="hero">
        <div className="eyebrow">
          CONTENT GENERATOR
        </div>

        <h1>
          SHEIN Affiliate
          <br />
          <span>Generator</span>
        </h1>


        <div className="video-count-selector">
          <div className="selector-label">
            HOW MANY VIDEOS?
          </div>

          <VideoCountSelect value={videoCount} onChange={setVideoCount} disabled={loading} />
        </div>

        <button
          className={`generate-button ${loading ? "loading" : ""}`}
          onClick={generate}
          disabled={loading}
        >
          <span>
            {loading
              ? "GENERATING..."
              : `GENERATE ${videoCount} VIDEO${videoCount === 1 ? "" : "S"}`}
          </span>

          <span className="button-arrow">
            →
          </span>
        </button>

        {message && (
          <div className="message">
            <span className="message-dot" />
            {message}
          </div>
        )}
      </section>

      <ChatGPTExport category="squishy" videos={videos} disabled={loading} templates={exportTemplates} />

      {videos.length > 0 && (
        <section className="results">
          <div className="results-header">
            <div>
              <div className="section-label">
                GENERATED CONTENT
              </div>

              <h2>
                Your video prompts
              </h2>
            </div>

            <div className="count">
              <strong>
                {videos.length * 4}
              </strong>
              PROMPTS READY
            </div>
          </div>



          <div className="section-label">
            QUICK COPY
          </div>

          <div className="quick-copy-table">
            <div className="quick-copy-header">
              <div className="quick-copy-video-label">
                VIDEO
              </div>

              <div>BILLEDE 1</div>
              <div>BILLEDE 2</div>
              <div>BILLEDE 3</div>
              <div>FORSIDE</div>
            </div>

            {videos.map((video) => (
              <div
                className="quick-copy-row"
                key={video.videoNumber}
              >
                <div className="quick-copy-video-name">
                  VIDEO {video.videoNumber}
                </div>

                {video.prompts.map(
                  (prompt, promptIndex) => {
                    const imageNumber =
                      promptIndex + 1;

                    const label =
                      promptLabel(
                        video.videoNumber,
                        imageNumber
                      );

                    return (
                      <button
                        key={imageNumber}
                        className="quick-copy-button"
                        onClick={() =>
                          copyPrompt(
                            prompt,
                            label
                          )
                        }
                      >
                        <span>
                          {label}
                        </span>

                        <span className="copy-icon">
                          ⧉
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            ))}
          </div>

          <div className="section-label">
            PROMPTS
          </div>

          <div className="squishy-prompt-table">
            <div className="squishy-table-header">
              <div className="squishy-video-label">
                VIDEO
              </div>

              <div>BILLEDE 1</div>
              <div>BILLEDE 2</div>
              <div>BILLEDE 3</div>
              <div>FORSIDE</div>
            </div>

            {videos.map((video) => (
              <div
                className="squishy-video-row"
                key={video.videoNumber}
              >
                <div className="squishy-video-name">
                  VIDEO {video.videoNumber}
                </div>

                {video.prompts.map(
                  (prompt, promptIndex) => {
                    const imageNumber =
                      promptIndex + 1;

                    const label =
                      promptLabel(
                        video.videoNumber,
                        imageNumber
                      );

                    return (
                      <article
                        className="squishy-prompt-card"
                        key={imageNumber}
                      >
                        <div className="squishy-prompt-card-top">
                          <span>
                            {imageNumber === 4
                              ? "FORSIDE"
                              : `BILLEDE ${imageNumber}`}
                          </span>

                          <strong>
                            V
                            {video.videoNumber}
                            -
                            {imageNumber}
                          </strong>
                        </div>

                        <button
                          className="copy-button"
                          onClick={() =>
                            copyPrompt(
                              prompt,
                              label
                            )
                          }
                        >
                          <span>
                            {label}
                          </span>

                          <span className="copy-icon">
                            ⧉
                          </span>
                        </button>

                        <div className="prompt-wrapper">
                          <textarea
                            value={prompt}
                            readOnly
                          />
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
