// Product catalog. Prices follow the Shoutout Studios pricing sheet (low end of each range).
// When Shopify is connected, add each option's Shopify variant id under `shopifyVariants`
// (key = option values joined with "|", e.g. "12 cards|Base").

export const TIERS = {
  digital: { name: "Digital", note: "Delivered by download. The easiest first buy." },
  keepsake: { name: "Keepsake", note: "Everyday pieces for a season worth keeping." },
  milestone: { name: "Milestone Edition", note: "Made for senior night, title runs and captains." },
  select: { name: "Shoutout Select", note: "Numbered, foil-stamped collector editions.", limited: true },
  founders: { name: "Founders & VIP", note: "Serialized legacy pieces in the smallest runs we make.", limited: true },
  program: { name: "Team & Program", note: "Whole-roster sets for athletic programs and their sponsors." },
  addon: { name: "Add-Ons", note: "Extras for any order." },
};

// The four product families from the brand positioning (Oct 2026).
export const FAMILIES = [
  {
    name: "Athlete Cards",
    blurb: "Individually designed cards, printed or digital, built around the athlete's portrait, action, number, stats and achievements.",
    examples: "Player profile cards, milestone and senior-year cards, championship cards, limited commemorative editions.",
    feature: "player-highlight-card",
  },
  {
    name: "Signature Artwork",
    blurb: "Premium compositions that celebrate one athlete and one defining moment, made to hang on a wall.",
    examples: "Athlete portraits, season-highlight art, senior-night commemoratives, record-breaking milestone prints.",
    feature: "premium-legacy-drop",
  },
  {
    name: "Season & Career Collections",
    blurb: "Multi-piece collections that document a whole season or a whole career, curated like an editorial.",
    examples: "Season retrospectives, senior legacy editions, career milestone collections, curated multi-card sets.",
    feature: "season-recap-collection",
  },
  {
    name: "Team & Program Collections",
    blurb: "Coordinated collections commissioned by schools, clubs and athletic programs for the whole roster.",
    examples: "Team roster card sets, championship collections, senior class editions, program legacy collections.",
    feature: "team-set-fundraiser",
  },
];

export const CATEGORIES = ["All", ...FAMILIES.map((f) => f.name), "Add-Ons"];

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
// The program earns 30% of retail (Team Set Fundraiser terms, pricing sheet Oct 2026).
export const COLLECTIONS = [
  {
    id: "eagles-football-26",
    name: "MSD Eagles Football ’26",
    school: SCHOOLS.eagles,
    status: "Live this season",
    lede: "Every varsity Eagle, captured on the sideline and made collectible. MSD Eagles Football earns 30% of every sale.",
    fundraiser: "MSD Eagles Football earns 30% of the retail price of every order in this collection.",
    products: ["eagles-digital-only", "eagles-player-card", "eagles-legacy-drop", "eagles-season-recap", "eagles-team-poster"],
  },
];
export const findCollection = (id) => COLLECTIONS.find((c) => c.id === id);


