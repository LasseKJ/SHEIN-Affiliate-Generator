export const TITLE_MAX_LENGTH = 29;
export const DESCRIPTION_MAX_LENGTH = 70;

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
const SUFFIXES = ["Finds", "Picks", "Favorites", "Wishlist"];

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
const SQUISHY_DESCRIPTION_HOOKS = [
  " 🎀 Squishy surprise!",
  " 💗 Pick your favorite!",
  " ✨ Cute finds to squeeze!",
  " 🧸 Little squish, big joy!",
  " 💕 Soft, cute and fun!",
  " 🌸 A kawaii little find!",
  " 💖 A tiny mood boost!",
  " 🎁 Add a little squish!",
];
const SQUISHY_HASHTAG_SETS = [
  " #Shein #Squishy",
  " #Shein #Kawaii",
  " #Shein #CuteFinds",
  " #Squishy #SquishyCodes",
];

function profileFor(category, video) {
  const profile = CAPTION_PROFILES[category];
  if (!profile) throw new Error(`Unknown caption category: ${category}`);
  if (category !== "essentials") return profile;
  const categories = [...new Set(video.categories || video.slides?.map(slide => slide.category) || [])];
  const details = categories.map(key => ESSENTIALS[key]).filter(Boolean);
  if (!details.length) return profile;
  const names = details.map(item => item.name).join(" + ");
  return { ...profile, subjects: [`Shein ${names}`, `Cute Shein ${names}`, `Everyday Shein ${names}`, `Fresh Shein ${names}`], tags: details.map(item => item.tags[0]).concat(details.flatMap(item => item.tags.slice(1))) };
}

// Keep whole words and hashtags, counting spaces, punctuation and emoji too.
function fitWords(text, limit) {
  if (text.length <= limit) return text;
  const words = text.split(" ");
  while (words.join(" ").length > limit) words.pop();
  return words.join(" ");
}

export function createTikTokCaptions(category, videos) {
  const titles = new Set();
  return videos.map((video, index) => {
    const profile = profileFor(category, video);
    const subject = profile.subjects[Math.floor(index / SUFFIXES.length) % profile.subjects.length];
    let title = category === "squishy"
      ? SQUISHY_TITLES[index % SQUISHY_TITLES.length]
      : `${subject} ${SUFFIXES[index % SUFFIXES.length]} ${profile.emoji}`;
    if (title.length > TITLE_MAX_LENGTH || titles.has(title)) {
      const suffix = ` ${index + 1}`;
      title = fitWords(profile.subjects[0], TITLE_MAX_LENGTH - suffix.length) + suffix;
    }
    // Mixed Essentials categories can exceed the budget even without a suffix.
    if (titles.has(title)) title = `Shein Finds ${index + 1}`;
    titles.add(title);
    let description;
    if (category === "squishy") {
      const hook = SQUISHY_DESCRIPTION_HOOKS[index % SQUISHY_DESCRIPTION_HOOKS.length];
      const hashtagSet = SQUISHY_HASHTAG_SETS[Math.floor(index / SQUISHY_DESCRIPTION_HOOKS.length) % SQUISHY_HASHTAG_SETS.length];
      description = `${CAPTION_PREFIX.slice(0, -1)}${hook}${hashtagSet}`;
    } else {
      const prefix = `${CAPTION_PREFIX} ${index + 1}`;
      const tags = [...new Set(["Shein", ...profile.tags, "SheinFinds"])];
      description = prefix;
      for (const tag of tags) {
        const next = `${description} #${tag}`;
        if (next.length <= DESCRIPTION_MAX_LENGTH) description = next;
      }
    }
    return { videoNumber: video.videoNumber ?? index + 1, title, description };
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
