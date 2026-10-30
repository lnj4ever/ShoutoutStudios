import React, { useMemo, useState } from "react";
import { CATEGORIES, COLLECTIONS, PRODUCTS, TIERS, findCollection, findProduct, money, unitPrice } from "./catalog.js";
import { COMMERCE, checkoutMode, orderNote, startCheckout } from "./commerce.js";
import { TYPE_LABEL, checkoutBasket, groupLines, selldoneProduct, takePending, unmappedLines } from "./selldone.js";
import { useCart } from "./cart.jsx";
import heroUrl from "./assets/hero.webp";
import logoFullUrl from "./assets/logo-full.webp";
import { Button, CardArt, Link, ProductTile, SectionHead, Seal, TierBadge, go } from "./ui.jsx";

const STEPS = [
  ["Choose the piece", "Pick a card pack, poster, frame or collection, and tell us who it's for."],
  ["Share the moments", "After checkout you get a private link to send photos, stats and the story behind the season."],
  ["We curate the story", "Our designers choose the frames that matter and compose the piece around your athlete and school."],
  ["Approve your proof", "You see a digital proof before anything is produced. Names, numbers and stats are checked twice."],
  ["Keep it", "Produced, inspected by hand and shipped in keepsake packaging, usually 10–14 business days after approval."],
];

export function Home() {
  const featured = ["senior-night-edition", "athlete-card-pack", "framed-keepsake", "season-recap-poster"].map(findProduct);
  return (
    <>
      <section className="hero">
        <img className="hero-img" src={heroUrl} alt="A football player walks off the field at sunset, high-fiving fans along the fence." />
        <div className="hero-shade" />
        <div className="hero-copy wrap">
          <p className="eyebrow light">Sports storytelling &amp; collectibles studio</p>
          <h1>Moments happen once.<br /><span>Shoutouts last.</span></h1>
          <p className="hero-lede">Turn the moments that define an athlete's story into professionally designed collectibles worth keeping.</p>
          <div className="actions">
            <Button to="shop">Create a Shoutout</Button>
            <Button to="programs" variant="ghost">Partner With Shoutout</Button>
          </div>
        </div>
      </section>

      <CollectionBand collection={COLLECTIONS[0]} />

      <section className="band ivory">
        <div className="wrap split">
          <div>
            <p className="eyebrow">The season ends</p>
            <h2>The story shouldn't disappear with it.</h2>
          </div>
          <div className="prose">
            <p>Photos get buried in camera rolls. Stats disappear into spreadsheets. Social posts get forgotten.</p>
            <p>Shoutout brings the moments that mattered together and makes them into something you can hold. Something worth displaying. Something worth giving. Something worth keeping.</p>
            <p className="signature">Some things are made to be posted. This is made to be kept.</p>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <SectionHead eyebrow="Your story. Made collectible." title="Cards, posters, frames and editions.">
            Professionally curated around the athlete, never dropped into a template.
          </SectionHead>
          <div className="grid tiles">{featured.map((p) => <ProductTile key={p.id} product={p} />)}</div>
          <div className="center-row"><Button to="shop" variant="secondary">See the full shop</Button></div>
        </div>
      </section>

      <section className="band ink">
        <div className="wrap split">
          <div>
            <p className="eyebrow light">Curated, not templated</p>
            <h2>Your athlete isn't a template. Their story shouldn't be either.</h2>
          </div>
          <div className="prose">
            <p>Most custom sports sites ask, “Which template would you like?” We ask what made this athlete and this season worth remembering.</p>
            <p>You bring us the moments. We turn them into the collection.</p>
            <ol className="flow" aria-label="How a Shoutout is made">
              <li>Curated</li><li>Designed</li><li>Produced</li><li>Collected</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="band ivory" id="how">
        <div className="wrap">
          <SectionHead eyebrow="How it works" title="Share the moments. We'll make them collectible." />
          <Steps />
          <div className="center-row"><Button to="how-it-works" variant="secondary">Ordering details</Button></div>
        </div>
      </section>

      <section className="band">
        <div className="wrap duo">
          <article className="panel">
            <p className="eyebrow">For athletic programs</p>
            <h3>Celebrate the athletes who define your program.</h3>
            <p>Whole-roster card sets and season collections in your school's colors. The program stays the hero; we provide the creative system behind it.</p>
            <Link to="programs" className="arrow">Explore program partnerships</Link>
          </article>
          <article className="panel">
            <p className="eyebrow">For sponsors</p>
            <h3>Support something families keep.</h3>
            <p>More meaningful than another banner on the fence. Put your business behind the collections families take home.</p>
            <Link to="sponsors" className="arrow">Become a community partner</Link>
          </article>
        </div>
      </section>

      <section className="band ink closing">
        <div className="wrap center">
          <img className="closing-logo" src={logoFullUrl} alt="Shoutout Studios, Moments Made Collectible"  width="320" height="349" />
          <h2>One season. Hundreds of moments.<br />One story worth keeping.</h2>
          <Button to="shop">Make it a Shoutout</Button>
        </div>
      </section>
    </>
  );
}

