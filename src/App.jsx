import React, { useEffect, useRef, useState } from "react";
import { CartProvider, useCart } from "./cart.jsx";
import { Link, Wordmark } from "./ui.jsx";
import { FAMILIES } from "./catalog.js";
import { About, Audience, CartLines, CartPage, CheckoutPreview, CollectionPage, Home, HowItWorks, NotFound, OrderResult, PartnerPage, Product, Shop } from "./pages.jsx";

const NAV = [
  ["collection/eagles-football-26", "Eagles ’26"],
  ["shop", "Shop"],
  ["how-it-works", "How It Works"],
  ["families", "Families"],
  ["programs", "Programs"],
  ["sponsors", "Sponsors"],
];

const TITLES = {
  "": "Moments happen once. Shoutouts last.",
  shop: "Shop",
  "how-it-works": "How It Works",
  families: "For Families",
  programs: "For Athletic Programs",
  sponsors: "For Sponsors",
  partner: "Partner With Shoutout",
  about: "About",
  cart: "Cart",
  collection: "MSD Eagles Football ’26",
};

function useRoute() {
  const read = () => {
    const raw = window.location.hash.replace(/^#\/?/, "");
    const [path, qs] = raw.split("?");
    return { path: path.replace(/\/$/, ""), query: new URLSearchParams(qs || "") };
  };
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => {
      setRoute(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

function Page({ path, query }) {
  const [head, arg] = path.split("/");
  switch (head) {
    case "": return <Home />;
    case "shop": return <Shop key={query.toString()} query={query} />;
    case "product": return <Product key={arg} id={arg} />;
    case "collection": return <CollectionPage key={arg} id={arg} />;
    case "cart": return <CartPage />;
    case "checkout": return <CheckoutPreview />;
    case "order": return <OrderResult ok={arg === "success"} />;
    case "how-it-works": return <HowItWorks />;
    case "families":
    case "programs":
    case "sponsors": return <Audience key={head} kind={head} />;
    case "partner": return <PartnerPage key={query.toString()} query={query} />;
    case "about": return <About />;
    default: return <NotFound />;
  }
}

function Header({ path }) {
  const cart = useCart();
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [path]);
  const head = path.split("/")[0];
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link to="" className="brand"><Wordmark /></Link>
        <nav className={`nav${menu ? " open" : ""}`} aria-label="Main">
          {NAV.map(([to, label]) => (
            <Link key={to} to={to} aria-current={path === to || head === to || (to === "shop" && head === "product") ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <button className="cart-btn" onClick={() => cart.setOpen(true)} aria-label={`Cart, ${cart.count} item${cart.count === 1 ? "" : "s"}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1.2 12.2a1 1 0 0 1-1 .8H8.2a1 1 0 0 1-1-.8L6 7Zm3 0V6a3 3 0 0 1 6 0v1" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            {cart.count ? <span className="cart-count">{cart.count}</span> : null}
          </button>
          <button className="menu-btn" aria-expanded={menu} aria-label="Menu" onClick={() => setMenu(!menu)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

function CartDrawer() {
  const cart = useCart();
  const panel = useRef(null);
  useEffect(() => {
    if (!cart.open) return;
    const prev = document.activeElement;
    panel.current?.focus();
    const key = (e) => e.key === "Escape" && cart.setOpen(false);
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [cart.open]);
  if (!cart.open) return null;
  return (
    <div className="drawer-wrap" onClick={() => cart.setOpen(false)}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabIndex={-1} ref={panel} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2 id="drawer-title">Your cart</h2>
          <button className="close" aria-label="Close cart" onClick={() => cart.setOpen(false)}>×</button>
        </div>
        {cart.lines.length ? (
          <CartLines compact />
        ) : (
          <p className="empty">Nothing here yet. <Link to="shop" onClick={() => cart.setOpen(false)}>Browse the shop</Link>.</p>
        )}
      </aside>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Wordmark />
          <p className="foot-line">Moments happen once. Shoutouts last.</p>
          <p className="fine">Every athlete has a story worth collecting.</p>
        </div>
        <div>
          <span className="foot-h">Shop</span>
          {FAMILIES.map((f) => <Link key={f.name} to={`shop?c=${encodeURIComponent(f.name)}`}>{f.name}</Link>)}
        </div>
        <div>
          <span className="foot-h">Studio</span>
          <Link to="how-it-works">How it works</Link>
          <Link to="about">About</Link>
          <Link to="partner">Partner with us</Link>
          <Link to="cart">Cart</Link>
        </div>
        <div>
          <span className="foot-h">For</span>
          <Link to="families">Families</Link>
          <Link to="programs">Athletic programs</Link>
          <Link to="sponsors">Sponsors</Link>
        </div>
      </div>
      <div className="wrap foot-base">© {new Date().getFullYear()} Shoutout Studios · Curated, not templated.</div>
    </footer>
  );
}

export function App() {
  const { path, query } = useRoute();
  useEffect(() => {
    const t = TITLES[path.split("/")[0]];
    document.title = t && path ? `${t} | Shoutout Studios` : "Shoutout Studios | Moments happen once. Shoutouts last.";
  }, [path]);
  return (
    <CartProvider>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>Skip to content</a>
      <Header path={path} />
      <main id="main" tabIndex={-1}><Page path={path} query={query} /></main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
