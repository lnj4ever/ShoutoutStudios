// Product catalog. Prices follow Jamie's Pricing & Packaging Structure (Nov 2026): one ladder
// from a $5 digital card to the $199 Founder Edition, plus quoted programs for teams and schools.
// Ladder prices are illustrative until supplier quotes and margins are validated; shipping and tax are extra.
// Launch order: Digital and Signature first, Story at a milestone, Select and Founder once production is validated.

export const TIERS = {
  digital: { name: "Digital Entry", note: "Delivered by download. The easiest first buy." },
  signature: { name: "Signature", note: "Three printed cards and their digital versions. The core package." },
  story: { name: "Story Collection", note: "The season told across three cards, presented together." },
  select: { name: "Shoutout Select", note: "Premium finishes, upgraded stock and a rigid presentation box.", limited: true },
  founders: { name: "Founder Edition", note: "Available only during the published launch window.", limited: true },
  program: { name: "Team & Program", note: "Quoted programs for whole rosters, schools and sponsors." },
};

// The four product families from the brand positioning (Oct 2026), mapped onto the ladder.
export const FAMILIES = [
  {
    name: "Athlete Cards",
    blurb: "Individually designed cards, printed or digital, built around the athlete's portrait, action, number, stats and achievements.",
    examples: "Digital cards, five-card digital packs, the Signature package of three printed cards.",
    feature: "signature-package",
  },
  {
    name: "Season & Career Collections",
    blurb: "Multi-card collections that tell a whole season or career, curated like an editorial and presented together.",
    examples: "Signature, Moment and Story cards in a presentation folder.",
    feature: "story-collection",
  },
  {
    name: "Signature Artwork",
    blurb: "Premium-finish cards and framed editorial prints for the moments that deserve the full treatment.",
    examples: "Shoutout Select boxed collections, the Founder Edition with a framed editorial print.",
    feature: "shoutout-select",
  },
  {
    name: "Team & Program Collections",
    blurb: "Coordinated collections commissioned by schools, clubs, athletic programs and sponsors for the whole roster.",
    examples: "Team Recognition, Season Story Programs, Select Recognition, the Founding Program.",
    feature: "team-recognition",
  },
];

export const CATEGORIES = ["All", ...FAMILIES.map((f) => f.name)];

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
// DTC fundraiser rule (Nov 2026): families pay retail, and the program agreement states a fixed dollar
// contribution per eligible sale. Set `contribution` (in dollars) once the agreement names it.
export const COLLECTIONS = [
  {
    id: "eagles-football-26",
    name: "MSD Eagles Football ’26",
    school: SCHOOLS.eagles,
    status: "Live this season",
    contribution: null,
    lede: "Every varsity Eagle, captured on the sideline and made collectible. Every eligible order sends a contribution to MSD Eagles Football.",
    products: ["eagles-digital", "eagles-signature", "eagles-story"],
  },
];
export const findCollection = (id) => COLLECTIONS.find((c) => c.id === id);

export const fundraiserNote = (c) =>
  c.contribution
    ? `MSD Eagles Football receives ${money(c.contribution)} from every eligible order in this collection. Families pay the regular price.`
    : `Families pay the regular price, and every eligible order in this collection sends a set contribution to ${c.name.replace(/ ’\d+$/, "")}.`;

const LATER = {
  story: "Opens at our first production milestone.",
  select: "Opens once premium production is validated.",
  founders: "Available only during the published launch window, opening after premium production is validated.",
};

