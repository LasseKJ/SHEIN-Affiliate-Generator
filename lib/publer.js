export const PUBLER_TEMPLATE_HEADERS = [
  "Date - Intl. format or prompt",
  "Text",
  "Link(s) - Separated by comma for FB carousels",
  "Media URL(s) - Separated by comma",
  "Title - For the video, pin, PDF ..",
  "Label(s) - Separated by comma",
  "Alt text(s) - Separated by ||",
  "Comment(s) - Separated by ||",
  "Pin board, FB album, or Google category",
  "Post subtype - I.e. story, reel, PDF ..",
  "CTA - For Facebook links or Google",
  "Reminder - For stories, reels, shorts, and TikToks"
];

export function publerTemplateCsv() {
  return PUBLER_TEMPLATE_HEADERS
    .map((header) => `"${header.replaceAll('"', '""')}"`)
    .join(",") + "\r\n";
}

export function buildPublerInstructions(category, videoCount, imageCount) {
  const label = String(category || "content").replaceAll("-", " ").toUpperCase();
  return [
    `PUBLER CSV — ${label}`,
    `After generating and checking all ${imageCount} images, create exactly ${videoCount} Publer rows: one TikTok post per VIDEO folder. This must work for every selected batch size from 1 to 50 videos.`,
    "A Publer calendar screenshot is required before you schedule posts. If one is already attached, use only the dates and open time slots visible in it. Otherwise, finish image generation and quality checks, then ask me to upload a screenshot of my Publer calendar and wait before creating the CSV. Use Europe/Copenhagen unless the screenshot or I clearly specify another timezone. If the year cannot be inferred safely, ask me. Do not invent dates or assume a visible time repeats on dates not shown.",
    "Treat a single clock time shown as the center of a one-hour window: choose a minute from 30 minutes before through 30 minutes after, staying within that window. If an explicit interval is shown, choose a time within it. Use each available slot no more than once, schedule chronologically, and make every full date and time unique. If the screenshot has fewer open slots than videos, stop and ask for a screenshot with more slots. Fill Date using YYYY/MM/DD HH:MM. Keep all 12 PUBLER-TEMPLATE.csv columns in the exact order. Fill Date, Text, Media URL(s), and Title; leave other fields blank unless I provide values.",
    "For each row, put all finished PNGs from that same video's vN folder into Media URL(s), separated by commas. Use the cover first when that video's prompt identifies a cover, then the other images in the exact order specified by the prompt mapping. Never mix videos. Use only the final output PNGs, not product references, templates, local paths, or Drive viewer pages.",
    "After image QA, create a batch folder in the Google Drive folder I provided in this chat; if I did not provide a destination, create a new batch folder in My Drive. Preserve the vN subfolders and exact vN-N.png names by uploading each final PNG individually. Upload the final ZIP archive and Publer.csv at the batch folder root. Give each PNG used in Media URL(s) link access as a reader so Publer can fetch it without login. Keep reference assets and templates at their current access level.",
    "Use each uploaded PNG's verified Drive file ID to form its direct download URL as https://drive.google.com/uc?export=download&id=FILE_ID. Do not use the Drive viewer page URL. Test each direct URL without signing in and confirm it returns the PNG. If Drive cannot provide anonymous image access, stop and tell me which links failed rather than writing a CSV with unusable links. Never invent or substitute file IDs.",
    "Use the matching VIDEO N entry from TIKTOK-CAPTIONS.txt for each row's Text and Title, preserving the exact generated values. Every Text value must start exactly with Code 2MBJJ on shein, contain exactly five complete relevant hashtags, and be no more than 70 characters including spaces and punctuation. Keep each description distinct. Titles must be catchy and specific to that video's actual products, no more than 29 characters, and never identical to their descriptions. Do not reuse a title or description within the batch, and do not invent product details.",
    `Before delivery, verify exactly ${videoCount} CSV rows, 12 columns per row, one working Drive image URL per output image in that video's mapped order, no cross-video links, no duplicate dates/times, five hashtags per Text, and the title/description length limits. Include Publer.csv in the final ZIP root alongside the vN folders. Return the final ZIP, standalone Publer.csv, and the Google Drive batch-folder link. Do not import or publish posts in Publer.`
  ].join("\n");
}
