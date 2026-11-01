// Product catalog. Prices follow Jamie's Pricing & Packaging Structure (Nov 2026): one ladder
// from a $5 digital card to the $199 Founder Edition, plus quoted programs for teams and schools.
// Ladder prices are illustrative until supplier quotes and margins are validated; shipping and tax are extra.
// Launch order: Digital and Signature first, Story at a milestone, Select and Founder once production is validated.

export const TIERS = {
  digital: { name: "Digital Entry", note: "Start with the moment: a digital single or five-card pack." },
  signature: { name: "Base / Signature", note: "Make the moment tangible: three printed cards and their digital counterpart." },
  story: { name: "Story Collection", note: "Build the athlete's story: Signature, Moment and Story cards in a folder." },
  select: { name: "Shoutout Select", note: "The full treatment: premium finish, upgraded stock and a rigid box.", limited: true },
  founders: { name: "Founder Edition", note: "Mark an inaugural chapter: Select with a framed editorial print.", limited: true },
  program: { name: "Team & Program", note: "Coordinated programs for rosters, schools and sponsors. Quoted from a setup fee plus a per-athlete rate." },
};

// The four product families from the brand positioning (Oct 2026), mapped onto the ladder.
export const FAMILIES = [
  {
    name: "Athlete Cards",
    blurb: "Individually designed cards, printed or digital, built around the athlete's portrait, action, number, stats and achievements.",
    examples: "Digital Entry singles and five-card packs, the Base / Signature package of three printed cards.",
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
  // Descriptions follow the Pricing & Packaging Explorer v1 (Oct 31, 2026). Prices are its draft figures:
  // illustrative DTC prices before shipping and tax, pending costing.
  {
    id: "digital-entry",
    name: "Digital Entry",
    tier: "digital",
    category: "Athlete Cards",
    price: 5,
    tagline: "Start with the moment.",
    story: "A digital single or five-card pack creates the first connection to the athlete's collection: a first, shareable entry for parents, grandparents and first-time collectors. Delivered digitally, with no physical item.",
    includes: ["Digital single or five-card pack", "A shareable first entry into the collection", "Digital delivery, no physical item"],
    options: [{ name: "Format", values: [{ label: "Single card", add: 0 }, { label: "Five-card pack", add: 10 }] }],
    fields: "player",
    digital: true,
    art: { kind: "card", school: SCHOOLS.green, name: "Sam Okafor", number: "9", sport: "Track", pos: "400m", year: "2026", focus: "30% 50%" },
  },
  {
    id: "signature-package",
    name: "Base / Signature",
    tier: "signature",
    category: "Athlete Cards",
    price: 25,
    tagline: "Make the moment tangible.",
    story: "The physical starting point: a compact keepsake built around one athlete. Three printed cards bring the story off the screen, each with its digital counterpart, for families looking for a first physical keepsake.",
    includes: ["Three printed cards", "Digital counterpart"],
    options: [{ name: "Format", values: [{ label: "Base / Signature", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.maroon, name: "Jordan Hale", number: "11", sport: "Football", pos: "WR", year: "2026", focus: "56% 40%" },
  },
  {
    id: "story-collection",
    name: "Story Collection",
    tier: "story",
    category: "Season & Career Collections",
    price: 59,
    later: LATER.story,
    tagline: "Build the athlete's story.",
    story: "A three-card narrative of Signature, Moment and Story cards, brought together as a collection. The narrative roles and a presentation folder add context and cohesion, for families preserving an athlete's season or milestone.",
    includes: ["Signature, Moment and Story cards", "Presentation folder", "Digital counterpart"],
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
    tagline: "The collection, given the full treatment.",
    story: "The premium expression of the Story Collection, with a more considered physical presentation. Materials, finish, a rigid box and a collection record set it apart, for collectors who want a premium presentation.",
    includes: ["Story Collection contents", "Premium finish and upgraded stock", "Rigid presentation box", "Collection record"],
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
    tagline: "Mark an inaugural chapter.",
    story: "Shoutout Select with a framed editorial print and a documented founder designation, for collectors marking a genuine inaugural collection. The inaugural story is the distinction. It carries no lifetime benefits and no guaranteed scarcity.",
    includes: ["Shoutout Select contents", "Framed editorial print", "Documented inaugural designation"],
    options: [{ name: "Format", values: [{ label: "Founder", add: 0 }] }],
    art: { kind: "frame", school: SCHOOLS.green, name: "Avery Cole", number: "7", sport: "Soccer", focus: "62% 42%" },
  },
  // Bulk programs: quoted per program from the draft setup fee and per-athlete rate.
  {
    id: "team-recognition",
    name: "Team Recognition",
    tier: "program",
    category: "Team & Program Collections",
    quote: "$150 setup + $18 per athlete",
    inquiry: true,
    tagline: "Team-wide athlete recognition.",
    story: "A Base / Signature package for every athlete, one collection design and a consolidated shipment. For teams of 50 athletes or more.",
    includes: ["Base / Signature per athlete", "One collection design", "Consolidated shipment", "Minimum 50 athlete packages"],
    options: [{ name: "Format", values: [{ label: "Program", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.royal, name: "Lakeview Knights", number: "", sport: "Team Set", pos: "", year: "2026 Roster", focus: "20% 60%" },
  },
  {
    id: "season-story-program",
    name: "Season Story Program",
    tier: "program",
    category: "Team & Program Collections",
    quote: "$300 setup + $42 per athlete",
    inquiry: true,
    tagline: "Roster-wide season storytelling.",
    story: "Story Collections across the roster. The program scales the narrative package to your whole team, with the roster, card counts and delivery scoped with you. For programs of 50 athletes or more.",
    includes: ["Story Collection per athlete", "Roster and delivery scoped with your program", "Minimum 50 athlete packages"],
    options: [{ name: "Format", values: [{ label: "Program", add: 0 }] }],
    art: { kind: "poster", school: SCHOOLS.royal, name: "Lakeview Knights", number: "2026", sport: "Basketball", title: "The Run", focus: "70% 45%" },
  },
  {
    id: "select-recognition",
    name: "Select Recognition",
    tier: "program",
    category: "Team & Program Collections",
    quote: "$400 setup + $85 per athlete",
    inquiry: true,
    tagline: "Premium program recognition.",
    story: "Shoutout Select packages for the athletes your program wants to recognize, such as seniors, captains or a title team. Recipients and the premium specification are set with you. For groups of 25 athletes or more.",
    includes: ["Shoutout Select per designated athlete", "Recipients chosen with your program", "Minimum 25 athlete packages"],
    options: [{ name: "Format", values: [{ label: "Program", add: 0 }] }],
    art: { kind: "card", school: SCHOOLS.black, name: "Harbor City", number: "", sport: "Seniors", pos: "", year: "Class of 2026", focus: "40% 60%" },
  },
  {
    id: "founding-program",
    name: "Founding Program",
    tier: "program",
    category: "Team & Program Collections",
    quote: "Custom quote",
    inquiry: true,
    tagline: "An inaugural program and its designated recipients.",
    story: "An inaugural program collection with an optional Founder Edition allocation for designated recipients. Scope, recipients and pricing are set together with one inaugural team or school.",
    includes: ["Inaugural program collection", "Optional Founder Edition allocation", "Scoped with one team or school"],
    options: [{ name: "Format", values: [{ label: "Program", add: 0 }] }],
    art: { kind: "poster", school: SCHOOLS.black, name: "Harbor City Tide", number: "2026", sport: "Baseball", title: "Founding", focus: "40% 60%" },
  },
  // MSD Eagles Football '26: the live DTC fundraiser collection.
  {
    id: "eagles-digital",
    collection: "eagles-football-26",
    name: "Eagles Digital Entry",
    tier: "digital",
    category: "Athlete Cards",
    price: 5,
    tagline: "Friday's moment, ready to share.",
    story: "A digital single or five-card pack of your Eagle from the sideline shoot: the first, shareable entry into their collection. Delivered digitally, with no physical item.",
    includes: ["Digital single or five-card pack", "Your Eagle from the sideline shoot", "Digital delivery, no physical item"],
    options: [{ name: "Format", values: [{ label: "Single card", add: 0 }, { label: "Five-card pack", add: 10 }] }],
    fields: "player",
    digital: true,
    art: { kind: "card", school: SCHOOLS.eagles, name: "Your Athlete", number: "11", sport: "Football", pos: "", year: "2026", focus: "56% 40%" },
  },
  {
    id: "eagles-signature",
    collection: "eagles-football-26",
    name: "Eagles Base / Signature",
    tier: "signature",
    category: "Athlete Cards",
    price: 25,
    tagline: "Your Eagle's season, made tangible.",
    story: "Three printed cards of your Eagle in burgundy and gold, each with its digital counterpart. Names and numbers are approved by the program before anything prints.",
    includes: ["Three printed Eagles cards", "Digital counterpart"],
    options: [{ name: "Format", values: [{ label: "Base / Signature", add: 0 }] }],
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
    tagline: "Your Eagle's season, told in three cards.",
    story: "Signature, Moment and Story cards from your Eagle's season, brought together in a presentation folder with their digital counterparts.",
    includes: ["Signature, Moment and Story cards", "Presentation folder", "Digital counterpart"],
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
