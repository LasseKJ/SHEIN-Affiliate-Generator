export const CAPTION_PREFIX = "Code 2MBJJ on shein.";

// Each category has its own English vocabulary and hashtag pool.
export const CAPTION_PROFILES = {
  squishy: { subjects: ["Shein Squishy", "Cute Shein Squishy", "Soft Shein Squishy", "Colorful Shein Squishy"], tags: ["Squishy", "SquishyCodes", "FidgetToys", "Kawaii", "SensoryToys", "SquishyLove", "CuteToys", "SquishyCollection"], emoji: "💖" },
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
const MOODS = ["Dreamy", "Fresh", "Lovely", "Daily", "Little", "Favorite", "Pretty", "New"];

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

// Unrank permutations instead of random sorting: every description in a batch
// has a distinct hashtag order, and rerendering/downloading keeps the same text.
function hashtagOrder(tags, rank) {
  const remaining = [...tags];
  const result = [];
  for (let i = 0; i < 5; i++) {
    const index = rank % remaining.length;
    rank = Math.floor(rank / remaining.length);
    result.push(`#${remaining.splice(index, 1)[0]}`);
  }
  return result.join(" ");
}

export function createTikTokCaptions(category, videos) {
  const titles = new Set(), descriptions = new Set();
  return videos.map((video, index) => {
    const profile = profileFor(category, video);
    const tags = [...new Set(["Shein", "SheinFinds", ...profile.tags])];
    let variant = index, title;
    do {
      const subject = profile.subjects[Math.floor(variant / SUFFIXES.length) % profile.subjects.length];
      const cycle = Math.floor(variant / (SUFFIXES.length * profile.subjects.length));
      const mood = cycle ? `${MOODS[(cycle - 1) % MOODS.length]} ` : "";
      title = `${mood}${subject} ${SUFFIXES[variant % SUFFIXES.length]} ${profile.emoji}`;
      variant++;
    } while (titles.has(title));
    titles.add(title);
    let rank = index, description;
    do { description = `${CAPTION_PREFIX} ${profile.emoji}\n${hashtagOrder(tags, rank++)}`; }
    while (descriptions.has(description));
    descriptions.add(description);
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
