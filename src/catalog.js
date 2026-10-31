// Product catalog. Prices aligned to the official Shoutout Studios Photography Service Pricing Sheet (October 2026).
// Base prices use mid/lower points of published ranges; volume, multi-program, and custom arrangements available on request.
// When Shopify is connected, add each option's Shopify variant id under `shopifyVariants`
// (key = option values joined with "|", e.g. "12 cards|Base").

export const TIERS = {
  digital: { name: "Digital", note: "Delivered by download. The easiest first buy." },
  keepsake: { name: "Keepsake", note: "Everyday pieces for a season worth keeping." },
  milestone: { name: "Milestone Edition", note: "Made for senior night, title runs and captains." },
  select: { name: "Shoutout Select", note: "Numbered, foil-stamped collector editions.", limited: true },
  founders: { name: "Founders & VIP", note: "Serialized legacy pieces in the smallest runs we make.", limited: true },
  program: { name: "Team & Program", note: "Whole-roster sets for athletic programs." },
};

export const CATEGORIES = ["All", "Digital", "Trading Cards", "Posters", "Framed Pieces", "Collections", "Team Sets"];

// Sample school palettes show the dual-brand rule: the collectible wears the school's colors,
// the studio chrome stays Ink / Ivory / Purple / Gold.
const SCHOOLS = {
  maroon: { school: "Westbrook", mascot: "Eagles", c1: "#6E1A2B", c2: "#E9E2D6" },
  royal: { school: "Lakeview", mascot: "Knights", c1: "#1E3A7A", c2: "#C9CCD1" },
  green: { school: "Cedar Ridge", mascot: "Pioneers", c1: "#1F4D36", c2: "#E3C878" },
  black: { school: "Harbor City", mascot: "Tide", c1: "#1A1A1A", c2: "#E07A2E" },
  eagles: { school: "MSD", mascot: "Eagles", c1: "#5C1A26", c2: "#D4AF5A" },
};

// Live school collections. The collection wears the school's colors; the store stays Shoutout.
// Fundraiser: athletic program receives 30% of retail (before tax/shipping). No inventory buy-in required.
export const COLLECTIONS = [
  {
    id: "eagles-football-26",
    name: "MSD Eagles Football ’26",
    school: SCHOOLS.eagles,
    status: "Live this season",
    lede: "Every varsity Eagle, captured on the sideline and made collectible. 30% of every order goes back to Eagles Football.",
    fundraiser: "30% of every order supports MSD Eagles Football (before tax/shipping). No inventory risk for the program.",
    products: ["eagles-digital-single", "eagles-digital-pack", "eagles-base-pack", "eagles-senior-night", "eagles-locker-box"],
  },
];
export const findCollection = (id) => COLLECTIONS.find((c) => c.id === id);