function CollectionBand({ collection: c }) {
  const picks = c.products.slice(0, 3).map(findProduct);
  return (
    <section className="band collection-band" style={{ "--c1": c.school.c1, "--c2": c.school.c2 }}>
      <div className="wrap split">
        <div>
          <p className="eyebrow live"><span className="dot" aria-hidden="true" />{c.status}</p>
          <h2>{c.name}</h2>
          <p className="lede">{c.lede}</p>
          <div className="actions"><Button to={`collection/${c.id}`}>Shop the Eagles collection</Button></div>
        </div>
        <div className="fan" aria-hidden="true">{picks.map((p) => <CardArt key={p.id} art={p.art} tier={p.tier} />)}</div>
      </div>
    </section>
  );
}

const FLYWHEEL = [
  ["Friday", "Capture", "Big Exposure Athletics shoots the game. Same-night selects are tagged to the roster."],
  ["Saturday", "Curate", "Hero frames chosen, blurry and weak shots pulled, cards designed in the school's colors."],
  ["Sunday", "Proof", "The athletic director and families preview the week's cards. Names and numbers are locked."],
  ["Monday", "Drop", "Digital cards go live, the print window opens and the booster club sends the link."],
  ["That week", "Fulfill", "Print orders are batched. Milestone pieces are held for their dated night."],
  ["Next Friday", "Return", "Sideline content points back to the collection, and the next week starts."],
];

export function CollectionPage({ id }) {
  const c = findCollection(id);
  if (!c) return <NotFound />;
  const items = c.products.map(findProduct);
  return (
    <>
      <section className="intro collection-intro" style={{ "--c1": c.school.c1, "--c2": c.school.c2 }}>
        <div className="wrap">
          <p className="eyebrow live"><span className="dot" aria-hidden="true" />{c.status} · Curated &amp; produced by Shoutout Studios</p>
          <h1>{c.name}</h1>
          <p className="lede">{c.lede}</p>
        </div>
      </section>
      <section className="band tight">
        <div className="wrap">
          <p className="fundraiser-note">{c.fundraiser}</p>
          <div className="grid tiles">{items.map((p) => <ProductTile key={p.id} product={p} />)}</div>
          <p className="fine">Captured on the sideline by Big Exposure Athletics. Every card's name and number is approved by the program before it prints.</p>
        </div>
      </section>
      <section className="band ivory">
        <div className="wrap">
          <SectionHead eyebrow="Every game week" title="Shot Friday. Live by Monday." />
          <Flywheel />
        </div>
      </section>
    </>
  );
}

function Flywheel() {
  return (
    <ol className="steps six">
      {FLYWHEEL.map(([day, t, d]) => (
        <li key={t}>
          <span className="step-day">{day}</span>
          <h3>{t}</h3>
          <p>{d}</p>
        </li>
      ))}
    </ol>
  );
}

function Steps() {
  return (
    <ol className="steps">
      {STEPS.map(([t, d], i) => (
        <li key={t}>
          <span className="step-n">{String(i + 1).padStart(2, "0")}</span>
          <h3>{t}</h3>
          <p>{d}</p>
        </li>
      ))}
    </ol>
  );
}

