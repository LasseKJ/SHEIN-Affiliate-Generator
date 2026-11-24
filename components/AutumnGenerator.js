"use client";

import { useState } from "react";
import VideoCountSelect from "./VideoCountSelect";
import ChatGPTExport from "./ChatGPTExport";
import { createChatGPTZip } from "../lib/chatGPTExport";


const IMAGE_NUMBERS = [
  1,
  2,
  3,
  4,
  5,
  6
];

const PROMPT_COLUMNS = [1, 2, 3, 4, 5];
const promptColumnLabel = number => ["FORSIDE", "OUTFIT 1", "KODER 1", "OUTFIT 2", "KODER 2"][number - 1];

export default function AutumnGenerator() {
  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [videoCount, setVideoCount] =
    useState(1);

  const [videos, setVideos] =
    useState([]);

  function promptLabel(
    videoNumber,
    promptNumber
  ) {
    return `PROMPT V${videoNumber}-${promptNumber}`;
  }

  function getPrompt(
    video,
    promptNumber
  ) {
    return (
      video?.prompts?.[
        promptNumber - 1
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
      `Selecting products for ${videoCount} Autumn video${videoCount === 1 ? "" : "s"}...`
    );

    try {
      const response =
        await fetch(
          "/api/generate-clothing",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              category: "Autumn",
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
        !Array.isArray(
          data.videos
        ) ||
        data.videos.length !==
          videoCount
      ) {
        throw new Error(
          "Der blev ikke oprettet det valgte antal videoer."
        );
      }

      setVideos(
        data.videos
      );

      const zipBlob = await createChatGPTZip("autumn", data.videos, setMessage);

      const url =
        URL.createObjectURL(
          zipBlob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        url;

      link.download =
        `autumn-outfits-${videoCount}-videos.zip`;

      link.style.display =
        "none";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(
          url
        );
      }, 1000);

      setMessage(
        `Complete, ${videoCount} Autumn video${videoCount === 1 ? "" : "s"} with ${videoCount * 7} prompts generated.`
      );
    } catch (error) {
      console.error(
        "Autumn generate error:",
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
    <section className="clothing-generator">

      <div className="clothing-hero">

        <div className="eyebrow">
          AUTUMN
        </div>

        <h1>
          Create
          <span> Autumn Looks.</span>
        </h1>


        <div className="clothing-video-count">

          <div className="selector-label">
            HOW MANY VIDEOS?
          </div>

          <VideoCountSelect value={videoCount} onChange={setVideoCount} disabled={loading} />
        </div>

        <button
          className={`generate-button ${
            loading ? "loading" : ""
          }`}
          onClick={generate}
          disabled={loading}
        >
          <span>
            {loading
              ? "GENERATING..."
              : `GENERATE ${videoCount} VIDEO${
                  videoCount === 1
                    ? ""
                    : "S"
                }`}
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

      </div>

      <ChatGPTExport category="autumn" videos={videos} disabled={loading} />

      {videos.length > 0 && (

        <section className="clothing-results">

          <div className="results-header">

            <div>

              <div className="section-label">
                GENERATED CONTENT
              </div>

              <h2>
                Your Autumn prompts
              </h2>

            </div>

            <div className="count">

              <strong>
                {videos.length * 5}
              </strong>

              PROMPTS READY

            </div>

          </div>

          <div className="section-label">
            QUICK COPY
          </div>

          <div className="clothing-quick-copy-table">

            <div className="clothing-quick-copy-header">

              <div>
                VIDEO
              </div>

              {PROMPT_COLUMNS.map(
                (promptNumber) => (
                  <div
                    key={
                      promptNumber
                    }
                  >
                    {promptColumnLabel(promptNumber)}
                  </div>
                )
              )}

            </div>

            {videos.map(
              (video) => (

                <div
                  className="clothing-quick-copy-row"
                  key={
                    video.videoNumber
                  }
                >

                  <div className="clothing-quick-copy-video">
                    VIDEO{" "}
                    {
                      video.videoNumber
                    }
                  </div>

                  {PROMPT_COLUMNS.map(
                    (
                      promptNumber
                    ) => {

                      const label =
                        promptLabel(
                          video.videoNumber,
                          promptNumber
                        );

                      return (
                        <button
                          key={
                            promptNumber
                          }
                          className="quick-copy-button"
                          onClick={() =>
                            copyPrompt(
                              getPrompt(
                                video,
                                promptNumber
                              ),
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

              )
            )}

          </div>

          <div className="section-label">
            PROMPTS
          </div>

          <div className="clothing-prompt-table">

            <div className="clothing-prompt-header">

              <div>
                VIDEO
              </div>

              {PROMPT_COLUMNS.map(
                (promptNumber) => (
                  <div
                    key={
                      promptNumber
                    }
                  >
                    {promptColumnLabel(promptNumber)}
                  </div>
                )
              )}

            </div>

            {videos.map(
              (video) => (

                <div
                  className="clothing-prompt-row"
                  key={
                    video.videoNumber
                  }
                >

                  <div className="clothing-prompt-video-name">
                    VIDEO{" "}
                    {
                      video.videoNumber
                    }
                  </div>

                  {PROMPT_COLUMNS.map(
                    (
                      promptNumber
                    ) => {

                      const label =
                        promptLabel(
                          video.videoNumber,
                          promptNumber
                        );

                      const prompt =
                        getPrompt(
                          video,
                          promptNumber
                        );

                      return (
                        <article
                          className="clothing-prompt-card"
                          key={
                            promptNumber
                          }
                        >

                          <div className="clothing-prompt-card-top">

                            <span>
                              {promptColumnLabel(promptNumber)}
                            </span>

                            <strong>
                              V
                              {
                                video.videoNumber
                              }
                              -
                              {
                                promptNumber
                              }
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
                              value={
                                prompt
                              }
                              readOnly
                            />

                          </div>

                        </article>
                      );

                    }
                  )}

                </div>

              )
            )}

          </div>

        </section>

      )}

    </section>
  );
}
