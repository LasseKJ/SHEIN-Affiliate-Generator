"use client";

import {
  useState
} from "react";

import JSZip from "jszip";

const VIDEO_COUNTS = [
  1,
  2,
  4,
  8
];

const PROMPT_COLUMNS = [
  1,
  2,
  3,
  4,
  5
];

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

function safeFilePart(
  value
) {
  return String(
    value || "product"
  )
    .trim()
    .replace(
      /[^a-zA-Z0-9æøåÆØÅ]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      "");
}

function safeCode(
  value
) {
  return String(
    value || "UNKNOWN"
  )
    .trim()
    .replace(
      /[^a-zA-Z0-9]+/g,
      "");
}

function createFileName(
  imageNumber,
  product,
  extension
) {
  const code =
    safeCode(
      product?.code
    );

  const name =
    safeFilePart(
      product?.name
    );

  return `B${imageNumber}-Case-${name}-${code}.${extension}`;
}

async function downloadProduct(
  product
) {
  if (!product?.imageUrl) {
    throw new Error(
      `Produktet ${
        product?.name ||
        "ukendt"
      } har ingen billed URL.`
    );
  }

  const response =
    await fetch(
      product.imageUrl
    );

  if (!response.ok) {
    throw new Error(
      `Kunne ikke hente produktbillede: ${product.name}`
    );
  }

  return response.blob();
}

async function addProduct(
  folder,
  imageNumber,
  product
) {
  const blob =
    await downloadProduct(
      product
    );

  const extension =
    blob.type ===
    "image/png"
      ? "png"
      : "jpg";

  const fileName =
    createFileName(
      imageNumber,
      product,
      extension
    );

  folder.file(
    fileName,
    blob
  );
}

export default function PhoneCaseGenerator() {
  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    message,
    setMessage
  ] = useState("");

  const [
    videoCount,
    setVideoCount
  ] = useState(1);

  const [
    videos,
    setVideos
  ] = useState([]);

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
      `Selecting Phone Cases for ${videoCount} video${
        videoCount === 1
          ? ""
          : "s"
      }...`
    );

    try {
      const response =
        await fetch(
          "/api/generate-phone-cases",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
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

      const zip =
        new JSZip();

      for (
        const video of data.videos
      ) {
        const videoFolder =
          zip.folder(
            `VIDEO ${video.videoNumber}`
          );

        /*
          Hver video indeholder
          16 forskellige cases.

          4 cases til BILLEDE 1
          4 cases til BILLEDE 2
          4 cases til BILLEDE 3
          4 cases til BILLEDE 4

          FORSIDE indeholder INGEN
          produktbilleder.
        */

        for (
          let slideIndex = 0;
          slideIndex < 4;
          slideIndex++
        ) {
          const slide =
            video.slides[
              slideIndex
            ];

          const imageNumber =
            slideIndex + 1;

          setMessage(
            `Video ${video.videoNumber} of ${data.videos.length}, downloading slide ${imageNumber}...`
          );

          for (
            const product of slide
          ) {
            await addProduct(
              videoFolder,
              imageNumber,
              product
            );
          }
        }

        /*
          FORSIDE:

          Der oprettes kun en tom
          FORSIDE mappe.

          Der downloades INGEN cases
          til forsiden.

          Forsiden består kun af
          cover prompten.
        */

        videoFolder.folder(
          "FORSIDE"
        );
      }

      setMessage(
        "Creating Phone Cases ZIP..."
      );

      const zipBlob =
        await zip.generateAsync({
          type: "blob",

          compression:
            "DEFLATE",

          compressionOptions: {
            level: 6
          }
        });

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
        `phone-cases-${videoCount}-videos.zip`;

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
        `Complete, ${videoCount} Phone Case video${
          videoCount === 1
            ? ""
            : "s"
        } with ${
          videoCount * 5
        } prompts generated.`
      );
    } catch (error) {
      console.error(
        "Phone Case generate error:",
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
          PHONE CASES
        </div>

        <h1>
          Create
          <span>
            {" "}
            Phone Cases.
          </span>
        </h1>

        <p>
          Generate 16 Phone Cases
          per video, 4 product slides
          and 1 clean cover.
        </p>

        <div className="clothing-video-count">

          <div className="selector-label">
            HOW MANY VIDEOS?
          </div>

          <div className="video-count-grid">

            {VIDEO_COUNTS.map(
              (count) => (
                <button
                  key={count}
                  type="button"
                  className={`video-count-button ${
                    videoCount ===
                    count
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setVideoCount(
                      count
                    )
                  }
                  disabled={
                    loading
                  }
                >
                  {count}
                </button>
              )
            )}

          </div>

        </div>

        <button
          className={`generate-button ${
            loading
              ? "loading"
              : ""
          }`}
          onClick={
            generate
          }
          disabled={
            loading
          }
        >

          <span>
            {loading
              ? "GENERATING..."
              : `GENERATE ${videoCount} VIDEO${
                  videoCount ===
                  1
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

      {videos.length > 0 && (

        <section className="clothing-results">

          <div className="results-header">

            <div>

              <div className="section-label">
                GENERATED CONTENT
              </div>

              <h2>
                Your Phone Case prompts
              </h2>

            </div>

            <div className="count">

              <strong>
                {videos.length *
                  5}
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
                (
                  promptNumber
                ) => (
                  <div
                    key={
                      promptNumber
                    }
                  >
                    {promptNumber <
                    5
                      ? `BILLEDE ${promptNumber}`
                      : "FORSIDE"}
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
                            {
                              label
                            }
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
                (
                  promptNumber
                ) => (
                  <div
                    key={
                      promptNumber
                    }
                  >
                    {promptNumber <
                    5
                      ? `BILLEDE ${promptNumber}`
                      : "FORSIDE"}
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
                              {promptNumber <
                              5
                                ? `BILLEDE ${promptNumber}`
                                : "FORSIDE"}
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
                              {
                                label
                              }
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