export const PRODUCTS = [
  // Core packages and add-ons from the Shoutout Studios Photography Pricing Sheet (Oct 2026).
  // Each sheet price is a range; the store sells at the low end until Jamie sets final prices.
  {
    id: "player-highlight-card",
    name: "Player Highlight Card",
    tier: "keepsake",
    category: "Athlete Cards",
    price: 45,
    tagline: "One moment, one card, made to keep.",
    story:
      "We choose the single frame that says the most about your athlete and design a trading card around it, front and back, in their school's colors. You get the high-resolution digital to post and one printed card to keep.",
    includes: ["1 photo select", "Designed trading card, front and back (2.5 × 3.5 in)", "High-resolution digital", "1 printed card"],
    options: [{ name: "Format", values: [{ label: "Highlight card", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.maroon, name: "Jordan Hale", number: "11", sport: "Football", pos: "WR", year: "2026", focus: "56% 40%" },
  },
  {
    id: "multi-photo-player-card",
    name: "Multi-Photo Player Card",
    tier: "keepsake",
    category: "Athlete Cards",
    price: 85,
    tagline: "Every great frame from one game, and a card from your favorite.",
    story:
      "For the game with more than one moment. We pull 5 to 10 selects from a single game, deliver every one as a high-resolution digital, and design a card from the image you choose.",
    includes: ["5–10 photo selects from one game", "High-resolution digitals of every select", "1 designed card from your preferred image", "1 printed card"],
    options: [{ name: "Format", values: [{ label: "Multi-photo card", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.royal, name: "Eli Brooks", number: "23", sport: "Basketball", pos: "G", year: "2026", focus: "45% 45%" },
  },
  {
    id: "digital-only-pack",
    name: "Digital-Only Pack",
    tier: "digital",
    category: "Athlete Cards",
    price: 15,
    tagline: "The designed card, ready to share tonight.",
    story: "Your athlete's designed card delivered digitally, with a share-sized version for social and a high-resolution file you can print later. No physical card.",
    includes: ["Designed card, delivered digitally", "High-resolution and share-sized files", "Upgrade to a printed card anytime"],
    options: [{ name: "Format", values: [{ label: "Digital only", add: 0 }] }],
    fields: "player",
    digital: true,
    art: { kind: "card", school: SCHOOLS.green, name: "Sam Okafor", number: "9", sport: "Track", pos: "400m", year: "2026", focus: "30% 50%" },
  },
  {
    id: "premium-legacy-drop",
    name: "Premium Legacy Drop",
    tier: "select",
    category: "Signature Artwork",
    price: 95,
    tagline: "The key moment, given the full treatment.",
    story:
      "For the moment that deserves more than a standard card. Priority selection from the shoot, a foil or special-finish card, and a framed poster of the same frame, delivered digital and printed.",
    includes: ["Priority photo select", "Upgraded card with foil or special finish", "Framed poster", "Digital and printed delivery"],
    options: [{ name: "Format", values: [{ label: "Legacy drop", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.black, name: "Riley Shaw", number: "2", sport: "Softball", pos: "P", year: "Legacy", focus: "75% 38%", edition: "LEGACY DROP" },
  },
  {
    id: "framed-poster",
    name: "Framed Poster",
    tier: "keepsake",
    category: "Signature Artwork",
    price: 45,
    tagline: "The frame that belongs on the wall.",
    story: "Any selected image or designed card, composed as a poster and framed, ready to hang.",
    includes: ["Composed poster from your athlete's select", "Frame included", "Ready to hang"],
    options: [{ name: "Size", values: [{ label: "8 × 10 in", add: 0 }, { label: "11 × 14 in", add: 30 }] }],
    art: { kind: "frame", school: SCHOOLS.green, name: "Avery Cole", number: "7", sport: "Soccer", focus: "62% 42%" },
  },
  {
    id: "season-recap-collection",
    name: "Season Recap Collection",
    tier: "milestone",
    category: "Season & Career Collections",
    price: 180,
    unit: "per athlete",
    tagline: "The whole season, kept together.",
    story:
      "Selects from across the season, individual cards from the games that mattered, a team poster with a framed option, and a digital archive of the year.",
    includes: ["Multi-game photo selects", "Individual designed cards", "Team poster, framed option", "Digital season archive"],
    options: [{ name: "Format", values: [{ label: "Per athlete", add: 0 }] }],
    deadlineNote: true,
    art: { kind: "card", school: SCHOOLS.maroon, name: "Maya Torres", number: "4", sport: "Volleyball", pos: "OH", year: "Senior", focus: "88% 35%", edition: "SEASON RECAP · 2026" },
  },
  {
    id: "extra-cards",
    name: "Extra Printed Cards",
    tier: "addon",
    category: "Add-Ons",
    price: 8,
    unit: "each",
    tagline: "More copies for the grandparents, the coach and the scrapbook.",
    story: "Extra printed copies of a card we've already designed for your athlete.",
    includes: ["Printed 2.5 × 3.5 in cards", "Same design as your original card"],
    options: [{ name: "Card", values: [{ label: "Standard", add: 0 }, { label: "Multi-photo select", add: 4 }] }],
    fields: "player",
    quantityLabel: "Number of cards",
    art: { kind: "card", school: SCHOOLS.maroon, name: "Jordan Hale", number: "11", sport: "Football", pos: "WR", year: "2026", focus: "60% 42%" },
  },
  {
    id: "rush-proofing",
    name: "Rush Proofing",
    tier: "addon",
    category: "Add-Ons",
    price: 25,
    unit: "per athlete",
    tagline: "Selects and proof the same weekend.",
    story: "Moves your athlete to the front of the line: photo selects and a proof the same weekend as the game.",
    includes: ["Same-weekend photo select", "Priority proof"],
    options: [{ name: "Format", values: [{ label: "Rush", add: 0 }] }],
    fields: "player",
    digital: true,
    quantityLabel: "Athletes",
    art: { kind: "card", school: SCHOOLS.royal, name: "Eli Brooks", number: "23", sport: "Basketball", pos: "G", year: "Rush", focus: "45% 45%" },
  },
  {
    id: "team-set-fundraiser",
    name: "Team Set Fundraiser",
    tier: "program",
    category: "Team & Program Collections",
    price: 35,
    unit: "per card",
    inquiry: true,
    tagline: "Your roster as an official card set. Your program earns 30%.",
    story:
      "We shoot the team, design a complete player card set and team pack, and open a store for your families. Your program earns 30% of retail on every card, with no inventory to buy and nothing paid up front.",
    includes: ["Full-team photo selects", "Complete player card set", "Team pack design", "30% of retail to your program, no inventory risk"],
    options: [{ name: "Format", values: [{ label: "Program", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.royal, name: "Lakeview Knights", number: "", sport: "Team Set", pos: "", year: "2026 Roster", focus: "20% 60%" },
  },
  {
    id: "school-team-poster",
    name: "School-Branded Team Poster",
    tier: "program",
    category: "Team & Program Collections",
    price: 200,
    tagline: "The whole roster on one wall.",
    story: "A team poster designed around your school's colors and marks, for the locker room, the gym or the booster banquet.",
    includes: ["Team poster in your school's identity", "Designed from your season's selects", "Print-ready digital file"],
    options: [{ name: "Format", values: [{ label: "Team poster", add: 0 }] }],
    art: { kind: "poster", school: SCHOOLS.black, name: "Harbor City Tide", number: "2026", sport: "Baseball", title: "The Roster", focus: "40% 60%" },
  },
  {
    id: "program-season-recap",
    name: "Program Season Recap",
    tier: "program",
    category: "Team & Program Collections",
    price: 1200,
    unit: "per program",
    inquiry: true,
    tagline: "A season collection for every athlete on the roster.",
    story: "The Season Recap Collection for a whole program: multi-game selects, individual cards, team poster and a digital season archive.",
    includes: ["Multi-game selects for the roster", "Individual cards for every athlete", "Team poster, framed option", "Digital season archive"],
    options: [{ name: "Format", values: [{ label: "Program", add: 0 }] }],
    art: { kind: "poster", school: SCHOOLS.royal, name: "Lakeview Knights", number: "2026", sport: "Basketball", title: "The Run", focus: "70% 45%" },
  },
  {
    id: "sponsor-spotlight",
    name: "Sponsor Spotlight",
    tier: "program",
    category: "Team & Program Collections",
    price: 400,
    unit: "per game",
    inquiry: true,
    tagline: "Put your business behind something families keep.",
    story: "Your brand on the cards and packs families take home, co-branded distribution, and digital assets to share. $400 per game, or $1,500 for a multi-game run.",
    includes: ["Brand placement on cards and packs", "Co-branded distribution", "Digital assets"],
    options: [{ name: "Format", values: [{ label: "Sponsor", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.green, name: "Cedar Ridge", number: "", sport: "Sponsor", pos: "", year: "Presented by", focus: "30% 50%" },
  },
  // MSD Eagles Football '26: the live Team Set Fundraiser. The program earns 30% of retail.
  {
    id: "eagles-digital-only",
    collection: "eagles-football-26",
    name: "Eagles Digital-Only Pack",
    tier: "digital",
    category: "Athlete Cards",
    price: 15,
    tagline: "Friday's frame, on a card, ready to share.",
    story: "Your Eagle's designed card from the sideline shoot, delivered digitally: a high-resolution file to keep and a share-sized one to post tonight.",
    includes: ["Designed Eagles card of your athlete", "High-resolution and share-sized files", "Upgrade to a printed card anytime"],
    options: [{ name: "Format", values: [{ label: "Digital only", add: 0 }] }],
    fields: "player",
    digital: true,
    art: { kind: "card", school: SCHOOLS.eagles, name: "Your Athlete", number: "11", sport: "Football", pos: "", year: "2026", focus: "56% 40%" },
  },
  {
    id: "eagles-player-card",
    collection: "eagles-football-26",
    name: "Eagles Player Card",
    tier: "keepsake",
    category: "Athlete Cards",
    price: 35,
    unit: "per card",
    tagline: "The official Eagles card. 30% goes to the program.",
    story: "Your athlete's card from the Eagles ’26 team set, printed in burgundy and gold. Names and numbers are approved by the program before anything prints.",
    includes: ["Printed Eagles card, 2.5 × 3.5 in", "Front photo, back with season details", "High-resolution digital"],
    options: [{ name: "Format", values: [{ label: "Player card", add: 0 }] }],
    fields: "player",
    quantityLabel: "Number of cards",
    art: { kind: "card", school: SCHOOLS.eagles, name: "Your Athlete", number: "11", sport: "Football", pos: "", year: "2026", focus: "60% 42%" },
  },
  {
    id: "eagles-legacy-drop",
    collection: "eagles-football-26",
    name: "Eagles Premium Legacy Drop",
    tier: "select",
    category: "Signature Artwork",
    price: 95,
    tagline: "Senior night, the big catch, the moment.",
    story: "Priority selection from the Eagles shoot, a foil-finish card and a framed poster of the same frame, delivered digital and printed.",
    includes: ["Priority photo select", "Foil-finish Eagles card", "Framed poster", "Digital and printed delivery"],
    options: [{ name: "Format", values: [{ label: "Legacy drop", add: 0 }] }],
    fields: "player",
    deadlineNote: true,
    art: { kind: "poster", school: SCHOOLS.eagles, name: "MSD Eagles", number: "2026", sport: "Football", title: "Senior Night", focus: "88% 35%" },
  },
  {
    id: "eagles-season-recap",
    collection: "eagles-football-26",
    name: "Eagles Season Recap Collection",
    tier: "milestone",
    category: "Season & Career Collections",
    price: 180,
    unit: "per athlete",
    tagline: "The whole Eagles season, kept together.",
    story: "Selects from every game of the season, individual cards, a team poster with a framed option and a digital archive of your Eagle's year.",
    includes: ["Multi-game selects", "Individual Eagles cards", "Team poster, framed option", "Digital season archive"],
    options: [{ name: "Format", values: [{ label: "Per athlete", add: 0 }] }],
    fields: "player",
    art: { kind: "card", school: SCHOOLS.eagles, name: "Eagles ’26", number: "", sport: "Football", pos: "", year: "Season", focus: "30% 55%" },
  },
  {
    id: "eagles-team-poster",
    collection: "eagles-football-26",
    name: "Eagles Team Poster",
    tier: "program",
    category: "Team & Program Collections",
    price: 200,
    tagline: "The full roster, in burgundy and gold.",
    story: "The Eagles ’26 roster on one school-branded poster, for the locker room, the trophy case or a sponsor to present.",
    includes: ["School-branded team poster", "Designed from the season's selects", "Optional sponsor credit"],
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
