import { findProduct, isOrderable, unitPrice } from "../src/catalog.js";

// POST /api/checkout creates a Stripe Checkout Session when STRIPE_SECRET_KEY is set as a host secret.
// Only used when COMMERCE.STRIPE_ENABLED is true in src/commerce.js.
// Prices are looked up here from the catalog; the browser only sends product ids, options and quantities.
export function stripeLineItems(lines) {
  const items = [];
  for (const l of lines) {
    const p = findProduct(l?.productId);
    if (!isOrderable(p)) throw new Error("One of the items in your cart can't be bought online.");
    const selections = {};
    for (const o of p.options) {
      const chosen = l.selections?.[o.name];
      if (!o.values.some((v) => v.label === chosen)) throw new Error(`Choose a ${o.name.toLowerCase()} for ${p.name}.`);
      selections[o.name] = chosen;
    }
    const qty = Math.round(Number(l.qty));
    if (!(qty >= (p.minQty || 1) && qty <= 999)) throw new Error(`Check the quantity for ${p.name}.`);
    const details = Object.entries(l.details || {})
      .filter(([, v]) => typeof v === "string" && v.trim())
      .map(([k, v]) => `${k}: ${v.trim()}`)
      .join("; ");
    const opts = Object.values(selections).filter((v) => p.options.length > 1 || p.options[0].values.length > 1).join(", ");
    items.push({
      name: opts ? `${p.name} (${opts})` : p.name,
      description: (details || p.tagline).slice(0, 500),
      unitAmount: Math.round(unitPrice(p, selections) * 100),
      quantity: qty,
      productId: p.id,
      shippable: !p.digital,
    });
  }
  return items;
}

async function createStripeCheckout(request, env) {
  if (!env.STRIPE_SECRET_KEY) return Response.json({ error: "Stripe is not configured." }, { status: 501 });
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const lines = Array.isArray(body?.lines) ? body.lines.slice(0, 50) : [];
  if (!lines.length) return Response.json({ error: "Cart is empty." }, { status: 400 });
  let items;
  try {
    items = stripeLineItems(lines);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const form = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/#/order/success`,
    cancel_url: `${origin}/#/order/cancel`,
    "phone_number_collection[enabled]": "true",
    "metadata[source]": "shoutout-studios-store",
  });
  if (items.some((i) => i.shippable)) form.set("shipping_address_collection[allowed_countries][0]", "US");
  items.forEach((it, i) => {
    form.set(`line_items[${i}][quantity]`, String(it.quantity));
    form.set(`line_items[${i}][price_data][currency]`, "usd");
    form.set(`line_items[${i}][price_data][unit_amount]`, String(it.unitAmount));
    form.set(`line_items[${i}][price_data][product_data][name]`, it.name.slice(0, 250));
    form.set(`line_items[${i}][price_data][product_data][description]`, it.description);
    form.set(`line_items[${i}][price_data][product_data][metadata][site_id]`, it.productId);
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "content-type": "application/x-www-form-urlencoded" },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) return Response.json({ error: data?.error?.message || "Stripe error." }, { status: 502 });
  return Response.json({ url: data.url });
}

// POST /api/signup: free digital card signups from featured athlete pages.
// Forwards the signup as JSON to SIGNUP_WEBHOOK_URL (a Zapier, Make or Google Sheets webhook, set as a
// Worker secret). Returns 501 until that secret exists.
export function cleanSignup(body) {
  const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const s = {
    name: str(body?.name, 120),
    email: str(body?.email, 200).toLowerCase(),
    phone: str(body?.phone, 30),
    textConsent: body?.consent === true && !!str(body?.phone, 30),
    playerId: str(body?.playerId, 80),
    player: str(body?.player, 120),
    feature: str(body?.feature, 120),
  };
  if (!s.name) throw new Error("Add your name.");
  if (!/^\S+@\S+\.\S+$/.test(s.email)) throw new Error("Enter a valid email.");
  if (s.phone && s.phone.replace(/\D/g, "").length < 10) throw new Error("Enter a 10-digit phone number.");
  if (!s.playerId) throw new Error("Missing athlete.");
  return s;
}

async function signup(request, env) {
  if (!env.SIGNUP_WEBHOOK_URL) return Response.json({ error: "Signups are not configured." }, { status: 501 });
  let s;
  try {
    s = cleanSignup(await request.json());
  } catch (e) {
    return Response.json({ error: e instanceof SyntaxError ? "Invalid request." : e.message }, { status: 400 });
  }
  const res = await fetch(env.SIGNUP_WEBHOOK_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...s, source: "free-digital-card", at: new Date().toISOString() }),
  });
  if (!res.ok) return Response.json({ error: "We couldn't save that just now. Please try again." }, { status: 502 });
  return Response.json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/checkout" && request.method === "POST") return createStripeCheckout(request, env);
    if (url.pathname === "/api/signup" && request.method === "POST") return signup(request, env);

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};