export function Shop({ query }) {
  const initial = CATEGORIES.includes(query.get("c")) ? query.get("c") : "All";
  const [cat, setCat] = useState(initial);
  const list = PRODUCTS.filter((p) => !p.collection && (cat === "All" || p.category === cat));
  const tiers = Object.keys(TIERS).filter((t) => list.some((p) => p.tier === t));
  return (
    <>
      <PageIntro eyebrow="The Shoutout shop" title="Made for this athlete. This team. This season.">
        Choose the piece, check out, then send us the moments. Every order is curated and proofed by our studio before it's produced.
      </PageIntro>
      <section className="band tight">
        <div className="wrap">
          <div className="filters" role="tablist" aria-label="Filter by category">
            {CATEGORIES.map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          {cat === "All" ? (
            <Link to={`collection/${COLLECTIONS[0].id}`} className="collection-strip" style={{ "--c1": COLLECTIONS[0].school.c1, "--c2": COLLECTIONS[0].school.c2 }}>
              <span className="eyebrow live"><span className="dot" aria-hidden="true" />{COLLECTIONS[0].status}</span>
              <strong>{COLLECTIONS[0].name}</strong>
              <span className="arrow">Shop the collection</span>
            </Link>
          ) : null}
          {!tiers.length ? <p>Nothing in this category yet. <Link to={`collection/${COLLECTIONS[0].id}`}>See the Eagles collection</Link>.</p> : null}
          {tiers.map((t) => (
            <div key={t} className={`tier-group${TIERS[t].limited ? " limited" : ""}`}>
              <div className="tier-head">
                <h2>{TIERS[t].name}</h2>
                <p>{TIERS[t].note}</p>
              </div>
              <div className="grid tiles">{list.filter((p) => p.tier === t).map((p) => <ProductTile key={p.id} product={p} />)}</div>
            </div>
          ))}
          <p className="fine">Prices shown are in USD and include design, curation and one round of proof revisions. Shipping and tax are calculated at checkout.</p>
        </div>
      </section>
    </>
  );
}

const DETAIL_FIELDS = [
  { key: "Athlete name", required: true, auto: "name" },
  { key: "School or team", required: true },
  { key: "Sport", required: true },
  { key: "Jersey number" },
  { key: "Season or year" },
];
const FIELD_SETS = {
  player: [
    { key: "Athlete name", required: true, auto: "off" },
    { key: "Jersey number", required: true },
  ],
  "player-optional": [{ key: "Your athlete (optional, featured first)" }],
  sponsor: [
    { key: "Your name", required: true, auto: "name" },
    { key: "Email", required: true, type: "email", auto: "email" },
    { key: "Sponsor business (if adding credit)" },
  ],
};
const PROGRAM_FIELDS = [
  { key: "School or program", required: true },
  { key: "Sport", required: true },
  { key: "Season or year", required: true },
  { key: "Athletic director email", required: true, type: "email", auto: "email" },
];

export function Product({ id }) {
  const product = findProduct(id);
  const cart = useCart();
  const [sel, setSel] = useState(() => Object.fromEntries((product?.options || []).map((o) => [o.name, o.values[0].label])));
  const [qty, setQty] = useState(product?.minQty || 1);
  const [details, setDetails] = useState({});
  const [errors, setErrors] = useState({});
  if (!product) return <NotFound />;

  const fields = FIELD_SETS[product.fields] || (product.tier === "program" ? PROGRAM_FIELDS : DETAIL_FIELDS);
  const collection = product.collection ? findCollection(product.collection) : null;
  const price = unitPrice(product, sel);
  const min = product.minQty || 1;

  function submit(e) {
    e.preventDefault();
    const errs = {};
    fields.forEach((f) => {
      const v = (details[f.key] || "").trim();
      if (f.required && !v) errs[f.key] = `Add the ${f.key.toLowerCase()}.`;
      else if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) errs[f.key] = "Enter a valid email.";
    });
    if (qty < min) errs.qty = `Minimum ${min}.`;
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0].replace(/\W+/g, "-")}`)?.focus();
      return;
    }
    const clean = Object.fromEntries(Object.entries(details).map(([k, v]) => [k, v.trim()]));
    cart.add({ productId: product.id, selections: sel, qty, details: clean });
  }

  const limited = TIERS[product.tier].limited;
  const orderable = checkoutMode() !== "selldone" || !!selldoneProduct(product.id);
  return (
    <section className={`band product${limited ? " limited" : ""}`}>
      <div className="wrap product-grid">
        <div className="product-art">
          <CardArt art={product.art} tier={product.tier} size="lg" />
          <p className="fine">Sample design for a fictional school. Your piece is composed around your athlete, in your school's colors.</p>
        </div>
        <div className="product-info">
          {collection ? <Link to={`collection/${collection.id}`} className="back">← {collection.name}</Link> : <Link to="shop" className="back">← Back to shop</Link>}
          <TierBadge tier={product.tier} />
          <h1>{product.name}</h1>
          <p className="tagline">{product.tagline}</p>
          <p className="price">{money(price)}{product.unit ? <small> {product.unit}</small> : null}</p>
          <p>{product.story}</p>
          {collection ? <p className="fundraiser-note">{collection.fundraiser}</p> : null}
          <ul className="includes">{product.includes.map((i) => <li key={i}>{i}</li>)}</ul>

          <form onSubmit={submit} noValidate className="order-form">
            {product.options.map((o) => (
              <fieldset key={o.name} className="opt">
                <legend>{o.name}</legend>
                <div className="chips">
                  {o.values.map((v) => (
                    <label key={v.label} className={sel[o.name] === v.label ? "on" : ""}>
                      <input type="radio" name={o.name} value={v.label} checked={sel[o.name] === v.label} onChange={() => setSel({ ...sel, [o.name]: v.label })} />
                      {v.label}
                      {v.add ? <small> +{money(v.add)}</small> : null}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <fieldset className="opt">
              <legend>{product.fields === "sponsor" ? "Your details" : product.tier === "program" ? "About the program" : "Who it's for"}</legend>
              <div className="fields">
                {fields.map((f) => {
                  const fid = `f-${f.key.replace(/\W+/g, "-")}`;
                  return (
                    <div className="field" key={f.key}>
                      <label htmlFor={fid}>{f.key}{f.required ? <span aria-hidden="true"> *</span> : null}</label>
                      <input id={fid} type={f.type || "text"} autoComplete={f.auto || "off"} value={details[f.key] || ""} aria-invalid={!!errors[f.key]} aria-describedby={errors[f.key] ? `${fid}-err` : undefined} onChange={(e) => setDetails({ ...details, [f.key]: e.target.value })} />
                      {errors[f.key] ? <span className="err" id={`${fid}-err`}>{errors[f.key]}</span> : null}
                    </div>
                  );
                })}
                {product.deadlineNote ? (
                  <div className="field">
                    <label htmlFor="f-need-by">Event date (if it's for a specific night)</label>
                    <input id="f-need-by" type="date" value={details["Event date"] || ""} onChange={(e) => setDetails({ ...details, "Event date": e.target.value })} />
                  </div>
                ) : null}
                <div className="field wide">
                  <label htmlFor="f-story">What made this season worth remembering?</label>
                  <textarea id="f-story" rows="3" placeholder="The comeback, the record, the first varsity start…" value={details.Story || ""} onChange={(e) => setDetails({ ...details, Story: e.target.value })} />
                </div>
              </div>
            </fieldset>

            <div className="buy-row">
              <div className="qty">
                <label htmlFor="qty">{product.quantityLabel || "Quantity"}</label>
                <div className="stepper">
                  <button type="button" aria-label="Decrease" onClick={() => setQty(Math.max(min, qty - 1))}>−</button>
                  <input id="qty" inputMode="numeric" value={qty} aria-invalid={!!errors.qty} onChange={(e) => setQty(Math.max(0, parseInt(e.target.value || "0", 10) || 0))} onBlur={() => setQty(Math.max(min, qty))} />
                  <button type="button" aria-label="Increase" onClick={() => setQty(qty + 1)}>+</button>
                </div>
                {errors.qty ? <span className="err">{errors.qty}</span> : null}
              </div>
              {orderable ? <Button type="submit">Add to cart · {money(price * qty)}</Button> : <Button to={`partner?interest=${encodeURIComponent(product.name)}`}>Ask about this piece</Button>}
            </div>
            {!orderable ? <p className="fine">This piece is made to order through a school or program. Ask and we'll set it up for your team.</p> : null}
            <p className="fine">
              {product.deadlineNote
                ? "Ordering for a specific night? Standard turnaround is 10–14 business days after proof approval. Add the date and we'll tell you right away if it's tight."
                : collection
                  ? product.digital
                    ? "Digital cards are delivered by email once the program approves names and numbers, usually the Monday after the game."
                    : "Photos come from the Big Exposure Athletics sideline shoot, so there's nothing to upload. Printing starts once the program approves the cards."
                  : "You'll send photos after checkout through a private upload link. Nothing is produced until you approve the proof."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export function CartPage() {
  const cart = useCart();
  return (
    <>
      <PageIntro eyebrow="Your cart" title={cart.lines.length ? "Almost there." : "Your cart is empty."}>
        {cart.lines.length ? "Review your pieces, then check out. You'll send photos and the story after." : "Start with the piece that fits the moment."}
      </PageIntro>
      <section className="band tight">
        <div className="wrap narrow">
          {cart.lines.length ? <CartLines /> : <Button to="shop">Browse the shop</Button>}
        </div>
      </section>
    </>
  );
}

export function CartLines({ compact }) {
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function checkout() {
    setError("");
    setBusy(true);
    try {
      const r = await startCheckout(cart.lines);
      if (r === "preview" || r === "checkout-page") {
        cart.setOpen(false);
        go("checkout");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={`cart-lines${compact ? " compact" : ""}`}>
      <ul>
        {cart.lines.map((l) => {
          const p = findProduct(l.productId);
          const each = unitPrice(p, l.selections);
          const who = l.details["Athlete name"] || l.details["School or program"];
          return (
            <li key={l.id} className="line">
              <div className="line-art"><CardArt art={p.art} tier={p.tier} size="sm" /></div>
              <div className="line-info">
                <strong>{p.name}</strong>
                <span>{Object.values(l.selections).join(" · ")}</span>
                {who ? <span>For {who}</span> : null}
                <div className="line-ctrl">
                  <div className="stepper sm">
                    <button type="button" aria-label={`Decrease quantity of ${p.name}`} onClick={() => cart.setQty(l.id, l.qty - 1)}>−</button>
                    <span aria-live="polite">{l.qty}</span>
                    <button type="button" aria-label={`Increase quantity of ${p.name}`} onClick={() => cart.setQty(l.id, l.qty + 1)}>+</button>
                  </div>
                  <button type="button" className="text-btn" onClick={() => cart.remove(l.id)}>Remove</button>
                </div>
              </div>
              <span className="line-price">{money(each * l.qty)}</span>
            </li>
          );
        })}
      </ul>
      <div className="subtotal"><span>Subtotal</span><strong>{money(cart.subtotal)}</strong></div>
      <p className="fine">Shipping and tax calculated at checkout.</p>
      {error ? <p className="err" role="alert">{error}</p> : null}
      <Button onClick={checkout} disabled={busy}>{busy ? "Starting checkout…" : "Check out"}</Button>
    </div>
  );
}

export function CheckoutPreview() {
  return checkoutMode() === "selldone" ? <Checkout /> : <PreviewCheckout />;
}

function PreviewCheckout() {
  const cart = useCart();
  return (
    <>
      <PageIntro eyebrow="Checkout preview" title="Payments aren't connected yet.">
        This is where customers will go to Shopify (or Stripe) to pay. Once a store is connected, this button takes them straight to a secure checkout with the order below.
      </PageIntro>
      <section className="band tight">
        <div className="wrap narrow">
          <h2 className="h3">Order that would be sent</h2>
          <pre className="order-note">{cart.lines.length ? orderNote(cart.lines) : "Cart is empty."}</pre>
          <p>Subtotal: <strong>{money(cart.subtotal)}</strong></p>
          <p className="fine">Mode: {checkoutMode()}. Set the store in <code>src/commerce.js</code> to go live.</p>
          <Button to="shop" variant="secondary">Back to shop</Button>
        </div>
      </section>
    </>
  );
}

const BUYER_KEY = "shoutout-buyer";
const BUYER_FIELDS = [
  { key: "email", label: "Email", type: "email", auto: "email", required: true, wide: true },
  { key: "name", label: "Full name", auto: "name", required: true },
  { key: "phone", label: "Phone", type: "tel", auto: "tel", required: true },
];
const SHIP_FIELDS = [
  { key: "address", label: "Street address", auto: "address-line1", required: true, wide: true },
  { key: "unit", label: "Apt or unit", auto: "address-line2" },
  { key: "city", label: "City", auto: "address-level2", required: true },
  { key: "state", label: "State (2 letters)", auto: "address-level1", required: true, max: 2 },
  { key: "postal", label: "ZIP code", auto: "postal-code", required: true, inputMode: "numeric" },
];

function loadBuyer() {
  try {
    return JSON.parse(localStorage.getItem(BUYER_KEY) || "{}");
  } catch {
    return {};
  }
}

function Checkout() {
  const cart = useCart();
  const groups = groupLines(cart.lines);
  const blocked = unmappedLines(cart.lines);
  const group = groups[0];
  const [buyer, setBuyer] = useState(loadBuyer);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState("");

  if (!cart.lines.length) {
    return (
      <PageIntro eyebrow="Checkout" title="Your cart is empty.">
        Start with the piece that fits the moment.
        <span className="block-actions"><Button to="collection/eagles-football-26">Shop Eagles ’26</Button></span>
      </PageIntro>
    );
  }

  const physical = group?.type === "PHYSICAL";
  const fields = physical ? [...BUYER_FIELDS, ...SHIP_FIELDS] : BUYER_FIELDS;
  const subtotal = (group?.lines || []).reduce((s, l) => s + unitPrice(findProduct(l.productId), l.selections) * l.qty, 0);

  async function pay(e) {
    e.preventDefault();
    const errs = {};
    fields.forEach((f) => {
      const v = (buyer[f.key] || "").trim();
      if (f.required && !v) errs[f.key] = `Add your ${f.label.toLowerCase()}.`;
      else if (f.type === "email" && v && !/^\S+@\S+\.\S+$/.test(v)) errs[f.key] = "Enter a valid email.";
      else if (f.key === "state" && v && !/^[A-Za-z]{2}$/.test(v)) errs[f.key] = "Use the 2-letter code, like FL.";
      else if (f.key === "postal" && v && !/^\d{5}(-\d{4})?$/.test(v)) errs[f.key] = "Enter a 5-digit ZIP.";
    });
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`b-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    const clean = Object.fromEntries(Object.entries(buyer).map(([k, v]) => [k, k === "state" ? v.trim().toUpperCase() : v.trim()]));
    try {
      localStorage.setItem(BUYER_KEY, JSON.stringify(clean));
    } catch {
      /* storage unavailable */
    }
    setFail("");
    setBusy(true);
    try {
      const r = await checkoutBasket(group.type, group.lines, clean);
      if (r === "paid") go("order/success");
    } catch (err) {
      setFail(err.message || "Checkout couldn't start.");
      setBusy(false);
    }
  }

  return (
    <>
      <PageIntro eyebrow="Checkout" title={physical ? "Where should we send it?" : "Where should we send your cards?"}>
        {groups.length > 1
          ? `Printed and digital pieces check out separately. This step covers your ${TYPE_LABEL[group.type]}; you'll finish the ${TYPE_LABEL[groups[1].type]} right after.`
          : "You'll pay on a secure page, then come straight back here."}
      </PageIntro>
      <section className="band tight">
        <div className="wrap narrow">
          {blocked.length ? (
            <p className="err" role="alert">
              {blocked.map((l) => findProduct(l.productId).name).join(", ")} can't be bought online yet. Remove {blocked.length > 1 ? "them" : "it"} from your cart, or <Link to="partner">ask us about a program order</Link>.
            </p>
          ) : null}
          {group ? (
            <form onSubmit={pay} noValidate className="order-form">
              <fieldset className="opt">
                <legend>Order summary</legend>
                <ul className="summary">
                  {group.lines.map((l) => {
                    const p = findProduct(l.productId);
                    return (
                      <li key={l.id}>
                        <span>{p.name}{p.options.length > 1 || p.options[0].values.length > 1 ? ` · ${Object.values(l.selections).join(", ")}` : ""} × {l.qty}</span>
                        <strong>{money(unitPrice(p, l.selections) * l.qty)}</strong>
                      </li>
                    );
                  })}
                </ul>
                <div className="subtotal"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                <p className="fine">{physical ? "Shipping and tax are added on the payment page." : "Tax, if any, is added on the payment page."}</p>
              </fieldset>
              <fieldset className="opt">
                <legend>{physical ? "Contact and shipping" : "Contact"}</legend>
                <div className="fields">
                  {fields.map((f) => (
                    <div className={`field${f.wide ? " wide" : ""}`} key={f.key}>
                      <label htmlFor={`b-${f.key}`}>{f.label}{f.required ? <span aria-hidden="true"> *</span> : null}</label>
                      <input
                        id={`b-${f.key}`}
                        type={f.type || "text"}
                        autoComplete={f.auto}
                        inputMode={f.inputMode}
                        maxLength={f.max}
                        value={buyer[f.key] || ""}
                        aria-invalid={!!errors[f.key]}
                        aria-describedby={errors[f.key] ? `b-${f.key}-err` : undefined}
                        onChange={(e) => setBuyer({ ...buyer, [f.key]: e.target.value })}
                      />
                      {errors[f.key] ? <span className="err" id={`b-${f.key}-err`}>{errors[f.key]}</span> : null}
                    </div>
                  ))}
                </div>
              </fieldset>
              {fail ? <p className="err" role="alert">{fail}</p> : null}
              <Button type="submit" disabled={busy || blocked.length > 0}>{busy ? "Opening secure payment…" : "Continue to payment"}</Button>
              <p className="fine">Payments are processed by our shop platform, Selldone. Part of every Eagles order supports MSD Eagles Football.</p>
            </form>
          ) : null}
          <p><Link to="cart">← Back to cart</Link></p>
        </div>
      </section>
    </>
  );
}

