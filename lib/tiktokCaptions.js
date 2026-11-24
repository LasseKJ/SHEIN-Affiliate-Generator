export const TITLE_MAX_LENGTH = 29;
export const DESCRIPTION_MAX_LENGTH = 70;
export const CAPTION_PREFIX = "Code 2MBJJ on shein";

// Four category-specific tags are added after the shared #Shein tag.
export const CAPTION_PROFILES = {
  squishy: { subjects: ["Shein Squishy"], tags: ["Squish", "Kawaii", "Cute", "Finds"], emoji: "🎀" },
  autumn: { subjects: ["Shein Autumn Outfit", "Cozy Shein Fall", "Everyday Shein Autumn", "Layered Shein Fall"], tags: ["Fall", "Layers", "Cozy", "Finds"], emoji: "🍂" },
  winter: { subjects: ["Shein Winter Outfit", "Cozy Shein Winter", "Layered Shein Winter", "Everyday Shein Winter"], tags: ["Winter", "Snow", "Cozy", "Finds"], emoji: "❄️" },
  "phone-cases": { subjects: ["Shein Phone Case", "Cute Shein Phone Case", "Aesthetic Shein Phone Case", "Everyday Shein Phone Case"], tags: ["Phone", "Case", "Tech", "Cute"], emoji: "📱" },
  essentials: { subjects: ["Shein Everyday Essentials", "Cute Shein Essentials", "Aesthetic Shein Essentials", "Useful Shein Essentials"], tags: ["Daily", "Useful", "Home", "Beauty"], emoji: "✨" },
  jackets: { subjects: ["Shein Jacket", "Everyday Shein Jacket", "Layered Shein Outerwear", "Chic Shein Jacket"], tags: ["Jacket", "Cozy", "Style", "Finds"], emoji: "🧥" },
  sweaters: { subjects: ["Shein Sweater", "Cozy Shein Knitwear", "Everyday Shein Sweater", "Cute Shein Knitwear"], tags: ["Knit", "Cozy", "Style", "Finds"], emoji: "🧶" },
  dresses: { subjects: ["Shein Dress", "Chic Shein Dress", "Pretty Shein Dress", "Shein Dress Style"], tags: ["Dress", "Chic", "Style", "Finds"], emoji: "🎀" },
  "boo-basket": { subjects: ["Shein Boo Basket", "Spooky Shein Gift", "Cute Shein Halloween", "Cozy Shein Boo Basket"], tags: ["Boo", "Spooky", "Cute", "Finds"], emoji: "🎃" },
  stocking: { subjects: ["Shein Stocking Stuffer", "Festive Shein Gift", "Little Shein Christmas Gift", "Cute Shein Stocking"], tags: ["Gift", "Xmas", "Cute", "Finds"], emoji: "🎄" },
  "christmas-wishlist": { subjects: ["Shein Christmas Wishlist", "Festive Shein Wishlist", "Cozy Shein Christmas", "Shein Holiday Gift"], tags: ["Wish", "Gift", "Xmas", "Finds"], emoji: "🎁" },
};

const ESSENTIALS = {
  "Essentials-Makeup": { name: "Makeup", tags: ["MakeupFinds", "BeautyFinds", "MakeupInspo"] },
  "Essentials-Cases": { name: "Cases", tags: ["CuteCases", "AccessoryFinds", "CaseCollection"] },
  "Essentials-MakeupStorage": { name: "Makeup Storage", tags: ["MakeupStorage", "BeautyOrganization", "VanityOrganization"] },
  "Essentials-Hair": { name: "Hair", tags: ["HairAccessories", "HairFinds", "HairInspo"] },
  "Essentials-HomeDecor": { name: "Home Decor", tags: ["HomeDecor", "RoomInspo", "DecorFinds"] },
  "Essentials-VanityExtras": { name: "Vanity", tags: ["VanityFinds", "VanityDecor", "VanityInspo"] },
  "Essentials-Kitchen": { name: "Kitchen", tags: ["KitchenFinds", "KitchenEssentials", "KitchenInspo"] },
  "Essentials-Bath": { name: "Bath", tags: ["BathroomFinds", "BathEssentials", "BathroomInspo"] },
};

const TITLE_HOOKS = ["Crush", "Find", "Fave", "Love", "Dreamy", "Sweet Pick", "Must-Have", "Mood", "Obsessed", "Cute Pick"];
const DESCRIPTION_ADJECTIVES = ["Cute", "Cozy", "Sweet", "Chic", "Tiny", "Fresh", "Fun", "Soft", "Rare", "New"];
const DESCRIPTION_NOUNS = ["pick", "find", "fave", "gem", "joy"];
const DESCRIPTION_HOOKS = DESCRIPTION_ADJECTIVES.flatMap(adjective => DESCRIPTION_NOUNS.map(noun => `${adjective} ${noun}`));