export const PRODUCTS = [
  {
    id: "digital-entry",
    name: "Digital Card",
    tier: "digital",
    category: "Athlete Cards",
    price: 5,
    tagline: "The designed card, ready to share tonight.",
    story: "Your athlete's designed card delivered digitally, with a share-sized version for social and a high-resolution file to keep. Choose one card, or a pack of five from across the season.",
    includes: ["Designed athlete card, delivered digitally", "High-resolution and share-sized files", "Upgrade to Signature anytime"],
    options: [{ name: "Format", values: [{ label: "Single card", add: 0 }, { label: "Five-card pack", add: 10 }] }],
    fields: "player",
    digital: true,
    art: { kind: "card", school: SCHOOLS.green, name: "Sam Okafor", number: "9", sport: "Track", pos: "400m", year: "2026", focus: "30% 50%" },
  },
  {
    id: "signature-package",
    name: "Signature Package",
    tier: "signature",
    category: "Athlete Cards",
    price: 25,
    tagline: "Three printed cards, made to keep.",
    story: "Three printed athlete cards designed around your athlete in their school's colors, each with its digital version, delivered in a protective sleeve.",
    includes: ["3 printed athlete cards (2.5 × 3.5 in)", "Digital versions of all three", "Protective sleeve"],
    options: [{ name: "Format", values: [{ label: "Signature", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.maroon, name: "Jordan Hale", number: "11", sport: "Football", pos: "WR", year: "2026", focus: "56% 40%" },
  },
  {
    id: "story-collection",
    name: "Story Collection",
    tier: "story",
    category: "Season & Career Collections",
    price: 59,
    later: LATER.story,
    tagline: "The season, told in three cards.",
    story: "A Signature card, a Moment card and a Story card that carries the season's narrative, presented together in a folder with digital versions of each.",
    includes: ["Signature, Moment and Story cards", "Presentation folder", "Digital versions"],
    options: [{ name: "Format", values: [{ label: "Story Collection", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.royal, name: "Maya Torres", number: "4", sport: "Volleyball", pos: "OH", year: "Senior", focus: "88% 35%", edition: "STORY COLLECTION" },
  },
  {
    id: "shoutout-select",
    name: "Shoutout Select",
    tier: "select",
    category: "Signature Artwork",
    price: 119,
    later: LATER.select,
    tagline: "The Story Collection, given the full treatment.",
    story: "Everything in the Story Collection, plus a featured card in a premium finish, upgraded card stock throughout, a rigid presentation box and a collection record of the pieces inside.",
    includes: ["Story Collection", "Featured premium-finish card", "Upgraded card stock", "Rigid presentation box", "Collection record"],
    options: [{ name: "Format", values: [{ label: "Select", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.black, name: "Riley Shaw", number: "2", sport: "Softball", pos: "P", year: "Select", focus: "75% 38%", edition: "SHOUTOUT SELECT" },
  },
  {
    id: "founder-edition",
    name: "Founder Edition",
    tier: "founders",
    category: "Signature Artwork",
    price: 199,
    later: LATER.founders,
    tagline: "For families who were here first.",
    story: "Everything in Shoutout Select, plus a framed editorial print and an inaugural-collection designation. Offered only during the published launch window. It marks when you joined, not a promise about what the collection will be worth.",
    includes: ["Shoutout Select", "Framed editorial print", "Inaugural-collection designation", "Launch window only"],
    options: [{ name: "Format", values: [{ label: "Founder", add: 0 }] }],
    art: { kind: "frame", school: SCHOOLS.green, name: "Avery Cole", number: "7", sport: "Soccer", focus: "62% 42%" },
  },
  // Bulk programs: quoted per program, no list price.
  {
    id: "team-recognition",
    name: "Team Recognition",
    tier: "program",
    category: "Team & Program Collections",
    quote: "Quoted per roster",
    inquiry: true,
    tagline: "A Signature package for every athlete on the roster.",
    story: "For teams of 25 athletes or more. Every athlete gets the Signature package, coordinated by us and approved by the program. Priced as a setup fee plus a per-athlete price.",
    includes: ["Minimum 25 athlete packages", "Signature package for each athlete", "Setup fee plus per-athlete price", "Team set available as a separate piece"],
    options: [{ name: "Format", values: [{ label: "Program", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.royal, name: "Lakeview Knights", number: "", sport: "Team Set", pos: "", year: "2026 Roster", focus: "20% 60%" },
  },
  {
    id: "season-story-program",
    name: "Season Story Program",
    tier: "program",
    category: "Team & Program Collections",
    quote: "Quoted per program",
    inquiry: true,
    tagline: "The Story Collection for a whole program.",
    story: "For programs of 50 athletes or more. Story Collections for the roster, with roster coordination, a collection page for your families and a set ordering window.",
    includes: ["Minimum 50 athletes", "Story Collections", "Roster coordination", "Collection page and ordering window"],
    options: [{ name: "Format", values: [{ label: "Program", add: 0 }] }],
    art: { kind: "poster", school: SCHOOLS.royal, name: "Lakeview Knights", number: "2026", sport: "Basketball", title: "The Run", focus: "70% 45%" },
  },
  {
    id: "select-recognition",
    name: "Select Recognition",
    tier: "program",
    category: "Team & Program Collections",
    quote: "Quoted per roster",
    inquiry: true,
    tagline: "Shoutout Select for seniors, captains or a title team.",
    story: "For groups of 25 athletes or more. Shoutout Select collections for the athletes a program wants to recognize, produced together.",
    includes: ["Minimum 25 athletes", "Shoutout Select for each athlete", "Coordinated production"],
    options: [{ name: "Format", values: [{ label: "Program", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.black, name: "Harbor City", number: "", sport: "Seniors", pos: "", year: "Class of 2026", focus: "40% 60%" },
  },
  {
    id: "founding-program",
    name: "Founding Program",
    tier: "program",
    category: "Team & Program Collections",
    quote: "Fixed project fee",
    inquiry: true,
    tagline: "One inaugural team or school.",
    story: "We partner with one inaugural team or school to build its collection from the ground up, for a fixed project fee. Sponsors can underwrite packages for families.",
    includes: ["One inaugural team or school", "Fixed project fee", "Sponsor-funded packages welcome"],
    options: [{ name: "Format", values: [{ label: "Program", add: 0 }] }],
    art: { kind: "poster", school: SCHOOLS.black, name: "Harbor City Tide", number: "2026", sport: "Baseball", title: "Founding", focus: "40% 60%" },
  },
  // MSD Eagles Football '26: the live DTC fundraiser collection.
  {
    id: "eagles-digital",
    collection: "eagles-football-26",
    name: "Eagles Digital Card",
    tier: "digital",
    category: "Athlete Cards",
    price: 5,
    tagline: "Friday's frame, on a card, ready to share.",
    story: "Your Eagle's designed card from the sideline shoot, delivered digitally: a high-resolution file to keep and a share-sized one to post tonight. Choose one card or a five-card pack.",
    includes: ["Designed Eagles card of your athlete", "High-resolution and share-sized files", "Upgrade to Signature anytime"],
    options: [{ name: "Format", values: [{ label: "Single card", add: 0 }, { label: "Five-card pack", add: 10 }] }],
    fields: "player",
    digital: true,
    art: { kind: "card", school: SCHOOLS.eagles, name: "Your Athlete", number: "11", sport: "Football", pos: "", year: "2026", focus: "56% 40%" },
  },
  {
    id: "eagles-signature",
    collection: "eagles-football-26",
    name: "Eagles Signature Package",
    tier: "signature",
    category: "Athlete Cards",
    price: 25,
    tagline: "Three printed Eagles cards, in burgundy and gold.",
    story: "Three printed cards of your Eagle from the ’26 season with their digital versions, in a protective sleeve. Names and numbers are approved by the program before anything prints.",
    includes: ["3 printed Eagles cards (2.5 × 3.5 in)", "Digital versions of all three", "Protective sleeve"],
    options: [{ name: "Format", values: [{ label: "Signature", add: 0 }] }],
    fields: "player",
    art: { kind: "card", school: SCHOOLS.eagles, name: "Your Athlete", number: "11", sport: "Football", pos: "", year: "2026", focus: "60% 42%" },
  },
  {
    id: "eagles-story",
    collection: "eagles-football-26",
    name: "Eagles Story Collection",
    tier: "story",
    category: "Season & Career Collections",
    price: 59,
    later: LATER.story,
    tagline: "The whole Eagles season, kept together.",
    story: "A Signature card, a Moment card and a Story card from your Eagle's season, in a presentation folder with digital versions.",
    includes: ["Signature, Moment and Story cards", "Presentation folder", "Digital versions"],
    options: [{ name: "Format", values: [{ label: "Story Collection", add: 0 }] }],
    fields: "player",
    art: { kind: "poster", school: SCHOOLS.eagles, name: "MSD Eagles", number: "2026", sport: "Football", title: "The Season", line: "Story Collection", focus: "88% 35%" },
  },
];

// Can this piece go in the cart today? Quoted programs and pieces opening later can't.
export const isOrderable = (p) => !!p && !p.inquiry && !p.later;

// What a tile or product page shows for price.
export const priceLabel = (p, amount = p.price) => (p.quote ? p.quote : money(amount));

export const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const unitPrice = (product, selections) =>
  product.price +
  product.options.reduce((sum, opt) => {
    const v = opt.values.find((x) => x.label === selections[opt.name]);
    return sum + (v ? v.add : 0);
  }, 0);

export const money = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