export function OrderResult({ ok }) {
  const cart = useCart();
  const [left, setLeft] = useState(null);
  React.useEffect(() => {
    if (!ok) return;
    const paid = checkoutMode() === "selldone" ? takePending() : null;
    if (!paid) {
      if (checkoutMode() !== "selldone") cart.clear();
      return;
    }
    const remaining = cart.lines.filter((l) => selldoneProduct(l.productId)?.type !== paid);
    cart.removeMany(cart.lines.filter((l) => selldoneProduct(l.productId)?.type === paid).map((l) => l.id));
    if (remaining.length) setLeft(remaining.length);
  }, [ok]);
  return (
    <PageIntro eyebrow={ok ? "Order received" : "Checkout cancelled"} title={ok ? "Thank you. Now the good part." : "Your cart is still here."}>
      {ok
        ? "Your receipt is on its way by email. The program approves names and numbers before anything is produced, and we'll email you when your pieces are ready."
        : "Nothing was charged. Pick up where you left off whenever you're ready."}
      {left ? <span className="block-actions"><Button to="checkout">Finish checkout for the rest of your cart</Button></span> : null}
      <span className="block-actions"><Button to={ok ? "collection/eagles-football-26" : "cart"} variant="secondary">{ok ? "Back to Eagles ’26" : "Return to cart"}</Button></span>
    </PageIntro>
  );
}