function profileFor(category, video) {
  const profile = CAPTION_PROFILES[category];
  if (!profile) throw new Error(`Unknown caption category: ${category}`);
  if (category !== "essentials") return profile;
  const categories = [...new Set(video.categories || video.slides?.map(slide => slide.category) || [])];
  const details = categories.map(key => ESSENTIALS[key]).filter(Boolean);
  if (!details.length) return profile;
  const names = details.map(item => item.name).join(" + ");
  const tags = [...new Set([...details.flatMap(item => item.tags), "Cute", "Day", "Finds"])];
  return { ...profile, subjects: [`Shein ${names}`, `Cute Shein ${names}`, `Everyday Shein ${names}`, `Fresh Shein ${names}`], tags };
}

function collectProductNames(value, names = [], seen = new WeakSet(), depth = 0) {
  if (!value || typeof value !== "object" || depth > 7 || seen.has(value)) return names;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const child of value) collectProductNames(child, names, seen, depth + 1);
    return names;
  }
  const hasProductMarker = value.code || value.productCode || value.sku || value.imageUrl || value.price !== undefined;
  if (hasProductMarker && typeof value.name === "string" && value.name.trim()) names.push(value.name.trim());
  for (const [key, child] of Object.entries(value)) {
    if (["prompt", "prompts", "coverPrompt", "description", "title"].includes(key)) continue;
    collectProductNames(child, names, seen, depth + 1);
  }
  return names;
}

function cleanProductName(value) {
  return String(value || "")
    .replace(/\bSHEIN\b/gi, " ")
    .replace(/\b(?:product|item|finds?)\b/gi, " ")
    .replace(/[^\p{L}\p{N}' -]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fitWords(text, maxLength) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const kept = [];
  for (const word of words) {
    const candidate = [...kept, word].join(" ");
    if (candidate.length > maxLength) break;
    kept.push(word);
  }
  if (kept.length) return kept.join(" ");
  return (words[0] || "Pick").slice(0, maxLength);
}

function createTitle(video, index, profile, usedTitles) {
  const productName = collectProductNames(video)[0];
  const coreSource = cleanProductName(productName || profile.subjects[0].replace(/^Shein\s*/i, "")) || "Cute Find";
  for (let offset = 0; offset < TITLE_HOOKS.length; offset++) {
    const hook = TITLE_HOOKS[(index + offset) % TITLE_HOOKS.length];
    const available = TITLE_MAX_LENGTH - "Shein's  ".length - hook.length;
    const core = fitWords(coreSource, available);
    const candidate = `Shein's ${core} ${hook}`;
    if (!usedTitles.has(candidate)) {
      usedTitles.add(candidate);
      return candidate;
    }
  }
  let serial = 2;
  while (true) {
    const suffix = ` (${serial})`;
    const hook = TITLE_HOOKS[index % TITLE_HOOKS.length];
    const available = TITLE_MAX_LENGTH - "Shein's  ".length - hook.length - suffix.length;
    const candidate = `Shein's ${fitWords(coreSource, available)} ${hook}${suffix}`;
    if (!usedTitles.has(candidate)) {
      usedTitles.add(candidate);
      return candidate;
    }
    serial++;
  }
}

function createHashtags(profile) {
  const candidates = [...new Set(profile.tags || [])].filter(Boolean);
  const chosen = candidates.length > 4
    ? [candidates[0], ...candidates.slice(1).sort((a, b) => a.length - b.length).slice(0, 3)]
    : candidates.slice(0, 4);
  for (const fallback of ["Cute", "Daily", "Finds", "Style"]) {
    if (chosen.length === 4) break;
    if (!chosen.includes(fallback)) chosen.push(fallback);
  }
  const hashtags = ["#Shein", ...chosen.slice(0, 4).map(tag => `#${tag}`)];
  if (hashtags.length !== 5 || new Set(hashtags).size !== 5) throw new Error("Each description must have exactly five unique hashtags.");
  return hashtags.join(" ");
}

function createDescription(profile, index, usedDescriptions) {
  const hashtags = createHashtags(profile);
  for (let offset = 0; offset < DESCRIPTION_HOOKS.length; offset++) {
    const hook = DESCRIPTION_HOOKS[(index + offset) % DESCRIPTION_HOOKS.length];
    const description = `${CAPTION_PREFIX} ${hook} ${hashtags}`;
    if (description.length <= DESCRIPTION_MAX_LENGTH && !usedDescriptions.has(description)) {
      usedDescriptions.add(description);
      return description;
    }
  }
  throw new Error("Could not create a unique description within the 70-character limit.");
}

export function createTikTokCaptions(category, videos) {
  const titles = new Set();
  const descriptions = new Set();
  return videos.map((video, index) => {
    const profile = profileFor(category, video);
    return {
      videoNumber: video.videoNumber ?? index + 1,
      title: createTitle(video, index, profile, titles),
      description: createDescription(profile, index, descriptions),
    };
  });
}

export function formatTikTokCaptions(captions) {
  return captions.map(({ videoNumber, title, description }) => `VIDEO ${videoNumber}\n${title}\n${description}`).join("\n\n");
}

export function addTikTokCaptionsToZip(zip, category, videos) {
  const captions = createTikTokCaptions(category, videos);
  zip.file("TIKTOK-CAPTIONS.txt", formatTikTokCaptions(captions));
  for (const caption of captions) {
    zip.file(`VIDEO ${caption.videoNumber}/TIKTOK.txt`, `${caption.title}\n${caption.description}`);
  }
}
