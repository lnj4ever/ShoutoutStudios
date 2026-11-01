// Checkout wiring. The cart works today; payment goes live once ONE provider below is filled in.
//
// Selldone (previous): SELLDONE_ENABLED = true. Checkout runs on the site's #/checkout page and
//   pays through the Selldone shop. Product ids and the gateway are set in src/selldone.js.
//
// Shopify (recommended for physical goods: shipping, tax, order tracking):
//   1. Create each product + variant in Shopify.
//   2. Set SHOPIFY_STORE_DOMAIN and add `shopifyVariants` to each product in catalog.js.
//   Checkout uses a Shopify cart permalink; athlete details travel in the order note.
//
// Stripe (alternative): set SELLDONE_ENABLED = false, STRIPE_ENABLED = true, and add
//   STRIPE_SECRET_KEY as a secret on the Cloudflare Worker. The worker's /api/checkout prices the
//   cart from catalog.js and creates a Stripe Checkout Session; no separate server is needed.

import { findProduct } from "./catalog.js";

export const COMMERCE = {
  SELLDONE_ENABLED: false, // Selldone checkout kept in src/selldone.js; Stripe direct chosen 2026-11-01
  SHOPIFY_STORE_DOMAIN: "", // e.g. "shoutout-studios.myshopify.com"
  STRIPE_ENABLED: true,
  PARTNER_EMAIL: "", // e.g. "partners@shoutoutstudios.com" — partner form opens an email to this address
};

export const checkoutMode = () =>
  COMMERCE.SELLDONE_ENABLED ? "selldone" : COMMERCE.SHOPIFY_STORE_DOMAIN ? "shopify" : COMMERCE.STRIPE_ENABLED ? "stripe" : "preview";

const detailsText = (line) =>
  Object.entries(line.details)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");

export function orderNote(lines) {
  return lines
    .map((l, i) => {
      const p = findProduct(l.productId);
      const opts = Object.values(l.selections).join(", ");
      return `${i + 1}. ${p.name} (${opts}) x${l.qty} — ${detailsText(l)}`;
    })
    .join("\n");
}

export async function startCheckout(lines) {
  const mode = checkoutMode();
  if (mode === "selldone") return "checkout-page";
  if (mode === "shopify") {
    const missing = [];
    const items = lines.map((l) => {
      const p = findProduct(l.productId);
      const key = p.options.map((o) => l.selections[o.name]).join("|");
      const variant = p.shopifyVariants?.[key];
      if (!variant) missing.push(`${p.name} (${key})`);
      return `${variant}:${l.qty}`;
    });
    if (missing.length) throw new Error(`Shopify variant missing for: ${missing.join(", ")}`);
    const url = new URL(`https://${COMMERCE.SHOPIFY_STORE_DOMAIN}/cart/${items.join(",")}`);
    url.searchParams.set("note", orderNote(lines));
    window.location.assign(url.toString());
    return;
  }
  if (mode === "stripe") {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      // The worker prices each line from the catalog; only ids, options and quantities are sent.
      body: JSON.stringify({ lines: lines.map(({ productId, selections, qty, details }) => ({ productId, selections, qty, details })) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) throw new Error(data.error || "Checkout could not start.");
    window.location.assign(data.url);
    return;
  }
  return "preview";
}