export function HowItWorks() {
  return (
    <>
      <PageIntro eyebrow="How it works" title="From camera roll to keepsake.">
        Other sites hand you a template. We give you creative judgment. Here's exactly what happens after you order.
      </PageIntro>
      <section className="band ivory"><div className="wrap"><Steps /></div></section>
      <section className="band">
        <div className="wrap faq">
          <SectionHead eyebrow="Good to know" title="Questions families ask." />
          {[
            ["What photos should I send?", "Whatever you have: phone shots, school photography, local news. We pick the strongest frames and give them one consistent treatment so the set looks like it belongs together."],
            ["How long does it take?", "Most orders ship 10–14 business days after you approve the proof. Senior night or a championship coming up? Add the date when you order and we'll schedule production around it."],
            ["Can I change the design?", "Every order includes a digital proof and one round of revisions. Nothing is produced until you approve it."],
            ["Do you check names and stats?", "Yes. We verify spelling, numbers and statistics against what you send, and team sets are signed off by the athletic director."],
            ["What makes an edition limited?", "Numbered editions are produced once, in the quantity marked on the card. We don't manufacture rarity. We document significance."],
          ].map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </section>
    </>
  );
}

const AUDIENCES = {
  families: {
    eyebrow: "For families",
    title: "They'll never have this season again.",
    lede: "You've been there since the first practice. Shoutout turns the photos, achievements and moments you're already capturing into collectibles that tell your athlete's story, made to be kept long after the season ends.",
    pillars: [["Celebrate the achievement", "Give meaningful moments the recognition they deserve."], ["Preserve the story", "Turn scattered photos and stats into something coherent and lasting."], ["Make it theirs", "Every piece reflects this athlete, this team, this season."], ["Keep it", "Designed to still matter years from now."]],
    cta: ["shop", "Create a Shoutout"],
    products: ["senior-night-edition", "athlete-card-pack", "framed-keepsake"],
  },
  programs: {
    eyebrow: "For athletic programs",
    title: "Sell the collection. Fund the program.",
    lede: "Your season becomes an official collection families actually want, and part of every order goes back to your program. A professionally managed way to turn your athletes and seasons into official collections, without internal design resources and without pushing families toward generic merchandise.",
    pillars: [["A real fundraiser", "A simple split on every order, on one page your booster club can forward. No discount bins."], ["Program identity", "Collections wear your school's colors and marks. Your program is the hero."], ["Family engagement", "Something families value, not another piece of promotional stuff."], ["Professional execution", "We handle the creative system, verification and production."]],
    cta: ["partner?interest=program", "Start a program partnership"],
    products: ["team-card-set", "championship-collection", "captain-edition"],
    partner: true,
  },
  sponsors: {
    eyebrow: "For sponsors & community partners",
    title: "Support something families keep.",
    lede: "A banner hangs on a fence. A social post disappears. Sponsoring a Shoutout collection puts your business behind something families take home and keep.",
    pillars: [["Community association", "Align your business with the recognition of local athletes."], ["Meaningful visibility", "Appear in something valued, not merely viewed."], ["Longevity", "Exposure that lasts beyond a game, an event or a post."], ["Authenticity", "Support the program rather than interrupt its audience."]],
    cta: ["partner?interest=sponsor", "Become a community partner"],
    products: [],
    partner: true,
  },
};

export function Audience({ kind }) {
  const a = AUDIENCES[kind];
  return (
    <>
      <PageIntro eyebrow={a.eyebrow} title={a.title}>{a.lede}<span className="block-actions"><Button to={a.cta[0]}>{a.cta[1]}</Button></span></PageIntro>
      <section className="band ivory">
        <div className="wrap">
          <div className="pillars">{a.pillars.map(([t, d]) => <article key={t}><h3>{t}</h3><p>{d}</p></article>)}</div>
        </div>
      </section>
      {a.products.length ? (
        <section className="band">
          <div className="wrap">
            <SectionHead eyebrow="Where to start" title="Pieces made for this." />
            <div className="grid tiles three">{a.products.map((id) => <ProductTile key={id} product={findProduct(id)} />)}</div>
          </div>
        </section>
      ) : null}
      {kind === "programs" ? (
        <section className="band ivory">
          <div className="wrap">
            <SectionHead eyebrow="How a season runs" title="Shot Friday. Live by Monday.">
              Big Exposure Athletics captures the game, we design and proof the cards, and the booster club sends one link. It repeats every game week.
            </SectionHead>
            <Flywheel />
            <div className="center-row"><Button to={`collection/${COLLECTIONS[0].id}`} variant="secondary">See it live: Eagles Football ’26</Button></div>
          </div>
        </section>
      ) : null}
      {kind === "sponsors" ? (
        <section className="band">
          <div className="wrap split">
            <div><p className="eyebrow">Clean, editorial placement</p><h2>The athlete stays the story.</h2></div>
            <div className="prose">
              <p>Sponsors appear as a restrained credit on the collection and its packaging, for example “The 2026 Westbrook Eagles Collection, presented by Main Street Hardware.” Never across an athlete's face, never louder than the school.</p>
              <p>Sponsor-exclusive editions and senior-night presenting partnerships are available for programs we work with.</p>
            </div>
          </div>
        </section>
      ) : null}
      {a.partner ? <PartnerBlock defaultInterest={kind === "sponsors" ? "sponsor" : "program"} /> : null}
    </>
  );
}

export function PartnerPage({ query }) {
  return (
    <>
      <PageIntro eyebrow="Partner with Shoutout" title="Every season tells a story. Make yours collectible.">
        Tell us about your program or business. We'll come back with a plan, a sample collection in your colors and pricing for your roster.
      </PageIntro>
      <PartnerForm defaultInterest={query.get("interest") || "program"} />
    </>
  );
}

function PartnerBlock({ defaultInterest }) {
  return (
    <section className="band ivory">
      <div className="wrap">
        <SectionHead eyebrow="Let's talk" title="Start the conversation." />
        <PartnerForm defaultInterest={defaultInterest} bare />
      </div>
    </section>
  );
}

function PartnerForm({ defaultInterest, bare }) {
  const [v, setV] = useState({ interest: defaultInterest });
  const [errs, setErrs] = useState({});
  const [sent, setSent] = useState(false);
  const fields = [
    ["name", "Your name", true, "text", "name"],
    ["org", "School, program or business", true, "text", "organization"],
    ["role", "Your role", false, "text", "organization-title"],
    ["email", "Email", true, "email", "email"],
    ["phone", "Phone (optional)", false, "tel", "tel"],
    ["teams", "Teams or athletes involved (optional)", false, "text", "off"],
  ];
  function submit(e) {
    e.preventDefault();
    const n = {};
    fields.forEach(([k, l, req, t]) => {
      const val = (v[k] || "").trim();
      if (req && !val) n[k] = `Add ${l.toLowerCase()}.`;
      else if (t === "email" && val && !/^\S+@\S+\.\S+$/.test(val)) n[k] = "Enter a valid email.";
    });
    setErrs(n);
    if (Object.keys(n).length) {
      document.getElementById(`p-${Object.keys(n)[0]}`)?.focus();
      return;
    }
    if (COMMERCE.PARTNER_EMAIL) {
      const body = fields.map(([k, l]) => `${l}: ${v[k] || ""}`).join("\n") + `\nInterest: ${v.interest}\n\n${v.message || ""}`;
      window.location.href = `mailto:${COMMERCE.PARTNER_EMAIL}?subject=${encodeURIComponent(`Partnership inquiry: ${v.org}`)}&body=${encodeURIComponent(body)}`;
    }
    setSent(true);
  }
  const content = sent ? (
    <div className="sent" role="status">
      <Seal size={64} />
      <h3>Thank you, {v.name.split(" ")[0]}.</h3>
      <p>We'll be in touch within two business days with next steps for {v.org}.</p>
      {!COMMERCE.PARTNER_EMAIL ? <p className="fine">Preview only: this form isn't connected to an inbox yet.</p> : null}
    </div>
  ) : (
    <form className="partner-form" onSubmit={submit} noValidate>
      <fieldset className="opt">
        <legend>I'm interested in</legend>
        <div className="chips">
          {[["program", "A program partnership"], ["sponsor", "Sponsoring a collection"], ["bulk", "A large team order"], ["other", "Something else"]].map(([k, l]) => (
            <label key={k} className={v.interest === k ? "on" : ""}>
              <input type="radio" name="interest" checked={v.interest === k} onChange={() => setV({ ...v, interest: k })} />{l}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="fields">
        {fields.map(([k, l, req, t, auto]) => (
          <div className="field" key={k}>
            <label htmlFor={`p-${k}`}>{l}{req ? <span aria-hidden="true"> *</span> : null}</label>
            <input id={`p-${k}`} type={t} autoComplete={auto} value={v[k] || ""} aria-invalid={!!errs[k]} aria-describedby={errs[k] ? `p-${k}-err` : undefined} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
            {errs[k] ? <span className="err" id={`p-${k}-err`}>{errs[k]}</span> : null}
          </div>
        ))}
        <div className="field wide">
          <label htmlFor="p-message">Tell us about your season</label>
          <textarea id="p-message" rows="4" value={v.message || ""} onChange={(e) => setV({ ...v, message: e.target.value })} />
        </div>
      </div>
      <Button type="submit">Send</Button>
    </form>
  );
  return bare ? content : <section className="band tight"><div className="wrap narrow">{content}</div></section>;
}

export function About() {
  return (
    <>
      <PageIntro eyebrow="About Shoutout Studios" title="Every athlete has a story worth collecting.">
        Professional athletes have always had their achievements turned into artifacts. Young athletes create meaningful moments too. Their audience may be smaller, but to the people who love them, their significance isn't.
      </PageIntro>
      <section className="band ivory">
        <div className="wrap split">
          <div><p className="eyebrow">What we believe</p><h2>The energy belongs to the moment. The stillness belongs to the object.</h2></div>
          <div className="prose">
            <p>The game is loud, fast and gone in a second. A keepsake is the one frame where all of that resolves into something you can hold.</p>
            <p>We're a sports storytelling and collectibles studio. Not a template site, not a photo printer. We bring the craft and the editorial eye; the athlete and the school stay the hero.</p>
            <p className="signature">School = identity. Shoutout = provenance.</p>
          </div>
        </div>
      </section>
      <section className="band">
        <div className="wrap">
          <SectionHead eyebrow="Our standard" title="Is it worth keeping?" />
          <ul className="checks">
            {["Does it recognize the athlete?", "Does it tell a story rather than decorate a photo?", "Does it feel curated rather than templated?", "Does the school or athlete remain the hero?", "Will it still feel meaningful ten years from now?"].map((q) => <li key={q}>{q}</li>)}
          </ul>
          <p className="signature">Big Exposure Athletics is the Shoutout Studios sports-media team, capturing the moments we make collectible.</p>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  return <PageIntro eyebrow="Not found" title="Let's get you back to the story."><span className="block-actions"><Button to="">Go home</Button></span></PageIntro>;
}

export function PageIntro({ eyebrow, title, children }) {
  return (
    <section className="intro">
      <div className="wrap">
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        {children ? <p className="lede">{children}</p> : null}
      </div>
    </section>
  );
}
