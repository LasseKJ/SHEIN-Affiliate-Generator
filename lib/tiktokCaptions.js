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

const TITLE_BANKS = {
  autumn: [
    "Golden-Hour Fall Fits",
    "Chilly Day, Cute Layers",
    "The Fall Layering Edit",
    "A Cozy-Season Favorite",
    "Fall Colors, Found",
    "Your Autumn Outfit Mood",
    "The Soft-Layer Style Win",
    "Cool Weather, Great Fit",
  ],
  winter: [
    "Cold Days, Cute Fits",
    "The Cozy Layer Edit",
    "Snow-Day Outfit Mood",
    "Winter Layers, Sorted",
    "A Frosty Style Crush",
    "Stay Warm, Look Cute",
    "Your Winter Wardrobe Win",
    "This Cozy Fit Is It",
  ],
  "phone-cases": [
    "Case Closed: So Cute",
    "Your Phone's Cute Era",
    "New Case, New Mood",
    "Phone Candy, Found",
    "The Case Worth Showing",
    "Little Case, Big Mood",
    "A Fresh Phone Glow-Up",
    "Main Character Case",
  ],
  essentials: [
    "Little Finds, Big Joy",
    "Small Things, Smart Finds",
    "The Everyday Upgrade",
    "Tiny Upgrade, Better Day",
    "A Find for Every Day",
    "My New Daily Favorite",
    "Useful, Cute, Kept",
    "Good Finds, No Fuss",
  ],
  jackets: [
    "A Jacket That Gets It",
    "Layer Up in Style",
    "Your Outerwear Era",
    "The Cold-Weather MVP",
    "One Jacket, Big Energy",
    "A Layering Win",
    "Found: Your Go-To Jacket",
    "Warmth with a Style Twist",
  ],
  sweaters: [
    "The Sweater I Saved",
    "Cozy Knits, Best Mood",
    "Soft Knit, Strong Outfit",
    "Warmth with a Cute Twist",
    "A Knitwear Crush",
    "Your Coziest Layer Yet",
    "Sweater Weather, Sorted",
    "The Knit That Gets It",
  ],
  dresses: [
    "One Dress, Whole Mood",
    "Twirl-Worthy Find",
    "A Dress Day Done Right",
    "The Dress Code: Cute",
    "Meet Your New Favorite Dress",
    "A Little Dress Moment",
    "The One That Turns Heads",
    "An Outfit in One Step",
  ],
  "boo-basket": [
    "A Little Spooky, A Lot Cute",
    "Boo Basket Magic",
    "The Spooky-Cute Edit",
    "Halloween Basket Goals",
    "Cute Finds, Spooky Vibes",
    "The Boo Basket That Delivers",
    "A Treat-Worthy Basket",
    "Spooky Season, Sorted",
  ],
  stocking: [
    "Little Gifts, Big Grins",
    "The Stocking Stuffer Edit",
    "Tiny Gift, Huge Joy",
    "Good Things in Small Sizes",
    "A Gift They'll Keep",
    "Cute Finds for Their Stocking",
    "Small Surprise, Big Smile",
    "A Little Holiday Hit",
  ],
  "christmas-wishlist": [
    "Dear Santa, Add These",
    "A Wishlist-Worthy Find",
    "Holiday Wish-List Crush",
    "Save This for December",
    "Wrapped in Wish-List Magic",
    "The Gift You Keep Pinning",
    "A Little Holiday Dream",
    "Your Wish List Just Grew",
  ],
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
  const titleBank = category === "squishy" ? SQUISHY_TITLES : TITLE_BANKS[category];
  return titleBank[(index + offset) % titleBank.length];
}

export function createTikTokCaptions(category, videos) {
  if (!Array.isArray(videos) || !videos.length) return [];
  const cached = CAPTION_CACHE.get(videos);
  if (cached) return cached;

  const titles = new Set();
  const descriptions = new Set();
  const titleBankLength = category === "squishy" ? SQUISHY_TITLES.length : TITLE_BANKS[category].length;
  const titleOffset = Math.floor(Math.random() * titleBankLength);
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
