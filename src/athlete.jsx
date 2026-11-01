import React, { useState } from "react";
import { findProduct, isOrderable, money } from "./catalog.js";
import { PLAYERS, SERIES, findPlayer, seriesLabel } from "./players.js";
import { useCart } from "./cart.jsx";
import { Button, CardArt, Link, SectionHead, Seal, TierBadge } from "./ui.jsx";
import { NotFound, PageIntro } from "./pages.jsx";

const windowText = (iso) => {
  const d = new Date(`${iso}T23:59:00`);
  if (Number.isNaN(d.getTime()) || d < new Date()) return null;
  const day = d.toLocaleDateString("en-US", { weekday: "long" });
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return { day, date };
};

const playerArt = (p, extra = {}) => ({
  kind: "card",
  school: p.school,
  name: p.name,
  number: p.number,
  sport: p.sport,
  pos: p.pos,
  year: String(p.season),
  focus: p.focus,
  ...extra,
});

// ---------- Player page ----------

export function PlayerPage({ id }) {
  const p = findPlayer(id);
  if (!p) return <NotFound />;
  const win = windowText(p.windowCloses);
  const related = PLAYERS.filter((x) => x.id !== p.id).slice(0, 4);
  return (
    <div className="player-page" style={{ "--c1": p.school.c1, "--c2": p.school.c2 }}>
      <section className="player-hero">
        <div className="wrap player-hero-grid">
          <div className="player-photo" style={{ "--focus": p.focus }} role="img" aria-label={`${p.name} in action`}>
            <span className="player-photo-seal"><Seal size={48} /></span>
          </div>
          <div className="player-id">
            <p className="eyebrow light">Featured by Big Exposure Athletics</p>
            <h1>{p.name}</h1>
            <p className="player-number">#{p.number}</p>
            <p className="player-meta">{p.pos} · {p.schoolName} {p.school.mascot} · {p.sport}</p>
            <span className="series-badge">{seriesLabel(p)}</span>
            <p className="fine sample-note">Sample feature with a fictional athlete.</p>
          </div>
        </div>
      </section>

      <FreeCard player={p} />

      {win ? (
        <div className="urgency" role="note">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          <span>Order window closes <strong>{win.day}</strong>, {win.date}</span>
        </div>
      ) : null}

      <section className="band tight player-ladder-band">
        <div className="wrap narrow">
          <SectionHead eyebrow={`${p.name}'s collection`} title="Keep the moment." />
          <Ladder player={p} />
          <p className="fine">Prices in USD, before shipping and tax. Every piece is proofed before it's produced. <Link to="how-it-works">How it works</Link></p>
        </div>
      </section>

      <section className="band ivory">
        <div className="wrap split player-story">
          <div>
            <p className="eyebrow">The story</p>
            <h2>His story. His moment.</h2>
            <p className="lede">{p.story}</p>
          </div>
          <div className="stat-row">
            {p.stats.map(([v, l]) => (
              <div className="stat" key={l}>
                <strong>{v}</strong>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band tight">
        <div className="wrap">
          <SectionHead eyebrow="Photo gallery" title="Captured on the sideline." />
          <div className="gallery" tabIndex={0} aria-label={`Photos of ${p.name}`}>
            {p.gallery.map((f, i) => <div key={f + i} className="gallery-shot" style={{ "--focus": f }} role="img" aria-label={`${p.name}, game photo ${i + 1}`} />)}
          </div>
          <p className="fine">Photos by Big Exposure Athletics. Any frame can become a card in the collection.</p>
        </div>
      </section>

      <section className="band ivory tight">
        <div className="wrap">
          <div className="related-head">
            <h2>Related players</h2>
            <Link to="players" className="text-link">View all →</Link>
          </div>
          <div className="related">
            {related.map((r) => <PlayerTile key={r.id} player={r} />)}
          </div>
        </div>
      </section>

      <BigExposureStrip />
    </div>
  );
}

function Ladder({ player }) {
  const cart = useCart();
  const [added, setAdded] = useState(null);
  return (
    <ul className="ladder">
      {player.ladder.map((row) => {
        const product = findProduct(row.product);
        if (!product) return null;
        const opt = product.options[0];
        const choice = row.option || opt.values[0].label;
        const price = product.price + (opt.values.find((v) => v.label === choice)?.add || 0);
        const ok = isOrderable(product);
        const key = row.product + choice;
        const add = () => {
          cart.add({ productId: product.id, selections: { [opt.name]: choice }, qty: 1, details: { "Athlete name": player.name, "Jersey number": player.number } });
          setAdded(key);
        };
        return (
          <li key={key} className={`ladder-row${row.popular ? " popular" : ""}`}>
            <div className="ladder-art"><CardArt art={playerArt(player, { focus: product.art.focus })} tier={product.tier} size="sm" /></div>
            <div className="ladder-copy">
              <Link to={`product/${product.id}`} className="ladder-title">{row.title}</Link>
              <span className="ladder-sub">{row.sub}</span>
              {row.popular ? <span className="popular-tag">Most popular</span> : null}
            </div>
            <span className="ladder-price">{money(price)}</span>
            {ok ? (
              <button type="button" className="btn btn-secondary ladder-btn" onClick={add} aria-label={`Add ${row.title} for ${player.name} to cart, ${money(price)}`}>
                {added === key ? "Added ✓" : "Add to cart"}
              </button>
            ) : (
              <Link to={`product/${product.id}`} className="btn btn-ghost-dark ladder-btn">Opens later</Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function FreeCard({ player }) {
  const [v, setV] = useState({ name: "", email: "", phone: "", consent: false });
  const [errs, setErrs] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    const n = {};
    if (!v.name.trim()) n.name = "Add your name.";
    if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) n.email = "Enter a valid email.";
    if (v.phone.trim() && v.phone.replace(/\D/g, "").length < 10) n.phone = "Enter a 10-digit phone number.";
    setErrs(n);
    if (Object.keys(n).length) {
      document.getElementById(`fc-${Object.keys(n)[0]}`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...v, playerId: player.id, player: player.name, feature: seriesLabel(player) }),
      });
      if (res.ok) return setState("done");
      const data = await res.json().catch(() => ({}));
      setMsg(res.status === 501 ? "Free card signups open once the site goes live." : data.error || "We couldn't save that just now. Please try again.");
    } catch {
      setMsg("We couldn't reach the studio. Check your connection and try again.");
    }
    setState("error");
  }

  return (
    <section className="free-card">
      <div className="wrap free-card-grid">
        <div className="free-card-art">
          <span className="free-flag">Free digital card</span>
          <CardArt art={playerArt(player)} tier="digital" />
        </div>
        {state === "done" ? (
          <div className="sent" role="status">
            <Seal size={56} />
            <h2>It's on the way.</h2>
            <p>We'll send {player.name.split(" ")[0]}'s free digital card to {v.email}. Keep an eye out for it after the program approves the feature.</p>
          </div>
        ) : (
          <form className="free-card-form" onSubmit={submit} noValidate>
            <h2>Get {player.name.split(" ")[0]}'s card free.</h2>
            <p>A digital card of this feature, sent straight to you. Share it tonight.</p>
            {[
              ["name", "Full name", "text", "name"],
              ["email", "Email address", "email", "email"],
              ["phone", "Phone number (optional)", "tel", "tel"],
            ].map(([k, l, t, auto]) => (
              <div className="field" key={k}>
                <label htmlFor={`fc-${k}`}>{l}</label>
                <input id={`fc-${k}`} type={t} autoComplete={auto} value={v[k]} aria-invalid={!!errs[k]} aria-describedby={errs[k] ? `fc-${k}-err` : undefined} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
                {errs[k] ? <span className="err" id={`fc-${k}-err`}>{errs[k]}</span> : null}
              </div>
            ))}
            {v.phone.trim() ? (
              <label className="check">
                <input type="checkbox" checked={v.consent} onChange={(e) => setV({ ...v, consent: e.target.checked })} />
                <span>Text me about {player.name.split(" ")[0]}'s collection and order windows. Message rates may apply; reply STOP to opt out.</span>
              </label>
            ) : null}
            <button type="submit" className="btn btn-secondary free-card-btn" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send me the free card →"}
            </button>
            {state === "error" ? <p className="err" role="alert">{msg}</p> : null}
            <p className="fine">🔒 100% free. We only contact you about this athlete's collection.</p>
          </form>
        )}
      </div>
    </section>
  );
}

function PlayerTile({ player: p }) {
  return (
    <Link to={`player/${p.id}`} className="player-tile" style={{ "--c1": p.school.c1, "--c2": p.school.c2 }}>
      <div className="player-tile-photo" style={{ "--focus": p.focus }} />
      <div className="player-tile-body">
        <strong>{p.name}</strong>
        <span>{p.pos} · {p.schoolName} {p.school.mascot}</span>
        <em>{p.season}</em>
      </div>
    </Link>
  );
}

function BigExposureStrip() {
  return (
    <section className="be-strip">
      <div className="wrap be-strip-row">
        <div>
          <span className="be-kicker">Powered by</span>
          <strong className="be-name">Big Exposure Athletics</strong>
          <span className="be-tag">Scout. Rank. Recognize.</span>
        </div>
        <p>Every featured athlete is captured and covered by Big Exposure Athletics, a Shoutout Studios company.</p>
        <Button to="big-exposure" variant="ghost">Meet Big Exposure</Button>
      </div>
    </section>
  );
}

// ---------- Featured athletes index ----------

export function PlayersIndex() {
  return (
    <>
      <PageIntro eyebrow="Featured athletes" title="Seen on Big Exposure. Kept with Shoutout.">
        Every athlete named in a Big Exposure feature gets a page here, with a free digital card and their collection. Find yours.
      </PageIntro>
      <section className="band tight">
        <div className="wrap">
          {Object.entries(SERIES).map(([key, s]) => {
            const list = PLAYERS.filter((p) => p.series === key);
            if (!list.length) return null;
            return (
              <div key={key} className="tier-group">
                <div className="tier-head"><h2>{s.name}</h2><p>{s.note}</p></div>
                <div className="related">{list.map((p) => <PlayerTile key={p.id} player={p} />)}</div>
              </div>
            );
          })}
          <p className="fine">Sample features with fictional athletes. Real features are published with the family's consent.</p>
        </div>
      </section>
    </>
  );
}

// ---------- Big Exposure Athletics partnership page ----------

const BE_SERVICES = [
  ["Game-day media", "Professional photography and video from the sideline, at the games that matter most each week."],
  ["Creative graphics", "Player spotlights, final-score announcements and stat graphics built for social media."],
  ["Recruiting visibility", "Highlights, performance breakdowns and milestone tracking that put athletes in front of college recruiters."],
];

const BE_SERIES = [
  ["Prospect Watch", "The weekly list of South Florida prospects to know. Each prospect gets a numbered feature and a page of their own."],
  ["Player Spotlight", "One play, one athlete. The moment is captured on the sideline and offered as a card within 48 hours."],
  ["Coaches Spotlight", "Recognition for the coaches building programs, and the start of a partnership with their booster club."],
  ["Matchups", "Previews of the week's biggest games, followed by a final-score graphic and a rivalry print."],
];

const LOOP = [
  ["Capture", "Big Exposure shoots the game."],
  ["Feature", "The athlete is named in a weekly series."],
  ["Page", "Their page goes live on Shoutout Studios."],
  ["Free card", "Family gets a free digital card."],
  ["Order window", "Prints and collections, open until Sunday."],
  ["Keep", "Proofed, produced and delivered."],
];

const SPORTS = ["Football", "Flag football", "Basketball", "Baseball", "Softball", "Soccer", "Lacrosse"];

export function BigExposurePage() {
  return (
    <>
      <section className="band ink be-hero">
        <div className="wrap">
          <p className="eyebrow light">A Shoutout Studios company</p>
          <h1>Big Exposure <span>Athletics</span></h1>
          <p className="lede">South Florida's high school sports media platform, covering Miami-Dade, Broward and Palm Beach. Big Exposure captures the moments. Shoutout Studios makes them collectible.</p>
          <div className="actions">
            <Button to="partner?interest=coverage">Book game coverage</Button>
            <Button to="players" variant="ghost">See featured athletes</Button>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap split">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2>An amplification pipeline for student-athletes.</h2>
          </div>
          <div className="prose">
            <p>Big Exposure Athletics was founded by Marjory Stoneman Douglas High School graduate Jacob LaPaglia to give South Florida athletes the coverage their play deserves, and the visibility to catch the attention of college recruiters.</p>
            <p>We partner with families, teams and local talent on game-day media, creative graphics and recruiting promotion, and every week our series name dozens of athletes and coaches across three counties.</p>
          </div>
        </div>
      </section>

      <section className="band ivory">
        <div className="wrap">
          <SectionHead eyebrow="What we do" title="Coverage, creative and reach." />
          <div className="pillars three">
            {BE_SERVICES.map(([t, d]) => (
              <article key={t}><h3>{t}</h3><p>{d}</p></article>
            ))}
          </div>
          <ul className="sport-chips" aria-label="Sports covered">
            {SPORTS.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <SectionHead eyebrow="The weekly series" title="Every feature leads home.">
            Each series names real athletes and coaches. Every name links to a page on Shoutout Studios where the family can claim a free digital card and keep the moment.
          </SectionHead>
          <div className="pillars">
            {BE_SERIES.map(([t, d]) => (
              <article key={t}><h3>{t}</h3><p>{d}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="band ink">
        <div className="wrap">
          <SectionHead eyebrow="From post to keepsake" title="How the partnership works." />
          <ol className="loop">
            {LOOP.map(([t, d], i) => (
              <li key={t}><span className="loop-n">{String(i + 1).padStart(2, "0")}</span><strong>{t}</strong><span>{d}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band">
        <div className="wrap split">
          <div className="be-offer">
            <p className="eyebrow">For teams & booster clubs</p>
            <h3>Be covered every week.</h3>
            <p>Anchor programs get Big Exposure on the sideline every week, a collection page for their families, and a contribution from every eligible sale back to the program.</p>
            <Button to="partner?interest=coverage" variant="secondary">Book coverage</Button>
          </div>
          <div className="be-offer">
            <p className="eyebrow">For local sponsors</p>
            <h3>Present a series.</h3>
            <p>Restaurants, gyms, trainers and dealerships can present a weekly series, such as "Prospect Watch presented by", and help fund the photography that families keep.</p>
            <Button to="partner?interest=sponsor" variant="secondary">Sponsor a series</Button>
          </div>
        </div>
      </section>

      <section className="band ivory tight">
        <div className="wrap center">
          <h2>Follow the season.</h2>
          <p className="lede center-lede">Find Big Exposure Athletics on Instagram for weekly features, and on YouTube for highlight reels and game coverage.</p>
          <Button to="players">Browse featured athletes</Button>
        </div>
      </section>
    </>
  );
}