export const PRODUCTS = [
  {
    id: "athlete-card-pack",
    name: "Athlete Card Pack",
    tier: "keepsake",
    category: "Trading Cards",
    price: 55,
    tagline: "Their season on a card. A whole stack of them.",
    story:
      "We pick the frame that says the most about their season, set the name, number and stats they earned, and design the card around their school's colors. Enough to keep, trade and send to the grandparents.",
    includes: ["One card design made for your athlete", "Front photo and back with verified stats", "Rigid card sleeve and storage box"],
    options: [
      { name: "Pack size", values: [{ label: "12 cards", add: 0 }, { label: "24 cards", add: 20 }, { label: "50 cards", add: 45 }] },
      { name: "Finish", values: [{ label: "Base", add: 0 }, { label: "Silver Foil", add: 15 }, { label: "Gold Limited", add: 30 }] },
    ],
    art: { kind: "card", school: SCHOOLS.maroon, name: "Jordan Hale", number: "11", sport: "Football", pos: "WR", year: "2026", focus: "56% 40%" },
  },
  {
    id: "season-recap-poster",
    name: "Season Recap Poster",
    tier: "keepsake",
    category: "Posters",
    price: 60,
    tagline: "One season, composed on a single page.",
    story:
      "The record, the big nights, the teammates, the final score that mattered. We lay out the season the way a magazine would, so it still reads clearly on a bedroom wall ten years from now.",
    includes: ["Editorial layout of the full season", "Archival matte paper", "Shipped flat in a rigid mailer"],
    options: [{ name: "Size", values: [{ label: "18 × 24 in", add: 0 }, { label: "24 × 36 in", add: 20 }] }],
    art: { kind: "poster", school: SCHOOLS.royal, name: "Lakeview Knights", number: "2026", sport: "Basketball", title: "The Run", focus: "70% 45%" },
  },
  {
    id: "framed-keepsake",
    name: "Framed Keepsake",
    tier: "keepsake",
    category: "Framed Pieces",
    price: 65,
    tagline: "The one frame that holds the whole night.",
    story:
      "A single defining image, matted with the athlete's card and a small engraved plate. Built to hang in a hallway and outlast the jersey.",
    includes: ["Hero photograph, matted", "Matching athlete card set into the mat", "Engraved name plate", "Hardwood frame, ready to hang"],
    options: [
      { name: "Size", values: [{ label: "11 × 14 in", add: 0 }, { label: "16 × 20 in", add: 50 }] },
      { name: "Frame", values: [{ label: "Black", add: 0 }, { label: "Walnut", add: 20 }] },
    ],
    art: { kind: "frame", school: SCHOOLS.green, name: "Avery Cole", number: "7", sport: "Soccer", focus: "62% 42%" },
  },
  {
    id: "senior-night-edition",
    name: "Senior Night Edition",
    tier: "milestone",
    category: "Collections",
    price: 215,
    tagline: "They'll never have this season again.",
    story:
      "Four years, one walk across the field. The Senior Night Edition gathers the career into a matched set: an edition card marked with the year, a career poster, and a framed print of the night itself.",
    includes: ["24 Senior Edition cards marked “Senior Edition 2026”", "Career recap poster, 18 × 24 in", "Framed senior night print, 11 × 14 in", "Edition seal of authenticity"],
    options: [{ name: "Card finish", values: [{ label: "Silver Foil", add: 0 }, { label: "Gold Limited", add: 25 }] }],
    art: { kind: "card", school: SCHOOLS.maroon, name: "Maya Torres", number: "4", sport: "Volleyball", pos: "OH", year: "Senior", focus: "88% 35%", edition: "SENIOR EDITION · 2026" },
    deadlineNote: true,
  },
  {
    id: "championship-collection",
    name: "Championship Collection",
    tier: "milestone",
    category: "Collections",
    price: 215,
    tagline: "For the run you'll talk about forever.",
    story:
      "The bracket, the final, the team photo nobody wanted to leave. A Championship Collection records the title run as it actually happened, with the scores and dates checked against the record.",
    includes: ["24 Championship Edition cards", "Title run poster, 24 × 36 in", "Framed final-game print, 11 × 14 in", "Edition seal of authenticity"],
    options: [{ name: "Card finish", values: [{ label: "Silver Foil", add: 0 }, { label: "Gold Limited", add: 25 }] }],
    art: { kind: "poster", school: SCHOOLS.black, name: "Harbor City Tide", number: "2026", sport: "Baseball", title: "Champions", focus: "40% 60%" },
    deadlineNote: true,
  },
  {
    id: "captain-edition",
    name: "Captain Edition Cards",
    tier: "milestone",
    category: "Trading Cards",
    price: 95,
    tagline: "For the one the team looked to.",
    story: "A card set that marks the captaincy: the armband, the year, the leadership the stat sheet never shows.",
    includes: ["24 Captain Edition cards", "Captain mark and season year", "Rigid sleeve and storage box"],
    options: [{ name: "Finish", values: [{ label: "Silver Foil", add: 0 }, { label: "Gold Limited", add: 15 }] }],
    art: { kind: "card", school: SCHOOLS.royal, name: "Eli Brooks", number: "23", sport: "Basketball", pos: "G", year: "Captain", focus: "45% 45%", edition: "CAPTAIN EDITION" },
  },
  {
    id: "select-collector-box",
    name: "Shoutout Select Collector Box",
    tier: "select",
    category: "Collections",
    price: 140,
    tagline: "Numbered. Foil-stamped. Made to be kept.",
    story:
      "Our collector edition. A small numbered run of cards with foil and embossed seals, a career poster and a framed print, presented in a keepsake box. Each piece carries its edition number, so the family always knows which one is theirs.",
    includes: ["Numbered edition cards (e.g. 14/50)", "Foil-stamped and embossed Shoutout seal", "Career poster and framed print", "Presentation box with certificate"],
    options: [{ name: "Edition size", values: [{ label: "50 numbered", add: 0 }, { label: "25 numbered", add: 40 }] }],
    art: { kind: "card", school: SCHOOLS.green, name: "Sam Okafor", number: "9", sport: "Track", pos: "400m", year: "Select", focus: "30% 50%", edition: "14 / 50" },
  },
  {
    id: "autograph-edition",
    name: "Autograph Edition",
    tier: "select",
    category: "Trading Cards",
    price: 120,
    tagline: "Signed by the athlete. Sealed by us.",
    story:
      "We ship blank-signature cards to the athlete, they sign, we seal and number them. Every autograph is matched to an edition number and a certificate.",
    includes: ["10 signature-ready cards, numbered", "Signing kit with return mailer", "Authentication seal and certificate"],
    options: [{ name: "Finish", values: [{ label: "Gold Limited", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.black, name: "Riley Shaw", number: "2", sport: "Softball", pos: "P", year: "Autograph", focus: "75% 38%", edition: "AUTOGRAPH · 3/10", signed: true },
  },
  {
    id: "founders-legacy-frame",
    name: "Founders Legacy Frame",
    tier: "founders",
    category: "Framed Pieces",
    price: 499,
    tagline: "A career, framed the way museums frame things.",
    story:
      "Our most considered piece. A museum-matted shadow box with the hero image, the edition card, a serialized seal and the career line, built for the wall it will hang on for decades.",
    includes: ["Museum-grade shadow box, 20 × 24 in", "Serialized authentication seal", "Founders Edition card set into the display", "White-glove packaging"],
    options: [{ name: "Frame", values: [{ label: "Ebony", add: 0 }, { label: "Walnut", add: 0 }] }],
    art: { kind: "frame", school: SCHOOLS.maroon, name: "Jordan Hale", number: "11", sport: "Football", focus: "56% 40%", edition: "FOUNDERS EDITION" },
  },
  {
    id: "team-card-set",
    name: "Team Card Set",
    tier: "program",
    category: "Team Sets",
    price: 42,
    unit: "per athlete",
    minQty: 15,
    tagline: "Every athlete on the roster. One collection.",
    story:
      "A full-roster card set in your school's colors, with an athletic director sign-off on every name, number and stat before anything is produced. Each athlete gets their own pack; the program gets the complete set. Program earns 30% of retail.",
    includes: ["A card for every rostered athlete", "12 cards per athlete plus one complete team set", "Roster verification by your athletic director", "Program colors and marks, studio-curated layout"],
    options: [{ name: "Finish", values: [{ label: "Base", add: 0 }, { label: "Silver Foil", add: 4 }] }],
    art: { kind: "card", school: SCHOOLS.royal, name: "Lakeview Knights", number: "", sport: "Team Set", pos: "", year: "2026 Roster", focus: "20% 60%" },
    quantityLabel: "Athletes on roster",
  },
  // MSD Eagles Football '26 collection (offer ladder from the GTM strategy)
  {
    id: "eagles-digital-single",
    collection: "eagles-football-26",
    name: "Eagles Digital Card",
    tier: "digital",
    category: "Digital",
    price: 19,
    tagline: "Friday's frame, on a card, ready to share tonight.",
    story: "One athlete, one game-night photo from the sideline, designed as an official Eagles card. Delivered as a high-resolution download you can post, text to grandparents, or print later.",
    includes: ["One digital card of your athlete", "High-resolution download plus a share-sized version", "Credit toward a print pack within 14 days"],
    options: [{ name: "Format", values: [{ label: "Digital card", add: 0 }] }],
    fields: "player",
    digital: true,
    art: { kind: "card", school: SCHOOLS.eagles, name: "Your Athlete", number: "11", sport: "Football", pos: "", year: "2026", focus: "56% 40%" },
  },
  {
    id: "eagles-digital-pack",
    collection: "eagles-football-26",
    name: "Eagles Digital Team Pack",
    tier: "digital",
    category: "Digital",
    price: 39,
    tagline: "Collect the whole team.",
    story: "Every approved varsity card in the Eagles ’26 set, delivered digitally and updated as new game weeks drop.",
    includes: ["Every approved varsity card", "New cards added through the season", "Your athlete's card featured first"],
    options: [{ name: "Format", values: [{ label: "Digital team set", add: 0 }] }],
    fields: "player-optional",
    digital: true,
    art: { kind: "card", school: SCHOOLS.eagles, name: "Eagles ’26", number: "", sport: "Football", pos: "", year: "Team Set", focus: "30% 55%" },
  },
  {
    id: "eagles-base-pack",
    collection: "eagles-football-26",
    name: "Eagles Base Card Pack",
    tier: "keepsake",
    category: "Trading Cards",
    price: 49,
    tagline: "The pack to hold, trade and keep.",
    story: "Printed Eagles cards of your athlete on heavyweight stock, in burgundy and gold. Names and numbers are approved by the program before anything prints.",
    includes: ["12 printed cards of your athlete", "Front photo, back with season stats", "Rigid sleeve and storage box"],
    options: [{ name: "Pack size", values: [{ label: "12 cards", add: 0 }, { label: "24 cards", add: 20 }] }],
    fields: "player",
    art: { kind: "card", school: SCHOOLS.eagles, name: "Your Athlete", number: "11", sport: "Football", pos: "", year: "2026", focus: "60% 42%" },
  },
  {
    id: "eagles-senior-night",
    collection: "eagles-football-26",
    name: "Eagles Senior Night Set",
    tier: "milestone",
    category: "Collections",
    price: 199,
    tagline: "One walk across the field. Kept for good.",
    story: "A Senior Edition print card set and an 18 × 24 in poster of your senior's night, produced to arrive for the moment rather than after it.",
    includes: ["12 Senior Edition cards marked 2026", "Senior night poster, 18 × 24 in", "Edition seal"],
    options: [{ name: "Add a frame", values: [{ label: "Poster only", add: 0 }, { label: "Framed poster", add: 60 }] }],
    fields: "player",
    deadlineNote: true,
    art: { kind: "poster", school: SCHOOLS.eagles, name: "MSD Eagles", number: "2026", sport: "Football", title: "Senior Night", focus: "88% 35%" },
  },
  {
    id: "eagles-locker-box",
    collection: "eagles-football-26",
    name: "Eagles Team Locker Box",
    tier: "program",
    category: "Team Sets",
    price: 499,
    tagline: "The full roster, boxed for the building.",
    story: "A complete printed team set and a framed team piece for the locker room or trophy case. A natural fit for a sponsor to present. Program earns 30% of retail.",
    includes: ["One printed card of every varsity athlete", "Framed team piece, 16 × 20 in", "Optional sponsor credit on the box"],
    options: [{ name: "Sponsor credit", values: [{ label: "None", add: 0 }, { label: "Add sponsor credit", add: 0 }] }],
    fields: "sponsor",
    art: { kind: "frame", school: SCHOOLS.eagles, name: "MSD Eagles", number: "26", sport: "Football", focus: "35% 55%" },
  },
];

export const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const unitPrice = (product, selections) =>
  product.price +
  product.options.reduce((sum, opt) => {
    const v = opt.values.find((x) => x.label === selections[opt.name]);
    return sum + (v ? v.add : 0);
  }, 0);

export const money = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
