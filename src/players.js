// Featured athletes. Each Big Exposure Athletics feature (Prospect Watch, Player Spotlight, Coaches
// Spotlight, Matchups) gets a page here: free digital card signup, an order window and the ladder.
// These are SAMPLE athletes with fictional names. Replace them with real features only after the
// family has given written consent (athletes are minors; see the content strategy guardrails).
import { SCHOOLS } from "./catalog.js";

export const SERIES = {
  "prospect-watch": { name: "Prospect Watch", note: "Big Exposure's weekly list of South Florida prospects to know." },
  "player-spotlight": { name: "Player Spotlight", note: "One play, one athlete, captured on the sideline." },
  "coaches-spotlight": { name: "Coaches Spotlight", note: "The coaches building South Florida programs." },
};

// Ladder rows shown on every player page. `option` picks a Format value; the rest open later or link out.
const LADDER = [
  { product: "digital-entry", option: "Single card", title: "Digital Entry", sub: "One digital card" },
  { product: "digital-entry", option: "Five-card pack", title: "Digital Five-Card Pack", sub: "Five digital cards from the season" },
  { product: "signature-package", title: "Base / Signature", sub: "Three printed cards + digital counterpart", popular: true },
  { product: "story-collection", title: "Story Collection", sub: "Signature, Moment and Story cards in a folder" },
  { product: "shoutout-select", title: "Shoutout Select", sub: "Premium finish, rigid presentation box" },
];
const EAGLES_LADDER = [
  { product: "eagles-digital", option: "Single card", title: "Eagles Digital Entry", sub: "One digital card" },
  { product: "eagles-digital", option: "Five-card pack", title: "Eagles Digital Five-Card Pack", sub: "Five digital cards from the season" },
  { product: "eagles-signature", title: "Eagles Base / Signature", sub: "Three printed cards + digital counterpart", popular: true },
  { product: "eagles-story", title: "Eagles Story Collection", sub: "Signature, Moment and Story cards in a folder" },
];

export const PLAYERS = [
  {
    id: "pw14-marcus-reed",
    name: "Marcus Reed",
    number: "24",
    pos: "RB",
    sport: "Football",
    school: SCHOOLS.eagles,
    schoolName: "MSD",
    series: "prospect-watch",
    seriesNo: 14,
    season: 2026,
    windowCloses: "2026-11-08",
    focus: "56% 40%",
    gallery: ["56% 40%", "30% 55%", "75% 38%", "88% 35%", "45% 60%"],
    story: "From Friday night lights to whatever comes next, Marcus runs with purpose and leads with heart. This is more than a collectible. It's a piece of his journey, captured on the sideline by Big Exposure Athletics.",
    stats: [["1,428", "Rush yds (senior year)"], ["24", "TDs (senior year)"], ["1st Team", "All-County 2026"]],
    ladder: EAGLES_LADDER,
  },
  {
    id: "pw15-tyler-brooks",
    name: "Tyler Brooks",
    number: "7",
    pos: "QB",
    sport: "Football",
    school: SCHOOLS.royal,
    schoolName: "Lakeview",
    series: "prospect-watch",
    seriesNo: 15,
    season: 2026,
    windowCloses: "2026-11-08",
    focus: "45% 45%",
    gallery: ["45% 45%", "60% 42%", "20% 60%", "70% 45%", "35% 55%"],
    story: "Tyler reads a defense like he's seen the play before. Three fourth-quarter comebacks this fall, and a locker room that follows his lead.",
    stats: [["2,310", "Pass yds"], ["27", "Pass TDs"], ["3", "4th-qtr comebacks"]],
    ladder: LADDER,
  },
  {
    id: "ps08-jaden-lee",
    name: "Jaden Lee",
    number: "11",
    pos: "WR",
    sport: "Football",
    school: SCHOOLS.maroon,
    schoolName: "Westbrook",
    series: "player-spotlight",
    seriesNo: 8,
    season: 2026,
    windowCloses: "2026-11-08",
    focus: "60% 42%",
    gallery: ["60% 42%", "56% 40%", "88% 35%", "30% 50%", "75% 38%"],
    story: "Third and long, one defender, one chance. Jaden's sideline catch in Week 8 kept the drive alive and turned into the game winner two plays later.",
    stats: [["68", "Receptions"], ["1,045", "Rec yds"], ["11", "TDs"]],
    ladder: LADDER,
  },
  {
    id: "pw16-cameron-davis",
    name: "Cameron Davis",
    number: "52",
    pos: "LB",
    sport: "Football",
    school: SCHOOLS.green,
    schoolName: "Cedar Ridge",
    series: "prospect-watch",
    seriesNo: 16,
    season: 2026,
    windowCloses: "2026-11-08",
    focus: "75% 38%",
    gallery: ["75% 38%", "40% 60%", "62% 42%", "30% 55%", "56% 40%"],
    story: "Cameron is first to the ball and last off the field. Team captain, defensive play-caller and the loudest voice on the sideline.",
    stats: [["96", "Tackles"], ["14", "TFL"], ["Captain", "Two seasons"]],
    ladder: LADDER,
  },
  {
    id: "ps09-ethan-walker",
    name: "Ethan Walker",
    number: "71",
    pos: "OL",
    sport: "Football",
    school: SCHOOLS.black,
    schoolName: "Harbor City",
    series: "player-spotlight",
    seriesNo: 9,
    season: 2026,
    windowCloses: "2026-11-08",
    focus: "40% 60%",
    gallery: ["40% 60%", "20% 60%", "70% 45%", "45% 45%", "88% 35%"],
    story: "Nobody puts linemen on posters. We do. Ethan anchored a line that cleared the way for 2,000 rushing yards this season.",
    stats: [["0", "Sacks allowed"], ["2,000+", "Team rush yds"], ["Senior", "Class of 2027"]],
    ladder: LADDER,
  },
];

export const findPlayer = (id) => PLAYERS.find((p) => p.id === id);
export const seriesLabel = (p) => `${p.season} ${SERIES[p.series].name} #${p.seriesNo}`;
