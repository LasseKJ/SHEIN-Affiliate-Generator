export const TITLE_MAX_LENGTH = 29;
export const DESCRIPTION_MAX_LENGTH = 200;

export const CAPTION_PREFIX = "Code 2MBJJ on shein.";

// Each category has its own English vocabulary and hashtag pool.
export const CAPTION_PROFILES = {
  squishy: { subjects: ["Shein Squishy"], tags: ["Squishy", "Kawaii", "CuteFinds", "SquishyCodes"], emoji: "🎀" },
  autumn: { subjects: ["Shein Autumn Outfit", "Cozy Shein Fall", "Everyday Shein Autumn", "Layered Shein Fall"], tags: ["AutumnOutfits", "FallFashion", "AutumnStyle", "CozyStyle", "OutfitInspo", "FallOutfits", "LayeredLooks", "FallStyle"], emoji: "🍂" },
  winter: { subjects: ["Shein Winter Outfit", "Cozy Shein Winter", "Layered Shein Winter", "Everyday Shein Winter"], tags: ["WinterOutfits", "WinterFashion", "CozyStyle", "WinterStyle", "OutfitInspo", "LayeredLooks", "ColdWeatherStyle", "WinterWardrobe"], emoji: "❄️" },
  "phone-cases": { subjects: ["Shein Phone Case", "Cute Shein Phone Case", "Aesthetic Shein Phone Case", "Everyday Shein Phone Case"], tags: ["PhoneCases", "PhoneAccessories", "CuteCases", "PhoneStyle", "CaseCollection", "TechAccessories", "AestheticCases", "PhoneCaseInspo"], emoji: "📱" },
  essentials: { subjects: ["Shein Everyday", "Cute Shein Essentials", "Aesthetic Shein Essentials", "Useful Shein Essentials"], tags: ["EverydayEssentials", "LifestyleFinds", "DailyFinds", "HomeAndBeauty", "CuteFinds", "DailyEssentials", "LifestyleInspo", "LittleFinds"], emoji: "✨" },
  jackets: { subjects: ["Shein Jacket", "Everyday Shein Jacket", "Layered Shein Outerwear", "Chic Shein Jacket"], tags: ["Jackets", "Outerwear", "JacketStyle", "LayeredLooks", "OutfitInspo", "StreetStyle", "JacketOutfits", "WardrobeFinds"], emoji: "🧥" },
  sweaters: { subjects: ["Shein Sweater", "Cozy Shein Knitwear", "Everyday Shein Sweater", "Cute Shein Knitwear"], tags: ["Sweaters", "Knitwear", "SweaterWeather", "CozyStyle", "SweaterOutfits", "KnitwearStyle", "OutfitInspo", "CozyFashion"], emoji: "🧶" },
  dresses: { subjects: ["Shein Dress", "Chic Shein Dress", "Pretty Shein Dress", "Shein Dress Style"], tags: ["Dresses", "DressInspo", "DressStyle", "OutfitIdeas", "FashionFinds", "DressOutfits", "StyleInspo", "WardrobeFinds"], emoji: "🎀" },
  "boo-basket": { subjects: ["Shein Boo Basket", "Spooky Shein Gift", "Cute Shein Halloween", "Cozy Shein Boo Basket"], tags: ["BooBasket", "BooBasketIdeas", "HalloweenFinds", "SpookySeason", "HalloweenGifts", "GiftBasket", "SpookyCute", "HalloweenInspo"], emoji: "🎃" },
  stocking: { subjects: ["Shein Stocking Stuffer", "Festive Shein Gift", "Little Shein Christmas Gift", "Cute Shein Stocking"], tags: ["StockingStuffers", "ChristmasGifts", "ChristmasFinds", "GiftIdeas", "HolidayShopping", "StockingIdeas", "SmallGifts", "ChristmasInspo"], emoji: "🎄" },
  "christmas-wishlist": { subjects: ["Shein Christmas Wishlist", "Festive Shein Wishlist", "Cozy Shein Christmas", "Shein Holiday Gift"], tags: ["ChristmasWishlist", "ChristmasGifts", "WishlistIdeas", "GiftInspo", "HolidayFinds", "ChristmasShopping", "GiftGuide", "ChristmasIdeas"], emoji: "🎁" },
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

const SQUISHY_TITLES = [
  "Shein Squishy Goodies 🎀",
  "Cute Squishy Finds 💗",
  "Squishy Picks from Shein ✨",
  "Little Squishy Joys 🧸",
  "Soft & Squishy Finds 💕",
  "Kawaii Squishy Picks 🎀",
  "Shein Squishy Favorites 💖",
  "Happy Little Squishies 🌸",
  "Squishy Fun Starts Here ✨",
  "Sweet Squishy Finds 💝",
  "Your Next Squishy Crush 💗",
  "Colorful Squishy Picks 🌈",
  "Tiny Squishy Treasures 🧸",
  "Squishy Mood Boosters 💖",
  "Cutest Shein Squishies 🥰",
  "Squishy Treats from Shein 🎀",
  "Soft Squeeze Favorites 💕",
  "Adorable Squishy Finds 🐻",
  "Shein's Squishy Picks ✨",
  "Squishy Collection Goals 💗",
  "Little Squeeze, Big Joy 💖",
  "Kawaii Finds to Squeeze 🌸",
  "Squishy Goodies to Love 💝",
  "Find Your Favorite Squishy 🧸",
  "Squishy Joys from Shein 💕",
  "Sweet Squeeze Finds ✨",
  "Shein Squishy Must-Haves 💖",
  "More Cute Squishy Finds 🎀",
  "Squishy Lovelies 💗",
  "Soft, Cute & Squishy 🌸",
  "Squishies Worth a Squeeze 🧸",
  "Your Squishy Happy Place 💕",
];

const DESCRIPTION_HOOKS = [
  "A little find worth saving!",
  "This one caught my eye!",
  "Adding this to my wishlist!",
  "Found your next favorite!",
  "Too good to scroll past!",
  "A fresh pick for your feed!",
  "Such a cute little upgrade!",
  "This deserves a spot on your list!",
  "I love this for the season!",
  "The details make this one!",
  "A find that feels just right!",
  "Consider this your sign to save it!",
  "An easy favorite for my feed!",
  "A small find with big charm!",
  "This one has main character energy!",
  "A new favorite in the making!",
];

const TITLE_PATTERNS = [
  "The {topic} Edit",
  "Cute {topic} Find",
  "{topic} Style Win",
  "A {topic} Must-Save",
  "Your New {topic} Pick",
  "{topic} Mood, Upgraded",
  "{topic} Worth a Look",
  "A Little {topic} Joy",
  "{topic} That Pops",
  "Best {topic} Pick",
  "{topic} to Remember",
  "Save This {topic}",
  "Fresh {topic} Energy",
  "The {topic} Glow-Up",
  "{topic} for the Win",
  "Meet Your {topic} Match",
];

const TITLE_TOPICS = {
  autumn: "Fall",
  winter: "Winter",
  "phone-cases": "Phone Case",
  essentials: "Daily Finds",
  jackets: "Jacket",
  sweaters: "Knitwear",
  dresses: "Dress",
  "boo-basket": "Boo Basket",
  stocking: "Stocking",
  "christmas-wishlist": "Holiday",
};

const CAPTION_CACHE = new WeakMap();

function profileFor(category, video) {
  const profile = CAPTION_PROFILES[category];
  if (!profile) throw new Error("Unknown caption category: " + category);
  if (category !== "essentials") return profile;
  const categories = [...new Set(video.categories || video.slides?.map(slide => slide.category) || [])];
  const details = categories.map(key => ESSENTIALS[key]).filter(Boolean);
  if (!details.length) return profile;
  const names = details.map(item => item.name).join(" + ");
  const tags = details.flatMap(item => item.tags).concat(profile.tags);
  return {
    ...profile,
    subjects: ["Shein " + names, "Cute Shein " + names, "Everyday Shein " + names, "Fresh Shein " + names],
    tags: [...new Set(tags)],
  };
}

function fitWords(text, limit) {
  if (text.length <= limit) return text;
  const words = text.split(" ");
  while (words.join(" ").length > limit) words.pop();
  return words.join(" ");
}

function makeTitle(category, index, offset) {
  if (category === "squishy") return SQUISHY_TITLES[(index + offset) % SQUISHY_TITLES.length];
  const pattern = TITLE_PATTERNS[(index + offset) % TITLE_PATTERNS.length];
  return pattern.replace("{topic}", TITLE_TOPICS[category] || "Shein Find");
}

export function createTikTokCaptions(category, videos) {
  if (!Array.isArray(videos) || !videos.length) return [];
  const cached = CAPTION_CACHE.get(videos);
  if (cached) return cached;

  const titles = new Set();
  const descriptions = new Set();
  const titleOffset = Math.floor(Math.random() * (category === "squishy" ? SQUISHY_TITLES.length : TITLE_PATTERNS.length));
  const hookOffset = Math.floor(Math.random() * DESCRIPTION_HOOKS.length);

  const captions = videos.map((video, index) => {
    const profile = profileFor(category, video);
    const videoNumber = video.videoNumber ?? index + 1;
    let title = makeTitle(category, index, titleOffset);
    if (title.length > TITLE_MAX_LENGTH) title = fitWords(title, TITLE_MAX_LENGTH);

    let uniqueTitle = title;
    let titleSuffix = index + 1;
    while (titles.has(uniqueTitle)) {
      const suffix = " " + titleSuffix;
      uniqueTitle = fitWords(title, TITLE_MAX_LENGTH - suffix.length) + suffix;
      titleSuffix += 1;
    }
    titles.add(uniqueTitle);

    const tagCandidates = ["Shein", ...profile.tags, "SheinFinds", "CuteFinds", "StyleInspo", "LifestyleFinds", "FashionFinds"];
    const tags = [...new Set(tagCandidates)].slice(0, 5);
    for (const fallback of ["CuteFinds", "SheinFinds", "StyleInspo", "FashionFinds", "WishlistFinds"]) {
      if (tags.length >= 5) break;
      if (!tags.includes(fallback)) tags.push(fallback);
    }
    const hashtagText = tags.map(tag => "#" + tag).join(" ");

    let hook = DESCRIPTION_HOOKS[(index + hookOffset) % DESCRIPTION_HOOKS.length];
    let description = CAPTION_PREFIX + " " + hook + " " + hashtagText;
    let descriptionSuffix = 2;
    while (descriptions.has(description)) {
      hook = DESCRIPTION_HOOKS[(index + hookOffset) % DESCRIPTION_HOOKS.length].replace(/[.!?]$/, "") + " (pick " + descriptionSuffix + ")!";
      description = CAPTION_PREFIX + " " + hook + " " + hashtagText;
      descriptionSuffix += 1;
    }
    descriptions.add(description);

    if (uniqueTitle === description) uniqueTitle = fitWords(uniqueTitle, TITLE_MAX_LENGTH - 2) + " 1";
    return { videoNumber, title: uniqueTitle, description };
  });

  CAPTION_CACHE.set(videos, captions);
  return captions;
}

export function formatTikTokCaptions(captions) {
  return captions.map(({ videoNumber, title, description }) => "VIDEO " + videoNumber + "\n" + title + "\n" + description).join("\n\n");
}

export function addTikTokCaptionsToZip(zip, category, videos) {
  const captions = createTikTokCaptions(category, videos);
  zip.file("TIKTOK-CAPTIONS.txt", formatTikTokCaptions(captions));
  for (const caption of captions) {
    zip.file("VIDEO " + caption.videoNumber + "/TIKTOK.txt", caption.title + "\n" + caption.description);
  }
}
